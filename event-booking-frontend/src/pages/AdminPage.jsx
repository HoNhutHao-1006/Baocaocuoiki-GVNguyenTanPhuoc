import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';
import GenericCRUD from '../features/dashboard/GenericCRUD';
import { MapPin, Server, Monitor, Users, FileText, Calendar, TrendingUp, Activity, CheckCircle, ClipboardList } from 'lucide-react';

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
// ADMIN STATS DASHBOARD
// ══════════════════════════════════════════════════════════
function AdminStats() {
  const [stats, setStats] = useState(null);
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    fetchGraphQL(`query { getSystemStats { totalRevenue totalTicketsSold activeUsers totalEvents pendingProposals totalContracts } }`).then(d => setStats(d.getSystemStats)).catch(() => { });
    fetchGraphQL(`query { getAllContracts(limit: 5) { id details totalAmount status createdAt } }`).then(d => setContracts(d.getAllContracts || [])).catch(() => {});
  }, []);

  if (!stats) return <div style={{ padding: 40 }}>Đang phân tích dữ liệu...</div>;

  const statCards = [
    { label: 'Tổng Doanh Thu', value: `${stats.totalRevenue.toLocaleString()} đ`, icon: <TrendingUp size={24} />, color: '#00F0FF', pct: 75 },
    { label: 'Vé Đã Bán', value: stats.totalTicketsSold, icon: <Activity size={24} />, color: '#FF00E5', pct: 60 },
    { label: 'Nhân Sự & KH', value: stats.activeUsers, icon: <Users size={24} />, color: '#10B981', pct: 92 },
    { label: 'Tổng Sự Kiện', value: stats.totalEvents, icon: <Calendar size={24} />, color: '#F59E0B', pct: 85 },
    { label: 'Yêu Cầu Chờ Duyệt', value: stats.pendingProposals, icon: <ClipboardList size={24} />, color: '#FF6B35', pct: 40 },
    { label: 'Tổng Hợp Đồng', value: stats.totalContracts, icon: <FileText size={24} />, color: '#8B5CF6', pct: 70 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,229,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,240,255,0.3)' }}>
          <Monitor size={28} color="#00F0FF" />
        </div>
        <div>
          <h2 className="page-title" style={{ marginBottom: 0 }}>Thống Kê Báo Cáo Toàn Cầu</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Tổng quan hệ thống quản lý sự kiện</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 30 }}>
        {statCards.map((s, i) => (
          <div key={i} className="panel" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: `${s.color}08`, border: `1px solid ${s.color}15` }} />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
            </div>
            <h3 style={{ color: '#ccc', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>{s.label}</h3>
            <h1 style={{ color: s.color, fontSize: '2rem', margin: '6px 0', fontFamily: 'Outfit', fontWeight: 900 }}>{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</h1>
            <div style={{ background: '#333', height: 6, borderRadius: 3, marginTop: 10 }}>
              <div style={{ background: s.color, width: `${s.pct}%`, height: '100%', borderRadius: 3, transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <TrendingUp size={20} color="var(--primary-color)" />
            <h3>Thống kê doanh thu theo năm</h3>
          </div>
          <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 20 }}>
            {[40, 55, 65, 72, 90].map((h, i) => (
              <div key={i} style={{ flex: 1, position: 'relative' }}>
                <div style={{ background: `linear-gradient(to top, var(--primary-color), ${i === 4 ? '#FF00E5' : 'var(--primary-color)'})`, height: `${h}%`, borderRadius: '6px 6px 0 0', transition: 'height 0.8s ease', opacity: 0.8 + i * 0.04 }} />
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.75rem', color: '#888' }}>{2022 + i}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <FileText size={20} color="var(--accent-color)" />
            <h3>Hợp đồng gần đây</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {contracts.slice(0, 5).map((c, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #333' : 'none' }}>
                <span style={{ fontSize: '0.88rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.details}</span>
                <span className={`badge ${c.status === 'Paid' ? 'success' : c.status === 'Approved' ? 'blue' : c.status === 'Pending' ? 'warning' : 'error'}`}>{c.status}</span>
              </li>
            ))}
            {contracts.length === 0 && <li style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Chưa có hợp đồng</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// ADMIN MAIN
// ══════════════════════════════════════════════════════════
export default function AdminPage({ view }) {
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

  if (view === 'dashboard') return <AdminStats />;

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

  if (view === 'contracts') return <GenericCRUD key={view} 
        title="Quản Lý Hợp Đồng Toàn Hệ Thống" 
        headerIllustration={<IllustrationContract />}
        dataQuery="query C($page: Int, $limit: Int) { getAllContracts(page: $page, limit: $limit) { id details totalAmount status createdAt memberId fileUrl fileName proposalTitle } }" dataKey="getAllContracts" 
        columns={[
          { key: 'createdAt', label: 'Ngày Tạo', render: r => new Date(parseInt(r.createdAt || Date.now())).toLocaleDateString() },
          { key: 'proposalTitle', label: 'Dự Án', render: r => r.proposalTitle || '—' },
          { key: 'details', label: 'Chi Tiết' },
          { key: 'totalAmount', label: 'Giá Trị', render: r => `${r.totalAmount?.toLocaleString()}đ` },
          { key: 'fileUrl', label: 'File', render: r => r.fileUrl ? <a href={`http://localhost:4000${r.fileUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.85rem' }}>📄 {r.fileName || 'Tải về'}</a> : <span style={{ color: '#666' }}>—</span> },
          { key: 'status', label: 'Trạng Thái', render: r => <span className={`badge ${r.status === 'Paid' ? 'success' : r.status === 'Approved' ? 'blue' : r.status === 'Pending' ? 'warning' : 'error'}`}>{r.status}</span> },
          { label: 'Duyệt/Hủy', render: (r, load) => (
            <div style={{ display: 'flex', gap: 5 }}>
              <button className="btn outline" onClick={() => handleUpdateContract(r.id, 'Approved', load)} disabled={r.status !== 'Pending'}>Duyệt</button>
              <button className="btn outline" style={{ color: '#ff4444', borderColor: '#ff4444' }} onClick={() => handleUpdateContract(r.id, 'Cancelled', load)} disabled={r.status === 'Cancelled' || r.status === 'Paid'}>Hủy</button>
            </div>
          )}
        ]} 
  />;

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

  return <div><h2 className="page-title">Admin Dashboard</h2></div>;
}
