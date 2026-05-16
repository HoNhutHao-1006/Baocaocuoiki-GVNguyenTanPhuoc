import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';
import { PlusCircle, Send, Trash2, Mail, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import EventProposalWizard from '../features/proposal/EventProposalWizard';

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 14, padding: '16px 20px', flex: 1, minWidth: 140 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ color }}>{icon}</div>
      <div><div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color }}>{value}</div><div style={{ fontSize: '0.78rem', color: '#888' }}>{label}</div></div>
    </div>
  </div>
);

export function ProjectManager({ currentUser }) {
  const [proposals, setProposals] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', eventType: 'PUBLIC', expectedDate: '', expectedLocation: '', budget: '' });

  const load = () => {
    fetchGraphQL(`query { getMyEventProposals(memberId: "${currentUser.id}") { id title description eventType expectedDate expectedLocation budget status reviewNote createdAt } }`)
      .then(r => setProposals(r.getMyEventProposals || [])).catch(() => {});
  };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetchGraphQL(`mutation M($title: String!, $description: String!, $eventType: String, $expectedDate: String!, $expectedLocation: String!, $budget: Float) { createEventProposal(memberId: "${currentUser.id}", title: $title, description: $description, eventType: $eventType, expectedDate: $expectedDate, expectedLocation: $expectedLocation, budget: $budget) { id } }`, { ...form, budget: Number(form.budget) });
      alert('✅ Gửi đề xuất thành công!');
      setShowCreate(false); setForm({ title: '', description: '', eventType: 'PUBLIC', expectedDate: '', expectedLocation: '', budget: '' }); load();
    } catch (err) { alert(err.message); }
  };

  const approved = proposals.filter(p => p.status === 'Approved').length;
  const pending = proposals.filter(p => p.status === 'Pending').length;
  const rejected = proposals.filter(p => p.status === 'Rejected').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, rgba(255,0,229,0.2), rgba(0,240,255,0.2))', border: '1px solid rgba(255,0,229,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlusCircle size={26} color="#FF00E5" />
          </div>
          <div>
            <h2 className="page-title" style={{ marginBottom: 0 }}>📝 Quản Lý Dự Án Sự Kiện</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>Gửi yêu cầu & theo dõi tiến trình duyệt</p>
          </div>
        </div>
        <button className="btn" onClick={() => setShowCreate(true)}>+ Tạo đề xuất mới</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard icon={<Users size={20} />} label="Tổng đề xuất" value={proposals.length} color="#00F0FF" />
        <StatCard icon={<CheckCircle size={20} />} label="Đã duyệt" value={approved} color="#10B981" />
        <StatCard icon={<Clock size={20} />} label="Chờ duyệt" value={pending} color="#F59E0B" />
        <StatCard icon={<XCircle size={20} />} label="Từ chối" value={rejected} color="#EF4444" />
      </div>

      {proposals.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
          <h3 style={{ fontFamily: 'Outfit' }}>Chưa có đề xuất nào</h3>
          <p style={{ color: 'var(--text-muted)' }}>Nhấn "Tạo đề xuất mới" để bắt đầu</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {proposals.map(p => (
            <div key={p.id} className="panel" style={{ padding: '18px 24px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-color)' }} onClick={() => setDetail(p)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-color)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'Outfit' }}>{p.title}</span>
                    <span className={`badge ${p.eventType === 'PUBLIC' ? 'blue' : 'warning'}`} style={{ fontSize: '0.7rem' }}>{p.eventType}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: '0.82rem', color: '#888' }}>
                    <span>📅 {p.expectedDate}</span>
                    <span>📍 {p.expectedLocation}</span>
                    <span>💰 {p.budget?.toLocaleString()}đ</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`badge ${p.status === 'Approved' ? 'success' : p.status === 'Rejected' ? 'error' : 'warning'}`}>
                    {p.status === 'Approved' ? '✅ Đã duyệt' : p.status === 'Rejected' ? '❌ Từ chối' : '⏳ Chờ duyệt'}
                  </span>
                  {p.reviewNote && <span style={{ fontSize: '0.8rem', color: '#aaa', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>💬 {p.reviewNote}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 560 }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: 20 }}>📋 Chi Tiết Đề Xuất</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ fontSize: '0.78rem', color: '#888' }}>Tên dự án</label><div style={{ fontWeight: 700 }}>{detail.title}</div></div>
              <div><label style={{ fontSize: '0.78rem', color: '#888' }}>Loại</label><div><span className={`badge ${detail.eventType === 'PUBLIC' ? 'blue' : 'warning'}`}>{detail.eventType}</span></div></div>
              <div><label style={{ fontSize: '0.78rem', color: '#888' }}>Ngày dự kiến</label><div style={{ fontWeight: 600 }}>📅 {detail.expectedDate}</div></div>
              <div><label style={{ fontSize: '0.78rem', color: '#888' }}>Địa điểm</label><div style={{ fontWeight: 600 }}>📍 {detail.expectedLocation}</div></div>
              <div><label style={{ fontSize: '0.78rem', color: '#888' }}>Ngân sách</label><div style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.1rem' }}>💰 {detail.budget?.toLocaleString()}đ</div></div>
              <div><label style={{ fontSize: '0.78rem', color: '#888' }}>Trạng thái</label><div><span className={`badge ${detail.status === 'Approved' ? 'success' : detail.status === 'Rejected' ? 'error' : 'warning'}`}>{detail.status}</span></div></div>
            </div>
            <div style={{ marginTop: 16 }}><label style={{ fontSize: '0.78rem', color: '#888' }}>Mô tả</label><div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 14, marginTop: 6, fontSize: '0.9rem', lineHeight: 1.6 }}>{detail.description}</div></div>
            {detail.reviewNote && <div style={{ marginTop: 16 }}><label style={{ fontSize: '0.78rem', color: '#888' }}>Ghi chú từ Admin</label><div style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 10, padding: 14, marginTop: 6, fontSize: '0.9rem' }}>{detail.reviewNote}</div></div>}
            <button className="btn outline" style={{ marginTop: 20, width: '100%' }} onClick={() => setDetail(null)}>Đóng</button>
          </div>
        </div>
      )}

      {showCreate && (
        <EventProposalWizard currentUser={currentUser} onClose={() => setShowCreate(false)} onSubmit={async (data) => {
          try {
            await fetchGraphQL(`mutation M($title: String!, $description: String!, $eventType: String, $expectedDate: String!, $expectedLocation: String!, $budget: Float) { createEventProposal(memberId: "${currentUser.id}", title: $title, description: $description, eventType: $eventType, expectedDate: $expectedDate, expectedLocation: $expectedLocation, budget: $budget) { id } }`, data);
            alert('✅ Gửi đề xuất thành công!');
            setShowCreate(false); load();
          } catch (err) { alert(err.message); }
        }} />
      )}
    </div>
  );
}

export function InvitationManager({ currentUser }) {
  const [invitations, setInvitations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, sent: 0, confirmed: 0, declined: 0 });
  const [proposals, setProposals] = useState([]);
  const [filterProposal, setFilterProposal] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', dietary: '', plusOnes: 0, note: '', proposalId: '' });
  const [sending, setSending] = useState(null);

  const load = () => {
    const pFilter = filterProposal ? `, proposalId: "${filterProposal}"` : '';
    fetchGraphQL(`query { getMyInvitations(memberId: "${currentUser.id}"${pFilter}) { id name email phone status dietary plusOnes note qrCode sentAt createdAt proposalId proposalTitle } }`)
      .then(r => setInvitations(r.getMyInvitations || [])).catch(() => {});
    fetchGraphQL(`query { getInvitationStats(memberId: "${currentUser.id}") { total pending sent confirmed declined } }`)
      .then(r => setStats(r.getInvitationStats || stats)).catch(() => {});
  };
  useEffect(load, [filterProposal]);
  useEffect(() => {
    fetchGraphQL(`query { getMyEventProposals(memberId: "${currentUser.id}") { id title status } }`)
      .then(r => setProposals(r.getMyEventProposals || [])).catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetchGraphQL(`mutation M($name: String!, $email: String, $phone: String, $dietary: String, $plusOnes: Int, $note: String, $proposalId: ID) { createInvitation(memberId: "${currentUser.id}", name: $name, email: $email, phone: $phone, dietary: $dietary, plusOnes: $plusOnes, note: $note, proposalId: $proposalId) { id } }`, { ...form, plusOnes: Number(form.plusOnes), proposalId: form.proposalId || undefined });
      setShowAdd(false); setForm({ name: '', email: '', phone: '', dietary: '', plusOnes: 0, note: '', proposalId: '' }); load();
    } catch (err) { alert(err.message); }
  };

  const handleSend = async (id) => {
    setSending(id);
    try {
      await fetchGraphQL(`mutation { sendInvitation(invitationId: "${id}") { id status } }`);
      load();
    } catch (err) { alert(err.message); }
    setSending(null);
  };

  const handleSendAll = async () => {
    if (!window.confirm('Gửi tất cả thư mời đang chờ?')) return;
    const pFilter = filterProposal ? `, proposalId: "${filterProposal}"` : '';
    await fetchGraphQL(`mutation { sendAllInvitations(memberId: "${currentUser.id}"${pFilter}) }`);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa khách mời này?')) return;
    await fetchGraphQL(`mutation { deleteInvitation(invitationId: "${id}") }`);
    load();
  };

  const statusConfig = { Pending: { color: '#F59E0B', label: '⏳ Chờ gửi' }, Sent: { color: '#3B82F6', label: '📨 Đã gửi' }, Confirmed: { color: '#10B981', label: '✅ Xác nhận' }, Declined: { color: '#EF4444', label: '❌ Từ chối' }, CheckedIn: { color: '#00F0FF', label: '🎫 Đã check-in' } };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(16,185,129,0.2))', border: '1px solid rgba(0,240,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={26} color="#00F0FF" />
          </div>
          <div>
            <h2 className="page-title" style={{ marginBottom: 0 }}>📧 Quản Lý Thư Mời & RSVP</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>Thêm khách mời, gửi thư mời & theo dõi phản hồi</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {stats.pending > 0 && <button className="btn outline" onClick={handleSendAll} style={{ fontSize: '0.85rem' }}><Send size={14} /> Gửi tất cả ({stats.pending})</button>}
          <button className="btn" onClick={() => setShowAdd(true)}>+ Thêm khách mời</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard icon={<Users size={20} />} label="Tổng khách" value={stats.total} color="#00F0FF" />
        <StatCard icon={<Clock size={20} />} label="Chờ gửi" value={stats.pending} color="#F59E0B" />
        <StatCard icon={<Send size={20} />} label="Đã gửi" value={stats.sent} color="#3B82F6" />
        <StatCard icon={<CheckCircle size={20} />} label="Xác nhận" value={stats.confirmed} color="#10B981" />
        <StatCard icon={<XCircle size={20} />} label="Từ chối" value={stats.declined} color="#EF4444" />
      </div>

      {proposals.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <select className="form-control" style={{ maxWidth: 300, display: 'inline-block' }} value={filterProposal} onChange={e => setFilterProposal(e.target.value)}>
            <option value="">Tất cả dự án</option>
            {proposals.map(p => <option key={p.id} value={p.id}>{p.title} ({p.status})</option>)}
          </select>
        </div>
      )}

      <div className="panel">
        {invitations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <Mail size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
            <div style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Chưa có khách mời nào</div>
            <p style={{ fontSize: '0.85rem' }}>Nhấn "Thêm khách mời" để bắt đầu</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--primary-color)', fontFamily: 'Outfit', fontWeight: 700 }}>KHÁCH MỜI</th>
                <th style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--primary-color)', fontFamily: 'Outfit', fontWeight: 700 }}>LIÊN HỆ</th>
                <th style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--primary-color)', fontFamily: 'Outfit', fontWeight: 700 }}>DỰ ÁN</th>
                <th style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--primary-color)', fontFamily: 'Outfit', fontWeight: 700 }}>TRẠNG THÁI</th>
                <th style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--primary-color)', fontFamily: 'Outfit', fontWeight: 700 }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map(inv => {
                const sc = statusConfig[inv.status] || statusConfig.Pending;
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700 }}>{inv.name}</div>
                      {inv.plusOnes > 0 && <span style={{ fontSize: '0.75rem', color: '#888' }}>+{inv.plusOnes} khách đi cùng</span>}
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                      {inv.email && <div>📧 {inv.email}</div>}
                      {inv.phone && <div>📱 {inv.phone}</div>}
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.82rem', color: 'var(--accent-color)' }}>{inv.proposalTitle || '—'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: sc.color, fontWeight: 600, fontSize: '0.85rem' }}>{sc.label}</span>
                      {inv.sentAt && <div style={{ fontSize: '0.72rem', color: '#666', marginTop: 2 }}>Gửi: {new Date(inv.sentAt).toLocaleDateString('vi-VN')}</div>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {inv.status === 'Pending' && <button className="btn outline" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleSend(inv.id)} disabled={sending === inv.id}>{sending === inv.id ? '⌛' : '📨'} Gửi</button>}
                        <button className="btn outline" style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#ff4444', borderColor: '#ff444444' }} onClick={() => handleDelete(inv.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 520 }}>
            <h2 className="page-title">➕ Thêm Khách Mời</h2>
            <form onSubmit={handleAdd}>
              {proposals.length > 0 && (
                <div className="form-group"><label>Liên kết dự án</label><select className="form-control" value={form.proposalId} onChange={e => setForm({...form, proposalId: e.target.value})}><option value="">-- Không --</option>{proposals.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label>Tên khách mời *</label><input className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="form-group"><label>Email</label><input type="email" className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label>Số điện thoại</label><input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div className="form-group"><label>Người đi cùng</label><input type="number" className="form-control" min={0} value={form.plusOnes} onChange={e => setForm({...form, plusOnes: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Ghi chú</label><input className="form-control" value={form.note} onChange={e => setForm({...form, note: e.target.value})} /></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn">Thêm khách mời</button>
                <button type="button" className="btn outline" onClick={() => setShowAdd(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
