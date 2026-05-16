import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';
import { X, FileText, ClipboardList, FileCheck, CreditCard, Printer, CheckCircle, XCircle } from 'lucide-react';
import { ServiceContract, ContractAppendix, LiquidationReport, PaymentRequest } from './ContractDocuments';

// Tabs cho khách hàng: giống admin nhưng KHÔNG có BB Nghiệm Thu
const TABS = [
  { key: 'contract', label: 'Hợp đồng dịch vụ', icon: FileText, color: '#00F0FF' },
  { key: 'appendix', label: 'Phụ lục hợp đồng', icon: ClipboardList, color: '#FF00E5' },
  { key: 'liquidation', label: 'BB Thanh lý', icon: FileCheck, color: '#F59E0B' },
  { key: 'payment', label: 'Đề nghị thanh toán', icon: CreditCard, color: '#8B5CF6' },
];

export default function MemberContractDetailModal({ contract, onClose, onConfirm, onReject }) {
  const [activeTab, setActiveTab] = useState('contract');
  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract) return;
    fetchGraphQL(`query($id: ID!) { getContractFull(contractId: $id) {
      id details totalAmount status createdAt fileUrl fileName
      memberId memberName memberEmail memberPhone memberBankName memberBankAccount
      proposalId proposalTitle proposalDescription proposalEventType proposalExpectedDate proposalExpectedLocation proposalBudget
      eventTitle services { id name description price } devices { id name quantity price image }
    }}`, { id: contract.id })
      .then(d => { setFullData(d.getContractFull); setLoading(false); })
      .catch(() => { setFullData(contract); setLoading(false); });
  }, [contract]);

  if (!contract) return null;
  const d = fullData || contract;

  const handlePrint = () => {
    const content = document.getElementById('member-contract-doc-content');
    if (!content) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Hop Dong</title><style>body{font-family:'Times New Roman',serif;padding:40px;color:#1a1a1a}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:8px}</style></head><body>${content.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  const renderDoc = () => {
    switch (activeTab) {
      case 'contract': return <ServiceContract d={d} />;
      case 'appendix': return <ContractAppendix d={d} />;
      case 'liquidation': return <LiquidationReport d={d} />;
      case 'payment': return <PaymentRequest d={d} />;
      default: return null;
    }
  };

  const statusMap = {
    'Pending': { text: '⏳ Chờ xác nhận', bg: 'rgba(245,158,11,0.2)', color: '#F59E0B' },
    'MemberConfirmed': { text: '✅ Đã xác nhận', bg: 'rgba(59,130,246,0.2)', color: '#3B82F6' },
    'MemberRejected': { text: '❌ Đã từ chối', bg: 'rgba(239,68,68,0.2)', color: '#EF4444' },
    'EmployeeConfirmed': { text: '🎉 Đang triển khai', bg: 'rgba(16,185,129,0.2)', color: '#10B981' },
    'Paid': { text: '💰 Đã thanh toán', bg: 'rgba(16,185,129,0.2)', color: '#10B981' },
  };
  const st = statusMap[d.status] || { text: d.status, bg: 'rgba(245,158,11,0.2)', color: '#F59E0B' };

  return (
    <div style={{ position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.85)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)' }} onClick={onClose}>
      <div style={{ width:'95vw',maxWidth:1200,height:'90vh',background:'var(--bg-panel,#16161e)',borderRadius:16,border:'1px solid rgba(0,240,255,0.2)',display:'flex',overflow:'hidden',boxShadow:'0 25px 60px rgba(0,0,0,0.5)' }} onClick={e=>e.stopPropagation()}>
        {/* Sidebar tabs */}
        <div style={{ width:240,background:'rgba(0,0,0,0.3)',borderRight:'1px solid rgba(255,255,255,0.08)',padding:'20px 0',display:'flex',flexDirection:'column' }}>
          <div style={{ padding:'10px 20px 20px',borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color:'#fff',fontSize:'1rem',fontFamily:'Outfit',margin:'0 0 6px' }}>📄 Chi Tiết Hợp Đồng</h3>
            <div style={{ fontSize:'0.8rem',color:'var(--text-muted)',marginBottom:8 }}>HĐ-{(d.id||'').slice(-6).toUpperCase()}</div>
            <span style={{ padding:'4px 12px',borderRadius:20,fontSize:'0.75rem',fontWeight:600,background:st.bg,color:st.color }}>{st.text}</span>
            {d.proposalTitle && <div style={{ marginTop:10,fontSize:'0.82rem',color:'var(--accent-color)',fontWeight:600 }}>📋 {d.proposalTitle}</div>}
            {d.totalAmount && <div style={{ marginTop:6,fontSize:'1.1rem',fontWeight:900,color:'var(--primary-color)',fontFamily:'Outfit' }}>{d.totalAmount?.toLocaleString()} VNĐ</div>}
          </div>

          <div style={{ flex:1,padding:'10px 0',overflowY:'auto' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <div key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{ display:'flex',alignItems:'center',gap:10,padding:'13px 20px',cursor:'pointer',transition:'all 0.2s',
                    background: active ? `${tab.color}15` : 'transparent',
                    borderLeft: active ? `3px solid ${tab.color}` : '3px solid transparent',
                    color: active ? tab.color : 'var(--text-muted)' }}>
                  <Icon size={16} />
                  <span style={{ fontSize:'0.85rem',fontWeight: active?700:400 }}>{tab.label}</span>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div style={{ padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',flexDirection:'column',gap:8 }}>
            {d.status === 'Pending' && (
              <>
                <button onClick={() => onConfirm && onConfirm(d.id)} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:10,border:'none',background:'linear-gradient(135deg, #10B981, #059669)',color:'#fff',cursor:'pointer',fontSize:'0.85rem',fontWeight:700,fontFamily:'Outfit' }}>
                  <CheckCircle size={15}/> Xác Nhận Hợp Đồng
                </button>
                <button onClick={() => onReject && onReject(d.id)} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:10,border:'1px solid rgba(239,68,68,0.4)',background:'rgba(239,68,68,0.1)',color:'#EF4444',cursor:'pointer',fontSize:'0.85rem',fontWeight:700,fontFamily:'Outfit' }}>
                  <XCircle size={15}/> Từ Chối Hợp Đồng
                </button>
              </>
            )}
            <button onClick={handlePrint} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'8px',borderRadius:8,border:'1px solid rgba(0,240,255,0.3)',background:'rgba(0,240,255,0.1)',color:'#00F0FF',cursor:'pointer',fontSize:'0.8rem',fontWeight:600 }}>
              <Printer size={14}/> In hợp đồng
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1,display:'flex',flexDirection:'column' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'15px 25px',borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ margin:0,fontFamily:'Outfit',color:'#fff',fontSize:'1rem' }}>{TABS.find(t=>t.key===activeTab)?.label}</h3>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)',border:'none',borderRadius:8,padding:6,cursor:'pointer',color:'#fff',display:'flex' }}><X size={18}/></button>
          </div>
          <div id="member-contract-doc-content" style={{ flex:1,overflowY:'auto',padding:25 }}>
            {loading ? <div style={{ textAlign:'center',padding:60,color:'var(--text-muted)' }}>Đang tải dữ liệu...</div> : renderDoc()}
          </div>

          {/* Status bar at bottom */}
          {d.status === 'MemberConfirmed' && (
            <div style={{ padding:'12px 25px',borderTop:'1px solid rgba(255,255,255,0.08)',background:'rgba(59,130,246,0.06)',display:'flex',alignItems:'center',gap:10,fontSize:'0.85rem',color:'#3B82F6' }}>
              ⏳ <b>Đang chờ nhân viên kiểm tra kho thiết bị và địa điểm</b> — Hệ thống đã tự động phân công nhân viên tổ chức.
            </div>
          )}
          {d.status === 'EmployeeConfirmed' && (
            <div style={{ padding:'12px 25px',borderTop:'1px solid rgba(255,255,255,0.08)',background:'rgba(16,185,129,0.06)',display:'flex',alignItems:'center',gap:10,fontSize:'0.85rem',color:'#10B981' }}>
              🎉 <b>Sự kiện đang được triển khai!</b> — {d.proposalEventType === 'PUBLIC' ? '🌐 Hiển thị công khai trên trang chủ.' : '🔒 Sự kiện riêng tư — chỉ nội bộ xem được.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
