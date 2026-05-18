import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';
import { API_URL } from '../../api/config';

function StadiumOverview({ zones, activeZoneId, onSelectZone }) {
  const [hov, setHov] = useState(null);
  const total = zones.reduce((s, z) => s + (z.seats?.length || 0), 0);
  const sold = zones.reduce((s, z) => s + (z.seats?.filter(x => x.status !== 'available').length || 0), 0);
  const zoneInfo = zones.map(z => ({ z, avail: (z.seats||[]).filter(s=>s.status==='available').length, tot: (z.seats||[]).length }));
  const vip = zoneInfo[0], ga = zoneInfo[1], std = zoneInfo[2];

  const B = ({ zi, suffix, label }) => {
    if (!zi) return null;
    const isAct = zi.z.id === activeZoneId, isH = hov === zi.z.id+suffix;
    return (
      <div onClick={() => onSelectZone(zi.z.id)} onMouseEnter={() => setHov(zi.z.id+suffix)} onMouseLeave={() => setHov(null)}
        style={{ flex:1, minWidth:0, background: isAct?`${zi.z.zoneColor}35`:isH?`${zi.z.zoneColor}20`:'rgba(0,180,255,0.07)', border:`1.5px solid ${isAct?'#fff':isH?zi.z.zoneColor:'rgba(0,180,255,0.18)'}`, borderRadius:5, padding:'8px 4px', cursor:'pointer', transition:'all 0.2s', textAlign:'center', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:zi.z.zoneColor, borderRadius:'5px 5px 0 0' }}/>
        <div style={{ fontFamily:'Outfit', fontWeight:700, fontSize:'0.58rem', color:'#ddd', whiteSpace:'nowrap' }}>{label}</div>
      </div>
    );
  };

  const FZ = ({ zi, label }) => {
    if (!zi) return null;
    const isAct = zi.z.id === activeZoneId, isH = hov === label;
    return (
      <div onClick={() => onSelectZone(zi.z.id)} onMouseEnter={() => setHov(label)} onMouseLeave={() => setHov(null)}
        style={{ background: isAct?`${zi.z.zoneColor}30`:isH?`${zi.z.zoneColor}20`:'rgba(0,180,255,0.07)', border:`1.5px solid ${isAct?'#fff':'rgba(0,180,255,0.18)'}`, borderRadius:5, padding:'7px', textAlign:'center', cursor:'pointer', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:zi.z.zoneColor, borderRadius:'5px 5px 0 0' }}/>
        <span style={{ fontFamily:'Outfit', fontWeight:700, fontSize:'0.6rem', color:'#ddd' }}>{label}</span>
      </div>
    );
  };

  const cs = { fontSize:'0.48rem', color:'rgba(100,180,255,0.5)', fontFamily:'Outfit', fontWeight:600 };

  return (
    <div style={{ textAlign:'center', marginBottom:20, padding:'0 10px' }}>
      <div style={{ background:'rgba(0,0,0,0.6)', borderRadius:'14px 14px 0 0', padding:'14px 24px', maxWidth:780, margin:'0 auto', border:'1px solid rgba(0,160,255,0.12)', borderBottom:'none' }}>
        <h2 style={{ fontFamily:'Outfit', fontWeight:900, fontSize:'1.25rem', margin:0, color:'#fff', letterSpacing:4, textTransform:'uppercase' }}>SƠ ĐỒ KHU VỰC SÂN KHẤU</h2>
      </div>

      <div style={{ maxWidth:780, margin:'0 auto', background:'#060610', borderRadius:'0 0 14px 14px', border:'1px solid rgba(0,160,255,0.12)', borderTop:'none', padding:'12px 14px 16px' }}>
        {/* F&B */}
        <div style={{ border:'1px solid rgba(0,160,255,0.15)', borderRadius:6, padding:'6px', textAlign:'center', marginBottom:10, background:'rgba(0,160,255,0.03)' }}>
          <span style={{ ...cs, letterSpacing:2, fontSize:'0.5rem' }}>KHU VỰC F&B VÀ NHÀ TÀI TRỢ</span>
        </div>

        <div style={{ display:'flex', gap:8 }}>
          {/* ════ LEFT: zones + stage ════ */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ display:'flex', justifyContent:'space-around' }}><span style={cs}>▼ CỬA B1</span><span style={cs}>▼ CỬA B2</span></div>

            {/* VIP B */}
            <div style={{ display:'flex', gap:4 }}>
              <B zi={std} suffix="-v2b" label="VIP2-B"/><B zi={std} suffix="-v1b" label="VIP1-B"/>
              <div style={{ flex:0.3 }}/><B zi={std} suffix="-v3b" label="VIP3-B"/>
            </div>
            {/* GA B */}
            <div style={{ display:'flex', gap:3 }}>
              <B zi={ga} suffix="-g2b" label="GA2-B"/><B zi={ga} suffix="-g1b" label="GA1-B"/>
              <div style={{ flex:0.15 }}/><B zi={ga} suffix="-g3b" label="GA3-B"/><B zi={ga} suffix="-g4b" label="GA4-B"/><B zi={ga} suffix="-g5b" label="GA5-B"/>
            </div>
            {/* FANZONE B */}
            <FZ zi={vip} label="FANZONE B"/>

            {/* ══ STAGE ROW ══ */}
            <div style={{ display:'flex', gap:5, alignItems:'stretch' }}>
              <div style={{ width:80, background:'linear-gradient(180deg, #9B59B6, #7D3C98, #6C3483, #4A235A)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #BB8FCE', boxShadow:'0 0 30px rgba(155,89,182,0.3)', flexShrink:0, padding:'14px 0', position:'relative' }}>
                <div style={{ color:'#fff', fontFamily:'Outfit', fontWeight:900, fontSize:'1.05rem', letterSpacing:5, writingMode:'vertical-rl', textOrientation:'mixed', textShadow:'0 0 15px rgba(255,255,255,0.4)' }}>STAGE</div>
              </div>
              <div style={{ flex:1, display:'flex', gap:5 }}>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
                  <div style={{ flex:1, background:'rgba(0,160,255,0.06)', border:'1px solid rgba(0,160,255,0.12)', borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ ...cs, fontSize:'0.55rem' }}>FOH</span>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    <div style={{ flex:1, background:'rgba(155,89,182,0.1)', border:'1px solid rgba(155,89,182,0.2)', borderRadius:5, padding:'5px 3px', textAlign:'center' }}>
                      <span style={{ fontSize:'0.42rem', color:'#BB8FCE', fontFamily:'Outfit', fontWeight:600 }}>SKY<br/>LOUNGE</span>
                    </div>
                    <div style={{ flex:1, background:'rgba(255,215,0,0.06)', border:'1px solid rgba(255,215,0,0.15)', borderRadius:5, padding:'5px 3px', textAlign:'center' }}>
                      <span style={{ fontSize:'0.42rem', color:'#FFD700', fontFamily:'Outfit', fontWeight:600 }}>PRESIDENTIAL<br/>SUITE</span>
                    </div>
                  </div>
                </div>
                <div style={{ width:12, background:'linear-gradient(180deg, #E74C3C, #C0392B)', borderRadius:3, flexShrink:0 }}/>
              </div>
              <div style={{ width:24, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ writingMode:'vertical-rl', textOrientation:'mixed', fontSize:'0.38rem', color:'rgba(100,180,255,0.4)', fontFamily:'Outfit', fontWeight:600, letterSpacing:1 }}>LỐI VÀO SÂN KHẤU</span>
              </div>
            </div>

            {/* FANZONE A */}
            <FZ zi={vip} label="FANZONE A"/>
            {/* GA A */}
            <div style={{ display:'flex', gap:3 }}>
              <div style={{ flex:0.15 }}/><B zi={ga} suffix="-g1a" label="GA1-A"/><B zi={ga} suffix="-g2a" label="GA2-A"/>
              <B zi={ga} suffix="-g3a" label="GA3-A"/><B zi={ga} suffix="-g4a" label="GA4-A"/><B zi={ga} suffix="-g5a" label="GA5-A"/>
            </div>
            {/* VIP A */}
            <div style={{ display:'flex', gap:4 }}>
              <B zi={std} suffix="-v2a" label="VIP2-A"/><B zi={std} suffix="-v1a" label="VIP1-A"/>
              <div style={{ flex:0.3 }}/><B zi={std} suffix="-v3a" label="VIP3-A"/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'0 6px' }}>
              <span style={cs}>▲ CỬA A1</span>
              <span style={{ ...cs, color:'rgba(187,143,206,0.5)' }}>CỬA PRESIDENT / SKY LOUNGE</span>
              <span style={cs}>CỬA A2 ▲</span>
            </div>
          </div>

          {/* ════ RIGHT: CHECK-IN KHU B ════ */}
          <div style={{ width:65, background:'rgba(0,160,255,0.04)', border:'1px dashed rgba(0,160,255,0.12)', borderRadius:6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 4px', flexShrink:0 }}>
            <span style={{ ...cs, textAlign:'center', lineHeight:1.5 }}>KHU VỰC<br/>CHECK-IN<br/>KHU B</span>
            {[1,2,3].map(i=><div key={i} style={{ width:'90%', background:'rgba(0,160,255,0.06)', borderRadius:2, padding:'2px 0', textAlign:'center' }}><span style={{ fontSize:'0.3rem', color:'rgba(100,180,255,0.3)' }}>MÁY QUÉT</span></div>)}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display:'flex', gap:6, marginTop:8, alignItems:'center' }}>
          <div style={{ flex:1, background:'rgba(0,160,255,0.04)', border:'1px dashed rgba(0,160,255,0.1)', borderRadius:6, padding:'8px', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:'0.8rem' }}>🎫</span>
            <span style={{ ...cs, fontSize:'0.5rem', letterSpacing:1 }}>KHU VỰC CHECK-IN KHU A</span>
          </div>
          <div style={{ width:36, height:36, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:'0.9rem' }}>🅿</span>
          </div>
          <span style={{ ...cs, writingMode:'vertical-rl', fontSize:'0.35rem', letterSpacing:1, color:'rgba(100,180,255,0.3)' }}>ĐƯỜNG N12</span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:14, flexWrap:'wrap' }}>
        {zones.map(z => {
          const av = (z.seats||[]).filter(s=>s.status==='available').length;
          return (
            <div key={z.id} onClick={() => onSelectZone(z.id)} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', padding:'5px 12px', borderRadius:100, border:`2px solid ${z.id===activeZoneId?z.zoneColor:'transparent'}`, background:z.id===activeZoneId?`${z.zoneColor}15`:'transparent', transition:'all 0.2s' }}>
              <div style={{ width:10, height:10, borderRadius:3, background:z.zoneColor }}/>
              <span style={{ fontSize:'0.75rem', color:'#ccc', fontWeight:600 }}>{z.name}</span>
              <span style={{ fontSize:'0.65rem', color:'#666' }}>({av} trống)</span>
            </div>
          );
        })}
      </div>
      <div style={{ color:'#555', fontSize:'0.75rem', marginTop:8 }}>Tổng: {total} ghế — Đã bán: {sold} — Còn: {total-sold}</div>
      <p style={{ color:'#444', fontSize:'0.7rem', marginTop:4 }}>👆 Nhấn vào khu vực để chọn ghế chi tiết</p>
    </div>
  );
}

export default function SeatMapUI({ eventId, currentUser, onSeatHeld }) {
  const [zones, setZones] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [holding, setHolding] = useState(false);
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [showOverview, setShowOverview] = useState(true);

  useEffect(() => {
    fetchGraphQL(`query { getEventSeatMap(eventId: "${eventId}") { id name zoneColor price rows seatsPerRow seats { id label row number status } } }`)
      .then(res => { setZones(res.getEventSeatMap || []); if (res.getEventSeatMap?.length > 0) setActiveZoneId(res.getEventSeatMap[0].id); })
      .catch(console.error).finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.io) {
      const socket = window.io(API_URL);
      socket.on('seat-updated', ({ seatId, status, eventId: evtId }) => {
        if (evtId && evtId !== eventId) return;
        setZones(prev => prev.map(z => ({ ...z, seats: z.seats.map(s => s.id === seatId ? { ...s, status } : s) })));
        setSelectedSeats(prev => prev.filter(s => s.id !== seatId || status === 'available'));
      });
      return () => socket.disconnect();
    }
  }, [eventId]);

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      if (exists) return prev.filter(s => s.id !== seat.id);
      if (prev.length >= 10) { alert('Tối đa 10 ghế mỗi lần đặt!'); return prev; }
      return [...prev, seat];
    });
  };

  const handleHoldSeats = async () => {
    const mem = JSON.parse(localStorage.getItem('currentUser'));
    if (!mem || mem.role !== 'MEMBER') { alert('Vui lòng đăng nhập với tài khoản MEMBER để mua vé!'); return; }
    setHolding(true);
    try {
      const seatIdsStr = selectedSeats.map(s => `"${s.id}"`).join(',');
      const res = await fetchGraphQL(`mutation { holdMultipleSeats(memberId: "${mem.id}", seatIds: [${seatIdsStr}]) { id status totalAmount seatLabel seatLabels zoneName zoneColor holdExpiresAt quantity } }`);
      setSelectedSeats([]); onSeatHeld(res.holdMultipleSeats);
    } catch (e) { alert('❌ ' + e.message); }
    setHolding(false);
  };

  if (loading) return <div style={{ textAlign:'center', padding:60 }}>⌛ Đang tải sơ đồ ghế...</div>;
  if (!zones.length) return <div style={{ padding:'40px 60px' }}><div className="panel" style={{ textAlign:'center', padding:50 }}><div style={{ fontSize:'3rem', marginBottom:12 }}>🎭</div><h3>Chưa có sơ đồ ghế</h3></div></div>;

  const activeZone = zones.find(z => z.id === activeZoneId) || zones[0];
  const seatsByRow = {};
  (activeZone?.seats || []).forEach(s => { if (!seatsByRow[s.row]) seatsByRow[s.row] = []; seatsByRow[s.row].push(s); });
  const availSeats = (activeZone?.seats || []).filter(s => s.status === 'available').length;
  const heldSeats = (activeZone?.seats || []).filter(s => s.status === 'held').length;
  const bookedSeats = (activeZone?.seats || []).filter(s => s.status === 'booked').length;

  return (
    <div style={{ padding:'30px 40px' }}>
      {(!currentUser || currentUser.role !== 'MEMBER') && (
        <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid var(--warning)', borderRadius:12, padding:'14px 24px', marginBottom:20, textAlign:'center' }}>
          <span style={{ fontWeight:600, color:'var(--warning)' }}>⚠️ Đăng nhập MEMBER để đặt vé</span>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:20 }}>
        <button className={showOverview ? 'btn' : 'btn outline'} onClick={() => setShowOverview(true)} style={{ fontSize:'0.85rem', padding:'8px 20px' }}>🏟️ Sơ Đồ Khán Đài</button>
        <button className={!showOverview ? 'btn' : 'btn outline'} onClick={() => setShowOverview(false)} style={{ fontSize:'0.85rem', padding:'8px 20px' }}>💺 Chọn Ghế Chi Tiết</button>
      </div>

      {showOverview && <StadiumOverview zones={zones} activeZoneId={activeZoneId} onSelectZone={(id) => { setActiveZoneId(id); setShowOverview(false); }} />}

      {!showOverview && (
        <>
          {/* Zone info header */}
          <div style={{ maxWidth:900, margin:'0 auto 20px', background:`linear-gradient(135deg, ${activeZone.zoneColor}12, rgba(0,0,0,0.4))`, borderRadius:16, border:`1px solid ${activeZone.zoneColor}30`, padding:'20px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:`${activeZone.zoneColor}25`, border:`2px solid ${activeZone.zoneColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>🎭</div>
              <div>
                <div style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.15rem', color:activeZone.zoneColor }}>{activeZone.name}</div>
                <div style={{ color:'#888', fontSize:'0.85rem' }}>{activeZone.price.toLocaleString()}đ / vé</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:20 }}>
              {[
                { label:'Trống', val:availSeats, color:'#10B981', icon:'🟢' },
                { label:'Đang giữ', val:heldSeats, color:'#F59E0B', icon:'🟡' },
                { label:'Đã bán', val:bookedSeats, color:'#EF4444', icon:'🔴' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.3rem', fontFamily:'Outfit', fontWeight:900, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:'0.65rem', color:'#666' }}>{s.icon} {s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone tabs */}
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:20, flexWrap:'wrap' }}>
            {zones.map(z => (
              <button key={z.id} onClick={() => { setActiveZoneId(z.id); setSelectedSeats(prev => prev.filter(s => { const zoneSeats = (z.seats||[]).map(x=>x.id); return !zoneSeats.includes(s.id); })); }}
                style={{ padding:'10px 24px', borderRadius:100, fontFamily:'Outfit', fontWeight:700, fontSize:'0.88rem', border:`2px solid ${z.zoneColor}`, cursor:'pointer', transition:'all 0.25s', background:activeZoneId===z.id?z.zoneColor:'transparent', color:activeZoneId===z.id?'#000':z.zoneColor, boxShadow:activeZoneId===z.id?`0 0 20px ${z.zoneColor}50`:'none', transform:activeZoneId===z.id?'scale(1.05)':'scale(1)' }}>
                {z.name} — {z.price.toLocaleString()}đ
              </button>
            ))}
          </div>

          {/* Seat grid cinema style */}
          <div style={{ background:'rgba(0,0,0,0.5)', borderRadius:24, padding:'30px 24px', maxWidth:900, margin:'0 auto', border:'1px solid rgba(255,255,255,0.06)', position:'relative' }}>
            {/* Screen / Stage indicator */}
            <div style={{ position:'relative', marginBottom:30, textAlign:'center' }}>
              <div style={{ height:4, borderRadius:4, background:`linear-gradient(90deg, transparent 5%, ${activeZone.zoneColor} 30%, ${activeZone.zoneColor} 70%, transparent 95%)`, marginBottom:8 }} />
              <div style={{ background:`linear-gradient(90deg, transparent, ${activeZone.zoneColor}20, transparent)`, padding:'6px 0', borderRadius:6 }}>
                <span style={{ fontFamily:'Outfit', fontWeight:700, fontSize:'0.8rem', letterSpacing:4, color:activeZone.zoneColor }}>🎭 SÂN KHẤU / MÀN HÌNH 🎭</span>
              </div>
              {/* Light rays */}
              <div style={{ position:'absolute', top:-8, left:'20%', width:1, height:12, background:`${activeZone.zoneColor}40`, transform:'rotate(-20deg)' }}/>
              <div style={{ position:'absolute', top:-8, left:'40%', width:1, height:12, background:`${activeZone.zoneColor}40`, transform:'rotate(-8deg)' }}/>
              <div style={{ position:'absolute', top:-8, right:'40%', width:1, height:12, background:`${activeZone.zoneColor}40`, transform:'rotate(8deg)' }}/>
              <div style={{ position:'absolute', top:-8, right:'20%', width:1, height:12, background:`${activeZone.zoneColor}40`, transform:'rotate(20deg)' }}/>
            </div>

            {/* Seat rows */}
            <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
              {Object.keys(seatsByRow).sort().map((row, rowIdx) => {
                const seats = seatsByRow[row].sort((a, b) => a.number - b.number);
                const rowCount = Object.keys(seatsByRow).length;
                // Slight perspective: front rows slightly narrower gap
                const gapPx = 4 + Math.min(rowIdx * 0.5, 3);
                return (
                  <div key={row} style={{ display:'flex', alignItems:'center', gap:gapPx }}>
                    <span style={{ width:22, textAlign:'right', color:activeZone.zoneColor, fontSize:'0.7rem', fontWeight:800, fontFamily:'Outfit', opacity:0.7, marginRight:4 }}>{row}</span>
                    <div style={{ display:'flex', gap:gapPx }}>
                      {seats.map(seat => {
                        const isSel = selectedSeats.some(s => s.id === seat.id);
                        const isAvail = seat.status === 'available';
                        const isHeld = seat.status === 'held';
                        const isBooked = seat.status === 'booked';

                        let bg, bd, clr, cur = 'not-allowed', shadow = 'none';
                        if (isSel) {
                          bg = `${activeZone.zoneColor}30`; bd = activeZone.zoneColor; clr = activeZone.zoneColor; cur = 'pointer';
                          shadow = `0 0 12px ${activeZone.zoneColor}50`;
                        } else if (isAvail) {
                          bg = 'rgba(255,255,255,0.04)'; bd = 'rgba(255,255,255,0.12)'; clr = '#777'; cur = 'pointer';
                        } else if (isHeld) {
                          bg = 'rgba(245,158,11,0.12)'; bd = '#F59E0B'; clr = '#F59E0B';
                        } else {
                          bg = 'rgba(0,0,0,0.3)'; bd = 'rgba(255,255,255,0.03)'; clr = '#2a2a2a';
                        }

                        return (
                          <div key={seat.id} onClick={() => isAvail && toggleSeat(seat)} title={`${seat.label} — ${isAvail?'Trống':isHeld?'Đang giữ':'Đã bán'}`}
                            style={{ width:30, height:30, borderRadius:6, background:bg, border:`1.5px solid ${bd}`, cursor:cur, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', color:clr, transition:'all 0.2s', transform:isSel?'scale(1.2)':'scale(1)', fontWeight:isSel?800:500, boxShadow:shadow, position:'relative' }}>
                            {isBooked ? '✕' : seat.number}
                            {/* Seat top decoration */}
                            {isAvail && !isSel && <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:2, borderRadius:'2px 2px 0 0', background:'rgba(255,255,255,0.08)' }}/>}
                          </div>
                        );
                      })}
                    </div>
                    <span style={{ width:22, textAlign:'left', color:activeZone.zoneColor, fontSize:'0.7rem', fontWeight:800, fontFamily:'Outfit', opacity:0.7, marginLeft:4 }}>{row}</span>
                  </div>
                );
              })}
            </div>

            {/* Legend inside grid */}
            <div style={{ display:'flex', gap:24, justifyContent:'center', marginTop:24, padding:'14px 0', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              {[
                { bg:'rgba(255,255,255,0.04)', bd:'rgba(255,255,255,0.12)', label:'Trống', text:'1' },
                { bg:`${activeZone.zoneColor}30`, bd:activeZone.zoneColor, label:'Đang chọn', text:'1' },
                { bg:'rgba(245,158,11,0.12)', bd:'#F59E0B', label:'Đang giữ', text:'1' },
                { bg:'rgba(0,0,0,0.3)', bd:'rgba(255,255,255,0.03)', label:'Đã bán', text:'✕' },
              ].map(l => (
                <div key={l.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:24, height:24, borderRadius:5, background:l.bg, border:`1.5px solid ${l.bd}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.55rem', color:l.bd==='#F59E0B'?'#F59E0B':(l.label==='Đã bán'?'#2a2a2a':'#777') }}>{l.text}</div>
                  <span style={{ fontSize:'0.78rem', color:'#888' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:18 }}>
            <button className="btn outline" style={{ fontSize:'0.85rem', padding:'10px 24px', borderRadius:100 }} onClick={() => setShowOverview(true)}>🏟️ Quay lại Sơ Đồ Khán Đài</button>
          </div>
        </>
      )}

      {selectedSeats.length > 0 && (
        <div style={{ position:'sticky', bottom:20, maxWidth:900, margin:'20px auto 0', background:'rgba(10,10,15,0.97)', backdropFilter:'blur(20px)', border:`1px solid ${activeZone.zoneColor}`, borderRadius:16, padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:`0 0 30px ${activeZone.zoneColor}30`, gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily:'Outfit', fontWeight:700, marginBottom: 4 }}>
              <span style={{ color: activeZone.zoneColor, fontSize:'1.1rem' }}>{selectedSeats.length}</span> ghế đã chọn — {activeZone.name}
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {selectedSeats.map(s => (
                <span key={s.id} style={{ background:`${activeZone.zoneColor}20`, border:`1px solid ${activeZone.zoneColor}50`, borderRadius:6, padding:'2px 8px', fontSize:'0.75rem', color:activeZone.zoneColor, fontWeight:700 }}>{s.label}</span>
              ))}
            </div>
            <div style={{ color:'var(--primary-color)', fontFamily:'Outfit', fontWeight:800, fontSize:'1.3rem', marginTop:4 }}>{(activeZone.price * selectedSeats.length).toLocaleString()} đ</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button className="btn outline" style={{ padding:'10px 16px', fontSize:'0.85rem', color:'#ff4444', borderColor:'#ff4444' }} onClick={() => setSelectedSeats([])}>Bỏ chọn</button>
            <button className="btn" style={{ padding:'12px 28px', fontSize:'0.95rem' }} onClick={handleHoldSeats} disabled={holding}>
              {holding ? '⌛ Đang giữ...' : `🎟️ Giữ ${selectedSeats.length} ghế & Thanh toán`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
