import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, Share2, FileText } from 'lucide-react';
import { fetchGraphQL } from '../../api/axiosClient';
import SeatMapUI from './SeatMapUI';

const IconFB = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;

// Wedding showcase photos
const WEDDING_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop', caption: 'Không gian tiệc cưới sang trọng' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&fit=crop', caption: 'Trang trí bàn tiệc hoàng gia' },
  { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&fit=crop', caption: 'Hoa cưới & Backdrop' },
  { src: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&fit=crop', caption: 'Lễ đường outdoor' },
  { src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=600&fit=crop', caption: 'Không gian lãng mạn' },
  { src: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=600&fit=crop', caption: 'Đêm tiệc ánh nến' },
];
const WEDDING_MENU = [
  { name: 'Khai vị — Súp bào ngư vi cá', desc: 'Súp bào ngư nấu với vi cá, nấm đông cô, hạt sen' },
  { name: 'Món 1 — Tôm hùm sốt bơ tỏi', desc: 'Tôm hùm Alaska nướng bơ tỏi, rau măng tây Úc' },
  { name: 'Món 2 — Bò Wagyu A5 áp chảo', desc: 'Bò Wagyu Nhật grade A5, sốt tiêu đen truffle' },
  { name: 'Món 3 — Cá chẽm hấp Hồng Kông', desc: 'Cá chẽm tươi hấp xì dầu, hành gừng phi thơm' },
  { name: 'Tráng miệng — Bánh cưới 5 tầng', desc: 'Bánh cưới fondant 5 tầng, kem vanilla Madagascar' },
];
const WEDDING_PROGRAMS = [
  { time: '17:00', title: 'Đón khách — Cocktail Reception', icon: '🥂' },
  { time: '18:00', title: 'Lễ cưới chính — Nghi thức trao nhẫn', icon: '💍' },
  { time: '18:30', title: 'Biểu diễn nhạc sống — Ban nhạc Jazz', icon: '🎵' },
  { time: '19:00', title: 'Tiệc chính — 5-Course Dinner', icon: '🍽️' },
  { time: '20:00', title: 'Chương trình nghệ thuật — Múa đương đại', icon: '💃' },
  { time: '20:30', title: 'Cắt bánh cưới & Toast', icon: '🎂' },
  { time: '21:00', title: 'DJ Party & Khiêu vũ', icon: '🎶' },
];
const WEDDING_EFFECTS = [
  { name: 'Pháo hoa lạnh Indoor', desc: 'Hệ thống 12 cột pháo hoa lạnh sparkular, an toàn trong nhà, hiệu ứng tia sáng 3m', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&fit=crop' },
  { name: 'Khói sân khấu CO2', desc: 'Máy tạo khói CO2 jet, hiệu ứng khói dày phủ mặt đất tạo không gian mơ màng', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&fit=crop' },
  { name: 'LED Mapping 3D', desc: 'Màn hình LED P2.5 cong 180° kết hợp projection mapping tạo không gian 3D immersive', img: 'https://images.unsplash.com/photo-1563770660941-10a63607713a?w=300&fit=crop' },
  { name: 'Laser Show & Hologram', desc: 'Hệ thống laser RGB 20W kết hợp hologram fan tạo hình ảnh 3D trên không', img: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=300&fit=crop' },
];

export default function EventDetail({ eventId, onBack, currentUser }) {
  const [event, setEvent] = useState(null);
  const [holdTimer, setHoldTimer] = useState(null);
  const [cart, setCart] = useState(null);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [paying, setPaying] = useState(false);
  const [activeTab, setActiveTab] = useState('default');
  const [eventContracts, setEventContracts] = useState([]);

  useEffect(() => {
    fetchGraphQL(`query { getEventDetail(id: "${eventId}") { id title description date coverImg location status eventType ticketingEnabled categoryName ticketTiers { id tierName price availableQuantity } } }`)
      .then(res => {
        setEvent(res.getEventDetail);
        const cat = (res.getEventDetail?.categoryName || '').toLowerCase();
        const isWedding = cat.includes('cưới') || cat.includes('wedding');
        if (currentUser?.role === 'EMPLOYEE') {
          setActiveTab('info');
        } else {
          setActiveTab(isWedding ? 'gallery' : (res.getEventDetail?.ticketingEnabled ? 'seats' : 'info'));
        }
      });
    fetchGraphQL(`query { getContractsByEvent(eventId: "${eventId}") { id details totalAmount status createdAt } }`)
      .then(res => setEventContracts(res.getContractsByEvent || [])).catch(() => {});
  }, [eventId, currentUser]);

  useEffect(() => {
    let t = null;
    if (holdTimer > 0) t = setInterval(() => setHoldTimer(h => h - 1), 1000);
    else if (holdTimer === 0 && cart) { alert('Phiên giữ chỗ đã hết hạn!'); setCart(null); setShowPaymentQR(false); }
    return () => clearInterval(t);
  }, [holdTimer, cart]);

  const confirmPayment = async () => {
    setPaying(true);
    try {
      await fetchGraphQL(`mutation { checkoutOrder(orderId: "${cart.id}") { id qrCode } }`);
      setShowPaymentQR(false); setCart(null); setPaying(false);
      alert('✅ Thanh toán thành công! Vé QR điện tử đã được lưu vào Tủ Vé của bạn.');
      onBack();
    } catch (e) { alert('❌ ' + e.message); setPaying(false); }
  };

  if (!event) return <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải...</div>;

  const catName = (event.categoryName || '').toLowerCase();
  const isWedding = catName.includes('cưới') || catName.includes('wedding');
  const isTicketable = event.ticketingEnabled && !isWedding;

  const amount = cart ? cart.totalAmount : 0;
  const description = cart ? `Thanhtoanve${cart.id.slice(-6)}` : '';
  const vietQRUrl = `https://img.vietqr.io/image/VCB-9974174376-compact2.png?amount=${amount}&addInfo=${description}&accountName=${encodeURIComponent('TRAN NHAT HAO')}`;
  const mapQuery = encodeURIComponent(event.location + ', Việt Nam');

  // Build tabs based on event type
  const tabs = [];
  if (currentUser?.role !== 'EMPLOYEE') {
    if (isWedding) {
      tabs.push({ key: 'gallery', label: '📸 Album Ảnh' });
      tabs.push({ key: 'menu', label: '🍽️ Thực Đơn' });
      tabs.push({ key: 'program', label: '🎵 Chương Trình' });
      tabs.push({ key: 'effects', label: '✨ Kỹ Xảo' });
    } else if (isTicketable) {
      tabs.push({ key: 'seats', label: '🎟️ Chọn Ghế & Đặt Vé' });
    }
    tabs.push({ key: 'info', label: '📋 Thông Tin Chi Tiết' });
    tabs.push({ key: 'contracts', label: `📄 Hợp Đồng (${eventContracts.length})` });
    tabs.push({ key: 'map', label: '🗺️ Bản Đồ' });
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: 'var(--bg-main)' }}>
      {/* Topbar */}
      <div style={{ height: 52, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button className="btn outline" style={{ border: 'none', padding: 0, fontFamily: 'Outfit', fontWeight: 700 }} onClick={onBack}>← Quay lại</button>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.85rem' }}><Share2 size={14} style={{ display: 'inline', marginRight: 4 }} />Chia sẻ:</span>
          <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} style={{ background: '#4267B2', border: 'none', color: '#fff', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><IconFB /> Facebook</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ height: 380, background: `url(${event.coverImg}) center/cover`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 40%, var(--bg-main) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 30, left: 60, right: 60 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span className="badge blue">{event.categoryName || event.eventType}</span>
            {isTicketable && <span className="badge success">🎟 Đang mở bán</span>}
            {isWedding && <span className="badge" style={{ background: 'rgba(255,182,193,0.2)', color: '#FFB6C1', border: '1px solid #FFB6C1' }}>💒 Tiệc Cưới</span>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontFamily: 'Outfit', fontWeight: 900, lineHeight: 1.1, marginBottom: 14 }}>{event.title}</h1>
          <div style={{ display: 'flex', gap: 20, color: '#ccc', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={15} color="var(--primary-color)" /> {new Date(event.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={15} color="var(--accent-color)" /> {event.location}</span>
          </div>
        </div>
      </div>

      {/* Tab Nav */}
      {tabs.length > 0 && (
        <div style={{ display: 'flex', gap: 0, padding: '0 40px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 52, zIndex: 50, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ padding: '14px 24px', background: 'transparent', border: 'none', borderBottom: `3px solid ${activeTab === t.key ? 'var(--primary-color)' : 'transparent'}`, color: activeTab === t.key ? 'var(--primary-color)' : '#888', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ═══ WEDDING TABS ═══ */}
      {activeTab === 'gallery' && isWedding && (
        <div style={{ padding: '40px 60px' }}>
          <h2 className="page-title">📸 Album Ảnh Tiệc Cưới</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {WEDDING_GALLERY.map((p, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #333', position: 'relative' }}>
                <img src={p.src} alt={p.caption} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px 16px 12px', fontWeight: 600, fontSize: '0.9rem' }}>{p.caption}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'menu' && isWedding && (
        <div style={{ padding: '40px 60px', maxWidth: 800, margin: '0 auto' }}>
          <h2 className="page-title">🍽️ Thực Đơn Tiệc Cưới — 5 Course Dinner</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {WEDDING_MENU.map((m, i) => (
              <div key={i} className="panel" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: 'linear-gradient(135deg, rgba(255,182,193,0.2), rgba(255,215,0,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'var(--warning)', flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Outfit' }}>{m.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'program' && isWedding && (
        <div style={{ padding: '40px 60px', maxWidth: 800, margin: '0 auto' }}>
          <h2 className="page-title">🎵 Chương Trình & Tiết Mục</h2>
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, var(--primary-color), var(--accent-color))' }} />
            {WEDDING_PROGRAMS.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 24, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -34, width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-main)', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{p.icon}</div>
                <div className="panel" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontFamily: 'Outfit', fontSize: '1.05rem' }}>{p.title}</div>
                    <span className="badge blue">{p.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'effects' && isWedding && (
        <div style={{ padding: '40px 60px' }}>
          <h2 className="page-title">✨ Kỹ Thuật & Kỹ Xảo Đặc Biệt</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {WEDDING_EFFECTS.map((e, i) => (
              <div key={i} className="panel" style={{ display: 'flex', gap: 20, overflow: 'hidden' }}>
                <img src={e.img} alt={e.name} style={{ width: 120, height: 100, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Outfit', marginBottom: 6 }}>{e.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ TICKETING TAB (only for music/non-wedding) ═══ */}
      {activeTab === 'seats' && isTicketable && (
        !cart || !showPaymentQR ? (
          <SeatMapUI eventId={event.id} currentUser={currentUser} onSeatHeld={(order) => { setCart(order); setShowPaymentQR(true); setHoldTimer(10 * 60); }} />
        ) : (
          <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 20, padding: 35, textAlign: 'center' }}>
              <h3 style={{ color: 'var(--warning)' }}>⌛ Phiên Giữ Ghế</h3>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--warning)', margin: '10px 0' }}>
                {Math.floor(holdTimer / 60)}:{(holdTimer % 60).toString().padStart(2, '0')}
              </div>
              {(cart.seatLabels?.length > 0 || cart.seatLabel) && (
                <div style={{ background: 'rgba(0,240,255,0.08)', border: `1px solid ${cart.zoneColor || 'var(--primary-color)'}`, borderRadius: 12, padding: '12px 20px', margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700 }}>
                  🎟️ {cart.quantity > 1 ? `${cart.quantity} Ghế` : 'Ghế'}: <span style={{ color: 'var(--primary-color)' }}>{cart.seatLabels?.join(', ') || cart.seatLabel}</span> — {cart.zoneName}
                </div>
              )}
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <img src={vietQRUrl} alt="QR" style={{ width: '100%', maxWidth: 230, borderRadius: 8 }} />
                <div style={{ color: '#555', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: 8 }}>{amount.toLocaleString()}đ — Vietcombank • 9974174376</div>
              </div>
              <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: '1.1rem' }} onClick={confirmPayment} disabled={paying}>
                {paying ? '⌛ Đang xử lý...' : '✅ Tôi đã chuyển xong! Xác nhận'}
              </button>
            </div>
          </div>
        )
      )}

      {/* ═══ INFO TAB ═══ */}
      {activeTab === 'info' && (
        <div style={{ padding: '40px 60px', maxWidth: 900, margin: '0 auto' }}>
          <h2 className="page-title">📋 Giới Thiệu Sự Kiện</h2>
          <div className="panel" style={{ marginBottom: 30 }}>
            <p style={{ color: '#ddd', lineHeight: 2, fontSize: '1.05rem' }}>{event.description || 'Chưa có mô tả chi tiết.'}</p>
          </div>
          {currentUser?.role !== 'EMPLOYEE' && event.ticketTiers && event.ticketTiers.length > 0 && isTicketable && (
            <div>
              <h3 style={{ marginBottom: 16 }}>🎫 Các Hạng Vé</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                {event.ticketTiers.map(t => (
                  <div key={t.id} className="panel" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', marginBottom: 8 }}>{t.tierName}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-color)', fontFamily: 'Outfit' }}>{t.price?.toLocaleString()}đ</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>Còn {t.availableQuantity} vé</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ CONTRACTS TAB ═══ */}
      {activeTab === 'contracts' && (
        <div style={{ padding: '40px 60px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 className="page-title">📄 Hợp Đồng Liên Quan</h2>
          {eventContracts.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center', padding: 50 }}>
              <FileText size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
              <h3>Chưa có hợp đồng nào cho sự kiện này</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {eventContracts.map(c => (
                <div key={c.id} className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontWeight: 700, marginBottom: 4 }}>{c.details}</div></div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--primary-color)', fontFamily: 'Outfit' }}>{c.totalAmount?.toLocaleString()}đ</div>
                    <span className={`badge ${c.status === 'Paid' ? 'success' : c.status === 'Approved' ? 'blue' : 'warning'}`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ MAP TAB ═══ */}
      {activeTab === 'map' && (
        <div style={{ padding: '40px 60px' }}>
          <h2 className="page-title">📍 Địa Điểm</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 30 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <iframe title="Map" src={`https://maps.google.com/maps?q=${mapQuery}&output=embed&z=15`} width="100%" height="450" style={{ border: 'none', display: 'block' }} allowFullScreen loading="lazy" />
            </div>
            <div className="panel" style={{ alignSelf: 'start' }}>
              <h3 style={{ marginBottom: 16 }}>Thông Tin</h3>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}><MapPin size={18} color="var(--accent-color)" /><div><div style={{ fontWeight: 700 }}>{event.location}</div></div></div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--primary-color)', color: '#000', padding: '10px 16px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', justifyContent: 'center' }}><ExternalLink size={15} /> Google Maps</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
