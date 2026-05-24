import React from 'react';

const ds = { background:'#fff',color:'#1a1a1a',padding:'40px 50px',borderRadius:12,fontFamily:"'Times New Roman', serif",fontSize:'14px',lineHeight:1.8,maxHeight:'calc(80vh - 120px)',overflowY:'auto' };
const hs = { textAlign:'center',borderBottom:'2px solid #333',paddingBottom:20,marginBottom:30 };
const ss = { fontWeight:'bold',fontSize:'15px',textTransform:'uppercase',margin:'25px 0 10px',borderBottom:'1px solid #ccc',paddingBottom:5 };
const ts = { width:'100%',borderCollapse:'collapse',margin:'15px 0' };
const th = { border:'1px solid #666',padding:'8px 12px',background:'#f0f0f0',fontWeight:'bold',textAlign:'left',fontSize:'13px' };
const td = { border:'1px solid #999',padding:'8px 12px',fontSize:'13px' };

export function ServiceContract({ d }) {
  const no = `HĐ-${(d.id||'').slice(-6).toUpperCase()}`;
  const dt = d.createdAt ? new Date(d.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN');
  return (<div style={ds}>
    <div style={hs}>
      <div style={{fontSize:12,color:'#666'}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <div style={{fontSize:13,fontWeight:'bold'}}>Độc lập - Tự do - Hạnh phúc</div>
      <div style={{margin:'8px auto',width:80,borderBottom:'1px solid #333'}}/>
      <h2 style={{fontSize:20,margin:'15px 0 5px',color:'#1a1a1a'}}>HỢP ĐỒNG DỊCH VỤ TỔ CHỨC SỰ KIỆN</h2>
      <div style={{fontSize:13,color:'#555'}}>Số: {no} &nbsp;|&nbsp; Ngày: {dt}</div>
    </div>
    <div style={ss}>ĐIỀU 1: CÁC BÊN THAM GIA</div>
    <table style={ts}>
      <tbody>
        <tr><td style={{...th,width:'50%'}}>BÊN A (Khách hàng)</td><td style={{...th}}>BÊN B (Đơn vị tổ chức)</td></tr>
        <tr><td style={td}><b>Họ tên:</b> {d.memberName||'Chưa cập nhật'}<br/><b>Email:</b> {d.memberEmail||'N/A'}<br/><b>Điện thoại:</b> {d.memberPhone||'N/A'}</td>
        <td style={td}><b>Công ty:</b> Lumina EMS JSC<br/><b>Địa chỉ:</b> 123 Nguyễn Huệ, Q.1, TP.HCM<br/><b>MST:</b> 0123456789</td></tr>
      </tbody>
    </table>
    <div style={ss}>ĐIỀU 2: NỘI DUNG SỰ KIỆN</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>Tên sự kiện</td><td style={td}>{d.proposalTitle||d.eventTitle||'—'}</td></tr>
        <tr><td style={th}>Loại sự kiện</td><td style={td}>{d.proposalEventType==='PUBLIC'?'Công khai':'Riêng tư'}</td></tr>
        <tr><td style={th}>Ngày tổ chức</td><td style={td}>{d.proposalExpectedDate||'—'}</td></tr>
        <tr><td style={th}>Địa điểm</td><td style={td}>{d.proposalExpectedLocation||'—'}</td></tr>
        <tr><td style={th}>Mô tả</td><td style={td}>{d.proposalDescription||'—'}</td></tr>
      </tbody>
    </table>
    <div style={ss}>ĐIỀU 3: GIÁ TRỊ HỢP ĐỒNG & THANH TOÁN</div>
    <p><b>Tổng giá trị:</b> <span style={{color:'#c00',fontWeight:'bold',fontSize:16}}>{(d.totalAmount||0).toLocaleString()} VNĐ</span></p>
    <table style={ts}>
      <thead><tr><th style={th}>Đợt</th><th style={th}>Tỷ lệ</th><th style={th}>Số tiền</th><th style={th}>Thời hạn</th></tr></thead>
      <tbody>
        <tr><td style={td}>Đợt 1 - Đặt cọc</td><td style={td}>30%</td><td style={td}>{Math.round((d.totalAmount||0)*0.3).toLocaleString()} VNĐ</td><td style={td}>Khi ký hợp đồng</td></tr>
        <tr><td style={td}>Đợt 2</td><td style={td}>50%</td><td style={td}>{Math.round((d.totalAmount||0)*0.5).toLocaleString()} VNĐ</td><td style={td}>Trước sự kiện 7 ngày</td></tr>
        <tr><td style={td}>Đợt 3 - Quyết toán</td><td style={td}>20%</td><td style={td}>{Math.round((d.totalAmount||0)*0.2).toLocaleString()} VNĐ</td><td style={td}>Sau khi hoàn thành</td></tr>
      </tbody>
    </table>
    <div style={ss}>ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ</div>
    <p><b>Bên A:</b> Cung cấp thông tin đầy đủ, thanh toán đúng hạn, phối hợp với Bên B.</p>
    <p><b>Bên B:</b> Đảm bảo chất lượng dịch vụ, đúng tiến độ, bảo mật thông tin sự kiện.</p>
    <div style={ss}>ĐIỀU 5: BẤT KHẢ KHÁNG</div>
    <p>Trường hợp thiên tai, dịch bệnh, hỏa hoạn hoặc các sự kiện bất khả kháng khác, hai bên sẽ thương lượng để giải quyết và miễn trừ trách nhiệm cho bên bị ảnh hưởng.</p>
    <div style={ss}>ĐIỀU 6: GIẢI QUYẾT TRANH CHẤP</div>
    <p>Mọi tranh chấp phát sinh từ hợp đồng này sẽ được giải quyết thông qua thương lượng. Trường hợp không thành, sẽ đưa ra Tòa án Kinh tế có thẩm quyền tại TP.HCM.</p>
    <div style={ss}>ĐIỀU 7: ĐIỀU KHOẢN BẢO MẬT</div>
    <p>Hai bên cam kết bảo mật toàn bộ thông tin về sự kiện, đơn giá và các điều khoản hợp đồng. Mọi vi phạm sẽ bị xử lý theo pháp luật hiện hành.</p>
    <div style={{marginTop:50,display:'flex',justifyContent:'space-between'}}>
      <div style={{textAlign:'center',width:'45%'}}><b>ĐẠI DIỆN BÊN A</b><br/><i>(Ký, ghi rõ họ tên)</i><br/><br/><br/>{d.memberName||''}</div>
      <div style={{textAlign:'center',width:'45%'}}><b>ĐẠI DIỆN BÊN B</b><br/><i>(Ký, đóng dấu)</i><br/><br/><br/>Ban Quản Lý Lumina EMS</div>
    </div>
  </div>);
}

export function ContractAppendix({ d }) {
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>PHỤ LỤC HỢP ĐỒNG</h2>
      <div style={{fontSize:13,color:'#555'}}>BÁO GIÁ CHI TIẾT DỊCH VỤ TỔ CHỨC SỰ KIỆN</div>
      <div style={{fontSize:12,color:'#888',marginTop:5}}>Kèm theo Hợp đồng số: HĐ-{(d.id||'').slice(-6).toUpperCase()}</div>
    </div>
    <div style={ss}>I. THIẾT BỊ SỰ KIỆN</div>
    <table style={ts}>
      <thead><tr><th style={th}>STT</th><th style={th}>Hạng mục</th><th style={th}>SL</th><th style={th}>Đơn giá</th><th style={th}>Thành tiền</th></tr></thead>
      <tbody>
        {(d.devices||[]).map((dv,i)=>(<tr key={i}><td style={td}>{i+1}</td><td style={td}>{dv.name}</td><td style={td}>{dv.quantity||1}</td><td style={td}>{(dv.price||0).toLocaleString()}</td><td style={td}>{((dv.quantity||1)*(dv.price||0)).toLocaleString()}</td></tr>))}
        {(!d.devices||d.devices.length===0)&&<tr><td style={td} colSpan={5}>Sân khấu 8x6m, Màn hình LED P3, Âm thanh 5000W, Ánh sáng 200 bóng, Máy khói, Giàn khung Truss</td></tr>}
      </tbody>
    </table>
    <div style={ss}>II. DỊCH VỤ</div>
    <table style={ts}>
      <thead><tr><th style={th}>STT</th><th style={th}>Dịch vụ</th><th style={th}>Đơn giá</th></tr></thead>
      <tbody>
        {(d.services||[]).map((sv,i)=>(<tr key={i}><td style={td}>{i+1}</td><td style={td}>{sv.name} {sv.description?`- ${sv.description}`:''}</td><td style={td}>{(sv.price||0).toLocaleString()} VNĐ</td></tr>))}
        {(!d.services||d.services.length===0)&&<tr><td style={td} colSpan={3}>MC, Ca sĩ, Vũ đoàn, PG/PB, Bảo vệ, Êkip đạo diễn</td></tr>}
      </tbody>
    </table>
    <div style={ss}>III. TRANG TRÍ (DECOR)</div>
    <ul style={{paddingLeft:20}}>
      <li>Photo booth & Cổng chào</li><li>Hoa tươi & Nến trang trí</li><li>Thiết kế 2D/3D concept</li><li>Banner & Backdrop chính</li>
    </ul>
    <div style={ss}>IV. LƯU TRÚ & ẨM THỰC</div>
    <ul style={{paddingLeft:20}}>
      <li>Phòng khách VIP (theo yêu cầu)</li><li>Thực đơn BBQ / Tiệc mặn</li><li>Nước uống & Tráng miệng</li>
    </ul>
    <div style={ss}>V. HẠNG MỤC KHÁC</div>
    <ul style={{paddingLeft:20}}>
      <li>Máy phát điện dự phòng</li><li>Bộ đàm liên lạc</li><li>Bản quyền âm nhạc</li><li>Giấy phép tổ chức sự kiện</li><li>Vận chuyển và lắp đặt trong 5 ngày</li>
    </ul>
    <div style={{marginTop:20,padding:15,background:'#f9f9f9',borderRadius:8,border:'1px solid #ddd'}}>
      <b>TỔNG GIÁ TRỊ PHỤ LỤC:</b> <span style={{color:'#c00',fontSize:16,fontWeight:'bold'}}>{(d.totalAmount||0).toLocaleString()} VNĐ</span>
      <div style={{fontSize:12,color:'#888',marginTop:5}}>* Phí sáng tác concept và thiết kế visual được tách riêng để bảo vệ quyền sở hữu trí tuệ của đơn vị tổ chức.</div>
    </div>
  </div>);
}

export function AcceptanceReport({ d }) {
  const dt = new Date().toLocaleDateString('vi-VN');
  const extra = Math.round((d.totalAmount||0)*0.05);
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>BIÊN BẢN NGHIỆM THU</h2>
      <div style={{fontSize:13,color:'#555'}}>Ngày lập: {dt}</div>
    </div>
    <p>Căn cứ Hợp đồng số HĐ-{(d.id||'').slice(-6).toUpperCase()}, hai bên tiến hành nghiệm thu các hạng mục đã thực hiện:</p>
    <div style={ss}>I. CÁC HẠNG MỤC ĐÃ THỰC HIỆN</div>
    <table style={ts}>
      <thead><tr><th style={th}>STT</th><th style={th}>Hạng mục</th><th style={th}>Trạng thái</th><th style={th}>Ghi chú</th></tr></thead>
      <tbody>
        <tr><td style={td}>1</td><td style={td}>Sân khấu & Thiết bị kỹ thuật</td><td style={{...td,color:'green'}}>✓ Hoàn thành</td><td style={td}>Đúng thời gian</td></tr>
        <tr><td style={td}>2</td><td style={td}>Âm thanh & Ánh sáng</td><td style={{...td,color:'green'}}>✓ Hoàn thành</td><td style={td}>Chất lượng tốt</td></tr>
        <tr><td style={td}>3</td><td style={td}>Trang trí & Decor</td><td style={{...td,color:'green'}}>✓ Hoàn thành</td><td style={td}>Đúng thiết kế</td></tr>
        <tr><td style={td}>4</td><td style={td}>Nhân sự vận hành</td><td style={{...td,color:'green'}}>✓ Hoàn thành</td><td style={td}>Đủ số lượng</td></tr>
        <tr><td style={td}>5</td><td style={td}>Hệ thống bán vé & Check-in QR</td><td style={{...td,color:'green'}}>✓ Hoàn thành</td><td style={td}>Hoạt động ổn định</td></tr>
      </tbody>
    </table>
    <div style={ss}>II. CHI PHÍ PHÁT SINH</div>
    <table style={ts}>
      <thead><tr><th style={th}>Hạng mục</th><th style={th}>Số lượng</th><th style={th}>Đơn giá</th><th style={th}>Thành tiền</th></tr></thead>
      <tbody>
        <tr><td style={td}>Thêm suất ăn</td><td style={td}>10</td><td style={td}>{Math.round(extra/2).toLocaleString()}</td><td style={td}>{(extra).toLocaleString()} VNĐ</td></tr>
      </tbody>
    </table>
    <div style={{marginTop:20,padding:15,background:'#f9f9f9',borderRadius:8}}>
      <p><b>Giá trị hợp đồng:</b> {(d.totalAmount||0).toLocaleString()} VNĐ</p>
      <p><b>Chi phí phát sinh:</b> {extra.toLocaleString()} VNĐ</p>
      <p style={{fontSize:16}}><b>TỔNG GIÁ TRỊ CUỐI CÙNG:</b> <span style={{color:'#c00'}}>{((d.totalAmount||0)+extra).toLocaleString()} VNĐ</span></p>
    </div>
    <div style={{marginTop:40,display:'flex',justifyContent:'space-between'}}>
      <div style={{textAlign:'center',width:'45%'}}><b>BÊN A</b><br/>{d.memberName}</div>
      <div style={{textAlign:'center',width:'45%'}}><b>BÊN B</b><br/>Lumina EMS</div>
    </div>
  </div>);
}

export function LiquidationReport({ d }) {
  const deposit = Math.round((d.totalAmount||0)*0.3);
  const remaining = (d.totalAmount||0) - deposit;
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>BIÊN BẢN THANH LÝ HỢP ĐỒNG</h2>
      <div style={{fontSize:13,color:'#555'}}>Số: TL-{(d.id||'').slice(-6).toUpperCase()}</div>
    </div>
    <p>Căn cứ Hợp đồng dịch vụ số HĐ-{(d.id||'').slice(-6).toUpperCase()}, hai bên đồng ý thanh lý hợp đồng với các nội dung sau:</p>
    <div style={ss}>I. XÁC NHẬN HOÀN THÀNH</div>
    <p>✓ Bên B đã hoàn thành toàn bộ nghĩa vụ theo hợp đồng.</p>
    <p>✓ Bên A đã nghiệm thu và chấp nhận kết quả.</p>
    <p>✓ Hai bên không còn tranh chấp nào liên quan.</p>
    <div style={ss}>II. QUYẾT TOÁN TÀI CHÍNH</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>Tổng giá trị hợp đồng</td><td style={td}>{(d.totalAmount||0).toLocaleString()} VNĐ</td></tr>
        <tr><td style={th}>Đã đặt cọc (30%)</td><td style={td}>{deposit.toLocaleString()} VNĐ</td></tr>
        <tr><td style={th}>Đã thanh toán đợt 2 (50%)</td><td style={td}>{Math.round((d.totalAmount||0)*0.5).toLocaleString()} VNĐ</td></tr>
        <tr><td style={{...th,color:'#c00'}}>Còn lại phải trả</td><td style={{...td,color:'#c00',fontWeight:'bold'}}>{Math.round((d.totalAmount||0)*0.2).toLocaleString()} VNĐ</td></tr>
      </tbody>
    </table>
    <div style={ss}>III. CHẤM DỨT HIỆU LỰC</div>
    <p>Hợp đồng số HĐ-{(d.id||'').slice(-6).toUpperCase()} chính thức chấm dứt hiệu lực kể từ ngày ký biên bản thanh lý này. Mọi quyền và nghĩa vụ của hai bên theo hợp đồng gốc được coi là đã hoàn tất.</p>
    <div style={{marginTop:40,display:'flex',justifyContent:'space-between'}}>
      <div style={{textAlign:'center',width:'45%'}}><b>BÊN A</b><br/><i>(Ký, ghi rõ họ tên)</i><br/><br/>{d.memberName}</div>
      <div style={{textAlign:'center',width:'45%'}}><b>BÊN B</b><br/><i>(Ký, đóng dấu)</i><br/><br/>Lumina EMS</div>
    </div>
  </div>);
}

export function PaymentRequest({ d }) {
  const phase = d.status==='Deposited'?2:d.status==='Approved'?1:3;
  const amt = phase===1?Math.round((d.totalAmount||0)*0.3):phase===2?Math.round((d.totalAmount||0)*0.5):Math.round((d.totalAmount||0)*0.2);
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>ĐỀ NGHỊ THANH TOÁN</h2>
      <div style={{fontSize:13,color:'#555'}}>Đợt {phase} - Hợp đồng HĐ-{(d.id||'').slice(-6).toUpperCase()}</div>
    </div>
    <p>Kính gửi: <b>{d.memberName||'Quý Khách Hàng'}</b></p>
    <p>Công ty Lumina EMS kính đề nghị thanh toán khoản chi phí theo hợp đồng dịch vụ tổ chức sự kiện như sau:</p>
    <div style={ss}>THÔNG TIN THANH TOÁN</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>Số hợp đồng</td><td style={td}>HĐ-{(d.id||'').slice(-6).toUpperCase()}</td></tr>
        <tr><td style={th}>Tên sự kiện</td><td style={td}>{d.proposalTitle||d.eventTitle||'—'}</td></tr>
        <tr><td style={th}>Đợt thanh toán</td><td style={td}>Đợt {phase} ({phase===1?'Đặt cọc 30%':phase===2?'Thanh toán 50%':'Quyết toán 20%'})</td></tr>
        <tr><td style={{...th,fontSize:15,color:'#c00'}}>Số tiền cần chuyển</td><td style={{...td,fontSize:16,fontWeight:'bold',color:'#c00'}}>{amt.toLocaleString()} VNĐ</td></tr>
      </tbody>
    </table>
    <div style={ss}>THÔNG TIN TÀI KHOẢN NHẬN</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>Tên chủ tài khoản</td><td style={td}>CÔNG TY TNHH LUMINA EMS</td></tr>
        <tr><td style={th}>Số tài khoản</td><td style={td}>1234 5678 9012 3456</td></tr>
        <tr><td style={th}>Ngân hàng</td><td style={td}>Vietcombank - Chi nhánh Hồ Chí Minh</td></tr>
        <tr><td style={th}>Nội dung chuyển khoản</td><td style={td}>HD-{(d.id||'').slice(-6).toUpperCase()} DOT{phase} {d.memberName||''}</td></tr>
      </tbody>
    </table>
    {d.memberBankName && (<>
      <div style={ss}>THÔNG TIN TÀI KHOẢN KHÁCH HÀNG (ĐỂ HOÀN TIỀN NẾU CẦN)</div>
      <table style={ts}><tbody>
        <tr><td style={th}>Ngân hàng</td><td style={td}>{d.memberBankName}</td></tr>
        <tr><td style={th}>Số tài khoản</td><td style={td}>{d.memberBankAccount||'—'}</td></tr>
      </tbody></table>
    </>)}
    <p style={{marginTop:20,fontStyle:'italic',fontSize:12,color:'#666'}}>Vui lòng thanh toán trước ngày {new Date(Date.now()+7*86400000).toLocaleDateString('vi-VN')}. Mọi thắc mắc vui lòng liên hệ hotline: 1900 xxxx.</p>
    <div style={{marginTop:30,textAlign:'right'}}><b>Lumina EMS</b><br/>Ban Tài Chính - Kế Toán</div>
  </div>);
}
