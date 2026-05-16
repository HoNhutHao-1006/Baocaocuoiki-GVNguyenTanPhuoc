import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';
import GenericCRUD from '../features/dashboard/GenericCRUD';
import ContractDetailModal from '../features/dashboard/ContractDetailModal';
import AdvancedDashboard from '../features/dashboard/AdvancedDashboard';
import { MapPin, Server, Monitor, Users, FileText, Calendar, TrendingUp, Activity, CheckCircle, ClipboardList, Eye } from 'lucide-react';

// ══════════════════════════════════════════════════════════
// SVG ILLUSTRATIONS cho mỗi section
// ══════════════════════════════════════════════════════════
const IllustrationLocation = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="10" r="3" stroke="#00F0FF" strokeWidth="2"/>
    <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z" stroke="#FF00E5" strokeWidth="1.5" fill="rgba(255,0,229,0.1)"/>
  </svg>
);

const IllustrationService = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="12" rx="3" stroke="#00F0FF" strokeWidth="1.5" fill="rgba(0,240,255,0.08)"/>
    <path d="M8 10h8M8 14h5" stroke="#FF00E5" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="4" r="2" fill="#FFD700" stroke="#FFD700" strokeWidth="0.5"/>
  </svg>
);

const IllustrationDevice = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="#00F0FF" strokeWidth="1.5" fill="rgba(0,240,255,0.05)"/>
    <path d="M8 21h8M12 17v4" stroke="#FF00E5" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 8l3 3-3 3M11 14h5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IllustrationPersonnel = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" stroke="#00F0FF" strokeWidth="1.5" fill="rgba(0,240,255,0.1)"/>
    <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="19" cy="7" r="2.5" stroke="#FF00E5" strokeWidth="1.5"/>
    <path d="M19 12a3 3 0 013 3v1" stroke="#FF00E5" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IllustrationContract = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#00F0FF" strokeWidth="1.5" fill="rgba(0,240,255,0.05)"/>
    <path d="M8 7h8M8 11h8M8 15h5" stroke="#FF00E5" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M14 16l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IllustrationEvent = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#00F0FF" strokeWidth="1.5" fill="rgba(0,240,255,0.05)"/>
    <path d="M3 10h18" stroke="#FF00E5" strokeWidth="1.5"/>
    <path d="M8 2v4M16 2v4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8" cy="15" r="1.5" fill="#10B981"/>
    <circle cx="12" cy="15" r="1.5" fill="#F59E0B"/>
    <circle cx="16" cy="15" r="1.5" fill="#FF00E5"/>
  </svg>
);

const IllustrationMember = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#00F0FF" strokeWidth="1.5"/>
    <circle cx="9" cy="7" r="4" stroke="#00F0FF" strokeWidth="1.5" fill="rgba(0,240,255,0.1)"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#FF00E5" strokeWidth="1.5"/>
  </svg>
);

const IllustrationProposal = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#FF00E5" strokeWidth="1.5" fill="rgba(255,0,229,0.08)"/>
    <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 7h10" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ══════════════════════════════════════════════════════════
// ADMIN STATS DASHBOARD - Using AdvancedDashboard component
// ══════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════
// ADMIN MAIN
// ══════════════════════════════════════════════════════════
export default function AdminPage({ view }) {
  const [selectedContract, setSelectedContract] = useState(null);
  const handleToggleUser = async (u, loadData) => {
    let newSt = u.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    await fetchGraphQL(`mutation { updateUserStatus(userId: "${u.id}", status: "${newSt}") { id } }`);
    loadData();
  };

  const handleApproveEvent = async (e, loadData) => {
    if (e.status === 'Approved') return;
    try {
      await fetchGraphQL(`mutation { approveEvent(eventId: "${e.id}") { id } }`);
      loadData();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  }

  const handleUpdateContract = async (id, status, loadData) => {
    await fetchGraphQL(`mutation { updateContractStatus(contractId: "${id}", status: "${status}") { id } }`);
    loadData();
  };

  const handleApproveProposal = async (id, loadData) => {
    try {
      await fetchGraphQL(`mutation { approveEventProposal(proposalId: "${id}", reviewNote: "Đã duyệt bởi Admin") { id } }`);
      loadData();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const handleRejectProposal = async (id, loadData) => {
    const note = prompt('Nhập lý do từ chối:');
    if (!note) return;
    await fetchGraphQL(`mutation { rejectEventProposal(proposalId: "${id}", reviewNote: "${note}") { id } }`);
    loadData();
  };

  if (view === 'dashboard') return <AdvancedDashboard />;

  if (view === 'locations') return <GenericCRUD key={view} 
    title="Quản Lý Địa Điểm" 
    headerIllustration={<IllustrationLocation />}
    dataQuery="query L($page: Int, $limit: Int) { getAllLocations(page: $page, limit: $limit) { id name address capacity } }" dataKey="getAllLocations" 
    createMutation="mutation M($name: String!, $address: String, $capacity: Int) { createLocation(name: $name, address: $address, capacity: $capacity) { id } }" 
    formFields={[{ name: 'name', label: 'Tên Địa Điểm' }, { name: 'address', label: 'Địa chỉ' }, { name: 'capacity', label: 'Sức chứa', type: 'number' }]} 
    columns={[{ key: 'name', label: 'Địa Điểm' }, { key: 'address', label: 'Địa chỉ' }, { key: 'capacity', label: 'Sức chứa' }]} 
  />;

  if (view === 'services') return <GenericCRUD key={view} 
    title="Quản Lý Dịch Vụ Vendor" 
    headerIllustration={<IllustrationService />}
    dataQuery="query S($page: Int, $limit: Int) { getAllServices(page: $page, limit: $limit) { id name description price } }" dataKey="getAllServices" 
    createMutation="mutation M($name: String!, $description: String, $price: Float) { createService(name: $name, description: $description, price: $price) { id } }" 
    formFields={[{ name: 'name', label: 'Tên Dịch Vụ' }, { name: 'description', label: 'Mô tả', type: 'textarea' }, { name: 'price', label: 'Giá tiền', type: 'number' }]} 
    columns={[{ key: 'name', label: 'Tên Dịch Vụ' }, { key: 'description', label: 'Mô tả' }, { key: 'price', label: 'Báo giá', render: r => `${r.price?.toLocaleString()}đ` }]} 
  />;

  if (view === 'devices') return <GenericCRUD key={view} 
    title="Quản Lý Thiết Bị Kỹ Thuật" 
    headerIllustration={<IllustrationDevice />}
    dataQuery="query D($page: Int, $limit: Int) { getAllDevices(page: $page, limit: $limit) { id name quantity price image } }" dataKey="getAllDevices" 
    createMutation="mutation M($name: String!, $quantity: Int, $price: Float, $image: String) { createDevice(name: $name, quantity: $quantity, price: $price, image: $image) { id } }" 
    formFields={[{ name: 'name', label: 'Tên Thiết Bị' }, { name: 'quantity', label: 'Số lượng', type: 'number' }, { name: 'price', label: 'Giá thuê/Cái', type: 'number' }, { name: 'image', label: 'URL Ảnh minh họa' }]} 
    columns={[
      { key: 'image', label: 'Ảnh', render: r => r.image ? <img src={r.image} alt={r.name} style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 8, border: '1px solid #333' }} onError={e => { e.target.style.display='none'; e.target.nextSibling && (e.target.nextSibling.style.display='flex'); }} /> : <div style={{ width: 60, height: 45, background: '#222', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📷</div> },
      { key: 'name', label: 'Thiết bị' }, 
      { key: 'quantity', label: 'Tồn kho' }, 
      { key: 'price', label: 'Đơn giá', render: r => `${r.price?.toLocaleString()}đ` }
    ]} 
  />;
  
  if (view === 'personnel') return <GenericCRUD key={view} 
        title="Quản Lý Nhân Sự (Nội Bộ)" 
        headerIllustration={<IllustrationPersonnel />}
        dataQuery="query U($page: Int, $limit: Int) { getAllUsers(page: $page, limit: $limit) { id username fullname role status email avatar } }" dataKey="getAllUsers" dataFilter={u => u.role !== 'MEMBER' && u.role !== 'ADMIN'}
        createMutation={`mutation M($username: String!, $role: String!, $fullname: String) { registerAuth(username: $username, password: "123456", role: $role, fullname: $fullname) { id } }`} 
        formFields={[{ name: 'username', label: 'Username' }, { name: 'fullname', label: 'Họ tên' }, { name: 'role', label: 'Vai trò', type: 'select', options: [{ value: 'ORGANIZER', label: 'ORGANIZER' }, { value: 'EMPLOYEE', label: 'EMPLOYEE' }] }]} 
        columns={[
          { key: 'avatar', label: '', render: r => { const initials = (r.fullname || r.username || '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); const src = r.avatar ? (r.avatar.startsWith('/') ? `http://localhost:4000${r.avatar}` : r.avatar) : null; return src ? <img src={src} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4ECDC4, #45B7D1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>{initials}</div>; } },
          { key: 'username', label: 'Username' }, 
          { key: 'fullname', label: 'Tên' }, 
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Vai trò', render: r => <span className={`badge ${r.role === 'ORGANIZER' ? 'blue' : 'warning'}`}>{r.role}</span> }, 
          { key: 'status', label: 'Trạng thái', render: r => <span className={`badge ${r.status === 'ACTIVE' ? 'success' : 'error'}`}>{r.status}</span> }, 
          { label: 'Thao tác', render: (r, load) => <button className="btn outline" onClick={() => handleToggleUser(r, load)}>{r.status === 'LOCKED' ? 'Mở khóa' : 'Khóa'}</button> }]} 
  />;

  if (view === 'approvals') return <GenericCRUD key={view} 
        title="Phê duyệt Sự kiện" 
        headerIllustration={<IllustrationEvent />}
        dataQuery="query E($page: Int, $limit: Int) { getAllEvents(page: $page, limit: $limit) { id title date location status eventType coverImg } }" dataKey="getAllEvents" 
        columns={[
          { key: 'coverImg', label: 'Ảnh', render: r => <img src={r.coverImg} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} /> },
          { key: 'title', label: 'Tên Sự Kiện' }, 
          { key: 'date', label: 'Ngày' }, 
          { key: 'location', label: 'Địa Điểm' },
          { key: 'status', label: 'Trạng thái', render: r => <span className={`badge ${r.status === 'Approved' ? 'success' : 'warning'}`}>{r.status}</span> },
          { label: 'Thao tác', render: (r, load) => <button className="btn outline" onClick={() => handleApproveEvent(r, load)} disabled={r.status === 'Approved'}>{r.status === 'Approved' ? '✅ Đã duyệt' : 'Duyệt'}</button> }
        ]} 
  />;

  if (view === 'contracts') return (<>
    <GenericCRUD key={view} 
        title="Quan Ly Hop Dong Toan He Thong" 
        headerIllustration={<IllustrationContract />}
        dataQuery="query C($page: Int, $limit: Int) { getAllContracts(page: $page, limit: $limit) { id details totalAmount status createdAt memberId fileUrl fileName proposalTitle } }" dataKey="getAllContracts" 
        enableDateFilter={true}
        dateFilterKey="createdAt"
        columns={[
          { key: 'createdAt', label: 'Ngay Tao', render: r => { try { const d = r.createdAt; if (!d) return '—'; const date = new Date(isNaN(d) ? d : parseInt(d)); return isNaN(date) ? '—' : date.toLocaleDateString('vi-VN'); } catch { return '—'; }}},
          { key: 'proposalTitle', label: 'Du An', render: r => r.proposalTitle || '—' },
          { key: 'details', label: 'Chi Tiet', render: r => <span style={{maxWidth:120,display:'inline-block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.details?.slice(0,40)}</span> },
          { key: 'totalAmount', label: 'Gia Tri', render: r => `${r.totalAmount?.toLocaleString()}d` },
          { key: 'status', label: 'Trang Thai', render: r => <span className={`badge ${r.status === 'Paid' ? 'success' : r.status === 'Approved' ? 'blue' : r.status === 'Pending' ? 'warning' : 'error'}`}>{r.status}</span> },
          { label: 'Xem', render: (r) => (
            <button className="btn outline" style={{padding:'6px 12px',fontSize:'0.8rem'}} onClick={() => setSelectedContract(r)}><Eye size={14} style={{marginRight:4}}/>Chi tiet</button>
          )},
          { label: 'Duyet/Huy', render: (r, load) => (
            <div style={{ display: 'flex', gap: 5 }}>
              <button className="btn outline" onClick={() => handleUpdateContract(r.id, 'Approved', load)} disabled={r.status !== 'Pending'}>Duyet</button>
              <button className="btn outline" style={{ color: '#ff4444', borderColor: '#ff4444' }} onClick={() => handleUpdateContract(r.id, 'Cancelled', load)} disabled={r.status === 'Cancelled' || r.status === 'Paid'}>Huy</button>
            </div>
          )}
        ]} 
    />
    {selectedContract && <ContractDetailModal contract={selectedContract} onClose={() => setSelectedContract(null)} />}
  </>);

  if (view === 'members') return <GenericCRUD key={view} 
        title="Quản Lý Khách Hàng (Member)" 
        headerIllustration={<IllustrationMember />}
        dataQuery="query U($page: Int, $limit: Int) { getAllUsers(page: $page, limit: $limit) { id username fullname role status email avatar } }" dataKey="getAllUsers" dataFilter={u => u.role === 'MEMBER'}
        columns={[
          { key: 'avatar', label: '', render: r => { const initials = (r.fullname || r.username || '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); const src = r.avatar ? (r.avatar.startsWith('/') ? `http://localhost:4000${r.avatar}` : r.avatar) : null; return src ? <img src={src} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #DDA0DD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>{initials}</div>; } },
          { key: 'username', label: 'Tên Đăng Nhập' }, 
          { key: 'fullname', label: 'Họ Tên' }, 
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Trạng Thái', render: r => <span className={`badge ${r.status === 'ACTIVE' ? 'success' : 'error'}`}>{r.status}</span> }, 
          { label: 'Thao tác', render: (r, load) => (
            <div style={{ display: 'flex', gap: 5 }}>
                <button className="btn outline" onClick={() => handleToggleUser(r, load)}>{r.status === 'LOCKED' ? 'Kích hoạt' : 'Đóng băng'}</button>
            </div>
          )}
        ]} 
  />;

  if (view === 'event-proposals') return <GenericCRUD key={view}
        title="Duyệt Yêu Cầu Tổ Chức Sự Kiện"
        headerIllustration={<IllustrationProposal />}
        emptyMessage="Chưa có yêu cầu tổ chức sự kiện nào từ khách hàng"
        dataQuery="query P($page: Int, $limit: Int) { getAllEventProposals(page: $page, limit: $limit) { id memberId memberName title description eventType expectedDate expectedLocation budget status reviewNote createdAt } }" 
        dataKey="getAllEventProposals"
        columns={[
          { key: 'createdAt', label: 'Ngày Gửi', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '-' },
          { key: 'memberName', label: 'Khách Hàng' },
          { key: 'title', label: 'Tên Dự Án' },
          { key: 'expectedDate', label: 'Ngày Dự Kiến' },
          { key: 'expectedLocation', label: 'Địa Điểm' },
          { key: 'budget', label: 'Ngân Sách', render: r => `${r.budget?.toLocaleString()}đ` },
          { key: 'status', label: 'Trạng Thái', render: r => <span className={`badge ${r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'error' : 'warning'}`}>{r.status === 'Approved' ? '✅ Đã duyệt' : r.status === 'Rejected' ? '❌ Từ chối' : '⏳ Chờ duyệt'}</span> },
          { label: 'Thao tác', render: (r, load) => r.status === 'Pending' ? (
            <div style={{ display: 'flex', gap: 5 }}>
              <button className="btn outline" onClick={() => handleApproveProposal(r.id, load)}>✅ Duyệt</button>
              <button className="btn outline" style={{ color: '#ff4444', borderColor: '#ff4444' }} onClick={() => handleRejectProposal(r.id, load)}>❌ Từ chối</button>
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.reviewNote || '—'}</span>
          )}
        ]}
  />;
  if (view === 'mailbox') return <AdminMailbox />;

  return <div><h2 className="page-title">Admin Dashboard</h2></div>;
}

function AdminMailbox() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const load = () => {
    fetchGraphQL(`query { getAllAdminRequests { id memberId memberName type subject content status adminNote createdAt resolvedAt } }`)
      .then(r => setRequests(r.getAllAdminRequests || [])).catch(() => {});
  };
  useEffect(load, []);

  const handleResolve = async (id, status, note) => {
    const adminNote = note || prompt('Ghi chú xử lý:') || '';
    await fetchGraphQL(`mutation M($requestId: ID!, $adminNote: String, $status: String!) { resolveAdminRequest(requestId: $requestId, adminNote: $adminNote, status: $status) { id } }`,
      { requestId: id, adminNote, status });
    load();
  };

  const typeLabels = { location_request: '📍 Yêu cầu địa điểm', complaint: '⚠️ Khiếu nại', review: '⭐ Đánh giá', other: '📋 Khác' };
  const typeColors = { location_request: '#00F0FF', complaint: '#EF4444', review: '#F59E0B', other: '#888' };
  const filtered = filter === 'all' ? requests : requests.filter(r => r.type === filter || r.status === filter);
  const pending = requests.filter(r => r.status === 'Pending').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,229,0.15))', border: '1px solid rgba(0,240,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📬</div>
          <div>
            <h2 className="page-title" style={{ marginBottom: 0 }}>Hộp Thư Yêu Cầu</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Quản lý yêu cầu, khiếu nại và đánh giá từ khách hàng</p>
          </div>
        </div>
        {pending > 0 && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '8px 16px', fontWeight: 700, color: '#EF4444', fontFamily: 'Outfit' }}>🔴 {pending} chờ xử lý</div>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[{v:'all',l:'Tất cả'},{v:'Pending',l:'⏳ Chờ xử lý'},{v:'location_request',l:'📍 Địa điểm'},{v:'complaint',l:'⚠️ Khiếu nại'},{v:'review',l:'⭐ Đánh giá'}].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`btn ${filter === f.v ? '' : 'outline'}`} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>{f.l}</button>
        ))}
      </div>

      <div className="panel">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>📭</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Không có yêu cầu nào</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(r => (
              <div key={r.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${r.status === 'Pending' ? 'rgba(245,158,11,0.3)' : 'var(--border-color)'}`, borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ color: typeColors[r.type] || '#888', fontWeight: 700, fontSize: '0.82rem' }}>{typeLabels[r.type] || r.type}</span>
                      <span className={`badge ${r.status === 'Resolved' ? 'success' : r.status === 'Reviewed' ? 'blue' : 'warning'}`} style={{ fontSize: '0.72rem' }}>{r.status}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontFamily: 'Outfit', marginBottom: 4 }}>{r.subject}</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc', whiteSpace: 'pre-line', marginBottom: 6 }}>{r.content}</div>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>👤 {r.memberName || 'N/A'} • {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}</div>
                    {r.adminNote && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 8, fontSize: '0.82rem' }}>💬 Admin: {r.adminNote}</div>}
                  </div>
                  {r.status === 'Pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <button className="btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleResolve(r.id, 'Resolved', null)}>✅ Xử lý</button>
                      <button className="btn outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleResolve(r.id, 'Reviewed', null)}>👁️ Đã xem</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
