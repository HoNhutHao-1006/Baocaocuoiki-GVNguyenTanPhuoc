import React from 'react';
import { Monitor, CheckCircle, FileText, MapPin, Server, Users, Calendar, Clock, LayoutGrid, Ticket, Activity, Settings, LogOut, PlusCircle, ClipboardList } from 'lucide-react';

export default function Sidebar({ currentUser, view, setView, onLogout }) {
  if (!currentUser) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ fontSize: '1.5rem' }}>Lu<span style={{ color: 'var(--primary-color)' }}>mina</span></div>
      <div className="nav-links">
        {currentUser.role === 'ADMIN' && (
          <>
            <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}><Monitor size={18} /> Thống kê báo cáo</div>
            <div className={`nav-item ${view === 'approvals' ? 'active' : ''}`} onClick={() => setView('approvals')}><CheckCircle size={18} /> Quản lý sự kiện</div>
            <div className={`nav-item ${view === 'event-proposals' ? 'active' : ''}`} onClick={() => setView('event-proposals')}><ClipboardList size={18} /> Duyệt Yêu Cầu SK</div>
            <div className={`nav-item ${view === 'contracts' ? 'active' : ''}`} onClick={() => setView('contracts')}><FileText size={18} /> Quản lý hợp đồng</div>
            <div className={`nav-item ${view === 'locations' ? 'active' : ''}`} onClick={() => setView('locations')}><MapPin size={18} /> Quản lý địa điểm</div>
            <div className={`nav-item ${view === 'services' ? 'active' : ''}`} onClick={() => setView('services')}><Server size={18} /> Quản lý dịch vụ</div>
            <div className={`nav-item ${view === 'devices' ? 'active' : ''}`} onClick={() => setView('devices')}><Monitor size={18} /> Quản lý thiết bị</div>
            <div className={`nav-item ${view === 'personnel' ? 'active' : ''}`} onClick={() => setView('personnel')}><Users size={18} /> Nhân sự (Nội bộ)</div>
            <div className={`nav-item ${view === 'members' ? 'active' : ''}`} onClick={() => setView('members')}><Users size={18} /> Khách hàng (Member)</div>
            <div className={`nav-item ${view === 'mailbox' ? 'active' : ''}`} onClick={() => setView('mailbox')}><ClipboardList size={18} /> 📬 Hộp thư yêu cầu</div>
          </>
        )}
        {currentUser.role === 'ORGANIZER' && (
          <>
            <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}><Activity size={18} /> Thống Kê Chung</div>
            <div className={`nav-item ${view === 'contracts' ? 'active' : ''}`} onClick={() => setView('contracts')}><FileText size={18} /> Hợp đồng phân công</div>
            <div className={`nav-item ${view === 'events' ? 'active' : ''}`} onClick={() => setView('events')}><Calendar size={18} /> Quản Lý Sự Kiện</div>
            <div className={`nav-item ${view === 'rsvp' ? 'active' : ''}`} onClick={() => setView('rsvp')}><Users size={18} /> Khách mời & RSVP</div>
            <div className={`nav-item ${view === 'seating' ? 'active' : ''}`} onClick={() => setView('seating')}><LayoutGrid size={18} /> Xếp Bàn Tiệc</div>
            <div className={`nav-item ${view === 'rundown' ? 'active' : ''}`} onClick={() => setView('rundown')}><Clock size={18} /> Kịch Bản & Task</div>
            <div className={`nav-item ${view === 'internal-requests' ? 'active' : ''}`} onClick={() => setView('internal-requests')}><ClipboardList size={18} /> Yêu cầu nội bộ</div>
            <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}><Settings size={18} /> Quản lý tài khoản</div>
          </>
        )}
        {currentUser.role === 'EMPLOYEE' && (
          <>
            <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}><FileText size={18} /> Hợp đồng cá nhân</div>
            <div className={`nav-item ${view === 'all-contracts' ? 'active' : ''}`} onClick={() => setView('all-contracts')}><ClipboardList size={18} /> Tất cả hợp đồng</div>
            <div className={`nav-item ${view === 'events' ? 'active' : ''}`} onClick={() => setView('events')}><Calendar size={18} /> Danh sách sự kiện</div>
            <div className={`nav-item ${view === 'proposals' ? 'active' : ''}`} onClick={() => setView('proposals')}><PlusCircle size={18} /> Đề xuất SK</div>
            <div className={`nav-item ${view === 'my-requests' ? 'active' : ''}`} onClick={() => setView('my-requests')}><FileText size={18} /> Gửi yêu cầu</div>
            <div className={`nav-item ${view === 'scanner' ? 'active' : ''}`} onClick={() => setView('scanner')}><Ticket size={18} /> QR Scanner (Soát vé)</div>
            <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}><Settings size={18} /> Quản lý tài khoản</div>
          </>
        )}

        {currentUser.role === 'MEMBER' && (
          <>
            <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}><Ticket size={18} /> Tủ Vé Quét QR</div>
            <div className={`nav-item ${view === 'contracts' ? 'active' : ''}`} onClick={() => setView('contracts')}><FileText size={18} /> Quản lý hợp đồng</div>
            <div className={`nav-item ${view === 'create-event' ? 'active' : ''}`} onClick={() => setView('create-event')}><PlusCircle size={18} /> Tạo Dự Án Sự Kiện</div>
            <div className={`nav-item ${view === 'invitations' ? 'active' : ''}`} onClick={() => setView('invitations')}><Users size={18} /> Thư mời & RSVP</div>
            <div className={`nav-item ${view === 'explore' ? 'active' : ''}`} onClick={() => setView('discovery')}><LayoutGrid size={18} /> Mua Thêm Vé</div>
            <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}><Settings size={18} /> Quản lý tài khoản</div>
          </>
        )}

        <div className="nav-item" onClick={onLogout} style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', color: '#ff4444' }}><LogOut size={18} /> Đăng xuất</div>
      </div>
    </div>
  );
}
