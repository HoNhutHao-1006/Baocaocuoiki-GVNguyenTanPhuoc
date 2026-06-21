const cheerio = require('cheerio');
const MarketSnapshot = require('../models/MarketSnapshot');
const SystemLog = require('../models/SystemLog');

// Sandbox fallback data when online scraping fails
const SANDBOX_MARKET_EVENTS = [
    { title: 'Tech Innovation Summit 2026', priceRange: '800.000đ - 5.000.000đ', location: 'Grand Ballroom, TP.HCM', category: 'Technology', date: '2026-09-15' },
    { title: 'Kosmik Concert - Space Jam', priceRange: '500.000đ - 3.500.000đ', location: 'Nhà thi đấu Phú Thọ, TP.HCM', category: 'Music', date: '2026-10-20' },
    { title: 'Vietnam Startup Expo 2026', priceRange: 'Miễn phí', location: 'SECC Q.7, TP.HCM', category: 'Business', date: '2026-11-05' },
    { title: 'Art & Design Workshop', priceRange: '300.000đ', location: 'Lumina Center, Hà Nội', category: 'Art', date: '2026-08-12' },
    { title: 'Hanoi Marathon 2026', priceRange: '400.000đ - 1.200.000đ', location: 'Hồ Hoàn Kiếm, Hà Nội', category: 'Sports', date: '2026-12-10' }
];

/**
 * Fetch and parse public RSS feed (Simulated or actual)
 */
async function fetchRSSEvents() {
    try {
        // Try Eventbrite or a public mock RSS. If offline/blocked, it throws
        const res = await fetch('https://www.eventbrite.com/rss/vietnam-events', { signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        const xmlText = await res.text();
        const $ = cheerio.load(xmlText, { xmlMode: true });
        
        const events = [];
        $('item').each((i, el) => {
            const title = $(el).find('title').text().trim();
            const desc = $(el).find('description').text().trim();
            const link = $(el).find('link').text().trim();
            if (title) {
                events.push({ title, priceRange: 'Xem chi tiết', location: 'Việt Nam', category: 'RSS Event', link });
            }
        });
        if (events.length === 0) throw new Error('Empty RSS items');
        return events;
    } catch (err) {
        // Log error silently, fallback to main scraper or cache
        console.warn('RSS Reader failed:', err.message);
        return [];
    }
}

/**
 * Fallback Scraper for Ticketbox HTML using Cheerio
 */
async function scrapeTicketbox() {
    try {
        const res = await fetch('https://ticketbox.vn', { 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(4000)
        });
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        
        const html = await res.text();
        const $ = cheerio.load(html);
        const events = [];

        // Try extracting card selectors (layout dependent)
        $('a[href*="/event/"], div[class*="event-item"], [class*="card"]').each((i, el) => {
            const title = $(el).find('h3, h4, [class*="title"], [class*="name"]').first().text().trim();
            const price = $(el).find('[class*="price"], [class*="amount"]').first().text().trim();
            const loc = $(el).find('[class*="location"], [class*="address"]').first().text().trim();
            if (title && title.length > 5) {
                events.push({
                    title,
                    priceRange: price || 'Liên hệ',
                    location: loc || 'Việt Nam',
                    category: 'Public Event'
                });
            }
        });

        if (events.length === 0) {
            throw new Error('Không phân tích được cấu trúc HTML (Layout Ticketbox có thể đã thay đổi)');
        }
        return events.slice(0, 10);
    } catch (err) {
        // Record System Log ERROR (Phản biện 5)
        await SystemLog.create({
            type: 'ERROR',
            endpoint: 'Crawler: Ticketbox Scraper',
            module: 'Crawler Module',
            errorMessage: `Cào Ticketbox thất bại: ${err.message}. Tự động kích hoạt cơ chế Fallback.`
        });
        throw err;
    }
}

/**
 * Main Service method to fetch market data (using cache-first and fallbacks)
 */
async function getMarketEvents() {
    // 1. Check if we have a fresh cache in DB (created within last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const cachedSnapshot = await MarketSnapshot.findOne({
        createdAt: { $gte: oneDayAgo }
    }).sort({ createdAt: -1 });

    if (cachedSnapshot && cachedSnapshot.data && cachedSnapshot.data.length > 0) {
        return cachedSnapshot.data;
    }

    // 2. Try scraping Ticketbox & RSS
    let events = [];
    try {
        events = await scrapeTicketbox();
        const rssEvents = await fetchRSSEvents();
        events = [...events, ...rssEvents];
    } catch (err) {
        console.warn('Scraping failed, trying to retrieve any older cache from DB...');
        // 3. Fallback to older DB cache
        const oldSnapshot = await MarketSnapshot.findOne({}).sort({ createdAt: -1 });
        if (oldSnapshot && oldSnapshot.data && oldSnapshot.data.length > 0) {
            events = oldSnapshot.data;
        } else {
            // 4. Fallback to static Sandbox Data
            events = SANDBOX_MARKET_EVENTS;
        }
    }

    // 5. Cache the result in DB if we successfully got events (and no fresh cache was active)
    if (events.length > 0) {
        try {
            await MarketSnapshot.create({
                source: 'Aggregated Scraper & Fallback Sandbox',
                data: events
            });
        } catch (e) {
            console.error('Failed to cache market snapshot:', e.message);
        }
    }

    return events;
}

module.exports = {
    getMarketEvents,
    SANDBOX_MARKET_EVENTS
};
