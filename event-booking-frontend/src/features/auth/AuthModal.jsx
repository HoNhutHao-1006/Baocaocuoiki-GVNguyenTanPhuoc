import React, { useState } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';
import { Mail, User, Lock, CheckCircle, ArrowRight, Loader } from 'lucide-react';

export default function AuthModal({ mode, onClose, onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [fn, setFn] = useState('');
  const [em, setEm] = useState('');
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [step, setStep] = useState(1); // 1=form, 2=verify code, 3=done
  const [verCode, setVerCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  const sendCode = async () => {
    if (!em || !em.includes('@')) { alert('Vui lòng nhập email hợp lệ!'); return; }
    if (!u || !p || !fn) { alert('Vui lòng nhập đầy đủ thông tin!'); return; }
    setSending(true);
    try {
      await fetchGraphQL(`mutation { sendVerificationCode(email: "${em}") }`);
      setStep(2);
      startCountdown();
    } catch (err) { alert(err.message); }
    setSending(false);
  };

  const verifyCode = async () => {
    setVerifying(true);
    try {
      await fetchGraphQL(`mutation { verifyEmailCode(email: "${em}", code: "${verCode}") }`);
      // Now register
      const res = await fetchGraphQL(`mutation { registerAuth(username: "${u}", password: "${p}", role: "MEMBER", fullname: "${fn}", email: "${em}") { id username role fullname email avatar } }`);
      setStep(3);
      setTimeout(() => {
        onLogin({ ...res.registerAuth, token: null });
        onClose();
      }, 1500);
    } catch (err) { alert(err.message); }
    setVerifying(false);
  };

  const submitLogin = async () => {
    try {
      const res = await fetchGraphQL(`query { login(username: "${u}", password: "${p}") { id username role fullname phone email token avatar }}`);
      onLogin(res.login);
      onClose();
    } catch (err) { alert(err.message); }
  };

  const iconBox = { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: 40, maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,229,0.2))', border: '1px solid rgba(0,240,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            {isLogin ? <Lock size={28} color="#00F0FF" /> : step === 3 ? <CheckCircle size={28} color="#10B981" /> : <User size={28} color="#FF00E5" />}
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>
            {isLogin ? 'Đăng Nhập' : step === 1 ? 'Đăng Ký Tài Khoản' : step === 2 ? 'Xác Nhận Email' : '✅ Thành Công!'}
          </h2>
          {!isLogin && step === 2 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Mã xác nhận đã gửi đến <strong style={{ color: '#00F0FF' }}>{em}</strong></p>}
        </div>

        {/* LOGIN */}
        {isLogin && (
          <>
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#666' }} />
                <input className="form-control" style={{ paddingLeft: 40 }} placeholder="Tên tài khoản" value={u} onChange={e => setU(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#666' }} />
                <input type="password" className="form-control" style={{ paddingLeft: 40 }} placeholder="Mật khẩu" value={p} onChange={e => setP(e.target.value)} />
              </div>
            </div>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 10, padding: 14 }} onClick={submitLogin}>
              <ArrowRight size={18} /> Truy cập hệ thống
            </button>
          </>
        )}

        {/* REGISTER STEP 1 */}
        {!isLogin && step === 1 && (
          <>
            <div className="form-group"><input className="form-control" placeholder="Họ và tên *" value={fn} onChange={e => setFn(e.target.value)} /></div>
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#666' }} />
                <input className="form-control" style={{ paddingLeft: 40 }} placeholder="Email thật (để nhận mã xác nhận) *" value={em} onChange={e => setEm(e.target.value)} type="email" />
              </div>
            </div>
            <div className="form-group"><input className="form-control" placeholder="Tên đăng nhập (username) *" value={u} onChange={e => setU(e.target.value)} /></div>
            <div className="form-group"><input type="password" className="form-control" placeholder="Mật khẩu *" value={p} onChange={e => setP(e.target.value)} /></div>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={sendCode} disabled={sending || !u || !p || !fn || !em}>
              {sending ? <><Loader size={18} className="spin" /> Đang gửi mã...</> : <><Mail size={18} /> Gửi mã xác nhận</>}
            </button>
          </>
        )}

        {/* REGISTER STEP 2 - VERIFY */}
        {!isLogin && step === 2 && (
          <>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '20px 0 24px' }}>
              {[0,1,2,3,4,5].map(i => (
                <input key={i} maxLength={1} style={{ width: 48, height: 56, textAlign: 'center', fontSize: '1.5rem', fontWeight: 900, fontFamily: 'monospace', background: 'rgba(0,240,255,0.06)', border: `2px solid ${verCode[i] ? '#00F0FF' : 'var(--border-color)'}`, borderRadius: 12, color: '#fff', outline: 'none', transition: 'all 0.2s' }}
                  value={verCode[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (!val && verCode[i]) { const nv = verCode.slice(0, i) + verCode.slice(i + 1); setVerCode(nv); return; }
                    if (!val) return;
                    const newCode = verCode.padEnd(6, ' ').split('');
                    newCode[i] = val[0];
                    setVerCode(newCode.join('').trim());
                    if (val && i < 5) e.target.nextElementSibling?.focus();
                  }}
                  onKeyDown={e => { if (e.key === 'Backspace' && !verCode[i] && i > 0) e.target.previousElementSibling?.focus(); }}
                  onPaste={e => { e.preventDefault(); const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6); setVerCode(paste); }}
                />
              ))}
            </div>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={verifyCode} disabled={verifying || verCode.length < 6}>
              {verifying ? <><Loader size={18} /> Đang xác nhận...</> : <><CheckCircle size={18} /> Xác nhận & Tạo tài khoản</>}
            </button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              {countdown > 0 ? (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gửi lại sau {countdown}s</span>
              ) : (
                <span style={{ color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem' }} onClick={sendCode}>📨 Gửi lại mã</span>
              )}
            </div>
          </>
        )}

        {/* STEP 3 - SUCCESS */}
        {!isLogin && step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
            <p style={{ color: '#10B981', fontWeight: 700, fontSize: '1.1rem' }}>Đăng ký thành công!</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đang chuyển hướng...</p>
          </div>
        )}

        {step === 1 && (
          <p style={{ textAlign: 'center', marginTop: 20, cursor: 'pointer', color: 'var(--primary-color)', fontSize: '0.95rem' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </p>
        )}
        {step === 2 && (
          <p style={{ textAlign: 'center', marginTop: 16, cursor: 'pointer', color: '#888', fontSize: '0.85rem' }} onClick={() => setStep(1)}>← Quay lại</p>
        )}
      </div>
    </div>
  );
}
