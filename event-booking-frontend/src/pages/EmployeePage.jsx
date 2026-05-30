import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';
import { resolveFileUrl } from '../api/config';
import SettingsPage from './SettingsPage';
import EmployeeSetupModal from '../features/dashboard/EmployeeSetupModal';
import ContractDetailModal from '../features/dashboard/ContractDetailModal';
import { FileText, CheckCircle, XCircle, Clock, DollarSign, Ticket, AlertCircle, RefreshCw, Search, AlertTriangle, MapPin, Package } from 'lucide-react';

export default function EmployeePage({ view, currentUser }) {
  const [scanResult, setScanResult] = useState(null);
  const [ticketId, setTicketId] = useState('');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allContracts, setAllContracts] = useState([]);
  const [events, setEvents] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [setupModal, setSetupModal] = useState(null);
  const [setupData, setSetupData] = useState(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

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

  const formatMoney = (v) => v ? v.toLocaleString('vi-VN') + ' ₫' : '—';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '—';

  // ═══ QR SCANNER (Camera + Manual + File Upload) ═══
  if (view === 'scanner') {
    const startCamera = () => {
      import('html5-qrcode').then(({ Html5Qrcode }) => {
        const scanner = new Html5Qrcode('qr-reader');
        scanner.start(
          { facingMode: 'environment' },
          { 
            fps: 15, 
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.7);
              return { width: qrboxSize, height: qrboxSize };
            }
          },
          (decodedText) => {
            scanner.stop().catch(() => {});
            setTicketId(decodedText);
            // Auto verify
            fetchGraphQL(`mutation { verifyTicketCheckin(ticketId: "${decodedText}", otp: "dummy") { success message } }`)
              .then(r => setScanResult(r.verifyTicketCheckin))
              .catch(err => setScanResult({ success: false, message: err.message }));
          }
        ).catch(err => {
          console.error('Camera error:', err);
          setScanResult({ success: false, message: 'Không thể truy cập camera. Vui lòng cấp quyền hoặc nhập mã thủ công.' });
        });
      });
    };

    const handleFileScan = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setScanResult(null);
      import('html5-qrcode').then(({ Html5Qrcode }) => {
        const tempReader = new Html5Qrcode('qr-reader-temp');
        tempReader.scanFile(file, true)
          .then((decodedText) => {
            setTicketId(decodedText);
            fetchGraphQL(`mutation { verifyTicketCheckin(ticketId: "${decodedText}", otp: "dummy") { success message } }`)
              .then(r => setScanResult(r.verifyTicketCheckin))
              .catch(err => setScanResult({ success: false, message: err.message }));
          })
          .catch((err) => {
            console.error('File scan error:', err);
            setScanResult({ success: false, message: 'Không tìm thấy hoặc không nhận diện được mã QR trong ảnh này. Vui lòng thử chụp góc thẳng và rõ nét hơn!' });
          });
      });
    };

    return (
      <div>
        <h2 className="page-title">🎫 Cổng Kiểm Soát Vé</h2>
        <div className="panel" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 70, height: 70, borderRadius: 18, background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,229,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Ticket size={32} color="#00F0FF" />
          </div>

          {/* HTTPS Warning for Camera Scan */}
          {window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontSize: '0.78rem', marginBottom: 14, textAlign: 'left', lineHeight: 1.4 }}>
              <AlertTriangle size={14} style={{ verticalAlign: -2, marginRight: 4, display: 'inline' }} />
              <strong>Yêu cầu bảo mật HTTPS:</strong> Trình duyệt điện thoại bắt buộc phải kết nối qua giao thức bảo mật <code>https://</code> để cho phép ứng dụng mở Camera. Vui lòng sử dụng đường link <strong>LocalTunnel (https://...)</strong> hoặc bật camera thủ công.
            </div>
          )}

          {/* Camera QR Scanner Viewport */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto 16px', borderRadius: 16, overflow: 'hidden', border: '2px solid var(--border-color)', background: '#000' }}>
            <div id="qr-reader" style={{ width: '100%' }}></div>
            {/* Hidden temp element for file scanning */}
            <div id="qr-reader-temp" style={{ display: 'none' }}></div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button className="btn" onClick={() => { setScanResult(null); startCamera(); }} style={{ flex: 1, padding: '12px 10px', fontSize: '0.88rem', background: 'linear-gradient(135deg, #00F0FF, #00c3cc)', color: '#000', borderRadius: 10, justifyContent: 'center' }}>
              📸 Mở Camera
            </button>
            <label className="btn outline" style={{ flex: 1, padding: '12px 10px', fontSize: '0.88rem', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
              🖼️ Chọn ảnh QR
              <input type="file" accept="image/*" onChange={handleFileScan} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }}></div>
            <span style={{ color: '#666', fontSize: '0.82rem' }}>hoặc nhập mã thủ công</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }}></div>
          </div>

          <form onSubmit={handleScan} style={{ display: 'flex', gap: 8 }}>
            <input className="form-control" style={{ flex: 1 }} placeholder="Nhập Ticket ID..." value={ticketId} onChange={e => setTicketId(e.target.value)} required />
            <button type="submit" className="btn" style={{ padding: '12px 20px' }}>
              <Search size={16} /> Soát vé
            </button>
          </form>

          {/* Result */}
          {scanResult && (
            <div style={{ marginTop: 24, padding: 24, borderRadius: 16, background: scanResult.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `2px solid ${scanResult.success ? '#10B981' : '#EF4444'}`, animation: 'fadeIn 0.3s' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>{scanResult.success ? '✅' : '❌'}</div>
              <h2 style={{ color: scanResult.success ? '#10B981' : '#EF4444', margin: '0 0 8px', fontFamily: 'Outfit' }}>
                {scanResult.success ? 'VÉ HỢP LỆ — CHÀO MỪNG!' : 'TỪ CHỐI'}
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{scanResult.message}</p>
              <button className="btn outline" style={{ marginTop: 12, padding: '10px 24px' }} onClick={() => { setScanResult(null); setTicketId(''); }}>🔄 Quét vé tiếp</button>
            </div>
          )}
        </div>
      </div>
    );
  }

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

      {/* ═══ SETUP MODAL (Component) ═══ */}
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
                <th style={{ padding: '12px 10px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {allContracts.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{c.proposalTitle || `HĐ #${c.id.slice(-6)}`}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#00F0FF', whiteSpace: 'nowrap' }}>{formatMoney(c.totalAmount)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>{statusBadge(c.status)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button className="btn outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setSelectedContract(c)}>
                      👁️ Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedContract && (
        <ContractDetailModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
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
  
  if (view === 'my-requests') return <EmployeeRequests currentUser={currentUser} />;
  
  return null;
}

function EmployeeRequests({ currentUser }) {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ type: '', subject: '', content: '', amount: '' });

  const loadRequests = () => {
    fetchGraphQL(`query { getInternalRequestsForEmployee(employeeId: "${currentUser.id}") { id type subject content amount status managerNote createdAt } }`)
      .then(res => setRequests(res.getInternalRequestsForEmployee || []))
      .catch(console.error);
  };

  useEffect(() => { loadRequests(); }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vars = {
        employeeId: currentUser.id,
        type: formData.type,
        subject: formData.subject,
        content: formData.content,
        amount: formData.amount ? parseFloat(formData.amount) : null
      };
      await fetchGraphQL(`mutation M($employeeId: ID!, $type: String!, $subject: String!, $content: String!, $amount: Float) { createInternalRequest(employeeId: $employeeId, type: $type, subject: $subject, content: $content, amount: $amount) { id } }`, vars);
      alert('Gửi yêu cầu thành công!');
      setShowModal(false);
      setFormData({ type: '', subject: '', content: '', amount: '' });
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
        <h2 className="page-title" style={{ margin: 0 }}>Gửi Yêu Cầu Nội Bộ</h2>
        <button className="btn" onClick={() => setShowModal(true)}>+ Tạo Yêu Cầu Mới</button>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Lịch sử yêu cầu của bạn</h3>
        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Chưa có yêu cầu nào.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #444' }}>
                <th style={{ padding: 10 }}>Ngày Gửi</th>
                <th style={{ padding: 10 }}>Loại</th>
                <th style={{ padding: 10 }}>Tiêu Đề</th>
                <th style={{ padding: 10 }}>Số Tiền</th>
                <th style={{ padding: 10 }}>Trạng Thái</th>
                <th style={{ padding: 10 }}>Ghi Chú QL</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const rawDate = r.createdAt;
                const d = rawDate ? new Date(isNaN(rawDate) ? rawDate : parseInt(rawDate)) : null;
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: 10 }}>{d && !isNaN(d) ? d.toLocaleDateString('vi-VN') : '-'}</td>
                    <td style={{ padding: 10 }}>{typeLabels[r.type] || r.type}</td>
                    <td style={{ padding: 10, fontWeight: 'bold' }}>{r.subject}</td>
                    <td style={{ padding: 10, color: '#00F0FF' }}>{r.amount ? `${r.amount.toLocaleString()}đ` : '-'}</td>
                    <td style={{ padding: 10 }}>{statusBadge(r.status)}</td>
                    <td style={{ padding: 10, color: 'var(--text-muted)' }}>{r.managerNote || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 500 }}>
            <h2 className="page-title">Tạo Yêu Cầu Mới</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Loại Yêu Cầu</label>
                <select className="form-control" required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="">-- Chọn --</option>
                  <option value="Leave">Nghỉ phép</option>
                  <option value="Advance">Tạm ứng lương</option>
                  <option value="Expense">Thanh toán chi phí sự kiện</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tiêu Đề</label>
                <input className="form-control" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Nội Dung</label>
                <textarea className="form-control" required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
              </div>
              {(formData.type === 'Advance' || formData.type === 'Expense') && (
                <div className="form-group">
                  <label>Số Tiền (VNĐ)</label>
                  <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn">Gửi Yêu Cầu</button>
                <button type="button" className="btn outline" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
