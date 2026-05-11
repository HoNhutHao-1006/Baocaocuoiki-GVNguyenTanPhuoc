import React, { useState, useRef } from 'react';
import { fetchGraphQL } from '../api/axiosClient';
import { Camera } from 'lucide-react';

export default function SettingsPage({ currentUser }) {
  const [fn, setFn] = useState(currentUser?.fullname || '');
  const [em, setEm] = useState(currentUser?.email || '');
  const [ph, setPh] = useState(currentUser?.phone || '');
  const [bankName, setBankName] = useState(currentUser?.bankName || '');
  const [bankAccount, setBankAccount] = useState(currentUser?.bankAccount || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('http://localhost:4000/upload-avatar', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        await fetchGraphQL(`mutation { updateAvatar(userId: "${currentUser.id}", avatar: "${data.fileUrl}") { id avatar } }`);
        setAvatar(data.fileUrl);
        const saved = JSON.parse(localStorage.getItem('currentUser') || '{}');
        saved.avatar = data.fileUrl;
        localStorage.setItem('currentUser', JSON.stringify(saved));
        alert('✅ Cập nhật avatar thành công!');
      }
    } catch (err) { alert('Lỗi upload: ' + err.message); }
    setUploading(false);
  };

  const avatarSrc = avatar ? (avatar.startsWith('/') ? `http://localhost:4000${avatar}` : avatar) : null;
  const initials = (fn || currentUser?.username || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const saveProfile = async () => {
    try {
      await fetchGraphQL(`mutation { updateProfile(userId: "${currentUser.id}", fullname: "${fn}", email: "${em}", phone: "${ph}", bankName: "${bankName}", bankAccount: "${bankAccount}") { id } }`);
      const saved = JSON.parse(localStorage.getItem('currentUser') || '{}');
      saved.fullname = fn; saved.email = em; saved.phone = ph; saved.bankName = bankName; saved.bankAccount = bankAccount;
      localStorage.setItem('currentUser', JSON.stringify(saved));
      alert("Cập nhật thành công!");
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="panel" style={{ maxWidth: 600, margin: '20px auto' }}>
      {/* Avatar Section */}
      <div style={{ textAlign: 'center', marginBottom: 30, paddingBottom: 30, borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }} />
          ) : (
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: '#fff', border: '3px solid var(--primary-color)' }}>{initials}</div>
          )}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-color)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <Camera size={16} color="#000" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
        </div>
        <div style={{ marginTop: 12, fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>{fn || currentUser?.username}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{em || 'Chưa có email'}</div>
      </div>

      <h3>Thông tin cá nhân</h3>
      <div className="form-group" style={{ marginTop: 20 }}>
        <input className="form-control" placeholder="Họ và tên" value={fn} onChange={e => setFn(e.target.value)} />
      </div>
      <div className="form-group">
        <input className="form-control" placeholder="Email" value={em} onChange={e => setEm(e.target.value)} />
      </div>
      <div className="form-group">
        <input className="form-control" placeholder="Số điện thoại" value={ph} onChange={e => setPh(e.target.value)} />
      </div>

      <h3 style={{ marginTop: 30 }}>🏦 Thông tin ngân hàng (Hoàn tiền)</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '8px 0 16px' }}>Hệ thống sẽ hoàn tiền về tài khoản này khi bạn hủy vé.</p>
      <div className="form-group">
        <input className="form-control" placeholder="Tên ngân hàng (VD: Vietcombank, MB Bank...)" value={bankName} onChange={e => setBankName(e.target.value)} />
      </div>
      <div className="form-group">
        <input className="form-control" placeholder="Số tài khoản ngân hàng" value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
      </div>
      
      
      <button className="btn" style={{ width: '100%' }} onClick={saveProfile}>Cập nhật hồ sơ</button>

      <h3 style={{ marginTop: 40 }}>Đổi mật khẩu</h3>
      <div className="form-group" style={{ marginTop: 20 }}>
        <input className="form-control" type="password" placeholder="Mật khẩu cũ" value={oldP} onChange={e => setOldP(e.target.value)} />
      </div>
      <div className="form-group">
        <input className="form-control" type="password" placeholder="Mật khẩu mới" value={newP} onChange={e => setNewP(e.target.value)} />
      </div>
      <button className="btn outline" style={{ width: '100%' }} onClick={async () => {
        try {
          await fetchGraphQL(`mutation { changePassword(userId: "${currentUser.id}", oldPass: "${oldP}", newPass: "${newP}") }`);
          alert("Đổi mật khẩu thành công!");
          setOldP(''); setNewP('');
        } catch (e) { alert(e.message); }
      }}>Đổi mật khẩu</button>
    </div>
  )
}
