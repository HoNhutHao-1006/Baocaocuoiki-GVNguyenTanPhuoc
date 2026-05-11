import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Ticket, Share2, Tag } from 'lucide-react';

// Custom Social Icons
const IconFB = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const IconIG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>;
import { fetchGraphQL } from '../../api/axiosClient';
import AuthModal from '../auth/AuthModal';
import InfoModal from './InfoModal';

const BANNERS = [
  { img: 'https://images.unsplash.com/photo-1540039155732-6761b54cbaca?auto=format&fit=crop&w=1920&q=80', title: 'Đỉnh Cao Cảm Xúc', sub: 'Concert Âm nhạc điện tử lớn nhất năm 2026', tag: 'EDM Fes', promo: 'EARLY20' },
  { img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1920&q=80', title: 'Kỷ Nguyên A.I', sub: 'Hội nghị Công nghệ Đột phá toàn cầu', tag: 'Tech Expo', promo: 'TECH30' },
  { img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80', title: 'Đám Cưới Thế Kỷ', sub: 'Tổ chức Sự kiện cá nhân sang trọng & đẳng cấp Hoàng Gia', tag: 'Đám Cưới', promo: 'VIP15' }
];

const PROMO_CODES = { 'EARLY20': 20, 'TECH30': 30, 'VIP15': 15, 'KOSMIK10': 10 };

export default function DiscoveryHub({ currentUser, onLogin, onSelectEvent, setView, onLogout }) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState(null);
  const [showAdvSearch, setShowAdvSearch] = useState(false);
  const [sharedEvent, setSharedEvent] = useState(null);
  const [infoPage, setInfoPage] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetchGraphQL(
        `query Search($term: String, $cat: String) { getAllCategories { id name } searchEvents(searchTerm: $term, categoryId: $cat) { id title description date location coverImg status categoryName ticketingEnabled } }`,
        { term: searchTerm, cat: activeCat }
      );
      setCategories(res.getAllCategories || []);
      let evs = res.searchEvents || [];
      if (filterLocation) evs = evs.filter(e => e.location?.toLowerCase().includes(filterLocation.toLowerCase()));
      if (filterDate) evs = evs.filter(e => e.date >= filterDate);
      setEvents(evs);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadData(); }, [searchTerm, activeCat, filterLocation, filterDate]);
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(p => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const applyPromo = () => {
    const disc = PROMO_CODES[promoCode.toUpperCase()];
    if (disc) setPromoResult({ success: true, msg: `🎉 Áp dụng thành công! Giảm ${disc}% cho đơn hàng tiếp theo.`, disc });
    else setPromoResult({ success: false, msg: '❌ Mã không hợp lệ hoặc đã hết hạn.' });
  };

  const handleShare = (e, platform) => {
    const url = encodeURIComponent(`${window.location.origin}?event=${e.id}`);
    const text = encodeURIComponent(`Cùng tham dự sự kiện "${e.title}" ngày ${e.date} tại ${e.location}!`);
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      zalo: `https://zalo.me/share?url=${url}&title=${text}`,
      instagram: `https://www.instagram.com/`,
    };
    window.open(links[platform], '_blank', 'width=600,height=500');
  };

  return (
    <div style={{ overflowY: 'auto', height: '100vh', background: 'var(--bg-main)' }}>
      {/* ── NAVBAR ── */}
      <nav style={{ padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(11,11,15,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.8rem', color: '#fff', letterSpacing: -1, flexShrink: 0 }}>
          Lu<span style={{ color: 'var(--primary-color)', textShadow: '0 0 15px rgba(0,240,255,0.5)' }}>mina</span>
        </div>

        {/* Search bar nâng cao */}
        <div style={{ flex: 1, margin: '0 30px', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 100, padding: '6px 16px', alignItems: 'center' }}>
            <Search size={16} color="#888" style={{ flexShrink: 0 }} />
            <input style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', minWidth: 0 }}
              placeholder="Tìm tên sự kiện..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <div style={{ width: 1, height: 20, background: 'var(--border-color)' }} />
            <MapPin size={16} color="#888" style={{ flexShrink: 0 }} />
            <input style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem', minWidth: 0 }}
              placeholder="Địa điểm..." value={filterLocation} onChange={e => setFilterLocation(e.target.value)} />
            <div style={{ width: 1, height: 20, background: 'var(--border-color)' }} />
            <Calendar size={16} color="#888" style={{ flexShrink: 0 }} />
            <input type="date" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#888', fontSize: '0.9rem', colorScheme: 'dark' }}
              value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          </div>
        </div>

        {/* Social links + Auth */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#4267B2', display: 'flex', alignItems: 'center' }} title="Facebook"><IconFB /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#E1306C', display: 'flex', alignItems: 'center' }} title="Instagram"><IconIG /></a>
          <a href="https://zalo.me" target="_blank" rel="noreferrer" style={{ color: '#0068FF', fontWeight: 900, fontSize: '0.85rem', textDecoration: 'none', border: '1px solid #0068FF', borderRadius: 6, padding: '2px 8px' }} title="Zalo">Zalo</a>
          <div style={{ width: 1, height: 24, background: 'var(--border-color)' }} />
          {!currentUser ? (
            <>
              <button className="btn outline" onClick={() => setShowAuthModal('login')} style={{ borderRadius: 100, padding: '8px 20px' }}>Đăng Nhập</button>
              <button className="btn" onClick={() => setShowAuthModal('register')} style={{ borderRadius: 100, padding: '8px 20px' }}>Đăng Ký</button>
            </>
          ) : (
            <>
              <button className="btn outline" onClick={() => setView('dashboard')} style={{ borderRadius: 100, padding: '8px 20px' }}>Tủ Vé</button>
              <button className="btn outline" onClick={onLogout} style={{ borderRadius: 100, padding: '8px 20px', borderColor: '#ff4444', color: '#ff4444' }}>Thoát</button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO SLIDER ── */}
      <div style={{ position: 'relative', height: '82vh', overflow: 'hidden' }}>
        {BANNERS.map((b, idx) => (
          <div key={idx} style={{ position: 'absolute', inset: 0, opacity: idx === slideIdx ? 1 : 0, transition: 'opacity 1.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', background: `linear-gradient(to bottom, rgba(0,0,0,0.3) 30%, rgba(11,11,15,1) 100%), url('${b.img}') center/cover` }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <span className="badge warning" style={{ fontSize: '0.9rem' }}>{b.tag}</span>
              <span style={{ background: 'rgba(0,240,255,0.15)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: 6, padding: '4px 12px', fontSize: '0.85rem', fontFamily: 'Outfit', fontWeight: 700 }}>
                <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />MÃ ƯU ĐÃI: {b.promo}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(3rem,6vw,5.5rem)', margin: 0, fontFamily: 'Outfit', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05, background: 'linear-gradient(90deg, #fff 40%, var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', transform: idx === slideIdx ? 'translateY(0)' : 'translateY(30px)', transition: 'transform 1.1s ease' }}>{b.title}</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: 560, marginTop: 20, lineHeight: 1.7, transform: idx === slideIdx ? 'translateY(0)' : 'translateY(30px)', transition: 'transform 1.1s ease 0.15s' }}>{b.sub}</p>
            <div style={{ display: 'flex', gap: 15, marginTop: 35 }}>
              <button className="btn" onClick={() => document.getElementById('events').scrollIntoView({ behavior: 'smooth' })} style={{ borderRadius: 100, padding: '14px 40px', fontSize: '1.05rem', boxShadow: '0 0 25px rgba(0,240,255,0.4)' }}>
                <Ticket size={20} /> Săn Vé Ngay
              </button>
              <button className="btn outline" onClick={() => setPromoCode(b.promo)} style={{ borderRadius: 100, padding: '14px 30px' }}>
                <Tag size={18} /> Lấy Mã Giảm Giá
              </button>
            </div>
          </div>
        ))}
        {/* Indicators */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 5 }}>
          {BANNERS.map((_, i) => <div key={i} onClick={() => setSlideIdx(i)} style={{ width: i === slideIdx ? 32 : 10, height: 10, borderRadius: 5, background: i === slideIdx ? 'var(--primary-color)' : 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.3s', boxShadow: i === slideIdx ? '0 0 12px var(--primary-color)' : 'none' }} />)}
        </div>
      </div>

      {/* ── PROMO BANNER ── */}
      <div style={{ background: 'linear-gradient(90deg, rgba(0,240,255,0.12), rgba(255,0,229,0.12))', borderTop: '1px solid rgba(0,240,255,0.2)', borderBottom: '1px solid rgba(255,0,229,0.2)', padding: '28px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>🎁 Chương Trình Ưu Đãi Đặc Biệt</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: '0.95rem' }}>Nhập mã để nhận giảm giá ngay — <strong style={{ color: 'var(--warning)' }}>EARLY20 | TECH30 | VIP15 | KOSMIK10</strong></div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Tag size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--primary-color)' }} />
            <input className="form-control" style={{ paddingLeft: 38, width: 200, borderRadius: 100, borderColor: 'rgba(0,240,255,0.3)' }}
              placeholder="Nhập mã..." value={promoCode} onChange={e => { setPromoCode(e.target.value); setPromoResult(null); }}
              onKeyDown={e => e.key === 'Enter' && applyPromo()} />
          </div>
          <button className="btn" onClick={applyPromo} style={{ borderRadius: 100, padding: '10px 24px', flexShrink: 0 }}>Áp Dụng</button>
          {promoResult && (
            <div style={{ color: promoResult.success ? 'var(--success)' : '#ff6666', fontWeight: 600, fontSize: '0.9rem' }}>{promoResult.msg}</div>
          )}
        </div>
      </div>

      {/* ── ABOUT & SERVICES ── */}
      <div style={{ padding: '70px 60px', background: 'linear-gradient(180deg, var(--bg-main) 0%, rgba(0,240,255,0.02) 50%, var(--bg-main) 100%)' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', fontWeight: 900 }}>Về <span style={{ color: 'var(--primary-color)' }}>Lumina</span></h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 10, fontSize: '1.05rem', maxWidth: 700, margin: '10px auto 0' }}>Nền tảng quản lý và đặt vé sự kiện hàng đầu Việt Nam — Kết nối Ban Tổ Chức với hàng triệu khán giả thông qua công nghệ hiện đại.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto 60px' }}>
          {[
            { num: '10K+', label: 'Vé đã bán', icon: '🎟️' },
            { num: '200+', label: 'Sự kiện tổ chức', icon: '📅' },
            { num: '50+', label: 'Đối tác BTC', icon: '🤝' },
            { num: '99.9%', label: 'Khách hài lòng', icon: '⭐' },
          ].map((s, i) => (
            <div key={i} className="panel" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: 'var(--primary-color)' }}>{s.num}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 900 }}>🎯 Dịch Vụ Sự Kiện</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '1rem' }}>Chúng tôi cung cấp giải pháp toàn diện cho mọi loại sự kiện</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
          {[
            { icon: '🎵', title: 'Concert & Liveshow', desc: 'Tổ chức đại nhạc hội, live concert với sân khấu chuyên nghiệp, hệ thống ánh sáng LED và âm thanh đẳng cấp quốc tế.', color: '#00F0FF' },
            { icon: '💒', title: 'Tiệc Cưới & Hôn Lễ', desc: 'Trọn gói tiệc cưới hoàng gia — trang trí, catering 5 sao, ban nhạc sống, MC song ngữ, pháo hoa lạnh & kỹ xảo đặc biệt.', color: '#FFB6C1' },
            { icon: '💻', title: 'Hội Nghị & Công Nghệ', desc: 'Tổ chức hội nghị, workshop, demo day cho doanh nghiệp với hệ thống trình chiếu, livestream và networking chuyên nghiệp.', color: '#8B5CF6' },
            { icon: '🏃', title: 'Thể Thao & Marathon', desc: 'Giải chạy, giải đấu thể thao với timing chip, water station, expo booth và logistics chuyên nghiệp.', color: '#10B981' },
            { icon: '🎨', title: 'Triển Lãm & Art Expo', desc: 'Tổ chức triển lãm nghệ thuật, trưng bày sản phẩm với không gian immersive và guided tour chuyên nghiệp.', color: '#F59E0B' },
            { icon: '🎮', title: 'Gaming & Esports', desc: 'Giải đấu esports, gaming expo với VR zone, cosplay contest và streaming platform chuyên nghiệp.', color: '#FF6B35' },
          ].map((s, i) => (
            <div key={i} className="panel" style={{ padding: 28, transition: 'all 0.3s', cursor: 'default' }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = s.color}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = 'var(--border-color)'}>
              <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.15rem', marginBottom: 10, color: s.color }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── EVENT LIST ── */}
      <div id="events" style={{ padding: '70px 60px', background: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', fontWeight: 900 }}>Sự Kiện Hot Nhất</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 10, fontSize: '1.05rem' }}>Lựa chọn sự kiện phù hợp với Gu của bạn</p>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 50, flexWrap: 'wrap' }}>
          {[{ id: '', name: '🔥 Tất Cả' }, ...categories].map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)}
              style={{ padding: '10px 24px', borderRadius: 100, fontFamily:'Outfit', fontWeight: 700, fontSize: '0.95rem', border: `2px solid ${activeCat === c.id ? 'var(--primary-color)' : 'var(--border-color)'}`, background: activeCat === c.id ? 'var(--primary-color)' : 'transparent', color: activeCat === c.id ? '#000' : '#aaa', cursor: 'pointer', transition: 'all 0.2s', boxShadow: activeCat === c.id ? '0 0 15px rgba(0,240,255,0.4)' : 'none' }}>
              {c.name}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 30, maxWidth: 1300, margin: '0 auto' }}>
          {events.length === 0
            ? <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)', padding: '60px 0', fontSize: '1.1rem' }}>Không tìm thấy sự kiện nào phù hợp.</p>
            : events.map(e => (
              <div key={e.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', transition: 'all 0.3s' }}
                onMouseEnter={ev => ev.currentTarget.style.transform='translateY(-6px)'}
                onMouseLeave={ev => ev.currentTarget.style.transform='translateY(0)'}>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onSelectEvent(e.id)}>
                  <img src={e.coverImg} alt={e.title} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{e.categoryName}</div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.3, cursor: 'pointer' }} onClick={() => onSelectEvent(e.id)}>{e.title}</h3>
                  <div style={{ color: '#888', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={14} color="var(--primary-color)" /> {new Date(e.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} color="var(--accent-color)" /> {e.location}</span>
                  </div>
                  {/* Social Share */}
                  <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid var(--border-color)', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginRight: 4 }}><Share2 size={13} style={{ display: 'inline', marginRight: 4 }} />Chia sẻ:</span>
                    <button onClick={() => handleShare(e, 'facebook')} style={{ background: '#4267B2', border: 'none', color: '#fff', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><IconFB /> FB</button>
                    <button onClick={() => handleShare(e, 'zalo')} style={{ background: '#0068FF', border: 'none', color: '#fff', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Zalo</button>
                    <button onClick={() => handleShare(e, 'instagram')} style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', border: 'none', color: '#fff', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><IconIG /> IG</button>
                    <button onClick={() => onSelectEvent(e.id)} className="btn" style={{ marginLeft: 'auto', padding: '5px 18px', borderRadius: 100, fontSize: '0.85rem' }}>Xem vé →</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── FOOTER WITH SOCIAL ── */}
      <footer style={{ background: '#050510', borderTop: '1px solid var(--border-color)', padding: '60px 60px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 15 }}>Lumina</div>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: '0.9rem', maxWidth: 280 }}>Nền tảng tổ chức và đặt vé sự kiện hàng đầu Việt Nam. Kết nối bạn với những trải nghiệm không thể quên.</p>
            <div style={{ display: 'flex', gap: 15, marginTop: 20 }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ width: 40, height: 40, background: '#4267B2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><IconFB /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ width: 40, height: 40, background: 'linear-gradient(45deg,#f09433,#dc2743,#bc1888)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><IconIG /></a>
              <a href="https://zalo.me" target="_blank" rel="noreferrer" style={{ width: 40, height: 40, background: '#0068FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#fff', fontWeight: 900, fontSize: '0.75rem' }}>ZALO</a>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontFamily: 'Outfit' }}>Sự Kiện</h4>
            {['Âm Nhạc', 'Công Nghệ', 'Triển Lãm', 'Tiệc Cưới', 'Sinh Nhật'].map(t => <div key={t} style={{ color: '#666', marginBottom: 10, cursor: 'pointer', fontSize: '0.9rem' }}>{t}</div>)}
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontFamily: 'Outfit' }}>Hỗ Trợ</h4>
            {[{t:'Hướng dẫn mua vé',k:'guide'},{t:'Chính sách hoàn vé',k:'refund'},{t:'Liên hệ BTC',k:'contact'},{t:'FAQ',k:'faq'},{t:'Điều khoản',k:'terms'}].map(i => <div key={i.k} onClick={() => setInfoPage(i.k)} style={{ color: '#666', marginBottom: 10, cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--primary-color)'} onMouseLeave={e => e.currentTarget.style.color='#666'}>{i.t}</div>)}
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontFamily: 'Outfit' }}>Đăng Ký Nhận Tin</h4>
            <p style={{ color: '#666', fontSize: '0.87rem', marginBottom: 15, lineHeight: 1.6 }}>Nhận thông báo sự kiện hot và mã giảm giá độc quyền.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-control" placeholder="Email của bạn..." style={{ flex: 1, borderRadius: 100, fontSize: '0.9rem' }} />
              <button className="btn" style={{ borderRadius: 100, padding: '10px 18px', flexShrink: 0, fontSize: '0.85rem' }}>Đăng ký</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #111', paddingTop: 24, textAlign: 'center', color: '#333', fontSize: '0.85rem' }}>
          © 2026 Lumina EMS. All Rights Reserved. | Made with ❤️ in Vietnam
        </div>
      </footer>

      {showAuthModal && <AuthModal mode={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={onLogin} />}
      {infoPage && <InfoModal pageKey={infoPage} onClose={() => setInfoPage(null)} />}
    </div>
  );
}
