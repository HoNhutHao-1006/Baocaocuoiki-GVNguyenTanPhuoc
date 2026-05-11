/**
 * Script: Seed dữ liệu SeatZone + Seat cho TẤT CẢ sự kiện có ticketingEnabled
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const { SeatZone, Seat } = require('./src/models/Floorplan');
const Event = require('./src/models/Event');

const ROWS = ['A','B','C','D','E','F','G','H','I','J'];

// Cấu hình zone khác nhau cho mỗi loại sự kiện
const ZONE_CONFIGS = {
    concert: [
        { name: 'SVIP ⭐ Front Stage', zoneColor: '#FFD700', price: 3500000, rows: 2, seatsPerRow: 8 },
        { name: 'VIP Golden Zone', zoneColor: '#FF6B35', price: 2000000, rows: 3, seatsPerRow: 10 },
        { name: 'Standard GA', zoneColor: '#00F0FF', price: 800000, rows: 5, seatsPerRow: 15 },
    ],
    conference: [
        { name: 'VIP Front Row', zoneColor: '#FFD700', price: 5000000, rows: 2, seatsPerRow: 10 },
        { name: 'Business Zone', zoneColor: '#00F0FF', price: 1500000, rows: 4, seatsPerRow: 12 },
    ],
    exhibition: [
        { name: 'VIP Guided', zoneColor: '#FF00E5', price: 500000, rows: 2, seatsPerRow: 8 },
        { name: 'General', zoneColor: '#00F0FF', price: 150000, rows: 3, seatsPerRow: 10 },
    ],
    sports: [
        { name: 'VIP Grandstand', zoneColor: '#FFD700', price: 1200000, rows: 3, seatsPerRow: 12 },
        { name: 'Standard', zoneColor: '#10B981', price: 400000, rows: 5, seatsPerRow: 15 },
    ],
    default: [
        { name: 'Khu VIP', zoneColor: '#FFD700', price: 1000000, rows: 2, seatsPerRow: 10 },
        { name: 'Khu Thường', zoneColor: '#00F0FF', price: 300000, rows: 4, seatsPerRow: 12 },
    ]
};

function getZoneConfig(title) {
    const t = title.toLowerCase();
    if (t.includes('concert') || t.includes('nhạc') || t.includes('rap') || t.includes('singer') || t.includes('kosmik')) return ZONE_CONFIGS.concert;
    if (t.includes('tech') || t.includes('summit') || t.includes('startup') || t.includes('demo')) return ZONE_CONFIGS.conference;
    if (t.includes('expo') || t.includes('triển lãm') || t.includes('art') || t.includes('game')) return ZONE_CONFIGS.exhibition;
    if (t.includes('marathon') || t.includes('sport') || t.includes('thể thao')) return ZONE_CONFIGS.sports;
    return ZONE_CONFIGS.default;
}

async function seedSeats() {
    await connectDB();

    const events = await Event.find({ ticketingEnabled: true });
    
    if (events.length === 0) {
        console.error('Không tìm thấy sự kiện nào có ticketingEnabled. Hãy chạy seed.js trước.');
        process.exit(1);
    }

    console.log(`\n📍 Tìm thấy ${events.length} sự kiện có bán vé.\n`);

    for (const event of events) {
        console.log(`\n━━━ Tạo ghế cho: "${event.title}" ━━━`);

        // Xóa dữ liệu cũ
        const oldZones = await SeatZone.find({ eventId: event._id });
        for (const z of oldZones) {
            await Seat.deleteMany({ zoneId: z._id });
        }
        await SeatZone.deleteMany({ eventId: event._id });

        const zones = getZoneConfig(event.title);

        for (const zd of zones) {
            const zone = await SeatZone.create({ eventId: event._id, ...zd });
            let count = 0;
            for (let rIdx = 0; rIdx < zd.rows; rIdx++) {
                const rowChar = ROWS[rIdx];
                for (let s = 1; s <= zd.seatsPerRow; s++) {
                    await Seat.create({
                        eventId: event._id,
                        zoneId: zone._id,
                        row: rowChar,
                        number: s,
                        label: `${rowChar}${s}`,
                        status: 'available'
                    });
                    count++;
                }
            }
            console.log(`  ✓ Zone "${zd.name}": ${count} ghế`);
        }
    }

    console.log('\n✅ Seeding ghế cho tất cả sự kiện hoàn tất!');
    mongoose.disconnect();
    process.exit(0);
}

seedSeats().catch(e => { console.error(e); process.exit(1); });
