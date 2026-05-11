import React from 'react';

function AvatarDisplay({ user, size = 36 }) {
  if (user?.avatar) {
    const src = user.avatar.startsWith('/') ? `http://localhost:4000${user.avatar}` : user.avatar;
    return <img src={src} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }} />;
  }
  const initials = (user?.fullname || user?.username || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
  const color = colors[(user?.username || '').length % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 800, fontSize: size * 0.38, color: '#fff', flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)' }}>
      {initials}
    </div>
  );
}

export default function Topbar({ currentUser }) {
  if (!currentUser) return null;

  return (
    <div className="topbar" style={{ justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ fontWeight: 900, fontFamily: 'Outfit', fontSize: '1.2rem', color: 'var(--primary-color)' }}>Lumina</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AvatarDisplay user={currentUser} size={36} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser?.fullname || currentUser?.username}</div>
          <span className={`badge ${currentUser?.role === 'ADMIN' ? 'warning' : (currentUser?.role === 'ORGANIZER' ? 'success' : 'blue')}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{currentUser?.role}</span>
        </div>
      </div>
    </div>
  );
}

export { AvatarDisplay };
