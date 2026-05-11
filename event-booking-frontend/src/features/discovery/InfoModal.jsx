import React from 'react';
import { X, ChevronRight, Phone, Mail, MapPin, Clock } from 'lucide-react';

const INFO_PAGES = {
  'guide': {
    title: '📖 Hướng Dẫn Mua Vé',
    content: () => (
      <>
        <p style={{ color: '#aaa', lineHeight: 1.8, marginBottom: 30 }}>Chào mừng bạn đến với Lumina! Dưới đây là hướng dẫn chi tiết các bước mua vé sự kiện trên nền tảng của chúng tôi.</p>
        
        {[
          { step: 1, title: 'Đăng ký / Đăng nhập tài khoản', desc: 'Tạo tài khoản mới hoặc đăng nhập với tài khoản có sẵn. Bạn cần tài khoản MEMBER để có thể đặt vé.', icon: '👤' },
          { step: 2, title: 'Tìm kiếm sự kiện yêu thích', desc: 'Sử dụng thanh tìm kiếm hoặc bộ lọc danh mục để tìm sự kiện phù hợp. Bạn có thể lọc theo tên, địa điểm hoặc ngày.', icon: '🔍' },
          { step: 3, title: 'Xem chi tiết sự kiện & Chọn ghế', desc: 'Nhấn vào sự kiện để xem thông tin chi tiết. Với sự kiện âm nhạc, bạn sẽ thấy sơ đồ sân khấu và chọn khu vực/ghế ngồi mong muốn.', icon: '🪑' },
          { step: 4, title: 'Giữ ghế & Thanh toán', desc: 'Sau khi chọn ghế, hệ thống sẽ giữ ghế cho bạn trong 10 phút. Quét mã QR VietQR để thanh toán qua ngân hàng Vietcombank.', icon: '💳' },
          { step: 5, title: 'Nhận vé điện tử QR', desc: 'Sau khi thanh toán thành công, vé QR điện tử sẽ được lưu vào mục "Tủ Vé" của bạn. Xuất trình QR code tại cổng check-in sự kiện.', icon: '🎟️' },
        ].map(s => (
          <div key={s.step} style={{ display: 'flex', gap: 20, marginBottom: 24, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.05))', border: '1px solid rgba(0,240,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>
                <span style={{ color: 'var(--primary-color)', marginRight: 8 }}>Bước {s.step}</span>{s.title}
              </div>
              <p style={{ color: '#888', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>{s.desc}</p>
            </div>
          </div>
        ))}

        <div style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 12, padding: 20, marginTop: 10 }}>
          <h4 style={{ color: 'var(--primary-color)', marginBottom: 10 }}>💡 Lưu ý quan trọng</h4>
          <ul style={{ color: '#888', lineHeight: 2, paddingLeft: 20, margin: 0, fontSize: '0.9rem' }}>
            <li>Mỗi tài khoản chỉ được giữ tối đa 1 ghế tại một thời điểm</li>
            <li>Phiên giữ ghế có hiệu lực trong 10 phút — vui lòng thanh toán trước khi hết thời gian</li>
            <li>Vé đã thanh toán không thể chuyển nhượng cho người khác</li>
            <li>Đến sự kiện sớm 30 phút để check-in thuận lợi</li>
          </ul>
        </div>
      </>
    )
  },

  'refund': {
    title: '🔄 Chính Sách Hoàn Vé',
    content: () => (
      <>
        <p style={{ color: '#aaa', lineHeight: 1.8, marginBottom: 30 }}>Lumina cam kết bảo vệ quyền lợi người mua vé. Dưới đây là chính sách hoàn vé chi tiết.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 30 }}>
          {[
            { time: 'Trước 7 ngày', pct: '100%', color: '#10B981', desc: 'Hoàn tiền toàn bộ' },
            { time: 'Trước 3-7 ngày', pct: '70%', color: '#F59E0B', desc: 'Hoàn 70% giá vé' },
            { time: 'Trước 1-3 ngày', pct: '50%', color: '#EF4444', desc: 'Hoàn 50% giá vé' },
            { time: 'Trong ngày', pct: '0%', color: '#666', desc: 'Không hoàn tiền' },
          ].map((r, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 900, color: r.color, marginBottom: 4 }}>{r.pct}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{r.time}</div>
              <div style={{ color: '#666', fontSize: '0.85rem' }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: 16 }}>📋 Quy trình hoàn vé</h3>
        <ol style={{ color: '#aaa', lineHeight: 2.2, paddingLeft: 20, fontSize: '0.92rem' }}>
          <li>Đăng nhập vào tài khoản Lumina → Vào mục <strong style={{ color: '#fff' }}>"Tủ Vé"</strong></li>
          <li>Chọn vé cần hoàn → Nhấn <strong style={{ color: '#fff' }}>"Yêu cầu hoàn vé"</strong></li>
          <li>Điền lý do hoàn vé và thông tin tài khoản ngân hàng nhận tiền</li>
          <li>Chờ xác nhận từ Ban Tổ Chức (trong vòng 24-48h)</li>
          <li>Tiền hoàn sẽ được chuyển trong <strong style={{ color: '#fff' }}>3-5 ngày làm việc</strong></li>
        </ol>

        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 20, marginTop: 20 }}>
          <h4 style={{ color: '#EF4444', marginBottom: 10 }}>⚠️ Trường hợp KHÔNG được hoàn vé</h4>
          <ul style={{ color: '#888', lineHeight: 2, paddingLeft: 20, margin: 0, fontSize: '0.9rem' }}>
            <li>Vé đã được check-in (quét QR) tại sự kiện</li>
            <li>Yêu cầu hoàn vé sau khi sự kiện đã diễn ra</li>
            <li>Vé mua bằng mã khuyến mãi 100% miễn phí</li>
            <li>Trường hợp nghi ngờ gian lận hoặc vi phạm điều khoản</li>
          </ul>
        </div>
      </>
    )
  },

  'contact': {
    title: '📞 Liên Hệ Ban Tổ Chức',
    content: () => (
      <>
        <p style={{ color: '#aaa', lineHeight: 1.8, marginBottom: 30 }}>Chúng tôi luôn sẵn sàng hỗ trợ bạn. Liên hệ qua các kênh dưới đây để được giải đáp nhanh nhất.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
          {[
            { icon: <Phone size={24} />, title: 'Hotline', value: '1900 8888 99', sub: 'Miễn phí cuộc gọi', color: '#10B981' },
            { icon: <Mail size={24} />, title: 'Email', value: 'support@tickethub.vn', sub: 'Phản hồi trong 24h', color: '#00F0FF' },
            { icon: <MapPin size={24} />, title: 'Văn phòng', value: '123 Nguyễn Huệ, Q.1, TP.HCM', sub: 'T2-T6: 8:00 - 17:30', color: '#8B5CF6' },
            { icon: <Clock size={24} />, title: 'Giờ hỗ trợ', value: '08:00 - 22:00', sub: 'Tất cả các ngày trong tuần', color: '#F59E0B' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <div style={{ color: c.color, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: '#888', marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>{c.value}</div>
              <div style={{ color: '#555', fontSize: '0.82rem' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: 16 }}>📨 Gửi Yêu Cầu Hỗ Trợ</h3>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input className="form-control" placeholder="Họ và tên" />
            <input className="form-control" placeholder="Email liên hệ" />
          </div>
          <input className="form-control" placeholder="Tiêu đề" style={{ marginBottom: 12 }} />
          <textarea className="form-control" placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." rows={4} style={{ resize: 'vertical', marginBottom: 16 }} />
          <button className="btn" style={{ padding: '12px 30px' }}>📨 Gửi yêu cầu</button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
          {[
            { label: 'Facebook', href: 'https://facebook.com', bg: '#4267B2' },
            { label: 'Zalo', href: 'https://zalo.me', bg: '#0068FF' },
            { label: 'Instagram', href: 'https://instagram.com', bg: 'linear-gradient(45deg,#f09433,#dc2743,#bc1888)' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ background: s.bg, color: '#fff', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>{s.label}</a>
          ))}
        </div>
      </>
    )
  },

  'faq': {
    title: '❓ Câu Hỏi Thường Gặp (FAQ)',
    content: () => {
      const faqs = [
        { q: 'Làm sao để mua vé trên Lumina?', a: 'Đăng ký tài khoản MEMBER → Tìm sự kiện → Chọn ghế → Thanh toán qua VietQR. Vé QR sẽ được lưu trong Tủ Vé của bạn.' },
        { q: 'Tôi có thể mua nhiều vé cùng lúc không?', a: 'Hiện tại mỗi lần giao dịch bạn chỉ mua được 1 vé. Để mua thêm, vui lòng hoàn tất thanh toán vé hiện tại rồi chọn vé tiếp theo.' },
        { q: 'Phiên giữ ghế kéo dài bao lâu?', a: 'Phiên giữ ghế có hiệu lực trong 10 phút. Nếu không thanh toán trong thời gian này, ghế sẽ được trả lại cho người khác.' },
        { q: 'Thanh toán bằng phương thức nào?', a: 'Lumina hỗ trợ thanh toán qua QR Code ngân hàng (VietQR) — hỗ trợ tất cả ngân hàng tại Việt Nam. Quét mã QR bằng app ngân hàng để thanh toán.' },
        { q: 'Vé điện tử sử dụng như thế nào?', a: 'Vé QR điện tử được lưu trong mục "Tủ Vé". Khi đến sự kiện, xuất trình QR code cho nhân viên check-in quét xác nhận tại cổng vào.' },
        { q: 'Tôi có thể chuyển nhượng vé cho người khác không?', a: 'Hiện tại Lumina chưa hỗ trợ chuyển nhượng vé. Vé được gắn với tài khoản người mua.' },
        { q: 'Sự kiện bị hủy thì sao?', a: 'Nếu sự kiện bị hủy bởi Ban Tổ Chức, bạn sẽ được hoàn tiền 100% trong vòng 5-7 ngày làm việc.' },
        { q: 'Tôi muốn tổ chức sự kiện riêng thì làm sao?', a: 'Đăng nhập với tài khoản MEMBER → Vào mục "Đề xuất sự kiện" → Điền thông tin và gửi yêu cầu. Admin sẽ duyệt trong 24-48h.' },
      ];
      return (
        <>
          <p style={{ color: '#aaa', lineHeight: 1.8, marginBottom: 30 }}>Tổng hợp các câu hỏi thường gặp từ khách hàng. Nếu không tìm thấy câu trả lời, hãy liên hệ đội ngũ hỗ trợ.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </>
      );
    }
  },

  'terms': {
    title: '📜 Điều Khoản Sử Dụng',
    content: () => (
      <>
        <p style={{ color: '#aaa', lineHeight: 1.8, marginBottom: 24 }}>Cập nhật lần cuối: <strong style={{ color: '#fff' }}>01/01/2026</strong></p>

        {[
          { title: '1. Điều khoản chung', items: [
            'Lumina là nền tảng trung gian kết nối Ban Tổ Chức sự kiện với người mua vé.',
            'Khi sử dụng dịch vụ, bạn đồng ý tuân thủ toàn bộ điều khoản dưới đây.',
            'Lumina có quyền thay đổi điều khoản bất cứ lúc nào với thông báo trước 7 ngày.',
          ]},
          { title: '2. Tài khoản người dùng', items: [
            'Người dùng phải cung cấp thông tin chính xác khi đăng ký tài khoản.',
            'Mỗi cá nhân chỉ được sở hữu 1 tài khoản trên hệ thống.',
            'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.',
            'Lumina có quyền khóa tài khoản nếu phát hiện vi phạm.',
          ]},
          { title: '3. Mua bán vé', items: [
            'Giá vé được niêm yết bởi Ban Tổ Chức và có thể thay đổi trước khi sự kiện diễn ra.',
            'Vé đã thanh toán được xác nhận bằng mã QR duy nhất, không thể sao chép.',
            'Nghiêm cấm mua vé với mục đích đầu cơ, bán lại giá cao (scalping).',
            'Lumina không chịu trách nhiệm về nội dung hoặc chất lượng sự kiện do BTC tổ chức.',
          ]},
          { title: '4. Thanh toán & Hoàn tiền', items: [
            'Thanh toán qua VietQR được xử lý bởi đối tác ngân hàng, đảm bảo an toàn tuyệt đối.',
            'Chính sách hoàn tiền áp dụng theo quy định tại mục "Chính sách hoàn vé".',
            'Trong trường hợp lỗi hệ thống, tiền sẽ được hoàn trong 24h làm việc.',
          ]},
          { title: '5. Quyền sở hữu trí tuệ', items: [
            'Toàn bộ giao diện, logo, mã nguồn thuộc sở hữu của Lumina EMS.',
            'Nghiêm cấm sao chép, phân phối hoặc sử dụng thương mại mà không có sự đồng ý.',
          ]},
          { title: '6. Giới hạn trách nhiệm', items: [
            'Lumina không chịu trách nhiệm thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ.',
            'Mọi tranh chấp sẽ được giải quyết theo pháp luật Việt Nam.',
            'Tòa án có thẩm quyền: Tòa án Nhân dân TP. Hồ Chí Minh.',
          ]},
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12, color: 'var(--primary-color)' }}>{section.title}</h3>
            <ul style={{ color: '#999', lineHeight: 2, paddingLeft: 20, margin: 0, fontSize: '0.92rem' }}>
              {section.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </>
    )
  }
};

function FaqItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{q}</span>
        <ChevronRight size={18} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, color: 'var(--primary-color)' }} />
      </div>
      {open && (
        <div style={{ padding: '0 20px 16px', color: '#888', lineHeight: 1.8, fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ marginTop: 12 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function InfoModal({ pageKey, onClose }) {
  const page = INFO_PAGES[pageKey];
  if (!page) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} />
      
      {/* Modal */}
      <div style={{ position: 'relative', width: '90%', maxWidth: 780, maxHeight: '85vh', background: 'var(--bg-main)', borderRadius: 24, border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 30px', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.4rem', margin: 0 }}>{page.title}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,0,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <X size={18} />
          </button>
        </div>
        
        {/* Body */}
        <div style={{ padding: '30px 30px', overflowY: 'auto', flex: 1 }}>
          {page.content()}
        </div>
      </div>
    </div>
  );
}
