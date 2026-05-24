import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';

const EVENT_CATEGORIES = [
  { value: 'Concert', label: '🎵 Concert', icon: '🎵' },
  { value: 'Wedding', label: '💒 Đám cưới', icon: '💒' },
  { value: 'Workshop', label: '📚 Workshop', icon: '📚' },
  { value: 'TeamBuilding', label: '🏕️ Team Building', icon: '🏕️' },
  { value: 'Conference', label: '🎤 Hội thảo', icon: '🎤' },
  { value: 'Birthday', label: '🎂 Sinh nhật', icon: '🎂' },
  { value: 'Sports', label: '⚽ Thể thao', icon: '⚽' },
  { value: 'Exhibition', label: '🎨 Triển lãm', icon: '🎨' },
];

const STEPS = [
  { id: 1, title: 'Thông tin cơ bản', icon: '🏷️' },
  { id: 2, title: 'Hậu cần & Thời gian', icon: '📍' },
  { id: 3, title: 'Vé & RSVP', icon: '🎫' },
  { id: 4, title: 'Nội dung & Nhân sự', icon: '👥' },
  { id: 5, title: 'Tài chính', icon: '💰' },
];

const WEDDING_STEPS = [
  { id: 1, title: 'Thông tin Cặp đôi', icon: '💕' },
  { id: 2, title: 'Hậu cần Đám cưới', icon: '📍' },
  { id: 3, title: 'RSVP & Thực đơn', icon: '🍽️' },
  { id: 4, title: 'Chỗ ngồi & Quà tặng', icon: '🎁' },
  { id: 5, title: 'Tài chính', icon: '💰' },
];

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #444', background: '#111', color: '#fff', fontSize: '0.88rem', fontFamily: 'Outfit', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.78rem', color: '#00F0FF', fontWeight: 600, display: 'block', marginBottom: 5 };
const sectionStyle = { marginBottom: 16 };

export default function EventProposalWizard({ onClose, onSubmit, currentUser }) {
  const [step, setStep] = useState(0); // 0 = choose type
  const [category, setCategory] = useState('');
  const [locations, setLocations] = useState([]);
  const [dateConflict, setDateConflict] = useState(null);
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [showLocationRequest, setShowLocationRequest] = useState(false);
  const [locReqForm, setLocReqForm] = useState({ name: '', address: '', reason: '' });
  const [form, setForm] = useState({
    // Step 1 - Basic
    title: '', description: '', eventType: 'PUBLIC', coverImg: '',
    // Step 2 - Logistics
    expectedDate: '', endDate: '', startTime: '', endTime: '', expectedLocation: '', locationType: 'offline', onlineLink: '', timeline: '',
    // Step 3 - Tickets/RSVP
    ticketTiers: '', rsvpQuestions: '', rsvpDeadline: '',
    // Step 4 - Content
    speakers: '', documents: '', services: '',
    // Step 5 - Finance
    budget: '', bankInfo: '', couponCode: '', couponDiscount: '',
    // Wedding specific
    brideName: '', groomName: '', loveStory: '', ceremonyAddress: '', ceremonyTime: '', receptionVenue: '', weddingTimeline: '', guestGroups: '', dietaryOptions: '', tableCount: '', seatsPerTable: '', giftRegistry: '', bankQR: '',
  });

  useEffect(() => {
    fetchGraphQL(`query { getAllLocations { id name address capacity } }`)
      .then(r => setLocations(r.getAllLocations || []))
      .catch(() => {});
  }, []);

  // Check date conflict when date or location changes
  useEffect(() => {
    if (form.expectedDate && form.expectedLocation) {
      setCheckingConflict(true);
      fetchGraphQL(`query { checkEventDateConflict(date: "${form.expectedDate}", location: "${form.expectedLocation}") { hasConflict conflictingEvents { title date location } } }`)
        .then(r => { setDateConflict(r.checkEventDateConflict); setCheckingConflict(false); })
        .catch(() => setCheckingConflict(false));
    } else { setDateConflict(null); }
  }, [form.expectedDate, form.expectedLocation]);

  const handleLocationRequest = async () => {
    if (!locReqForm.name) return alert('Vui lòng nhập tên địa điểm!');
    try {
      const memberId = currentUser?.id || '';
      await fetchGraphQL(`mutation M($memberId: ID!, $type: String!, $subject: String!, $content: String!) { createAdminRequest(memberId: $memberId, type: $type, subject: $subject, content: $content) { id } }`,
        { memberId, type: 'location_request', subject: `Yêu cầu thêm địa điểm: ${locReqForm.name}`, content: `Tên: ${locReqForm.name}\nĐịa chỉ: ${locReqForm.address}\nLý do: ${locReqForm.reason}` });
      alert('✅ Đã gửi yêu cầu thêm địa điểm mới cho Admin!');
      setShowLocationRequest(false);
      setLocReqForm({ name: '', address: '', reason: '' });
    } catch (err) { alert(err.message); }
  };

  const set = (k, v) => setForm({ ...form, [k]: v });
  const isWedding = category === 'Wedding';
  const steps = isWedding ? WEDDING_STEPS : STEPS;

  const handleSubmit = () => {
    const data = {
      title: form.title, description: form.description, eventType: form.eventType,
      expectedDate: form.expectedDate, expectedLocation: form.expectedLocation,
      budget: Number(form.budget) || 0,
    };
    onSubmit(data);
  };

  // Step 0: Choose category
  if (step === 0) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 620, maxHeight: '85vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>🎉 Tạo Đề Xuất Sự Kiện</h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.88rem', marginBottom: 24 }}>Chọn loại hình sự kiện để bắt đầu</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {EVENT_CATEGORIES.map(c => (
            <div key={c.value} onClick={() => { setCategory(c.value); setStep(1); }}
              style={{ padding: '20px 12px', borderRadius: 14, border: category === c.value ? '2px solid #00F0FF' : '1px solid #333', background: category === c.value ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#00F0FF'}
              onMouseLeave={e => { if (category !== c.value) e.currentTarget.style.borderColor = '#333'; }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{c.label.split(' ').slice(1).join(' ')}</div>
            </div>
          ))}
        </div>
        <button className="btn outline" style={{ marginTop: 20, width: '100%' }} onClick={onClose}>Hủy</button>
      </div>
    </div>
  );

  const renderStep = () => {
    if (isWedding) {
      switch (step) {
        case 1: return (<>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={sectionStyle}><label style={labelStyle}>💒 Tên sự kiện *</label><input style={inputStyle} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="VD: Đám cưới Văn Lộc - Thanh Thư" /></div>
            <div style={sectionStyle}><label style={labelStyle}>📋 Phân loại</label><select style={inputStyle} value={form.eventType} onChange={e => set('eventType', e.target.value)}><option value="PUBLIC">Công khai</option><option value="PRIVATE">Riêng tư</option></select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={sectionStyle}><label style={labelStyle}>👰 Họ tên Cô dâu *</label><input style={inputStyle} value={form.brideName} onChange={e => set('brideName', e.target.value)} placeholder="Nguyễn Thị Thanh Thư" /></div>
            <div style={sectionStyle}><label style={labelStyle}>🤵 Họ tên Chú rể *</label><input style={inputStyle} value={form.groomName} onChange={e => set('groomName', e.target.value)} placeholder="Trần Văn Lộc" /></div>
          </div>
          <div style={sectionStyle}><label style={labelStyle}>💕 Câu chuyện tình yêu</label><textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.loveStory} onChange={e => set('loveStory', e.target.value)} placeholder="Kể về hành trình từ lúc quen nhau đến khi kết hôn..." /></div>
          <div style={sectionStyle}><label style={labelStyle}>📝 Mô tả sự kiện *</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} required value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mục đích, thông điệp gửi đến khách mời..." /></div>
          <div style={sectionStyle}><label style={labelStyle}>🖼️ Ảnh bìa (URL)</label><input style={inputStyle} value={form.coverImg} onChange={e => set('coverImg', e.target.value)} placeholder="Link ảnh pre-wedding hoặc banner" /></div>
        </>);
        case 2: return (<>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,0,229,0.05)', border: '1px solid rgba(255,0,229,0.15)', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: '#FF00E5', fontSize: '0.85rem', marginBottom: 10 }}>🏠 Lễ Gia Tiên</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={sectionStyle}><label style={labelStyle}>📍 Địa chỉ nhà trai/gái</label><input style={inputStyle} value={form.ceremonyAddress} onChange={e => set('ceremonyAddress', e.target.value)} /></div>
              <div style={sectionStyle}><label style={labelStyle}>⏰ Thời gian làm lễ</label><input type="time" style={inputStyle} value={form.ceremonyTime} onChange={e => set('ceremonyTime', e.target.value)} /></div>
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.15)', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: '#00F0FF', fontSize: '0.85rem', marginBottom: 10 }}>🎊 Tiệc Cưới</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={sectionStyle}><label style={labelStyle}>📅 Ngày cưới *</label><input type="date" style={inputStyle} required value={form.expectedDate} onChange={e => set('expectedDate', e.target.value)} /></div>
              <div style={sectionStyle}><label style={labelStyle}>🏛️ Tên sảnh tiệc</label><input style={inputStyle} value={form.receptionVenue} onChange={e => set('receptionVenue', e.target.value)} placeholder="VD: Sảnh Diamond, GEM Center" /></div>
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>📍 Địa điểm *</label>
              <select style={inputStyle} required value={form.expectedLocation} onChange={e => set('expectedLocation', e.target.value)}>
                <option value="">-- Chọn địa điểm --</option>
                {locations.map(loc => (<option key={loc.id} value={loc.name}>{loc.name} {loc.address ? `(${loc.address})` : ''}</option>))}
              </select>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Không tìm thấy?</span>
                <button type="button" onClick={() => setShowLocationRequest(true)} style={{ background: 'none', border: '1px solid rgba(0,240,255,0.3)', color: '#00F0FF', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Outfit' }}>+ Yêu cầu mới</button>
              </div>
            </div>
          </div>
          {dateConflict && dateConflict.hasConflict && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#EF4444', fontSize: '0.85rem' }}>⚠️ Trùng lịch!</div>
              {dateConflict.conflictingEvents.map((e, i) => (<div key={i} style={{ fontSize: '0.82rem', color: '#ff8888' }}>• "{e.title}" — {e.date}</div>))}
            </div>
          )}
          <div style={sectionStyle}><label style={labelStyle}>📋 Lịch trình (Timeline)</label><textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={form.weddingTimeline} onChange={e => set('weddingTimeline', e.target.value)} placeholder="17:30 Đón khách → 19:00 Lễ chính → 19:30 Nhập tiệc → 21:00 Tiệc tàn" /></div>
        </>);
        case 3: return (<>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: '#10B981', fontSize: '0.85rem', marginBottom: 10 }}>📋 Cấu hình RSVP</div>
            <div style={sectionStyle}><label style={labelStyle}>👥 Nhóm khách mời</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.guestGroups} onChange={e => set('guestGroups', e.target.value)} placeholder="Họ nội, Họ ngoại, Bạn đại học, Đồng nghiệp..." /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={sectionStyle}><label style={labelStyle}>📅 Hạn chót xác nhận</label><input type="date" style={inputStyle} value={form.rsvpDeadline} onChange={e => set('rsvpDeadline', e.target.value)} /></div>
              <div style={sectionStyle}><label style={labelStyle}>🍽️ Yêu cầu ăn uống</label><input style={inputStyle} value={form.dietaryOptions} onChange={e => set('dietaryOptions', e.target.value)} placeholder="Chay, dị ứng đậu phộng, hải sản..." /></div>
            </div>
          </div>
          <div style={sectionStyle}><label style={labelStyle}>❓ Câu hỏi RSVP thêm</label><textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={form.rsvpQuestions} onChange={e => set('rsvpQuestions', e.target.value)} placeholder="Cần hỗ trợ xe đưa đón? Có trẻ em đi cùng?" /></div>
        </>);
        case 4: return (<>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={sectionStyle}><label style={labelStyle}>🍽️ Số bàn tiệc</label><input type="number" style={inputStyle} value={form.tableCount} onChange={e => set('tableCount', e.target.value)} placeholder="VD: 30" /></div>
            <div style={sectionStyle}><label style={labelStyle}>💺 Số ghế/bàn</label><input type="number" style={inputStyle} value={form.seatsPerTable} onChange={e => set('seatsPerTable', e.target.value)} placeholder="VD: 10" /></div>
          </div>
          <div style={sectionStyle}><label style={labelStyle}>🎁 Danh sách quà tặng (Gift Registry)</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.giftRegistry} onChange={e => set('giftRegistry', e.target.value)} placeholder="Máy pha cà phê, lò vi sóng, bộ chăn ga..." /></div>
          <div style={sectionStyle}><label style={labelStyle}>🎶 Dịch vụ cần thuê</label><textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={form.services} onChange={e => set('services', e.target.value)} placeholder="Âm thanh, ánh sáng, quay phim, chụp ảnh, MC..." /></div>
        </>);
        default: return null;
      }
    } else {
      switch (step) {
        case 1: return (<>
          <div style={sectionStyle}><label style={labelStyle}>🏷️ Tên sự kiện *</label><input style={inputStyle} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="VD: Hội thảo AI 2026" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={sectionStyle}><label style={labelStyle}>📋 Loại hình</label>
              <select style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}>
                {EVENT_CATEGORIES.filter(c => c.value !== 'Wedding').map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div style={sectionStyle}><label style={labelStyle}>🔒 Phân loại</label><select style={inputStyle} value={form.eventType} onChange={e => set('eventType', e.target.value)}><option value="PUBLIC">Công khai</option><option value="PRIVATE">Riêng tư</option></select></div>
          </div>
          <div style={sectionStyle}><label style={labelStyle}>📝 Mô tả sự kiện *</label><textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} required value={form.description} onChange={e => set('description', e.target.value)} placeholder="Nội dung tóm tắt, mục đích và thông điệp..." /></div>
          <div style={sectionStyle}><label style={labelStyle}>🖼️ Ảnh đại diện (URL)</label><input style={inputStyle} value={form.coverImg} onChange={e => set('coverImg', e.target.value)} placeholder="Link ảnh banner/cover" /></div>
        </>);
        case 2: return (<>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={sectionStyle}><label style={labelStyle}>📅 Ngày bắt đầu *</label><input type="date" style={inputStyle} required value={form.expectedDate} onChange={e => set('expectedDate', e.target.value)} /></div>
            <div style={sectionStyle}><label style={labelStyle}>📅 Ngày kết thúc</label><input type="date" style={inputStyle} value={form.endDate} onChange={e => set('endDate', e.target.value)} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={sectionStyle}><label style={labelStyle}>⏰ Giờ bắt đầu</label><input type="time" style={inputStyle} value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
            <div style={sectionStyle}><label style={labelStyle}>⏰ Giờ kết thúc</label><input type="time" style={inputStyle} value={form.endTime} onChange={e => set('endTime', e.target.value)} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div style={sectionStyle}>
              <label style={labelStyle}>📍 Địa điểm *</label>
              <select style={inputStyle} required value={form.expectedLocation} onChange={e => set('expectedLocation', e.target.value)}>
                <option value="">-- Chọn địa điểm --</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.name}>{loc.name} {loc.address ? `(${loc.address})` : ''} {loc.capacity ? `— ${loc.capacity} chỗ` : ''}</option>
                ))}
              </select>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Không tìm thấy?</span>
                <button type="button" onClick={() => setShowLocationRequest(true)} style={{ background: 'none', border: '1px solid rgba(0,240,255,0.3)', color: '#00F0FF', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Outfit' }}>+ Yêu cầu địa điểm mới</button>
              </div>
            </div>
            <div style={sectionStyle}><label style={labelStyle}>🌐 Hình thức</label>
              <select style={inputStyle} value={form.locationType} onChange={e => set('locationType', e.target.value)}>
                <option value="offline">Trực tiếp</option><option value="online">Trực tuyến</option><option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          {dateConflict && dateConflict.hasConflict && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: '#EF4444', fontSize: '0.85rem', marginBottom: 4 }}>⚠️ Trùng lịch sự kiện!</div>
              {dateConflict.conflictingEvents.map((e, i) => (
                <div key={i} style={{ fontSize: '0.82rem', color: '#ff8888' }}>• "{e.title}" — {e.date} tại {e.location}</div>
              ))}
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 4 }}>Vui lòng chọn ngày hoặc địa điểm khác.</div>
            </div>
          )}
          {checkingConflict && <div style={{ fontSize: '0.82rem', color: '#F59E0B', marginBottom: 10 }}>⏳ Đang kiểm tra trùng lịch...</div>}
          {form.expectedDate && form.expectedLocation && !dateConflict?.hasConflict && !checkingConflict && (
            <div style={{ fontSize: '0.82rem', color: '#10B981', marginBottom: 10 }}>✅ Không có sự kiện trùng lịch tại địa điểm này.</div>
          )}
          {(form.locationType === 'online' || form.locationType === 'hybrid') && (
            <div style={sectionStyle}><label style={labelStyle}>🔗 Link trực tuyến</label><input style={inputStyle} value={form.onlineLink} onChange={e => set('onlineLink', e.target.value)} placeholder="Zoom, Google Meet..." /></div>
          )}
          <div style={sectionStyle}><label style={labelStyle}>📋 Lịch trình chi tiết</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="08:00 Đón khách → 09:00 Khai mạc → 12:00 Nghỉ trưa..." /></div>
        </>);
        case 3: return (<>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.15)', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: '#00F0FF', fontSize: '0.85rem', marginBottom: 10 }}>🎫 Cấu hình Vé</div>
            <div style={sectionStyle}><label style={labelStyle}>Các loại vé (mỗi dòng 1 loại)</label><textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={form.ticketTiers} onChange={e => set('ticketTiers', e.target.value)} placeholder={"VIP - 2,000,000đ - 50 vé\nGA - 500,000đ - 200 vé\nEarly Bird - 350,000đ - 100 vé"} /></div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ fontWeight: 700, color: '#10B981', fontSize: '0.85rem', marginBottom: 10 }}>📋 Cấu hình RSVP</div>
            <div style={sectionStyle}><label style={labelStyle}>❓ Câu hỏi xác nhận</label><textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={form.rsvpQuestions} onChange={e => set('rsvpQuestions', e.target.value)} placeholder="Bạn có tham gia? Có đi cùng ai? Yêu cầu đặc biệt?" /></div>
            <div style={sectionStyle}><label style={labelStyle}>📅 Hạn chót phản hồi</label><input type="date" style={inputStyle} value={form.rsvpDeadline} onChange={e => set('rsvpDeadline', e.target.value)} /></div>
          </div>
        </>);
        case 4: return (<>
          <div style={sectionStyle}><label style={labelStyle}>🎤 Diễn giả / Nghệ sĩ</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.speakers} onChange={e => set('speakers', e.target.value)} placeholder={"Họ tên - Chức danh - Tiểu sử ngắn\nVD: Nguyễn Văn A - CEO ABC - Chuyên gia AI..."} /></div>
          <div style={sectionStyle}><label style={labelStyle}>📄 Tài liệu sự kiện</label><textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={form.documents} onChange={e => set('documents', e.target.value)} placeholder="Slide thuyết trình, PDF tài liệu, Kịch bản MC..." /></div>
          <div style={sectionStyle}><label style={labelStyle}>🔧 Dịch vụ cần thuê</label><textarea style={{ ...inputStyle, minHeight: 50, resize: 'vertical' }} value={form.services} onChange={e => set('services', e.target.value)} placeholder="Âm thanh, ánh sáng, quay phim, chụp ảnh, MC..." /></div>
        </>);
        default: return null;
      }
    }
  };

  // Step 5 (Finance) is same for both
  const renderFinance = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={sectionStyle}><label style={labelStyle}>💰 Ngân sách tổng (VNĐ) *</label><input type="number" style={inputStyle} value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="50,000,000" /></div>
        <div style={sectionStyle}><label style={labelStyle}>🏦 Thông tin ngân hàng</label><input style={inputStyle} value={form.bankInfo} onChange={e => set('bankInfo', e.target.value)} placeholder="STK - Ngân hàng - Chủ TK" /></div>
      </div>
      {isWedding && (
        <div style={sectionStyle}><label style={labelStyle}>📱 Mã QR mừng cưới (URL)</label><input style={inputStyle} value={form.bankQR} onChange={e => set('bankQR', e.target.value)} placeholder="Link ảnh mã QR" /></div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={sectionStyle}><label style={labelStyle}>🎟️ Mã giảm giá</label><input style={inputStyle} value={form.couponCode} onChange={e => set('couponCode', e.target.value)} placeholder="VD: EARLY20" /></div>
        <div style={sectionStyle}><label style={labelStyle}>📉 Mức chiết khấu (%)</label><input type="number" style={inputStyle} min={0} max={100} value={form.couponDiscount} onChange={e => set('couponDiscount', e.target.value)} placeholder="20" /></div>
      </div>
    </>
  );

  const currentStepData = steps[step - 1];

  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 680, maxHeight: '88vh', overflowY: 'auto', padding: 0 }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #333', background: 'linear-gradient(135deg, rgba(0,240,255,0.05), rgba(255,0,229,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 28 }}>{isWedding ? '💒' : '🎉'}</div>
            <div>
              <h2 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem' }}>Đề Xuất Sự Kiện - {EVENT_CATEGORIES.find(c => c.value === category)?.label}</h2>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>Bước {step}/5 • {currentStepData?.title}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {steps.map((s, i) => (
              <div key={i} onClick={() => setStep(i + 1)} style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ height: 4, borderRadius: 2, background: i + 1 <= step ? 'linear-gradient(90deg, #00F0FF, #FF00E5)' : '#333', transition: 'all 0.3s', marginBottom: 6 }} />
                <div style={{ fontSize: '0.65rem', color: i + 1 <= step ? '#00F0FF' : '#666' }}>{s.icon} {s.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '20px 28px' }}>
          {step === 5 ? renderFinance() : renderStep()}
        </div>
        <div style={{ padding: '14px 28px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <button className="btn outline" onClick={() => step === 1 ? setStep(0) : setStep(step - 1)} style={{ padding: '8px 20px' }}>
            ← {step === 1 ? 'Chọn lại' : 'Quay lại'}
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn outline" onClick={onClose} style={{ padding: '8px 16px' }}>Hủy</button>
            {step < 5 ? (
              <button className="btn" onClick={() => setStep(step + 1)} style={{ padding: '8px 24px' }}>Tiếp theo →</button>
            ) : (
              <button className="btn" onClick={handleSubmit} style={{ padding: '8px 24px', background: 'linear-gradient(135deg, #10B981, #059669)' }}>✅ Gửi đề xuất</button>
            )}
          </div>
        </div>
      </div>
    </div>

    {showLocationRequest && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowLocationRequest(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#111118', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 16, padding: 28, width: 440 }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: 16, color: '#00F0FF' }}>📍 Yêu cầu thêm địa điểm mới</h3>
          <div style={sectionStyle}><label style={labelStyle}>Tên địa điểm *</label><input style={inputStyle} value={locReqForm.name} onChange={e => setLocReqForm({...locReqForm, name: e.target.value})} placeholder="VD: Trung tâm Hội nghị ABC" /></div>
          <div style={sectionStyle}><label style={labelStyle}>Địa chỉ</label><input style={inputStyle} value={locReqForm.address} onChange={e => setLocReqForm({...locReqForm, address: e.target.value})} placeholder="Số nhà, đường, quận..." /></div>
          <div style={sectionStyle}><label style={labelStyle}>Lý do yêu cầu</label><textarea style={{...inputStyle, minHeight: 60, resize: 'vertical'}} value={locReqForm.reason} onChange={e => setLocReqForm({...locReqForm, reason: e.target.value})} placeholder="Tại sao cần địa điểm này..." /></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" onClick={handleLocationRequest}>📨 Gửi yêu cầu</button>
            <button className="btn outline" onClick={() => setShowLocationRequest(false)}>Hủy</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
