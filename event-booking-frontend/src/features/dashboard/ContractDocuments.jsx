import React from 'react';

const ds = { background:'#fff',color:'#1a1a1a',padding:'40px 50px',borderRadius:12,fontFamily:"'Times New Roman', serif",fontSize:'14px',lineHeight:1.8,maxHeight:'calc(80vh - 120px)',overflowY:'auto' };
const hs = { textAlign:'center',borderBottom:'2px solid #333',paddingBottom:20,marginBottom:30 };
const ss = { fontWeight:'bold',fontSize:'15px',textTransform:'uppercase',margin:'25px 0 10px',borderBottom:'1px solid #ccc',paddingBottom:5 };
const ts = { width:'100%',borderCollapse:'collapse',margin:'15px 0' };
const th = { border:'1px solid #666',padding:'8px 12px',background:'#f0f0f0',fontWeight:'bold',textAlign:'left',fontSize:'13px' };
const td = { border:'1px solid #999',padding:'8px 12px',fontSize:'13px' };

export function ServiceContract({ d }) {
  const no = `HD-${(d.id||'').slice(-6).toUpperCase()}`;
  const dt = d.createdAt ? new Date(d.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN');
  return (<div style={ds}>
    <div style={hs}>
      <div style={{fontSize:12,color:'#666'}}>CONG HOA XA HOI CHU NGHIA VIET NAM</div>
      <div style={{fontSize:13,fontWeight:'bold'}}>Doc lap - Tu do - Hanh phuc</div>
      <div style={{margin:'8px auto',width:80,borderBottom:'1px solid #333'}}/>
      <h2 style={{fontSize:20,margin:'15px 0 5px',color:'#1a1a1a'}}>HOP DONG DICH VU TO CHUC SU KIEN</h2>
      <div style={{fontSize:13,color:'#555'}}>So: {no} &nbsp;|&nbsp; Ngay: {dt}</div>
    </div>
    <div style={ss}>DIEU 1: CAC BEN THAM GIA</div>
    <table style={ts}>
      <tbody>
        <tr><td style={{...th,width:'50%'}}>BEN A (Khach hang)</td><td style={{...th}}>BEN B (Don vi to chuc)</td></tr>
        <tr><td style={td}><b>Ho ten:</b> {d.memberName||'Chua cap nhat'}<br/><b>Email:</b> {d.memberEmail||'N/A'}<br/><b>Dien thoai:</b> {d.memberPhone||'N/A'}</td>
        <td style={td}><b>Cong ty:</b> Lumina EMS JSC<br/><b>Dia chi:</b> 123 Nguyen Hue, Q.1, TP.HCM<br/><b>MST:</b> 0123456789</td></tr>
      </tbody>
    </table>
    <div style={ss}>DIEU 2: NOI DUNG SU KIEN</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>Ten su kien</td><td style={td}>{d.proposalTitle||d.eventTitle||'—'}</td></tr>
        <tr><td style={th}>Loai su kien</td><td style={td}>{d.proposalEventType==='PUBLIC'?'Cong khai':'Rieng tu'}</td></tr>
        <tr><td style={th}>Ngay to chuc</td><td style={td}>{d.proposalExpectedDate||'—'}</td></tr>
        <tr><td style={th}>Dia diem</td><td style={td}>{d.proposalExpectedLocation||'—'}</td></tr>
        <tr><td style={th}>Mo ta</td><td style={td}>{d.proposalDescription||'—'}</td></tr>
      </tbody>
    </table>
    <div style={ss}>DIEU 3: GIA TRI HOP DONG & THANH TOAN</div>
    <p><b>Tong gia tri:</b> <span style={{color:'#c00',fontWeight:'bold',fontSize:16}}>{(d.totalAmount||0).toLocaleString()} VND</span></p>
    <table style={ts}>
      <thead><tr><th style={th}>Dot</th><th style={th}>Ty le</th><th style={th}>So tien</th><th style={th}>Thoi han</th></tr></thead>
      <tbody>
        <tr><td style={td}>Dot 1 - Dat coc</td><td style={td}>30%</td><td style={td}>{Math.round((d.totalAmount||0)*0.3).toLocaleString()} VND</td><td style={td}>Khi ky hop dong</td></tr>
        <tr><td style={td}>Dot 2</td><td style={td}>50%</td><td style={td}>{Math.round((d.totalAmount||0)*0.5).toLocaleString()} VND</td><td style={td}>Truoc su kien 7 ngay</td></tr>
        <tr><td style={td}>Dot 3 - Quyet toan</td><td style={td}>20%</td><td style={td}>{Math.round((d.totalAmount||0)*0.2).toLocaleString()} VND</td><td style={td}>Sau khi hoan thanh</td></tr>
      </tbody>
    </table>
    <div style={ss}>DIEU 4: QUYEN VA NGHIA VU</div>
    <p><b>Ben A:</b> Cung cap thong tin day du, thanh toan dung han, phoi hop voi Ben B.</p>
    <p><b>Ben B:</b> Dam bao chat luong dich vu, dung tien do, bao mat thong tin su kien.</p>
    <div style={ss}>DIEU 5: BAT KHA KHANG</div>
    <p>Truong hop thien tai, dich benh, hoa hoan hoac cac su kien bat kha khang khac, hai ben se thuong luong de giai quyet va mien tru trach nhiem cho ben bi anh huong.</p>
    <div style={ss}>DIEU 6: GIAI QUYET TRANH CHAP</div>
    <p>Moi tranh chap phat sinh tu hop dong nay se duoc giai quyet thong qua thuong luong. Truong hop khong thanh, se dua ra Toa an Kinh te co tham quyen tai TP.HCM.</p>
    <div style={ss}>DIEU 7: DIEU KHOAN BAO MAT</div>
    <p>Hai ben cam ket bao mat toan bo thong tin ve su kien, don gia va cac dieu khoan hop dong. Moi vi pham se bi xu ly theo phap luat hien hanh.</p>
    <div style={{marginTop:50,display:'flex',justifyContent:'space-between'}}>
      <div style={{textAlign:'center',width:'45%'}}><b>DAI DIEN BEN A</b><br/><i>(Ky, ghi ro ho ten)</i><br/><br/><br/>{d.memberName||''}</div>
      <div style={{textAlign:'center',width:'45%'}}><b>DAI DIEN BEN B</b><br/><i>(Ky, dong dau)</i><br/><br/><br/>Ban Quan Ly Lumina EMS</div>
    </div>
  </div>);
}

export function ContractAppendix({ d }) {
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>PHU LUC HOP DONG</h2>
      <div style={{fontSize:13,color:'#555'}}>BAO GIA CHI TIET DICH VU TO CHUC SU KIEN</div>
      <div style={{fontSize:12,color:'#888',marginTop:5}}>Kem theo Hop dong so: HD-{(d.id||'').slice(-6).toUpperCase()}</div>
    </div>
    <div style={ss}>I. THIET BI SU KIEN</div>
    <table style={ts}>
      <thead><tr><th style={th}>STT</th><th style={th}>Hang muc</th><th style={th}>SL</th><th style={th}>Don gia</th><th style={th}>Thanh tien</th></tr></thead>
      <tbody>
        {(d.devices||[]).map((dv,i)=>(<tr key={i}><td style={td}>{i+1}</td><td style={td}>{dv.name}</td><td style={td}>{dv.quantity||1}</td><td style={td}>{(dv.price||0).toLocaleString()}</td><td style={td}>{((dv.quantity||1)*(dv.price||0)).toLocaleString()}</td></tr>))}
        {(!d.devices||d.devices.length===0)&&<tr><td style={td} colSpan={5}>San khau 8x6m, Man hinh LED P3, Am thanh 5000W, Anh sang 200 bong, May khoi, Gian khung Truss</td></tr>}
      </tbody>
    </table>
    <div style={ss}>II. DICH VU</div>
    <table style={ts}>
      <thead><tr><th style={th}>STT</th><th style={th}>Dich vu</th><th style={th}>Don gia</th></tr></thead>
      <tbody>
        {(d.services||[]).map((sv,i)=>(<tr key={i}><td style={td}>{i+1}</td><td style={td}>{sv.name} {sv.description?`- ${sv.description}`:''}</td><td style={td}>{(sv.price||0).toLocaleString()} VND</td></tr>))}
        {(!d.services||d.services.length===0)&&<tr><td style={td} colSpan={3}>MC, Ca si, Vu doan, PG/PB, Bao ve, Ekip dao dien</td></tr>}
      </tbody>
    </table>
    <div style={ss}>III. TRANG TRI (DECOR)</div>
    <ul style={{paddingLeft:20}}>
      <li>Photo booth & Cong chao</li><li>Hoa tuoi & Nen trang tri</li><li>Thiet ke 2D/3D concept</li><li>Banner & Backdrop chinh</li>
    </ul>
    <div style={ss}>IV. LUU TRU & AN UONG</div>
    <ul style={{paddingLeft:20}}>
      <li>Phong khach VIP (theo yeu cau)</li><li>Thuc don BBQ / Tiec man</li><li>Nuoc uong & Trang mieng</li>
    </ul>
    <div style={ss}>V. HANG MUC KHAC</div>
    <ul style={{paddingLeft:20}}>
      <li>May phat dien du phong</li><li>Bo dam lien lac</li><li>Ban quyen am nhac</li><li>Giay phep to chuc su kien</li><li>Van chuyen va lap dat trong 5 ngay</li>
    </ul>
    <div style={{marginTop:20,padding:15,background:'#f9f9f9',borderRadius:8,border:'1px solid #ddd'}}>
      <b>TONG GIA TRI PHU LUC:</b> <span style={{color:'#c00',fontSize:16,fontWeight:'bold'}}>{(d.totalAmount||0).toLocaleString()} VND</span>
      <div style={{fontSize:12,color:'#888',marginTop:5}}>* Phi sang tac concept va thiet ke visual duoc tach rieng de bao ve quyen so huu tri tue cua don vi to chuc.</div>
    </div>
  </div>);
}

export function AcceptanceReport({ d }) {
  const dt = new Date().toLocaleDateString('vi-VN');
  const extra = Math.round((d.totalAmount||0)*0.05);
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>BIEN BAN NGHIEM THU</h2>
      <div style={{fontSize:13,color:'#555'}}>Ngay lap: {dt}</div>
    </div>
    <p>Can cu Hop dong so HD-{(d.id||'').slice(-6).toUpperCase()}, hai ben tien hanh nghiem thu cac hang muc da thuc hien:</p>
    <div style={ss}>I. CAC HANG MUC DA THUC HIEN</div>
    <table style={ts}>
      <thead><tr><th style={th}>STT</th><th style={th}>Hang muc</th><th style={th}>Trang thai</th><th style={th}>Ghi chu</th></tr></thead>
      <tbody>
        <tr><td style={td}>1</td><td style={td}>San khau & Thiet bi ky thuat</td><td style={{...td,color:'green'}}>✓ Hoan thanh</td><td style={td}>Dung thoi gian</td></tr>
        <tr><td style={td}>2</td><td style={td}>Am thanh & Anh sang</td><td style={{...td,color:'green'}}>✓ Hoan thanh</td><td style={td}>Chat luong tot</td></tr>
        <tr><td style={td}>3</td><td style={td}>Trang tri & Decor</td><td style={{...td,color:'green'}}>✓ Hoan thanh</td><td style={td}>Dung thiet ke</td></tr>
        <tr><td style={td}>4</td><td style={td}>Nhan su van hanh</td><td style={{...td,color:'green'}}>✓ Hoan thanh</td><td style={td}>Du so luong</td></tr>
        <tr><td style={td}>5</td><td style={td}>He thong ban ve & Check-in QR</td><td style={{...td,color:'green'}}>✓ Hoan thanh</td><td style={td}>Hoat dong on dinh</td></tr>
      </tbody>
    </table>
    <div style={ss}>II. CHI PHI PHAT SINH</div>
    <table style={ts}>
      <thead><tr><th style={th}>Hang muc</th><th style={th}>So luong</th><th style={th}>Don gia</th><th style={th}>Thanh tien</th></tr></thead>
      <tbody>
        <tr><td style={td}>Them suat an</td><td style={td}>10</td><td style={td}>{Math.round(extra/2).toLocaleString()}</td><td style={td}>{(extra).toLocaleString()} VND</td></tr>
      </tbody>
    </table>
    <div style={{marginTop:20,padding:15,background:'#f9f9f9',borderRadius:8}}>
      <p><b>Gia tri hop dong:</b> {(d.totalAmount||0).toLocaleString()} VND</p>
      <p><b>Chi phi phat sinh:</b> {extra.toLocaleString()} VND</p>
      <p style={{fontSize:16}}><b>TONG GIA TRI CUOI CUNG:</b> <span style={{color:'#c00'}}>{((d.totalAmount||0)+extra).toLocaleString()} VND</span></p>
    </div>
    <div style={{marginTop:40,display:'flex',justifyContent:'space-between'}}>
      <div style={{textAlign:'center',width:'45%'}}><b>BEN A</b><br/>{d.memberName}</div>
      <div style={{textAlign:'center',width:'45%'}}><b>BEN B</b><br/>Lumina EMS</div>
    </div>
  </div>);
}

export function LiquidationReport({ d }) {
  const deposit = Math.round((d.totalAmount||0)*0.3);
  const remaining = (d.totalAmount||0) - deposit;
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>BIEN BAN THANH LY HOP DONG</h2>
      <div style={{fontSize:13,color:'#555'}}>So: TL-{(d.id||'').slice(-6).toUpperCase()}</div>
    </div>
    <p>Can cu Hop dong dich vu so HD-{(d.id||'').slice(-6).toUpperCase()}, hai ben dong y thanh ly hop dong voi cac noi dung sau:</p>
    <div style={ss}>I. XAC NHAN HOAN THANH</div>
    <p>✓ Ben B da hoan thanh toan bo nghia vu theo hop dong.</p>
    <p>✓ Ben A da nghiem thu va chap nhan ket qua.</p>
    <p>✓ Hai ben khong con tranh chap nao lien quan.</p>
    <div style={ss}>II. QUYET TOAN TAI CHINH</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>Tong gia tri hop dong</td><td style={td}>{(d.totalAmount||0).toLocaleString()} VND</td></tr>
        <tr><td style={th}>Da dat coc (30%)</td><td style={td}>{deposit.toLocaleString()} VND</td></tr>
        <tr><td style={th}>Da thanh toan dot 2 (50%)</td><td style={td}>{Math.round((d.totalAmount||0)*0.5).toLocaleString()} VND</td></tr>
        <tr><td style={{...th,color:'#c00'}}>Con lai phai tra</td><td style={{...td,color:'#c00',fontWeight:'bold'}}>{Math.round((d.totalAmount||0)*0.2).toLocaleString()} VND</td></tr>
      </tbody>
    </table>
    <div style={ss}>III. CHAM DUT HIEU LUC</div>
    <p>Hop dong so HD-{(d.id||'').slice(-6).toUpperCase()} chinh thuc cham dut hieu luc ke tu ngay ky bien ban thanh ly nay. Moi quyen va nghia vu cua hai ben theo hop dong goc duoc coi la da hoan tat.</p>
    <div style={{marginTop:40,display:'flex',justifyContent:'space-between'}}>
      <div style={{textAlign:'center',width:'45%'}}><b>BEN A</b><br/><i>(Ky, ghi ro ho ten)</i><br/><br/>{d.memberName}</div>
      <div style={{textAlign:'center',width:'45%'}}><b>BEN B</b><br/><i>(Ky, dong dau)</i><br/><br/>Lumina EMS</div>
    </div>
  </div>);
}

export function PaymentRequest({ d }) {
  const phase = d.status==='Deposited'?2:d.status==='Approved'?1:3;
  const amt = phase===1?Math.round((d.totalAmount||0)*0.3):phase===2?Math.round((d.totalAmount||0)*0.5):Math.round((d.totalAmount||0)*0.2);
  return (<div style={ds}>
    <div style={hs}>
      <h2 style={{fontSize:18,margin:'10px 0'}}>DE NGHI THANH TOAN</h2>
      <div style={{fontSize:13,color:'#555'}}>Dot {phase} - Hop dong HD-{(d.id||'').slice(-6).toUpperCase()}</div>
    </div>
    <p>Kinh gui: <b>{d.memberName||'Quy Khach Hang'}</b></p>
    <p>Cong ty Lumina EMS kinh de nghi thanh toan khoan chi phi theo hop dong dich vu to chuc su kien nhu sau:</p>
    <div style={ss}>THONG TIN THANH TOAN</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>So hop dong</td><td style={td}>HD-{(d.id||'').slice(-6).toUpperCase()}</td></tr>
        <tr><td style={th}>Ten su kien</td><td style={td}>{d.proposalTitle||d.eventTitle||'—'}</td></tr>
        <tr><td style={th}>Dot thanh toan</td><td style={td}>Dot {phase} ({phase===1?'Dat coc 30%':phase===2?'Thanh toan 50%':'Quyet toan 20%'})</td></tr>
        <tr><td style={{...th,fontSize:15,color:'#c00'}}>So tien can chuyen</td><td style={{...td,fontSize:16,fontWeight:'bold',color:'#c00'}}>{amt.toLocaleString()} VND</td></tr>
      </tbody>
    </table>
    <div style={ss}>THONG TIN TAI KHOAN NHAN</div>
    <table style={ts}>
      <tbody>
        <tr><td style={th}>Ten chu tai khoan</td><td style={td}>CONG TY TNHH LUMINA EMS</td></tr>
        <tr><td style={th}>So tai khoan</td><td style={td}>1234 5678 9012 3456</td></tr>
        <tr><td style={th}>Ngan hang</td><td style={td}>Vietcombank - Chi nhanh Ho Chi Minh</td></tr>
        <tr><td style={th}>Noi dung chuyen khoan</td><td style={td}>HD-{(d.id||'').slice(-6).toUpperCase()} DOT{phase} {d.memberName||''}</td></tr>
      </tbody>
    </table>
    {d.memberBankName && (<>
      <div style={ss}>THONG TIN TAI KHOAN KHACH HANG (DE HOAN TIEN NEU CAN)</div>
      <table style={ts}><tbody>
        <tr><td style={th}>Ngan hang</td><td style={td}>{d.memberBankName}</td></tr>
        <tr><td style={th}>So tai khoan</td><td style={td}>{d.memberBankAccount||'—'}</td></tr>
      </tbody></table>
    </>)}
    <p style={{marginTop:20,fontStyle:'italic',fontSize:12,color:'#666'}}>Vui long thanh toan truoc ngay {new Date(Date.now()+7*86400000).toLocaleDateString('vi-VN')}. Moi thac mac vui long lien he hotline: 1900 xxxx.</p>
    <div style={{marginTop:30,textAlign:'right'}}><b>Lumina EMS</b><br/>Ban Tai Chinh - Ke Toan</div>
  </div>);
}
