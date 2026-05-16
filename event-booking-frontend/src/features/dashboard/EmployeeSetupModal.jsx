import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';
import { CheckCircle, XCircle, AlertTriangle, MapPin, Package, Users, FileText, Clock, Loader } from 'lucide-react';

const SETUP_ITEMS = [
  { key: 'stage', label: 'Sân khấu & Backdrop', icon: '🎪' },
  { key: 'sound', label: 'Hệ thống âm thanh', icon: '🔊' },
  { key: 'light', label: 'Hệ thống ánh sáng', icon: '💡' },
  { key: 'decor', label: 'Trang trí & Décor', icon: '🎨' },
  { key: 'staff', label: 'Nhân sự vận hành', icon: '👥' },
  { key: 'print', label: 'In ấn & Thiệp mời', icon: '🖨️' },
  { key: 'food', label: 'Ăn uống & Catering', icon: '🍽️' },
  { key: 'tech', label: 'Kiểm tra kỹ thuật', icon: '⚙️' },
];

export default function EmployeeSetupModal({ contract, onClose, onConfirmed }) {
  const [step, setStep] = useState(contract.showProgress ? 3 : 0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkResults, setCheckResults] = useState(null);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`setup_${contract.id}`)) || {}; } catch { return {}; }
  });

  const saveProgress = (p) => { setProgress(p); localStorage.setItem(`setup_${contract.id}`, JSON.stringify(p)); };

  // Load brief data
  useEffect(() => {
    if (!contract) return;
    setLoading(true);
    fetchGraphQL(`query { getEmployeeSetupData(contractId: "${contract.id}") { proposal { title description eventType expectedDate expectedLocation budget } devices { id name quantity price } locations { id name address capacity } conflictingEvents { id title date location } locationAvailable } }`)
      .then(r => { setData(r.getEmployeeSetupData); setLoading(false); })
      .catch(() => setLoading(false));
  }, [contract]);

  // Auto system check
  const runSystemCheck = () => {
    setStep(1);
    setTimeout(() => {
      if (!data) return;
      const inv = (data.devices || []);
      const outOfStock = inv.filter(d => (d.quantity || 0) <= 0);
      const budget = data.proposal?.budget || 0;
      const estStaff = Math.max(5, Math.ceil(budget / 5000000));
      setCheckResults({
        venue: { ok: data.locationAvailable, conflicts: data.conflictingEvents || [] },
        inventory: { ok: outOfStock.length === 0, total: inv.length, available: inv.length - outOfStock.length, outOfStock },
        staff: { ok: true, required: estStaff, note: `Ước tính ${estStaff} nhân viên dựa trên ngân sách` },
        allOk: data.locationAvailable && outOfStock.length === 0
      });
      setStep(2);
    }, 1500);
  };

  const handleConfirm = async () => {
    try {
      await fetchGraphQL(`mutation { employeeConfirmContract(contractId: "${contract.id}") { id } }`);
      const t = data?.proposal?.eventType;
      alert(`✅ Đã xác nhận!\n${t === 'PUBLIC' ? '🌐 Sự kiện hiển thị công khai trên trang chủ.' : '🔒 Sự kiện riêng tư — chỉ nội bộ.'}`);
      onConfirmed && onConfirmed();
    } catch (err) { alert('❌ ' + err.message); }
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalItems = SETUP_ITEMS.length;
  const progressPct = Math.round((completedCount / totalItems) * 100);
  const p = data?.proposal;

  const sectionStyle = { fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', margin: '20px 0 10px', display: 'flex', alignItems: 'center', gap: 8 };
  const cardStyle = { background: 'rgba(0,240,255,0.05)', borderRadius: 10, padding: '12px 16px' };
  const labelStyle = { fontSize: '0.72rem', color: '#888', marginBottom: 3 };

  if (!contract) return null;

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)' }} onClick={onClose}>
      <div style={{ width: 800, maxHeight:'90vh', background:'var(--bg-panel,#16161e)', borderRadius:16, border:'1px solid rgba(0,240,255,0.2)', overflow:'hidden', display:'flex', flexDirection:'column' }} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(0,240,255,0.08))', padding:'20px 28px 16px', borderBottom:'1px solid var(--border-color)' }}>
          <h2 style={{ margin:'0 0 4px', fontFamily:'Outfit', fontWeight:800, fontSize:'1.2rem' }}>🔧 Điều Phối & Vận Hành Sự Kiện</h2>
          <div style={{ color:'#aaa', fontSize:'0.85rem' }}>{contract.proposalTitle || `HĐ #${contract.id?.slice(-6)}`}</div>
          {/* Step indicator */}
          <div style={{ display:'flex', gap:6, marginTop:12 }}>
            {['📋 Brief','🔍 Kiểm tra','📊 Kết quả','⚙️ Tiến độ'].map((s,i) => (
              <div key={i} style={{ flex:1, padding:'6px 0', textAlign:'center', borderRadius:8, fontSize:'0.75rem', fontWeight:700, background: step===i ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.03)', color: step===i ? '#00F0FF' : '#666', border: step===i ? '1px solid rgba(0,240,255,0.3)' : '1px solid transparent' }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:60 }}><Loader size={32} className="spin" style={{ margin:'0 auto 16px', color:'var(--primary-color)' }} /><p style={{ color:'#888' }}>Đang tải dữ liệu...</p></div>
          ) : !data ? (
            <div style={{ textAlign:'center', padding:40, color:'#888' }}>Không có dữ liệu</div>
          ) : step === 0 ? (
            /* ═══ STEP 0: BRIEF ═══ */
            <>
              <h3 style={sectionStyle}><FileText size={16}/> Bảng Yêu Cầu Từ Khách Hàng</h3>
              {p && (
                <>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
                    <div style={cardStyle}><div style={labelStyle}>📅 Ngày tổ chức</div><div style={{ fontWeight:700 }}>{p.expectedDate}</div></div>
                    <div style={cardStyle}><div style={labelStyle}>📍 Địa điểm</div><div style={{ fontWeight:700 }}>{p.expectedLocation}</div></div>
                    <div style={{...cardStyle, background: p.eventType==='PUBLIC' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)'}}><div style={labelStyle}>🏷️ Loại</div><div style={{ fontWeight:700, color: p.eventType==='PUBLIC' ? '#3B82F6' : '#F59E0B' }}>{p.eventType==='PUBLIC' ? '🌐 Công khai' : '🔒 Riêng tư'}</div></div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                    <div style={{...cardStyle, background:'rgba(16,185,129,0.06)'}}><div style={labelStyle}>💰 Ngân sách</div><div style={{ fontWeight:900, color:'#10B981', fontSize:'1.1rem', fontFamily:'Outfit' }}>{p.budget?.toLocaleString()} VNĐ</div></div>
                    <div style={cardStyle}><div style={labelStyle}>👥 Quy mô ước tính</div><div style={{ fontWeight:700 }}>{Math.max(50, Math.ceil((p.budget||0)/200000))} khách</div></div>
                  </div>
                  <div style={{ background:'rgba(0,0,0,0.25)', borderRadius:10, padding:'14px 18px', marginBottom:16, border:'1px solid var(--border-color)' }}>
                    <div style={labelStyle}>📝 Mô tả chi tiết</div>
                    <div style={{ fontSize:'0.88rem', lineHeight:1.7, color:'#ccc', marginTop:4 }}>{p.description || 'Không có mô tả'}</div>
                  </div>
                </>
              )}
              <h3 style={sectionStyle}><Package size={16}/> Thiết Bị Trong Kho ({data.devices?.length || 0})</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:8, marginBottom:16 }}>
                {(data.devices||[]).map(d => (
                  <div key={d.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid var(--border-color)', borderRadius:8, padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div><div style={{ fontWeight:600, fontSize:'0.85rem' }}>{d.name}</div><div style={{ fontSize:'0.75rem', color:'#888' }}>{d.price?.toLocaleString()}đ</div></div>
                    <div style={{ fontWeight:800, color:(d.quantity||0)>0?'#10B981':'#EF4444', fontSize:'1.1rem' }}>{d.quantity||0}</div>
                  </div>
                ))}
              </div>
              <button className="btn" style={{ width:'100%', padding:'14px', fontSize:'0.95rem', background:'linear-gradient(135deg,#3B82F6,#2563EB)' }} onClick={runSystemCheck}>🔍 Hệ Thống Tự Động Kiểm Tra</button>
            </>
          ) : step === 1 ? (
            /* ═══ STEP 1: AUTO CHECKING ═══ */
            <div style={{ textAlign:'center', padding:60 }}>
              <div style={{ width:64, height:64, border:'4px solid var(--border-color)', borderTopColor:'#3B82F6', borderRadius:'50%', margin:'0 auto 20px', animation:'spin 1s linear infinite' }}></div>
              <h3 style={{ fontFamily:'Outfit', color:'#3B82F6', marginBottom:8 }}>🔍 Đang kiểm tra tự động...</h3>
              <div style={{ color:'#888', fontSize:'0.9rem' }}>Hệ thống đang đối soát kho thiết bị, địa điểm và nhân sự</div>
              <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:8, maxWidth:300, margin:'24px auto 0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'#10B981' }}><CheckCircle size={16}/> Kiểm tra kho thiết bị...</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'#3B82F6' }}><Clock size={16}/> Kiểm tra địa điểm & lịch...</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'#888' }}><Clock size={16}/> Phân bổ nhân sự...</div>
              </div>
            </div>
          ) : step === 2 && checkResults ? (
            /* ═══ STEP 2: RESULTS ═══ */
            <>
              <div style={{ textAlign:'center', marginBottom:24 }}>
                <div style={{ fontSize:'3rem', marginBottom:8 }}>{checkResults.allOk ? '✅' : '⚠️'}</div>
                <h3 style={{ fontFamily:'Outfit', color: checkResults.allOk ? '#10B981' : '#F59E0B', marginBottom:4 }}>{checkResults.allOk ? 'Tất cả kiểm tra ĐẠT!' : 'Có vấn đề cần lưu ý'}</h3>
                <div style={{ color:'#888', fontSize:'0.88rem' }}>Kết quả kiểm tra tự động bởi hệ thống</div>
              </div>

              {/* Venue check */}
              <div style={{ marginBottom:16 }}>
                <h3 style={sectionStyle}><MapPin size={16}/> Kiểm Tra Địa Điểm</h3>
                {checkResults.venue.ok ? (
                  <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}><CheckCircle size={18} color="#10B981"/><span style={{ color:'#10B981', fontWeight:600 }}>✅ Địa điểm trống — Không trùng lịch</span></div>
                ) : (
                  <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, color:'#EF4444', fontWeight:700, marginBottom:8 }}><AlertTriangle size={16}/> TRÙNG LỊCH!</div>
                    {checkResults.venue.conflicts.map(e => <div key={e.id} style={{ background:'rgba(239,68,68,0.06)', borderRadius:8, padding:'8px 12px', marginTop:4, fontSize:'0.85rem' }}><b>"{e.title}"</b> — {e.date} @ {e.location}</div>)}
                  </div>
                )}
              </div>

              {/* Inventory check */}
              <div style={{ marginBottom:16 }}>
                <h3 style={sectionStyle}><Package size={16}/> Kiểm Tra Kho Thiết Bị</h3>
                <div style={{ background: checkResults.inventory.ok ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', border:`1px solid ${checkResults.inventory.ok ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.25)'}`, borderRadius:10, padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: checkResults.inventory.ok ? 0 : 8 }}>
                    {checkResults.inventory.ok ? <CheckCircle size={18} color="#10B981"/> : <AlertTriangle size={18} color="#F59E0B"/>}
                    <span style={{ fontWeight:600, color: checkResults.inventory.ok ? '#10B981' : '#F59E0B' }}>
                      {checkResults.inventory.ok ? `✅ Đủ thiết bị (${checkResults.inventory.available}/${checkResults.inventory.total})` : `⚠️ Thiếu ${checkResults.inventory.outOfStock.length} thiết bị — Cần thuê ngoài`}
                    </span>
                  </div>
                  {!checkResults.inventory.ok && checkResults.inventory.outOfStock.map(d => <div key={d.id} style={{ fontSize:'0.85rem', color:'#F59E0B', marginTop:4 }}>• {d.name} (Hết hàng)</div>)}
                </div>
              </div>

              {/* Staff check */}
              <div style={{ marginBottom:16 }}>
                <h3 style={sectionStyle}><Users size={16}/> Phân Bổ Nhân Sự</h3>
                <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                  <CheckCircle size={18} color="#10B981"/>
                  <span style={{ color:'#10B981', fontWeight:600 }}>✅ {checkResults.staff.note}</span>
                </div>
              </div>

              {/* Publishing info */}
              <div style={{ background: p?.eventType==='PUBLIC' ? 'rgba(59,130,246,0.06)' : 'rgba(245,158,11,0.06)', border:`1px solid ${p?.eventType==='PUBLIC' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius:12, padding:'14px 18px', marginBottom:20, fontSize:'0.88rem' }}>
                {p?.eventType==='PUBLIC'
                  ? <span style={{ color:'#3B82F6' }}>🌐 <b>Sau khi xác nhận</b>: Sự kiện sẽ hiển thị trên trang chủ, mở cổng bán vé.</span>
                  : <span style={{ color:'#F59E0B' }}>🔒 <b>Sau khi xác nhận</b>: Sự kiện ẩn, chỉ KH + NV + Admin thấy.</span>}
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button className="btn" disabled={!checkResults.allOk} style={{ flex:1, padding:'14px', fontSize:'0.95rem', background: checkResults.allOk ? 'linear-gradient(135deg,#10B981,#059669)' : '#555', opacity: checkResults.allOk ? 1 : 0.6 }} onClick={handleConfirm}>
                  {checkResults.allOk ? '✅ Xác Nhận — Bắt Đầu Setup' : '❌ Không thể xác nhận'}
                </button>
                <button className="btn outline" onClick={() => setStep(0)} style={{ padding:'14px 20px' }}>← Xem lại Brief</button>
              </div>
            </>
          ) : step === 3 ? (
            /* ═══ STEP 3: PROGRESS TRACKING ═══ */
            <>
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <h3 style={{ fontFamily:'Outfit', fontWeight:700, margin:0 }}>⚙️ Tiến Độ Setup</h3>
                  <span style={{ fontFamily:'Outfit', fontWeight:800, color: progressPct===100 ? '#10B981' : '#00F0FF' }}>{progressPct}%</span>
                </div>
                <div style={{ height:8, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${progressPct}%`, background: progressPct===100 ? '#10B981' : 'linear-gradient(90deg,#00F0FF,#3B82F6)', borderRadius:4, transition:'width 0.3s' }}></div>
                </div>
                <div style={{ fontSize:'0.82rem', color:'#888', marginTop:6 }}>{completedCount}/{totalItems} hạng mục hoàn thành</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {SETUP_ITEMS.map(item => (
                  <div key={item.key} onClick={() => { const p2 = {...progress, [item.key]: !progress[item.key]}; saveProgress(p2); }}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', borderRadius:12, cursor:'pointer', transition:'all 0.2s',
                      background: progress[item.key] ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${progress[item.key] ? 'rgba(16,185,129,0.25)' : 'var(--border-color)'}` }}>
                    <div style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                      background: progress[item.key] ? '#10B981' : 'rgba(255,255,255,0.06)', color: progress[item.key] ? '#fff' : '#666', fontSize:'0.9rem', transition:'all 0.2s' }}>
                      {progress[item.key] ? '✓' : item.icon}
                    </div>
                    <span style={{ flex:1, fontWeight:600, fontSize:'0.9rem', color: progress[item.key] ? '#10B981' : '#ccc', textDecoration: progress[item.key] ? 'line-through' : 'none' }}>{item.label}</span>
                    {progress[item.key] && <CheckCircle size={16} color="#10B981"/>}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
