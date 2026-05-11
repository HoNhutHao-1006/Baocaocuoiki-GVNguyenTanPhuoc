import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Clock, PlusCircle, Send, Eye, Upload, FileText } from 'lucide-react';
import { fetchGraphQL } from '../api/axiosClient';
import SettingsPage from './SettingsPage';
import GenericCRUD from '../features/dashboard/GenericCRUD';
import { ProjectManager, InvitationManager } from './MemberComponents';

function ContractManager({ currentUser }) {
  const [contracts, setContracts] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [details, setDetails] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [proposalId, setProposalId] = useState('');
  const [contractFile, setContractFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = () => {
    fetchGraphQL(`query { getMyContracts(memberId: "${currentUser.id}") { id details totalAmount status createdAt fileUrl fileName proposalTitle } }`)
      .then(r => setContracts(r.getMyContracts || [])).catch(() => {});
    fetchGraphQL(`query { getMyEventProposals(memberId: "${currentUser.id}") { id title status } }`)
      .then(r => setProposals((r.getMyEventProposals || []).filter(p => p.status === 'Approved'))).catch(() => {});
  };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setUploading(true);
    let fileUrl = '', fileName = '';
    if (contractFile) {
      const fd = new FormData();
      fd.append('contract', contractFile);
      const res = await fetch('http://localhost:4000/upload-contract', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { fileUrl = data.fileUrl; fileName = data.fileName; }
    }
    try {
      await fetchGraphQL(
        `mutation M($details: String!, $totalAmount: Float, $proposalId: ID, $fileUrl: String, $fileName: String) { createContract(memberId: "${currentUser.id}", details: $details, totalAmount: $totalAmount, proposalId: $proposalId, fileUrl: $fileUrl, fileName: $fileName) { id } }`,
        { details, totalAmount: Number(totalAmount), proposalId: proposalId || undefined, fileUrl, fileName }
      );
      alert('✅ Tạo hợp đồng thành công!');
      setShowCreate(false); setDetails(''); setTotalAmount(''); setProposalId(''); setContractFile(null);
      load();
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 10, padding: '8px 18px', fontSize: '0.85rem', fontFamily: 'Outfit', fontWeight: 600 }}>
            📊 Tổng: <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>{contracts.length}</span> hợp đồng
          </div>
        </div>
        <button className="btn" onClick={() => setShowCreate(true)}>+ Tạo hợp đồng mới</button>
      </div>

      <div className="panel">
        {contracts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Chưa có hợp đồng nào</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {contracts.map(c => (
              <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  {c.proposalTitle && <div style={{ fontSize: '0.78rem', color: 'var(--accent-color)', fontWeight: 600, marginBottom: 4 }}>📋 Dự án: {c.proposalTitle}</div>}
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.details}</div>
                  <div style={{ fontSize: '0.82rem', color: '#888' }}>Ngày tạo: {new Date(parseInt(c.createdAt || Date.now())).toLocaleDateString('vi-VN')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {c.fileUrl && (
                    <a href={`http://localhost:4000${c.fileUrl}`} target="_blank" rel="noreferrer" className="btn outline" style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
                      📄 {c.fileName || 'Tải file'}
                    </a>
                  )}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-color)', fontFamily: 'Outfit' }}>{c.totalAmount?.toLocaleString()}đ</div>
                    <span className={`badge ${c.status === 'Paid' ? 'success' : c.status === 'Approved' ? 'blue' : c.status === 'Pending' ? 'warning' : 'error'}`}>{c.status}</span>
                  </div>
                  {c.status === 'Approved' && <button className="btn outline" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={() => { fetchGraphQL(`mutation { updateContractStatus(contractId: "${c.id}", status: "Deposited") { id } }`).then(() => { alert('Đặt cọc thành công!'); load(); }) }}>Đặt cọc</button>}
                  {c.status === 'Deposited' && <button className="btn" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={() => { fetchGraphQL(`mutation { updateContractStatus(contractId: "${c.id}", status: "Paid") { id } }`).then(() => { alert('Đã thanh toán!'); load(); }) }}>Thanh toán</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 520 }}>
            <h2 className="page-title">📝 Tạo Hợp Đồng Mới</h2>
            <form onSubmit={handleCreate}>
              {proposals.length > 0 && (
                <div className="form-group">
                  <label>Liên kết Dự án (tùy chọn)</label>
                  <select className="form-control" value={proposalId} onChange={e => setProposalId(e.target.value)}>
                    <option value="">-- Không liên kết --</option>
                    {proposals.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group"><label>Chi tiết hợp đồng</label><textarea className="form-control" rows={3} required value={details} onChange={e => setDetails(e.target.value)} style={{ resize: 'vertical', minHeight: 80 }} /></div>
              <div className="form-group"><label>Giá trị hợp đồng (VNĐ)</label><input type="number" className="form-control" required value={totalAmount} onChange={e => setTotalAmount(e.target.value)} /></div>
              <div className="form-group">
                <label>📄 File hợp đồng (PDF/DOC)</label>
                <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed var(--border-color)', borderRadius: 12, padding: '20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,240,255,0.03)', transition: 'border-color 0.2s' }}>
                  {contractFile ? (
                    <div style={{ color: 'var(--primary-color)', fontWeight: 600 }}>📎 {contractFile.name} ({(contractFile.size / 1024).toFixed(0)} KB)</div>
                  ) : (
                    <><Upload size={24} color="#888" style={{ marginBottom: 8 }} /><div style={{ color: '#888', fontSize: '0.9rem' }}>Click để chọn file</div></>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={e => setContractFile(e.target.files[0])} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn" disabled={uploading}>{uploading ? '⌛ Đang tải...' : 'Tạo hợp đồng'}</button>
                <button type="button" className="btn outline" onClick={() => setShowCreate(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MemberPage({ view, currentUser }) {
  const [orders, setOrders] = useState([]);
  const [realtimeNotif, setRealtimeNotif] = useState(null);

  const [contracts, setContracts] = useState([]);

  const loadOrders = () => {
    fetchGraphQL(`query { getMyTicketOrders(memberId: "${currentUser.id}") { id eventId eventTitle status totalAmount qrCode holdExpiresAt seatLabel seatLabels zoneName quantity } }`)
      .then(res => setOrders(res.getMyTicketOrders || []))
      .catch(() => { });
  }

  const loadContracts = () => {
    fetchGraphQL(`query { getMyContracts(memberId: "${currentUser.id}") { id details totalAmount status createdAt fileUrl fileName proposalTitle proposalId } }`)
      .then(res => setContracts(res.getMyContracts || []))
      .catch(() => { });
  }

  useEffect(() => {
    if (view === 'contracts') loadContracts();
    else if (view === 'dashboard') loadOrders();
  }, [view]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.io) {
      const socket = window.io('http://localhost:4000');
      socket.on('check-in-success', (data) => {
        setRealtimeNotif(data);
        setTimeout(() => setRealtimeNotif(null), 5000);
      });
      socket.on('ticket-purchased', (data) => {
        if (data.memberId === currentUser.id) loadOrders();
      });
      return () => socket.disconnect();
    }
  }, []);

  const cancelTicket = async (id) => {
    try {
      await fetchGraphQL(`mutation { cancelOrder(orderId: "${id}") }`);
      alert("✅ Đã hủy vé thành công! Tiền sẽ được hoàn về tài khoản ngân hàng.");
      loadOrders();
    } catch (e) { 
      console.error('Cancel error:', e);
      alert("Lỗi hủy vé: " + e.message); 
    }
  };

  const checkoutTicket = async (id) => {
    try {
      await fetchGraphQL(`mutation { checkoutOrder(orderId: "${id}") { id qrCode } }`);
      alert("✅ Thanh toán thành công! Vé QR điện tử đã được lưu.");
      loadOrders();
    } catch (e) { alert(e.message); }
  };

  if (view === 'settings') return <div><h2 className="page-title">Hồ Sơ Của Tôi</h2><SettingsPage currentUser={currentUser} /></div>;

  // ══════════════════════════════════════════════
  // VIEW: TẠO DỰ ÁN SỰ KIỆN (UPGRADED)
  // ══════════════════════════════════════════════
  if (view === 'create-event') return <ProjectManager currentUser={currentUser} />;

  // ══════════════════════════════════════════════
  // VIEW: HỢP ĐỒNG
  // ══════════════════════════════════════════════
  const [showHistory, setShowHistory] = useState(false);
  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

  if (view === 'contracts') return (
    <div>
      <h2 className="page-title">📄 Quản Lý Hợp Đồng Sự Kiện</h2>
      <ContractManager currentUser={currentUser} />
    </div>
  );

  if (view === 'invitations') return <InvitationManager currentUser={currentUser} />;

  // ══════════════════════════════════════════════
  // VIEW: TỦ VÉ (Dashboard)
  // ══════════════════════════════════════════════
  return (
    <div>
      {realtimeNotif && (
        <div style={{ position: 'fixed', top: 80, right: 30, zIndex: 9999, background: 'rgba(0,240,255,0.1)', border: '1px solid var(--primary-color)', borderRadius: 16, padding: '15px 25px', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontWeight: 700, color: 'var(--primary-color)' }}>🔴 LIVE Check-in</div>
          <div style={{ color: '#ddd' }}>{realtimeNotif.message}</div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,229,0.15))', border: '1px solid rgba(0,240,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ticket size={26} color="#00F0FF" />
          </div>
          <div>
            <h2 className="page-title" style={{ marginBottom: 0 }}>🎟️ Tủ Vé Điện Tử</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>Quản lý tất cả vé đã đặt của bạn</p>
          </div>
        </div>
        <button className="btn outline" style={{ padding: '10px 20px', fontSize: '0.85rem', position: 'relative' }} onClick={() => setShowHistory(true)}>
          <Clock size={16} /> Lịch sử giao dịch
          {cancelledOrders.length > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>{cancelledOrders.length}</span>
          )}
        </button>
      </div>

      {activeOrders.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎫</div>
          <h3 style={{ fontFamily: 'Outfit', marginBottom: 8 }}>Tủ vé của bạn đang trống</h3>
          <p style={{ color: 'var(--text-muted)' }}>Hãy khám phá và đặt vé sự kiện trên Lumina!</p>
        </div>
      ) : (
        <div className="grid-cards">
          {activeOrders.map(o => (
            <div key={o.id} className="panel" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 18, right: -28, background: o.status === 'Paid' ? 'var(--success)' : (o.status === 'CheckedIn' ? 'var(--primary-color)' : 'var(--warning)'), transform: 'rotate(45deg)', width: 110, textAlign: 'center', fontWeight: 'bold', fontSize: '0.7rem', padding: '2px 0', color: '#000' }}>{o.status}</div>
              
              <h3 style={{ marginBottom: 4 }}>🎟️ {o.eventTitle || `Sự kiện #${o.eventId?.slice(-6)}`}</h3>
              {(o.seatLabels?.length > 0 || o.seatLabel) && (
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, marginBottom: 8 }}>
                  {o.quantity > 1 ? `${o.quantity} Ghế` : 'Ghế'}: {o.seatLabels?.join(', ') || o.seatLabel} {o.zoneName ? `— ${o.zoneName}` : ''}
                </div>
              )}
              <p style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.2rem' }}>{o.totalAmount?.toLocaleString()} đ</p>
              
              {(o.status === 'Paid' || o.status === 'CheckedIn') && o.qrCode && (
                <div style={{ background: '#fff', padding: 15, textAlign: 'center', borderRadius: 12, marginTop: 10 }}>
                  <img src={`https://quickchart.io/qr?text=${encodeURIComponent(o.qrCode)}&size=180`} alt="QR" style={{ width: 160, height: 160 }} onError={(e) => { e.target.style.display = 'none'; }} />
                  <div style={{ color: '#000', fontSize: '0.75rem', marginTop: 8, fontFamily: 'monospace', fontWeight: 700 }}>{o.qrCode}</div>
                </div>
              )}

              {o.status === 'Paid' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn outline" style={{ color: '#ff4444', borderColor: '#ff4444', width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '10px 0' }} onClick={() => cancelTicket(o.id)}>❌ Hủy vé & Hoàn tiền</button>
                </div>
              )}

              {o.status === 'Held' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button className="btn" style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }} onClick={() => checkoutTicket(o.id)}>💳 Thanh Toán</button>
                  <button className="btn outline" style={{ color: '#ff4444', borderColor: '#ff4444', flex: 1, justifyContent: 'center', fontSize: '0.9rem' }} onClick={() => cancelTicket(o.id)}>Hủy</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* LỊCH SỬ GIAO DỊCH */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 650, padding: 30, maxHeight: '80vh', overflow: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontFamily: 'Outfit' }}>📋 Lịch Sử Giao Dịch</h2>
            
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 30 }}>Chưa có giao dịch nào.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {o.status === 'Cancelled' ? '❌' : o.status === 'Paid' ? '✅' : o.status === 'CheckedIn' ? '🎫' : '⏳'} {o.eventTitle || 'Sự kiện'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {o.seatLabels?.join(', ') || o.seatLabel || ''} {o.zoneName ? `— ${o.zoneName}` : ''}
                      </div>
                      {o.status === 'Cancelled' && (
                        <div style={{ fontSize: '0.82rem', color: '#EF4444', marginTop: 4, fontWeight: 600 }}>
                          💰 Hoàn tiền: {o.totalAmount?.toLocaleString()} đ → Tài khoản ngân hàng
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, color: o.status === 'Cancelled' ? '#EF4444' : 'var(--primary-color)', fontSize: '1.05rem' }}>
                        {o.status === 'Cancelled' ? '-' : ''}{o.totalAmount?.toLocaleString()} đ
                      </div>
                      <span style={{ 
                        padding: '3px 10px', borderRadius: 8, fontWeight: 700, fontSize: '0.75rem',
                        background: o.status === 'Paid' ? 'rgba(16,185,129,0.15)' : o.status === 'Cancelled' ? 'rgba(239,68,68,0.15)' : o.status === 'CheckedIn' ? 'rgba(0,240,255,0.15)' : 'rgba(245,158,11,0.15)',
                        color: o.status === 'Paid' ? '#10B981' : o.status === 'Cancelled' ? '#EF4444' : o.status === 'CheckedIn' ? '#00F0FF' : '#F59E0B'
                      }}>
                        {o.status === 'Paid' ? 'Đã thanh toán' : o.status === 'Cancelled' ? 'Đã hủy' : o.status === 'CheckedIn' ? 'Đã check-in' : 'Đang giữ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn outline" style={{ width: '100%', marginTop: 20 }} onClick={() => setShowHistory(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
