import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../api/axiosClient';

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Helper to format date nicely
const formatEventDate = (dateStr) => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

// Helper for Google Calendar link
const getGoogleCalendarUrl = (title, dateStr, location, details) => {
  try {
    const d = new Date(dateStr);
    const start = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(d.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // 3 hour duration
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  } catch (e) {
    return '#';
  }
};

// Helper for Outlook Calendar link
const getOutlookCalendarUrl = (title, dateStr, location, details) => {
  try {
    const d = new Date(dateStr);
    const start = d.toISOString();
    const end = new Date(d.getTime() + 3 * 60 * 60 * 1000).toISOString();
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  } catch (e) {
    return '#';
  }
};

export default function RsvpPage({ eventId }) {
  const [event, setEvent] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Confirmed'); // Default to Confirmed
  const [dietary, setDietary] = useState('');
  const [plusOnes, setPlusOnes] = useState(0);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId || !isValidObjectId(eventId)) {
      setError("Mã thiệp mời (ID) không hợp lệ hoặc thiếu. Vui lòng kiểm tra lại liên kết trong email.");
      return;
    }

    fetchGraphQL(`query Get($id: ID!) { getEventDetail(id: $id) { id title date location coverImg description } }`, { id: eventId })
      .then(d => {
        if (d && d.getEventDetail) {
          setEvent(d.getEventDetail);
        } else {
          setError("Không tìm thấy thông tin sự kiện hoặc đề xuất tương ứng với mã này.");
        }
      })
      .catch(err => {
        setError(`Không thể kết nối đến máy chủ API: ${err.message}. Vui lòng kiểm tra kết nối mạng của thiết bị.`);
      });
  }, [eventId]);

  const submitRSVP = async (e) => {
    e.preventDefault();
    if (!name || !phone) return alert("Vui lòng nhập họ tên và số điện thoại!");
    setSubmitting(true);
    try {
      const response = await fetchGraphQL(
        `mutation Rsvp($e: String!, $n: String!, $p: String!, $s: String!, $d: String, $po: Int, $nt: String) { 
           submitRSVP(eventId: $e, name: $n, phone: $p, status: $s, dietary: $d, plusOnes: $po, note: $nt) { id status qrCode name plusOnes } 
         }`,
        { e: eventId, n: name, p: phone, s: status, d: dietary, po: Number(plusOnes), nt: note }
      );
      
      if (response && response.submitRSVP) {
        setSubmittedData({
          ...response.submitRSVP,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          status: status
        });
        setSubmitted(true);
      } else {
        alert("Có lỗi xảy ra khi gửi RSVP.");
      }
    } catch (err) { 
      alert(err.message); 
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: "'Be Vietnam Pro', 'Outfit', sans-serif" }}>
        <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '450px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '18px', fontWeight: 700 }}>Không Thể Tải Thiệp Mời</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: 1.6 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ width: '100%', padding: '12px', background: '#1e3c72', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2a5298'} onMouseLeave={e => e.currentTarget.style.background = '#1e3c72'}>
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: "'Be Vietnam Pro', 'Outfit', sans-serif" }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#1e3c72', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: 20, color: '#64748b', fontWeight: 500 }}>Đang tải thiệp mời...</p>
      </div>
    );
  }

  // Cover image fallback
  const coverUrl = event.coverImg || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600';

  if (submitted && submittedData) {
    const isConfirmed = submittedData.status === 'Confirmed';
    const calendarDetails = `Trân trọng kính mời bạn tham dự sự kiện: ${submittedData.eventTitle}.\nĐăng ký RSVP thành công.`;
    const googleCalUrl = getGoogleCalendarUrl(submittedData.eventTitle, submittedData.eventDate, submittedData.eventLocation, calendarDetails);
    const outlookCalUrl = getOutlookCalendarUrl(submittedData.eventTitle, submittedData.eventDate, submittedData.eventLocation, calendarDetails);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${submittedData.qrCode || 'N/A'}`;

    return (
      <div style={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: "'Be Vietnam Pro', 'Outfit', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '600px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          
          {/* Header Banner */}
          <div style={{ height: '140px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', textAlign: 'center', padding: '0 20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '1px' }}>LUMINA EMS</h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)', letterSpacing: '2px', textTransform: 'uppercase' }}>Xác Nhận Tham Dự</p>
          </div>

          <div style={{ padding: '40px 30px', textAlign: 'center' }}>
            {/* Success icon */}
            <div style={{ width: '72px', height: '72px', background: isConfirmed ? '#d1fae5' : '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <span style={{ fontSize: '32px' }}>{isConfirmed ? '🎉' : '✉️'}</span>
            </div>

            {/* Thank you message */}
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>
              {isConfirmed ? 'Xác Nhận Tham Dự Thành Công!' : 'Đã Gửi Phản Hồi Thành Công!'}
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, margin: '0 0 30px 0' }}>
              {isConfirmed 
                ? `Cảm ơn Anh/Chị ${submittedData.name} đã xác nhận tham dự sự kiện.`
                : `Rất tiếc vì Anh/Chị ${submittedData.name} không thể tham gia chung vui cùng chúng tôi lần này. Hẹn gặp lại Anh/Chị vào dịp khác!`
              }
            </p>

            {/* Event Summary Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', textAlign: 'left', margin: '0 0 30px 0' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1e3c72' }}>📍 Thông tin sự kiện</h3>
              <div style={{ fontSize: '15px', color: '#334155', fontWeight: 600, marginBottom: '12px' }}>{submittedData.eventTitle}</div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                <span>📅</span>
                <span>{formatEventDate(submittedData.eventDate)}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>📍</span>
                <span>{submittedData.eventLocation}</span>
              </div>
              {isConfirmed && submittedData.plusOnes > 0 && (
                <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#64748b', marginTop: '8px', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                  <span>👥</span>
                  <span>Khách đi cùng: +{submittedData.plusOnes} người</span>
                </div>
              )}
            </div>

            {/* QR Code Section (Only if Confirmed) */}
            {isConfirmed && (
              <div style={{ border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '24px', background: '#fff', margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={qrImageUrl} alt="Mã QR vé check-in" width="160" height="160" style={{ display: 'block', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '1px' }}>MÃ QR CHECK-IN CỦA BẠN</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', maxWidth: '280px', lineHeight: 1.4 }}>
                  Chụp lại màn hình để xuất trình mã này tại quầy đón tiếp để quét mã check-in.
                </div>
              </div>
            )}

            {/* Next step instruction */}
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 30px 0', lineHeight: 1.5 }}>
              💡 Chúng tôi cũng đã gửi thư xác nhận kèm thông tin này vào email của bạn. Vui lòng kiểm tra (kiểm tra cả mục Spam/Thư rác nếu không tìm thấy).
            </p>

            {/* Add to Calendar Section (Only if Confirmed) */}
            {isConfirmed && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', margin: '0 0 24px 0' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#475569', margin: '0 0 16px 0' }}>🗓️ Lưu sự kiện vào lịch cá nhân:</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <a href={googleCalUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', textDecoration: 'none', transition: 'all 0.2s' }}
                     onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
                    Google Calendar
                  </a>
                  <a href={outlookCalUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', textDecoration: 'none', transition: 'all 0.2s' }}
                     onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
                    Outlook
                  </a>
                </div>
              </div>
            )}

            {/* Back Button */}
            <button onClick={() => window.location.href = '/'} style={{ width: '100%', padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer', transition: 'all 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
              Về trang chủ Lumina EMS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', fontFamily: "'Be Vietnam Pro', 'Outfit', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '600px', background: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        
        {/* Event Cover Image Banner */}
        <div style={{ height: '220px', background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', color: '#fff' }}>
          <span style={{ background: '#1e3c72', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: '8px' }}>
            Thiệp mời sự kiện
          </span>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>{event.title}</h1>
        </div>

        {/* Content Area */}
        <div style={{ padding: '32px 30px' }}>
          
          {/* Event Quick Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '10px', fontSize: '15px', color: '#475569' }}>
              <span style={{ fontSize: '18px' }}>📅</span>
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Thời gian</strong>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{formatEventDate(event.date)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', fontSize: '15px', color: '#475569' }}>
              <span style={{ fontSize: '18px' }}>📍</span>
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Địa điểm</strong>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Event Description */}
          {event.description && (
            <div style={{ marginBottom: '28px', background: '#f8fafc', borderRadius: '12px', padding: '16px 20px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              <strong style={{ display: 'block', color: '#0f172a', marginBottom: '6px' }}>📝 Giới thiệu sự kiện:</strong>
              {event.description}
            </div>
          )}

          <div style={{ borderBottom: '1px solid #f1f5f9', margin: '24px 0' }}></div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 20px 0', textAlign: 'center' }}>👥 Xác Nhận Tham Dự (RSVP)</h3>
          
          <form onSubmit={submitRSVP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Họ và Tên *</label>
                <input style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#000', boxSizing: 'border-box' }} value={name} onChange={e => setName(e.target.value)} required placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Số điện thoại *</label>
                <input style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#000', boxSizing: 'border-box' }} value={phone} onChange={e => setPhone(e.target.value)} required placeholder="0901234567" />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Phản hồi của bạn *</label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#000', background: '#fff', boxSizing: 'border-box' }} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Confirmed">Có, tôi chắc chắn sẽ đến!</option>
                <option value="Declined">Rất tiếc, tôi không thể tham dự</option>
                <option value="Pending">Tôi chưa quyết định được</option>
              </select>
            </div>

            {status === 'Confirmed' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Số người đi kèm (nếu có)</label>
                    <input type="number" min={0} max={10} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#000', boxSizing: 'border-box' }} value={plusOnes} onChange={e => setPlusOnes(e.target.value)} />
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Nhập 0 nếu bạn đi một mình.</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Yêu cầu ăn uống đặc biệt / Dị ứng thực phẩm (nếu có)</label>
                  <input style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#000', boxSizing: 'border-box' }} value={dietary} onChange={e => setDietary(e.target.value)} placeholder="Ăn chay, dị ứng hải sản,..." />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Lời nhắn gửi ban tổ chức</label>
              <textarea style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', color: '#000', minHeight: '60px', resize: 'vertical', boxSizing: 'border-box' }} value={note} onChange={e => setNote(e.target.value)} placeholder="Tôi sẽ đến muộn một chút..." />
            </div>

            <button className="btn" type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', background: '#1e3c72', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', marginTop: '10px' }}
               onMouseEnter={e => e.currentTarget.style.background = '#2a5298'} onMouseLeave={e => e.currentTarget.style.background = '#1e3c72'}>
              {submitting ? 'ĐANG GỬI PHẢN HỒI...' : 'GỬI PHẢN HỒI RSVP'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
