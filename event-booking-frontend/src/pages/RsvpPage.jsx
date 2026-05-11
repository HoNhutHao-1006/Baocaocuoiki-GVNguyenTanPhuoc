import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';

export default function RsvpPage({ eventId }) {
  const [event, setEvent] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dietary, setDietary] = useState('');
  const [plusOnes, setPlusOnes] = useState(0);

  useEffect(() => {
    fetchGraphQL(`query Get($id: ID!) { getEventDetail(id: $id) { title date location coverImg } }`, { id: eventId })
      .then(d => setEvent(d.getEventDetail));
  }, [eventId]);

  const submitRSVP = async (e) => {
    e.preventDefault();
    if (!name || !phone) return alert("Vui lòng nhập tên và sđt!");
    try {
      await fetchGraphQL(
        `mutation Rsvp($e: String!, $n: String!, $p: String!, $s: String!, $d: String, $po: Int) { 
           submitRSVP(eventId: $e, name: $n, phone: $p, status: $s, dietary: $d, plusOnes: $po) { id } 
         }`,
        { e: eventId, n: name, p: phone, s: status, d: dietary, po: Number(plusOnes) }
      );
      alert("Cảm ơn bạn đã phản hồi thiệp mời!");
      window.location.href = '/';
    } catch (err) { alert(err.message); }
  };

  if (!event) return <div style={{ padding: 50, textAlign: 'center' }}>Đang tải thiệp mời...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'serif' }}>
      <div style={{ width: 600, background: '#fff', padding: '60px 40px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <p style={{ color: '#c4a77d', letterSpacing: 3, textTransform: 'uppercase', fontSize: 14 }}>Trân trọng kính mời</p>
        <h1 style={{ fontSize: '3rem', color: '#333', margin: '20px 0' }}>{event.title}</h1>
        <p style={{ color: '#666', fontSize: 18 }}>{new Date(event.date).toLocaleDateString()} | {event.location}</p>
        <div style={{ borderBottom: '1px solid #eee', margin: '30px 0' }}></div>
        <h3 style={{ color: '#333', marginBottom: 20 }}>Xác Nhận Tham Dự (RSVP)</h3>
        <form onSubmit={submitRSVP} style={{ textAlign: 'left', color: '#444' }}>
          <div className="form-group"><label>Họ và Tên *</label><input className="form-control" style={{ background: '#f9f9f9', color: '#000' }} value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="form-group"><label>Số điện thoại *</label><input className="form-control" style={{ background: '#f9f9f9', color: '#000' }} value={phone} onChange={e => setPhone(e.target.value)} required /></div>
          <div className="form-group">
            <label>Xác nhận tham gia?</label>
            <select className="form-control" style={{ background: '#f9f9f9', color: '#000' }} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Pending">Chưa quyết định</option>
              <option value="Confirmed">Có, tôi sẽ đến chung vui!</option>
              <option value="Declined">Rất tiếc, tôi không thể tham dự</option>
            </select>
          </div>
          <button className="btn" type="submit" style={{ width: '100%', background: '#c4a77d', color: '#fff', fontSize: 18, marginTop: 20 }}>GỬI PHẢN HỒI RSVP</button>
        </form>
      </div>
    </div>
  );
}
