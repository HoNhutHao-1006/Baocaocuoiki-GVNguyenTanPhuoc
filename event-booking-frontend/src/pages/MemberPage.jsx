import React, { useState, useEffect } from 'react';
import { Ticket, Clock, PlusCircle, Send, Eye, FileText, AlertTriangle } from 'lucide-react';
import { fetchGraphQL } from '../api/axiosClient';
import SettingsPage from './SettingsPage';
import GenericCRUD from '../features/dashboard/GenericCRUD';
import MemberContractDetailModal from '../features/dashboard/MemberContractDetailModal';
import { ProjectManager, InvitationManager } from './MemberComponents';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('MemberPage Error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <AlertTriangle size={48} color="#EF4444" style={{ marginBottom: 16 }} />
          <h3 style={{ fontFamily: 'Outfit', color: '#EF4444', marginBottom: 8 }}>Đã xảy ra lỗi</h3>
          <p style={{ color: '#888', marginBottom: 20 }}>{this.state.error?.message || 'Không thể tải trang này.'}</p>
          <button className="btn" onClick={() => this.setState({ hasError: false, error: null })}>🔄 Thử lại</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ContractManager({ currentUser }) {
  const [contracts, setContracts] = useState([]);
  const [viewDetail, setViewDetail] = useState(null);

  const load = () => {
    fetchGraphQL(`query { getMyContracts(memberId: "${currentUser.id}") { id details totalAmount status createdAt fileUrl fileName proposalTitle proposalId } }`)
      .then(r => setContracts(r.getMyContracts || [])).catch(() => {});
  };
  useEffect(load, []);

  const handleConfirm = async (id) => {
    try {
      await fetchGraphQL(`mutation { memberConfirmContract(contractId: "${id}") { id } }`);
      alert('✅ Đã xác nhận hợp đồng! Sự kiện sẽ được chuyển cho nhân viên tổ chức.');
      setViewDetail(null); load();
    } catch (e) { alert(e.message); }
  };

  const handleReject = async (id) => {
    if (!confirm('Bạn chắc chắn muốn từ chối hợp đồng này?')) return;
    try {
      await fetchGraphQL(`mutation { memberRejectContract(contractId: "${id}") { id } }`);
      alert('Đã từ chối hợp đồng.'); setViewDetail(null); load();
    } catch (e) { alert(e.message); }
  };

  const statusLabel = (s) => {
    const map = { 'Pending': { text: '⏳ Chờ bạn xác nhận', cls: 'warning' }, 'MemberConfirmed': { text: '✅ Đã xác nhận — Đang chuyển cho NV', cls: 'blue' }, 'MemberRejected': { text: '❌ Đã từ chối', cls: 'error' }, 'EmployeeConfirmed': { text: '🎉 Đang triển khai sự kiện', cls: 'success' }, 'Paid': { text: '💰 Đã thanh toán', cls: 'success' } };
    return map[s] || { text: s, cls: 'warning' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 10, padding: '8px 18px', fontSize: '0.85rem', fontFamily: 'Outfit', fontWeight: 600 }}>
            📊 Tổng: <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>{contracts.length}</span> hợp đồng
          </div>
          {contracts.filter(c => c.status === 'Pending').length > 0 && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '8px 18px', fontSize: '0.85rem', fontFamily: 'Outfit', fontWeight: 600, color: '#F59E0B' }}>
              🔔 {contracts.filter(c => c.status === 'Pending').length} hợp đồng chờ xác nhận
            </div>
          )}
        </div>
      </div>

      <div style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 12, padding: '14px 20px', marginBottom: 20, fontSize: '0.85rem', color: '#aaa' }}>
        💡 Hợp đồng được tạo tự động khi Admin duyệt đề xuất sự kiện của bạn. Nhấn vào hợp đồng để xem chi tiết đầy đủ (Hợp đồng dịch vụ, Phụ lục báo giá, Biên bản thanh lý, Đề nghị thanh toán).
      </div>

      <div className="panel">
        {contracts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ marginBottom: 12, opacity: 0.5 }} />
            <div style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Chưa có hợp đồng nào</div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: 8 }}>Hãy gửi đề xuất sự kiện để nhận hợp đồng từ hệ thống</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {contracts.map(c => {
              const sl = statusLabel(c.status);
              return (
                <div key={c.id} style={{ background: c.status === 'Pending' ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${c.status === 'Pending' ? 'rgba(245,158,11,0.25)' : 'var(--border-color)'}`, borderRadius: 12, padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setViewDetail(c)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.status === 'Pending' ? 'rgba(245,158,11,0.25)' : 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      {c.proposalTitle && <div style={{ fontSize: '0.82rem', color: 'var(--accent-color)', fontWeight: 700, marginBottom: 4 }}>📋 {c.proposalTitle}</div>}
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ccc', marginBottom: 4 }}>{(c.details || '').substring(0, 80)}...</div>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>📅 {new Date(c.createdAt || Date.now()).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-color)', fontFamily: 'Outfit' }}>{c.totalAmount?.toLocaleString()}đ</div>
                        <span className={`badge ${sl.cls}`}>{sl.text}</span>
                      </div>
                      <Eye size={18} color="#666" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewDetail && (
        <MemberContractDetailModal
          contract={viewDetail}
          onClose={() => setViewDetail(null)}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default function MemberPage({ view, currentUser }) {
  const [orders, setOrders] = useState([]);
  const [realtimeNotif, setRealtimeNotif] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
  if (view === 'create-event') return <ErrorBoundary><ProjectManager currentUser={currentUser} /></ErrorBoundary>;
  if (view === 'contracts') return (
    <ErrorBoundary>
      <div>
        <h2 className="page-title">📄 Quản Lý Hợp Đồng Sự Kiện</h2>
        <ContractManager currentUser={currentUser} />
      </div>
    </ErrorBoundary>
  );
  if (view === 'invitations') return <ErrorBoundary><InvitationManager currentUser={currentUser} /></ErrorBoundary>;

  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');


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
