import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';
import { resolveFileUrl } from '../api/config';
import SettingsPage from './SettingsPage';
import EmployeeSetupModal from '../features/dashboard/EmployeeSetupModal';
import ContractDetailModal from '../features/dashboard/ContractDetailModal';
import { Calendar, Users, Clock, CheckCircle, XCircle, DollarSign, RefreshCw, PlusCircle, MapPin, Eye, FileText, Package } from 'lucide-react';

export default function OrganizerPage({ view, currentUser }) {
  const [events, setEvents] = useState([]);
  const [guests, setGuests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', coverImg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200', categoryId: '', eventType: 'PUBLIC', ticketingEnabled: true });
  
  const [contracts, setContracts] = useState([]);
  const [setupModal, setSetupModal] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    if (currentUser && (view === 'dashboard' || view === 'events')) loadEvents();
    if (view === 'events') loadCategories();
    if (currentUser && view === 'contracts') loadMyContracts();
  }, [view, currentUser]);

  const loadMyContracts = async () => {
    setLoading(true);
    try {
      const res = await fetchGraphQL(`query { getEmployeeContracts(employeeId: "${currentUser.id}") { id memberId eventId details totalAmount status createdAt fileUrl fileName proposalTitle } }`);
      setContracts(res.getEmployeeContracts || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const formatMoney = (v) => v ? v.toLocaleString('vi-VN') + ' ₫' : '—';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

  const contractStatusBadge = (status) => {
    const map = {
      'Pending': { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', icon: <Clock size={14} /> },
      'MemberConfirmed': { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', icon: <CheckCircle size={14} /> },
      'MemberRejected': { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', icon: <XCircle size={14} /> },
      'EmployeeConfirmed': { bg: 'rgba(16,185,129,0.15)', color: '#10B981', icon: <CheckCircle size={14} /> },
      'Approved': { bg: 'rgba(16,185,129,0.15)', color: '#10B981', icon: <CheckCircle size={14} /> },
      'Deposited': { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', icon: <DollarSign size={14} /> },
      'Paid': { bg: 'rgba(16,185,129,0.15)', color: '#10B981', icon: <CheckCircle size={14} /> },
      'Rejected': { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', icon: <XCircle size={14} /> },
    };
    const s = map[status] || map['Pending'];
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, background: s.bg, color: s.color, fontWeight: 700, fontSize: '0.8rem' }}>
        {s.icon} {status}
      </span>
    );
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchGraphQL(`query { getOrganizerEvents(organizerId: "${currentUser.id}") { id title date location status eventType coverImg ticketingEnabled categoryName ticketTiers { id tierName price availableQuantity totalQuantity } } }`);
      setEvents(res.getOrganizerEvents || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const res = await fetchGraphQL(`query { getAllCategories { id name } }`);
      setCategories(res.getAllCategories || []);
    } catch (err) { console.error(err); }
  };

  const loadGuests = async (eventId) => {
    setSelectedEventId(eventId);
    try {
      const res = await fetchGraphQL(`query { getEventGuests(eventId: "${eventId}") { id name phone status dietary plusOnes note } }`);
      setGuests(res.getEventGuests || []);
    } catch (err) { console.error(err); }
  };

  const createEvent = async () => {
    if (!form.title || !form.date || !form.location || !form.categoryId) { alert('Vui lòng điền đầy đủ thông tin!'); return; }
    try {
      await fetchGraphQL(`mutation { createEvent(organizerId: "${currentUser.id}", categoryId: "${form.categoryId}", title: "${form.title}", date: "${form.date}", coverImg: "${form.coverImg}", location: "${form.location}", eventType: "${form.eventType}", ticketingEnabled: ${form.ticketingEnabled}, description: "${form.description}") { id } }`);
      setShowCreate(false);
      setForm({ title: '', description: '', date: '', location: '', coverImg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200', categoryId: '', eventType: 'PUBLIC', ticketingEnabled: true });
      loadEvents();
    } catch (err) { alert(err.message); }
  };

  const statusBadge = (s) => {
    const m = { 'Pending': { bg: 'rgba(245,158,11,0.15)', c: '#F59E0B' }, 'Approved': { bg: 'rgba(16,185,129,0.15)', c: '#10B981' }, 'Rejected': { bg: 'rgba(239,68,68,0.15)', c: '#EF4444' } };
    const st = m[s] || m['Pending'];
    return <span style={{ padding: '4px 10px', borderRadius: 8, background: st.bg, color: st.c, fontWeight: 700, fontSize: '0.8rem' }}>{s === 'Approved' ? '✅ Đã duyệt' : s === 'Rejected' ? '❌ Từ chối' : '⏳ Chờ duyệt'}</span>;
  };

  // ═══ DASHBOARD ═══
  if (view === 'dashboard') {
    const approved = events.filter(e => e.status === 'Approved').length;
    const pending = events.filter(e => e.status === 'Pending').length;
    const totalTix = events.reduce((s, e) => s + (e.ticketTiers || []).reduce((t, tt) => t + (tt.totalQuantity - tt.availableQuantity), 0), 0);
    return (
      <div>
        <h2 className="page-title">📊 Thống Kê Chung</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Tổng sự kiện', val: events.length, color: '#00F0FF', icon: '📅' },
            { label: 'Đã duyệt', val: approved, color: '#10B981', icon: '✅' },
            { label: 'Chờ duyệt', val: pending, color: '#F59E0B', icon: '⏳' },
            { label: 'Vé đã bán', val: totalTix, color: '#FF00E5', icon: '🎫' },
          ].map((c, i) => (
            <div key={i} className="panel" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: c.color }}>{c.val}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>
        <h3 style={{ marginBottom: 14 }}>Sự kiện gần nhất</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.slice(0, 5).map(e => (
            <div key={e.id} className="panel" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src={e.coverImg} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontWeight: 700 }}>{e.title}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📅 {e.date} • 📍 {e.location}</span>
              </div>
              {statusBadge(e.status)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ QUẢN LÝ SỰ KIỆN ═══
  if (view === 'events') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>📅 Quản Lý Sự Kiện</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn outline" onClick={loadEvents}><RefreshCw size={16} /> Làm mới</button>
          <button className="btn" onClick={() => setShowCreate(!showCreate)}><PlusCircle size={16} /> Tạo sự kiện</button>
        </div>
      </div>

      {showCreate && (
        <div className="panel" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px' }}>🆕 Tạo Sự Kiện Mới</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group"><label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tên sự kiện *</label><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ngày tổ chức *</label><input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Địa điểm *</label><input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
            <div className="form-group"><label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Danh mục *</label>
              <select className="form-control" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loại sự kiện</label>
              <select className="form-control" value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}>
                <option value="PUBLIC">Công khai (Public)</option>
                <option value="PRIVATE">Riêng tư (Private)</option>
              </select>
            </div>
            <div className="form-group"><label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>URL Ảnh bìa</label><input className="form-control" value={form.coverImg} onChange={e => setForm({ ...form, coverImg: e.target.value })} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 4 }}><label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mô tả</label><textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={form.ticketingEnabled} onChange={e => setForm({ ...form, ticketingEnabled: e.target.checked })} /> Bật bán vé online
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn" onClick={createEvent}><CheckCircle size={16} /> Tạo Sự Kiện</button>
            <button className="btn outline" onClick={() => setShowCreate(false)}>Hủy</button>
          </div>
        </div>
      )}

      {loading ? <div className="panel" style={{ textAlign: 'center', padding: 40 }}>Đang tải...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {events.map(e => (
            <div key={e.id} className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={e.coverImg} alt={e.title} style={{ width: '100%', height: 170, objectFit: 'cover' }} />
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', flex: 1 }}>{e.title}</h3>
                  {statusBadge(e.status)}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 6 }}>📅 {e.date} • 📍 {e.location}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>🏷️ {e.categoryName} • {e.eventType === 'PUBLIC' ? '🌐 Công khai' : '🔒 Riêng tư'}</div>
                {e.ticketTiers && e.ticketTiers.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    {e.ticketTiers.map(t => (
                      <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        <span>{t.tierName}</span>
                        <span style={{ color: '#00F0FF', fontWeight: 700 }}>{t.price.toLocaleString('vi-VN')}₫ ({t.totalQuantity - t.availableQuantity}/{t.totalQuantity})</span>
                      </div>
                    ))}
                  </div>
                )}
                <button className="btn outline" style={{ width: '100%', padding: '8px 0', fontSize: '0.85rem' }} onClick={() => loadGuests(e.id)}>
                  <Eye size={14} /> Xem khách / Check-in
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guest modal */}
      {selectedEventId && (
        <div className="modal-overlay" onClick={() => setSelectedEventId(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, padding: 30 }}>
            <h3 style={{ margin: '0 0 16px' }}>👥 Danh sách khách ({guests.length})</h3>
            {guests.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Chưa có khách RSVP cho sự kiện này.</p> : (
              <div style={{ maxHeight: 400, overflow: 'auto' }}>
                {guests.map(g => (
                  <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{g.name} {g.plusOnes > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(+{g.plusOnes})</span>}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📞 {g.phone || '—'} {g.dietary && `• 🍽️ ${g.dietary}`}</div>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', background: g.status === 'Confirmed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: g.status === 'Confirmed' ? '#10B981' : '#F59E0B' }}>{g.status}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="btn outline" style={{ marginTop: 16, width: '100%' }} onClick={() => setSelectedEventId(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );

  // ═══ RSVP ═══
  if (view === 'rsvp') {
    return (
      <div>
        <h2 className="page-title">👥 Khách Mời & RSVP</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Chọn sự kiện để xem danh sách khách mời:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {events.filter(e => e.status === 'Approved').map(e => (
            <div key={e.id} className="panel" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => loadGuests(e.id)}>
              <div>
                <h4 style={{ margin: 0, fontWeight: 700 }}>{e.title}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📅 {e.date} • 📍 {e.location}</span>
              </div>
              <button className="btn outline" style={{ padding: '8px 16px' }}><Users size={14} /> Xem khách</button>
            </div>
          ))}
          {events.filter(e => e.status === 'Approved').length === 0 && <div className="panel" style={{ textAlign: 'center', padding: 40 }}>Chưa có sự kiện đã duyệt.</div>}
        </div>
        {selectedEventId && (
          <div className="modal-overlay" onClick={() => setSelectedEventId(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, padding: 30 }}>
              <h3 style={{ margin: '0 0 16px' }}>👥 Danh sách khách RSVP ({guests.length})</h3>
              {guests.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Chưa có ai RSVP.</p> : guests.map(g => (
                <div key={g.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <div><strong>{g.name}</strong> {g.plusOnes > 0 && `(+${g.plusOnes})`}<br /><span style={{ fontSize: '0.85rem', color: '#888' }}>{g.phone} {g.dietary && `• ${g.dietary}`}</span></div>
                  <span style={{ color: g.status === 'Confirmed' ? '#10B981' : '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>{g.status}</span>
                </div>
              ))}
              <button className="btn outline" style={{ marginTop: 16, width: '100%' }} onClick={() => setSelectedEventId(null)}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══ SEATING ═══
  if (view === 'seating') return (
    <div>
      <h2 className="page-title">🪑 Xếp Bàn Tiệc</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Chọn sự kiện Private để quản lý sơ đồ bàn:</p>
      {events.filter(e => e.eventType === 'PRIVATE').map(e => (
        <div key={e.id} className="panel" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 12px' }}>{e.title}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {[1,2,3,4,5,6].map(n => (
              <div key={n} style={{ border: '2px dashed var(--border-color)', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor='#00F0FF'} onMouseLeave={e => e.currentTarget.style.borderColor='var(--border-color)'}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🪑</div>
                <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>Bàn {n}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>0/10 khách</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {events.filter(e => e.eventType === 'PRIVATE').length === 0 && <div className="panel" style={{ textAlign: 'center', padding: 40 }}>Không có sự kiện Private.</div>}
    </div>
  );

  // ═══ RUNDOWN ═══
  if (view === 'rundown') return (
    <div>
      <h2 className="page-title">📋 Kịch Bản & Task Checklist</h2>
      {events.filter(e => e.status === 'Approved').slice(0, 3).map(e => (
        <div key={e.id} className="panel" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 16px' }}>{e.title} — {e.date}</h3>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'var(--border-color)' }} />
            {[
              { time: '06:00', task: 'Setup sân khấu & thiết bị', done: true },
              { time: '08:00', task: 'Soundcheck & lighting test', done: true },
              { time: '14:00', task: 'Rehearsal nghệ sĩ', done: false },
              { time: '17:00', task: 'Mở cổng check-in', done: false },
              { time: '18:00', task: 'Khai mạc chương trình', done: false },
              { time: '22:00', task: 'Kết thúc & dọn dẹp', done: false },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, position: 'relative' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: item.done ? '#10B981' : 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: -16 }}>
                  {item.done && <CheckCircle size={12} color="#fff" />}
                </div>
                <span style={{ fontWeight: 700, color: '#00F0FF', minWidth: 50, marginLeft: 16 }}>{item.time}</span>
                <span style={{ color: item.done ? 'var(--text-muted)' : '#fff', textDecoration: item.done ? 'line-through' : 'none' }}>{item.task}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {events.filter(e => e.status === 'Approved').length === 0 && <div className="panel" style={{ textAlign: 'center', padding: 40 }}>Chưa có sự kiện đã duyệt.</div>}
    </div>
  );

  // ═══ HỢP ĐỒNG PHÂN CÔNG ═══
  if (view === 'contracts') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>📋 Hợp Đồng Được Phân Công Tổ Chức</h2>
        <button className="btn outline" onClick={loadMyContracts} style={{ padding: '8px 16px' }}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>
      
      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: 40 }}>
          <div className="spin" style={{ width: 32, height: 32, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Đang tải...</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: 50 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📂</div>
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Chưa có hợp đồng nào được phân công</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Bạn sẽ nhận được các hợp đồng tổ chức sự kiện khi khách hàng xác nhận.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 8 }}>
            <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-color)' }}>{contracts.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tổng HĐ</div>
            </div>
            <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>{contracts.filter(c => c.status === 'Pending' || c.status === 'MemberConfirmed').length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chờ xử lý</div>
            </div>
            <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>{contracts.filter(c => c.status === 'EmployeeConfirmed' || c.status === 'Approved' || c.status === 'Paid').length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Đã triển khai</div>
            </div>
            <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#3B82F6' }}>{formatMoney(contracts.reduce((s, c) => s + (c.totalAmount || 0), 0))}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tổng giá trị</div>
            </div>
          </div>

          {/* Contract list */}
          {contracts.map(c => (
            <div key={c.id} className="panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '1.05rem' }}>
                    <FileText size={16} style={{ marginRight: 6, verticalAlign: -2, color: 'var(--primary-color)' }} />
                    {c.proposalTitle || `Hợp đồng #${c.id.slice(-6)}`}
                  </h3>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ngày tạo: {formatDate(c.createdAt)}</span>
                </div>
                {contractStatusBadge(c.status)}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 14, marginBottom: 14, maxHeight: 120, overflow: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {c.details ? c.details.substring(0, 300) + (c.details.length > 300 ? '...' : '') : 'Không có chi tiết'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: '#00F0FF', fontSize: '1.1rem' }}>
                  <DollarSign size={16} style={{ verticalAlign: -2 }} /> {formatMoney(c.totalAmount)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => setSelectedContract(c)}>
                    👁️ Chi tiết
                  </button>
                  {c.fileUrl && (
                    <a href={resolveFileUrl(c.fileUrl)} target="_blank" rel="noreferrer" className="btn outline" style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}>
                      📄 Tải file
                    </a>
                  )}
                  {c.status === 'MemberConfirmed' && (
                    <button className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }} onClick={() => setSetupModal(c)}>
                      <Package size={14} /> Kiểm tra & Xác nhận
                    </button>
                  )}
                  {c.status === 'EmployeeConfirmed' && (
                    <button className="btn outline" style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#10B981', color: '#10B981' }} onClick={() => { setSetupModal({...c, showProgress: true}); }}>
                      <CheckCircle size={14} /> Cập nhật tiến độ
                    </button>
                  )}
                  {c.status === 'Pending' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 8, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontWeight: 700, fontSize: '0.8rem' }}>
                      <Clock size={14} /> Chờ khách hàng xác nhận
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ SETUP MODAL ═══ */}
      {setupModal && (
        <EmployeeSetupModal
          contract={setupModal}
          onClose={() => setSetupModal(null)}
          onConfirmed={() => { setSetupModal(null); loadMyContracts(); }}
        />
      )}

      {selectedContract && (
        <ContractDetailModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );

  if (view === 'settings') return <div><h2 className="page-title">⚙️ Thông Tin Cá Nhân</h2><SettingsPage currentUser={currentUser} /></div>;
  if (view === 'internal-requests') return <OrganizerRequests currentUser={currentUser} />;
  return null;
}

function OrganizerRequests({ currentUser }) {
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    fetchGraphQL(`query { getInternalRequestsForManager(managerId: "${currentUser.id}") { id employeeName type subject content amount status managerNote createdAt } }`)
      .then(res => setRequests(res.getInternalRequestsForManager || []))
      .catch(console.error);
  };

  useEffect(() => { loadRequests(); }, [currentUser]);

  const handleUpdate = async (id, status) => {
    const note = prompt('Nhập ghi chú cho nhân viên (không bắt buộc):') || '';
    try {
      await fetchGraphQL(`mutation M($requestId: ID!, $status: String!, $managerNote: String) { updateInternalRequestStatus(requestId: $requestId, status: $status, managerNote: $managerNote) { id } }`, { requestId: id, status, managerNote: note });
      loadRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const statusBadge = (s) => {
    if (s === 'Approved') return <span className="badge success">✅ Đã duyệt</span>;
    if (s === 'Rejected') return <span className="badge error">❌ Từ chối</span>;
    return <span className="badge warning">⏳ Chờ duyệt</span>;
  };

  const typeLabels = { Leave: 'Nghỉ phép', Advance: 'Tạm ứng', Expense: 'Thanh toán chi phí', Other: 'Khác' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>Duyệt Yêu Cầu Chi Nhánh</h2>
        <button className="btn outline" onClick={loadRequests}><RefreshCw size={16} /> Làm mới</button>
      </div>

      <div className="panel">
        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Chưa có yêu cầu nào từ nhân viên trong chi nhánh.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #444' }}>
                <th style={{ padding: 10 }}>Ngày Gửi</th>
                <th style={{ padding: 10 }}>Nhân Viên</th>
                <th style={{ padding: 10 }}>Loại</th>
                <th style={{ padding: 10 }}>Tiêu Đề / Nội dung</th>
                <th style={{ padding: 10 }}>Số Tiền</th>
                <th style={{ padding: 10 }}>Trạng Thái</th>
                <th style={{ padding: 10 }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const rawDate = r.createdAt;
                const d = rawDate ? new Date(isNaN(rawDate) ? rawDate : parseInt(rawDate)) : null;
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: 10 }}>{d && !isNaN(d) ? d.toLocaleDateString('vi-VN') : '-'}</td>
                    <td style={{ padding: 10, fontWeight: 'bold' }}>{r.employeeName}</td>
                    <td style={{ padding: 10 }}>{typeLabels[r.type] || r.type}</td>
                    <td style={{ padding: 10 }}>
                      <div style={{ fontWeight: 'bold' }}>{r.subject}</div>
                      <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: 4 }}>{r.content}</div>
                      {r.managerNote && <div style={{ fontSize: '0.85rem', color: '#00F0FF', marginTop: 4 }}>💬 QL: {r.managerNote}</div>}
                    </td>
                    <td style={{ padding: 10, color: '#00F0FF' }}>{r.amount ? `${r.amount.toLocaleString()}đ` : '-'}</td>
                    <td style={{ padding: 10 }}>{statusBadge(r.status)}</td>
                    <td style={{ padding: 10 }}>
                      {r.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: 6, flexDirection: 'column' }}>
                          <button className="btn" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => handleUpdate(r.id, 'Approved')}>✅ Duyệt</button>
                          <button className="btn outline" style={{ color: '#ff4444', borderColor: '#ff4444', padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => handleUpdate(r.id, 'Rejected')}>❌ Hủy</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
