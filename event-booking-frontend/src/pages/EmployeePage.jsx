import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';
import SettingsPage from './SettingsPage';
import { FileText, CheckCircle, XCircle, Clock, DollarSign, Ticket, AlertCircle, RefreshCw, Search } from 'lucide-react';

export default function EmployeePage({ view, currentUser }) {
  const [scanResult, setScanResult] = useState(null);
  const [ticketId, setTicketId] = useState('');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allContracts, setAllContracts] = useState([]);
  const [events, setEvents] = useState([]);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (view === 'dashboard' && currentUser) loadMyContracts();
    if (view === 'all-contracts' && currentUser) loadAllContracts();
    if (view === 'events' && currentUser) loadEvents();
    if (view === 'proposals' && currentUser) loadProposals();
  }, [view, currentUser]);

  const loadMyContracts = async () => {
    setLoading(true);
    try {
      const res = await fetchGraphQL(`query { getEmployeeContracts(employeeId: "${currentUser.id}") { id memberId eventId details totalAmount status createdAt fileUrl fileName proposalTitle } }`);
      setContracts(res.getEmployeeContracts || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadAllContracts = async () => {
    setLoading(true);
    try {
      const res = await fetchGraphQL(`query { getAllContracts { id memberId employeeId eventId details totalAmount status createdAt fileUrl fileName proposalTitle } }`);
      setAllContracts(res.getAllContracts || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchGraphQL(`query { getAllEvents { id title date location status eventType coverImg } }`);
      setEvents(res.getAllEvents || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadProposals = async () => {
    setLoading(true);
    try {
      const res = await fetchGraphQL(`query { getAllEventProposals { id memberId memberName title description eventType expectedDate expectedLocation budget status reviewNote createdAt } }`);
      setProposals(res.getAllEventProposals || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateContractStatus = async (contractId, status) => {
    try {
      await fetchGraphQL(`mutation { updateContractStatus(contractId: "${contractId}", status: "${status}") { id status } }`);
      loadMyContracts();
      if (view === 'all-contracts') loadAllContracts();
    } catch (err) { alert(err.message); }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchGraphQL(`mutation { verifyTicketCheckin(ticketId: "${ticketId}", otp: "dummy") { success message } }`);
      setScanResult(res.verifyTicketCheckin);
    } catch (err) {
      setScanResult({ success: false, message: err.message });
    }
  };

  const statusBadge = (status) => {
    const map = {
      'Pending': { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', icon: <Clock size={14} /> },
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

  const formatMoney = (v) => v ? v.toLocaleString('vi-VN') + ' ₫' : '—';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

  // ═══ QR SCANNER ═══
  if (view === 'scanner') return (
    <div>
      <h2 className="page-title">🎫 Cổng Kiểm Soát Vé (Staff Scanner)</h2>
      <div className="panel" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,229,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Ticket size={36} color="#00F0FF" />
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Nhập mã Ticket ID hoặc quét chuỗi QR để xác thực vé vào cổng.</p>
        <form onSubmit={handleScan} style={{ display: 'flex', gap: 10 }}>
          <input className="form-control" style={{ flex: 1 }} placeholder="Nhập mã Ticket ID..." value={ticketId} onChange={e => setTicketId(e.target.value)} required />
          <button type="submit" className="btn" style={{ padding: '12px 24px' }}>
            <Search size={18} /> QUÉT VÉ
          </button>
        </form>
        {scanResult && (
          <div style={{ marginTop: 30, padding: 24, borderRadius: 16, background: scanResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `2px solid ${scanResult.success ? '#10B981' : '#EF4444'}` }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>{scanResult.success ? '✅' : '❌'}</div>
            <h2 style={{ color: scanResult.success ? '#10B981' : '#EF4444', margin: '0 0 8px' }}>
              {scanResult.success ? 'VÉ HỢP LỆ' : 'TỪ CHỐI'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{scanResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );

  // ═══ HỢP ĐỒNG CÁ NHÂN ═══
  if (view === 'dashboard') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>📋 Hợp Đồng Được Phân Công</h2>
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
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Admin sẽ phân công hợp đồng cho bạn khi có yêu cầu mới.</p>
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
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>{contracts.filter(c => c.status === 'Pending').length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Chờ xử lý</div>
            </div>
            <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>{contracts.filter(c => c.status === 'Approved' || c.status === 'Paid').length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Đã duyệt</div>
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
                {statusBadge(c.status)}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 14, marginBottom: 14, maxHeight: 120, overflow: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {c.details ? c.details.substring(0, 300) + (c.details.length > 300 ? '...' : '') : 'Không có chi tiết'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: '#00F0FF', fontSize: '1.1rem' }}>
                  <DollarSign size={16} style={{ verticalAlign: -2 }} /> {formatMoney(c.totalAmount)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {c.fileUrl && (
                    <a href={`http://localhost:4000${c.fileUrl}`} target="_blank" rel="noreferrer" className="btn outline" style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none' }}>
                      📄 Tải file
                    </a>
                  )}
                  {c.status === 'Pending' && (
                    <>
                      <button className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #10B981, #059669)' }} onClick={() => updateContractStatus(c.id, 'Approved')}>
                        <CheckCircle size={14} /> Duyệt
                      </button>
                      <button className="btn outline" style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#EF4444', color: '#EF4444' }} onClick={() => updateContractStatus(c.id, 'Rejected')}>
                        <XCircle size={14} /> Từ chối
                      </button>
                    </>
                  )}
                  {c.status === 'Approved' && (
                    <button className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }} onClick={() => updateContractStatus(c.id, 'Deposited')}>
                      <DollarSign size={14} /> Xác nhận đặt cọc
                    </button>
                  )}
                  {c.status === 'Deposited' && (
                    <button className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #10B981, #059669)' }} onClick={() => updateContractStatus(c.id, 'Paid')}>
                      <CheckCircle size={14} /> Thanh toán đủ
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ═══ XEM TẤT CẢ HỢP ĐỒNG ═══
  if (view === 'all-contracts') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="page-title" style={{ margin: 0 }}>📑 Tất Cả Hợp Đồng</h2>
        <button className="btn outline" onClick={loadAllContracts} style={{ padding: '8px 16px' }}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>
      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: 40 }}><p>Đang tải...</p></div>
      ) : (
        <div className="panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tên HĐ</th>
                <th style={{ padding: '12px 10px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Giá trị</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trạng thái</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {allContracts.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{c.proposalTitle || `HĐ #${c.id.slice(-6)}`}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#00F0FF' }}>{formatMoney(c.totalAmount)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>{statusBadge(c.status)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ═══ XEM SỰ KIỆN ═══
  if (view === 'events') return (
    <div>
      <h2 className="page-title">📅 Danh Sách Sự Kiện</h2>
      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: 40 }}><p>Đang tải...</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {events.map(e => (
            <div key={e.id} className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={e.coverImg} alt={e.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 8px', fontWeight: 700 }}>{e.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>📍 {e.location}</span>
                  {statusBadge(e.status)}
                </div>
                <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>📆 {e.date} • {e.eventType}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ═══ XEM ĐỀ XUẤT SỰ KIỆN ═══
  if (view === 'proposals') return (
    <div>
      <h2 className="page-title">📝 Đề Xuất Sự Kiện Từ Khách Hàng</h2>
      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: 40 }}><p>Đang tải...</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {proposals.map(p => (
            <div key={p.id} className="panel" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontWeight: 700 }}>{p.title}</h3>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Khách hàng: {p.memberName}</span>
                </div>
                {statusBadge(p.status)}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8, lineHeight: 1.5 }}>{p.description}</p>
              <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>📅 {p.expectedDate}</span>
                <span>📍 {p.expectedLocation}</span>
                <span>💰 {formatMoney(p.budget)}</span>
                <span>🏷️ {p.eventType}</span>
              </div>
              {p.reviewNote && (
                <div style={{ marginTop: 10, padding: 10, background: 'rgba(0,240,255,0.06)', borderRadius: 8, fontSize: '0.85rem', color: '#00F0FF' }}>
                  📋 Ghi chú: {p.reviewNote}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ═══ CÀI ĐẶT ═══
  if (view === 'settings') return (
    <div>
      <h2 className="page-title">⚙️ Thông Tin Cá Nhân</h2>
      <SettingsPage currentUser={currentUser} />
    </div>
  );
  
  return null;
}
