import React, { useState, useEffect } from 'react';
import DiscoveryHub from './features/discovery/DiscoveryHub';
import EventDetail from './features/ticketing/EventDetail';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import AdminPage from './pages/AdminPage';
import OrganizerPage from './pages/OrganizerPage';
import MemberPage from './pages/MemberPage';
import EmployeePage from './pages/EmployeePage';
import RsvpPage from './pages/RsvpPage';
import './assets/styles/global.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rsvpEventId, setRsvpEventId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setCurrentUser(JSON.parse(saved));
    
    const params = new URLSearchParams(window.location.search);
    if (params.has('rsvp')) setRsvpEventId(params.get('rsvp'));
  }, []);

  if (rsvpEventId) return <RsvpPage eventId={rsvpEventId} />;

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.role === 'MEMBER') setView('dashboard');
    else setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setView('discovery');
    setSelectedEventId(null);
  };

  const renderContent = () => {
    if (!currentUser || (currentUser.role === 'MEMBER' && view === 'discovery')) {
        if (selectedEventId) {
            return <EventDetail eventId={selectedEventId} onBack={() => setSelectedEventId(null)} currentUser={currentUser} />;
        }
        return <DiscoveryHub currentUser={currentUser} onLogin={handleLogin} onSelectEvent={setSelectedEventId} setView={setView} onLogout={handleLogout} />;
    }

    return (
      <div className="dashboard-layout">
        <Sidebar currentUser={currentUser} view={view} setView={setView} onLogout={handleLogout} />
        <div className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
          <Topbar currentUser={currentUser} onUserUpdate={(updated) => { setCurrentUser(updated); localStorage.setItem('currentUser', JSON.stringify(updated)); }} />
          <div className="page-wrapper">
            {currentUser.role === 'ADMIN' && <AdminPage view={view} currentUser={currentUser} />}
            {currentUser.role === 'ORGANIZER' && <OrganizerPage view={view} currentUser={currentUser} />}
            {currentUser.role === 'MEMBER' && <MemberPage view={view} currentUser={currentUser} />}
            {currentUser.role === 'EMPLOYEE' && <EmployeePage view={view} currentUser={currentUser} />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {renderContent()}
    </div>
  );
}
