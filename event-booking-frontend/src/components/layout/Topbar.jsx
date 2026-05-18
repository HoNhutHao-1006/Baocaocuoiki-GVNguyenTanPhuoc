import React, { useState, useRef, useEffect } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';
import { resolveFileUrl, UPLOAD_AVATAR_URL } from '../../api/config';

function AvatarDisplay({ user, size = 36 }) {
  if (user?.avatar) {
    const src = resolveFileUrl(user.avatar);
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

export default function Topbar({ currentUser, onUserUpdate }) {
  const [showEditor, setShowEditor] = useState(false);
  const [editName, setEditName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const editorRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullname || currentUser.username || '');
      setPreviewUrl(currentUser.avatar || '');
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClick = (e) => {
      if (editorRef.current && !editorRef.current.contains(e.target)) setShowEditor(false);
    };
    if (showEditor) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEditor]);

  if (!currentUser) return null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    // Upload to server
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const resp = await fetch(UPLOAD_AVATAR_URL, { method: 'POST', body: formData });
      const data = await resp.json();
      if (data.success) {
        setPreviewUrl(data.fileUrl);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = { ...currentUser, fullname: editName, avatar: previewUrl };
    try {
      await fetchGraphQL(`mutation U($id: ID!, $fullname: String, $avatar: String) { updateUserProfile(id: $id, fullname: $fullname, avatar: $avatar) { id fullname avatar } }`, { id: currentUser.id, fullname: editName, avatar: previewUrl });
    } catch (e) { /* fallback: local only */ }
    if (onUserUpdate) onUserUpdate(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowEditor(false); }, 1000);
    setSaving(false);
  };

  const previewUser = { ...currentUser, fullname: editName, avatar: previewUrl };

  return (
    <div className="topbar" style={{ justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ fontWeight: 900, fontFamily: 'Outfit', fontSize: '1.2rem', color: 'var(--primary-color)' }}>Lumina</div>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '4px 10px', borderRadius: 10, transition: 'background 0.2s' }}
          onClick={() => setShowEditor(!showEditor)}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = ''}>
          <AvatarDisplay user={currentUser} size={36} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser?.fullname || currentUser?.username}</div>
            <span className={`badge ${currentUser?.role === 'ADMIN' ? 'warning' : (currentUser?.role === 'ORGANIZER' ? 'success' : 'blue')}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{currentUser?.role}</span>
          </div>
          <div style={{ fontSize: '0.6rem', color: '#666', marginLeft: 4 }}>✏️</div>
        </div>

        {showEditor && (
          <div ref={editorRef} style={{ position: 'absolute', top: '110%', right: 0, width: 340, background: '#1a1a2e', borderRadius: 14, border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', padding: 22, zIndex: 100 }}>
            <div style={{ textAlign: 'center', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #333' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 4 }}>Chinh sua ho so</div>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>Thay doi anh dai dien & ten hien thi</div>
            </div>

            {/* Avatar Upload */}
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <AvatarDisplay user={previewUser} size={80} />
                <div onClick={() => fileRef.current?.click()}
                  style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00F0FF, #FF00E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #1a1a2e', fontSize: 14 }}>
                  📷
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button onClick={() => fileRef.current?.click()}
                  style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(0,240,255,0.3)', background: 'rgba(0,240,255,0.1)', color: '#00F0FF', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>
                  {uploading ? '⏳ Dang tai...' : '📷 Chon anh'}
                </button>
                {previewUrl && (
                  <button onClick={handleRemoveAvatar}
                    style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#EF4444', cursor: 'pointer', fontSize: '0.72rem' }}>
                    🗑️ Xoa anh
                  </button>
                )}
              </div>
            </div>

            {/* Name Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.75rem', color: '#00F0FF', fontWeight: 600, display: 'block', marginBottom: 6 }}>📝 Ho va ten</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #444', background: '#111', color: '#fff', fontSize: '0.9rem', fontFamily: 'Outfit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#00F0FF'}
                onBlur={e => e.target.style.borderColor = '#444'}
                placeholder="Nhap ten cua ban..." />
            </div>

            {/* Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(0,240,255,0.04)', borderRadius: 10, border: '1px solid rgba(0,240,255,0.1)', marginBottom: 14 }}>
              <AvatarDisplay user={previewUser} size={40} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{editName || 'Ten cua ban'}</div>
                <div style={{ fontSize: '0.68rem', color: '#888' }}>Xem truoc thay doi</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowEditor(false)}
                style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1px solid #444', background: 'transparent', color: '#999', cursor: 'pointer', fontSize: '0.8rem' }}>
                Huy
              </button>
              <button onClick={handleSave} disabled={uploading}
                style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', background: saved ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #00F0FF, #FF00E5)', color: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 700, opacity: uploading ? 0.5 : 1 }}>
                {saving ? '⏳...' : saved ? '✅ Da luu!' : '💾 Luu thay doi'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { AvatarDisplay };
