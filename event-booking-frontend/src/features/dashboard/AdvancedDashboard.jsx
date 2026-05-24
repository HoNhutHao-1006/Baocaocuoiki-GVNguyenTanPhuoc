import React, { useState, useEffect, useCallback } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';
import { BarChart3, TrendingUp, PieChart, Target, Users, Calendar, FileText, Activity, DollarSign, ShoppingCart, Filter, RefreshCw, AlertTriangle, Zap, Clock, ArrowUp, ArrowDown } from 'lucide-react';

const GaugeChart = ({ value, max, label, color }) => {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  const angle = (pct / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const x = 50 + 40 * Math.cos(Math.PI - rad);
  const y = 50 - 40 * Math.sin(Math.PI - rad);
  const large = angle > 90 ? 1 : 0;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="120" height="70" viewBox="0 0 100 60">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#333" strokeWidth="8" strokeLinecap="round" />
        <path d={`M 10 50 A 40 40 0 ${large} 1 ${x} ${50 - (50 - y)}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <text x="50" y="48" textAnchor="middle" fill={color} fontSize="14" fontWeight="900" fontFamily="Outfit">{pct.toFixed(0)}%</text>
      </svg>
      <div style={{ fontSize: '0.7rem', color: '#999', marginTop: -4 }}>{label}</div>
    </div>
  );
};

const DonutChart = ({ data, colors }) => {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let cum = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width="100" height="100" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="#222" strokeWidth="5" />
        {data.map((d, i) => {
          const pct = (d.count / total) * 100;
          const offset = 100 - cum + 25;
          cum += pct;
          return <circle key={i} cx="21" cy="21" r="15.9" fill="none" stroke={colors[i % colors.length]} strokeWidth="5" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset} />;
        })}
        <text x="21" y="22" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="800">{total}</text>
      </svg>
      <div style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: '0.78rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ color: '#ccc', flex: 1 }}>{d.name}</span>
            <span style={{ color: colors[i % colors.length], fontWeight: 700 }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FunnelChart = ({ data, colors }) => {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div>
      {data.map((d, i) => {
        const w = Math.max((d.count / max) * 100, 15);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ width: 60, fontSize: '0.75rem', color: '#999', textAlign: 'right', flexShrink: 0 }}>{d.name}</span>
            <div style={{ flex: 1, position: 'relative', height: 28 }}>
              <div style={{ width: `${w}%`, height: '100%', background: `linear-gradient(90deg, ${colors[i % colors.length]}cc, ${colors[i % colors.length]}44)`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 0.8s', margin: '0 auto' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>{d.count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function AdvancedDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [drillDown, setDrillDown] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const loadData = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchGraphQL(`query { getSystemStats { totalRevenue totalTicketsSold activeUsers totalEvents pendingProposals totalContracts totalRefunded cancelledCount } }`),
      fetchGraphQL(`query { getAnalyticsDashboard { monthlyRevenue { month revenue orders } eventTypeStats { name count } contractStatusStats { name count amount } orderStatusStats { name count } totalMembers newMembersThisMonth avgOrderValue conversionRate } }`),
      fetchGraphQL(`query { getAllContracts(limit: 10) { id details totalAmount status createdAt proposalTitle } }`)
    ]).then(([s, a, c]) => {
      setStats(s.getSystemStats);
      setAnalytics(a.getAnalyticsDashboard);
      setContracts(c.getAllContracts || []);
      setLastUpdate(new Date());
      setRefreshing(false);
    }).catch(() => setRefreshing(false));
  }, []);

  useEffect(() => { loadData(); const iv = setInterval(loadData, 30000); return () => clearInterval(iv); }, [loadData]);
  useEffect(() => {
    setAiLoading(true);
    fetchGraphQL(`query { getAIInsights { swotStrengths swotWeaknesses swotOpportunities swotThreats marketTrends strategicRecommendations roadmapPhases { phase title items } generatedAt } }`)
      .then(d => { setAiInsights(d.getAIInsights); setAiLoading(false); })
      .catch(() => setAiLoading(false));
  }, []);

  if (!stats) return <div style={{ padding: 60, textAlign: 'center' }}><div style={{ fontSize: 40, marginBottom: 10 }}>📊</div><div style={{ color: '#888', fontFamily: 'Outfit' }}>Đang tải dữ liệu phân tích...</div></div>;

  const kpiCards = [
    { label: 'Tổng Doanh Thu', value: (stats.totalRevenue || 0), fmt: v => `${v.toLocaleString()}đ`, icon: <DollarSign size={20} />, color: '#00F0FF', trend: '+12%', up: true },
    { label: 'Vé Đã Bán', value: stats.totalTicketsSold, fmt: v => v.toLocaleString(), icon: <ShoppingCart size={20} />, color: '#FF00E5', trend: `${stats.cancelledCount || 0} hủy`, up: false },
    { label: 'Thành Viên', value: analytics?.totalMembers || stats.activeUsers, fmt: v => v.toLocaleString(), icon: <Users size={20} />, color: '#10B981', trend: `+${analytics?.newMembersThisMonth || 0} mới`, up: true },
    { label: 'Sự Kiện', value: stats.totalEvents, fmt: v => v.toLocaleString(), icon: <Calendar size={20} />, color: '#F59E0B', trend: `${stats.pendingProposals} chờ`, up: false },
    { label: 'TB/Đơn Hàng', value: Math.round(analytics?.avgOrderValue || 0), fmt: v => `${v.toLocaleString()}đ`, icon: <Target size={20} />, color: '#8B5CF6', trend: `CR: ${(analytics?.conversionRate || 0).toFixed(0)}%`, up: true },
    { label: 'Hợp Đồng', value: stats.totalContracts, fmt: v => v.toLocaleString(), icon: <FileText size={20} />, color: '#FF6B35', trend: 'Toàn hệ thống', up: true },
  ];

  const mr = analytics?.monthlyRevenue || [];
  const maxRev = Math.max(...mr.map(m => m.revenue), 1);
  const etColors = ['#00F0FF', '#FF00E5', '#F59E0B', '#10B981', '#8B5CF6', '#FF6B35'];
  const csColors = { Pending: '#F59E0B', Approved: '#00F0FF', Deposited: '#8B5CF6', Paid: '#10B981', Cancelled: '#EF4444' };
  const osData = analytics?.orderStatusStats || [];
  const funnelColors = ['#00F0FF', '#FF00E5', '#10B981', '#EF4444'];

  // Forecasting - simple linear projection
  const forecast = [];
  if (mr.length >= 2) {
    const last2 = mr.slice(-2);
    const growth = last2[1].revenue - last2[0].revenue;
    for (let i = 1; i <= 3; i++) {
      const lastM = mr[mr.length - 1];
      const [y, m] = lastM.month.split('-').map(Number);
      const nm = m + i > 12 ? m + i - 12 : m + i;
      const ny = m + i > 12 ? y + 1 : y;
      forecast.push({ month: `${ny}-${String(nm).padStart(2, '0')}`, revenue: Math.max(0, lastM.revenue + growth * i), orders: Math.max(0, Math.round(lastM.orders + i * 2)), predicted: true });
    }
  }
  const allMonths = [...mr, ...forecast];
  const allMaxRev = Math.max(...allMonths.map(m => m.revenue), 1);

  // Anomaly detection
  const anomalies = [];
  if (stats.totalRefunded > stats.totalRevenue * 0.2) anomalies.push({ msg: 'Tỷ lệ hoàn tiền cao bất thường (>20% doanh thu)', severity: 'high' });
  if (stats.cancelledCount > stats.totalTicketsSold * 0.3) anomalies.push({ msg: 'Tỷ lệ hủy vé vượt ngưỡng cảnh báo (>30%)', severity: 'high' });
  if (stats.pendingProposals > 5) anomalies.push({ msg: `${stats.pendingProposals} đề xuất đang chờ duyệt`, severity: 'medium' });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,rgba(0,240,255,0.2),rgba(255,0,229,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,240,255,0.3)' }}>
            <BarChart3 size={28} color="#00F0FF" />
          </div>
          <div>
            <h2 className="page-title" style={{ marginBottom: 0 }}>Thống Kê & Báo Cáo Toàn Cầu</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Dashboard phân tích dữ liệu thời gian thực | Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', '7d', '30d', '90d'].map(f => (
            <button key={f} onClick={() => setTimeFilter(f)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${timeFilter === f ? '#00F0FF' : '#333'}`, background: timeFilter === f ? 'rgba(0,240,255,0.15)' : 'transparent', color: timeFilter === f ? '#00F0FF' : '#888', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
              {f === 'all' ? 'Tất cả' : f === '7d' ? '7 ngày' : f === '30d' ? '30 ngày' : '90 ngày'}
            </button>
          ))}
          <button onClick={loadData} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #333', background: 'transparent', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Làm mới
          </button>
        </div>
      </div>

      {/* Anomaly Alerts */}
      {anomalies.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {anomalies.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, marginBottom: 8, background: a.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${a.severity === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
              <AlertTriangle size={16} color={a.severity === 'high' ? '#EF4444' : '#F59E0B'} />
              <span style={{ fontSize: '0.82rem', color: a.severity === 'high' ? '#EF4444' : '#F59E0B' }}>{a.msg}</span>
              <Zap size={12} color="#F59E0B" style={{ marginLeft: 'auto' }} />
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: 22 }}>
        {kpiCards.map((s, i) => (
          <div key={i} className="panel" style={{ padding: '16px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = ''}>
            <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: `${s.color}08` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            </div>
            <div style={{ color: '#777', fontSize: '0.7rem', fontWeight: 500, marginBottom: 3 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: '1.3rem', fontFamily: 'Outfit', fontWeight: 900, lineHeight: 1 }}>{s.fmt(s.value)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 6, fontSize: '0.65rem', color: s.up ? '#10B981' : '#F59E0B' }}>
              {s.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Gauge Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GaugeChart value={analytics?.conversionRate || 0} max={100} label="Tỷ lệ chuyển đổi" color="#10B981" />
        </div>
        <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GaugeChart value={stats.totalTicketsSold} max={stats.totalTicketsSold + (stats.cancelledCount || 0)} label="Tỷ lệ giữ vé" color="#00F0FF" />
        </div>
        <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GaugeChart value={stats.totalEvents - stats.pendingProposals} max={stats.totalEvents || 1} label="SK đã duyệt" color="#F59E0B" />
        </div>
        <div className="panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <GaugeChart value={stats.totalRevenue - (stats.totalRefunded || 0)} max={stats.totalRevenue || 1} label="Doanh thu thực" color="#FF00E5" />
        </div>
      </div>

      {/* Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr', gap: 16, marginBottom: 22 }}>
        {/* Revenue + Forecast */}
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><TrendingUp size={18} color="#00F0FF" /><h3 style={{ margin: 0, fontSize: '0.9rem' }}>Doanh Thu & Dự Báo</h3></div>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.7rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 4, borderRadius: 2, background: '#00F0FF' }} /> Thực tế</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 4, borderRadius: 2, background: '#FF00E5', opacity: 0.5 }} /> Dự báo</span>
            </div>
          </div>
          <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 4, paddingBottom: 22 }}>
            {allMonths.map((m, i) => {
              const h = Math.max((m.revenue / allMaxRev) * 170, 4);
              const isPred = m.predicted;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => !isPred && setDrillDown(drillDown === m.month ? null : m.month)}>
                  <div style={{ fontSize: '0.55rem', color: isPred ? '#FF00E5' : '#00F0FF', marginBottom: 3, fontWeight: 600, opacity: isPred ? 0.6 : 1 }}>{(m.revenue / 1000).toFixed(0)}k</div>
                  <div style={{ width: '100%', height: h, background: isPred ? 'repeating-linear-gradient(45deg,#FF00E555,#FF00E555 2px,transparent 2px,transparent 6px)' : `linear-gradient(to top,#00F0FF,#00c3cc)`, borderRadius: '3px 3px 0 0', transition: 'height 0.6s', border: drillDown === m.month ? '2px solid #FFD700' : 'none', opacity: isPred ? 0.5 : 0.85 }} />
                  <div style={{ fontSize: '0.55rem', color: isPred ? '#FF00E5' : '#666', marginTop: 5 }}>{m.month.slice(5)}{isPred ? '*' : ''}</div>
                </div>
              );
            })}
          </div>
          {drillDown && <div style={{ padding: '10px 14px', background: 'rgba(0,240,255,0.05)', borderRadius: 8, border: '1px solid rgba(0,240,255,0.15)', fontSize: '0.8rem', color: '#ccc' }}>📋 Drill-down: Tháng {drillDown} — {mr.find(m => m.month === drillDown)?.orders || 0} đơn hàng, doanh thu {(mr.find(m => m.month === drillDown)?.revenue || 0).toLocaleString()}đ</div>}
        </div>

        {/* Donut - Event Types */}
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}><PieChart size={18} color="#FF00E5" /><h3 style={{ margin: 0, fontSize: '0.9rem' }}>Loại Sự Kiện</h3></div>
          <DonutChart data={analytics?.eventTypeStats || []} colors={etColors} />
          <div style={{ marginTop: 16, borderTop: '1px solid #333', paddingTop: 12 }}>
            <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: 6 }}>Trạng thái đơn hàng (Funnel)</div>
            <FunnelChart data={osData} colors={funnelColors} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Contract Status */}
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><FileText size={16} color="#8B5CF6" /><h3 style={{ margin: 0, fontSize: '0.88rem' }}>Hợp Đồng</h3></div>
          {(analytics?.contractStatusStats || []).map((cs, i) => {
            const total = (analytics?.contractStatusStats || []).reduce((s, c) => s + c.count, 0) || 1;
            const pct = Math.round((cs.count / total) * 100);
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                  <span style={{ color: '#ccc' }}>{cs.name}</span>
                  <span style={{ color: csColors[cs.name] || '#888', fontWeight: 700 }}>{cs.count} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#222', borderRadius: 3 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: csColors[cs.name] || '#888', borderRadius: 3, transition: 'width 0.8s' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Contracts Table */}
        <div className="panel" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><Activity size={16} color="var(--accent-color)" /><h3 style={{ margin: 0, fontSize: '0.88rem' }}>Bảng Giao Dịch Gần Đây</h3></div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead><tr style={{ borderBottom: '1px solid #444' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Ngày</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Dự án</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Giá trị</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Trạng thái</th>
              </tr></thead>
              <tbody>
                {contracts.slice(0, 8).map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #2a2a2a' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,240,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '8px 10px', color: '#999' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                    <td style={{ padding: '8px 10px', color: '#ddd', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.proposalTitle || c.details?.slice(0, 30) || '—'}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: '#fff', fontWeight: 600, fontFamily: 'Outfit' }}>{(c.totalAmount || 0).toLocaleString()}đ</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span className={`badge ${c.status === 'Paid' ? 'success' : c.status === 'Approved' ? 'blue' : c.status === 'Pending' ? 'warning' : 'error'}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
                {contracts.length === 0 && <tr><td colSpan={4} style={{ padding: 30, textAlign: 'center', color: '#666' }}>Chưa có dữ liệu</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ PHÂN TÍCH DỰ BÁO & CHIẾN LƯỢC (AI-Powered) ═══ */}
      <div style={{ marginTop: 22, padding: '20px 24px', background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(255,0,229,0.05))', borderRadius: 14, border: '1px solid rgba(139,92,246,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔮</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Outfit' }}>Phân Tích Dự Báo & Chiến Lược (AI-Powered)</h3>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>Gemini AI | Data Mining | SWOT | Market Trends {aiInsights?.generatedAt ? `| Cập nhật: ${new Date(aiInsights.generatedAt).toLocaleString('vi-VN')}` : ''}</div>
            </div>
          </div>
          <button onClick={() => { setAiLoading(true); fetchGraphQL(`query { getAIInsights { swotStrengths swotWeaknesses swotOpportunities swotThreats marketTrends strategicRecommendations roadmapPhases { phase title items } generatedAt } }`).then(d => { setAiInsights(d.getAIInsights); setAiLoading(false); }).catch(() => setAiLoading(false)); }} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {aiLoading ? '⏳ AI đang phân tích...' : '🤖 Phân tích lại bằng AI'}
          </button>
        </div>

        {aiLoading && !aiInsights ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div style={{ fontSize: 30, marginBottom: 10 }}>🤖</div><div style={{ color: '#8B5CF6', fontFamily: 'Outfit' }}>Gemini AI đang phân tích dữ liệu hệ thống...</div></div>
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* SWOT Analysis - AI Generated */}
          <div className="panel" style={{ padding: 18 }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#00F0FF' }}>📊 Phân Tích SWOT <span style={{ fontSize: '0.65rem', background: 'rgba(139,92,246,0.2)', padding: '2px 8px', borderRadius: 10, color: '#8B5CF6', marginLeft: 8 }}>🤖 AI Generated</span></h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ title: '💪 Điểm Mạnh', data: aiInsights?.swotStrengths, bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', color: '#10B981' },
                { title: '⚠️ Điểm Yếu', data: aiInsights?.swotWeaknesses, bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', color: '#EF4444' },
                { title: '🚀 Cơ Hội', data: aiInsights?.swotOpportunities, bg: 'rgba(0,240,255,0.08)', border: 'rgba(0,240,255,0.2)', color: '#00F0FF' },
                { title: '🔥 Thách Thức', data: aiInsights?.swotThreats, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', color: '#F59E0B' },
              ].map((section, idx) => (
                <div key={idx} style={{ padding: 12, borderRadius: 10, background: section.bg, border: `1px solid ${section.border}` }}>
                  <div style={{ fontWeight: 700, color: section.color, fontSize: '0.78rem', marginBottom: 6 }}>{section.title}</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.7rem', color: '#aaa', lineHeight: 1.6 }}>
                    {(section.data || []).map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trends + Strategic Recommendations - AI Generated */}
          <div className="panel" style={{ padding: 18 }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#FF00E5' }}>📈 Xu Hướng & Khuyến Nghị <span style={{ fontSize: '0.65rem', background: 'rgba(139,92,246,0.2)', padding: '2px 8px', borderRadius: 10, color: '#8B5CF6', marginLeft: 8 }}>🤖 AI Generated</span></h4>
            <div style={{ fontSize: '0.75rem', color: '#00F0FF', fontWeight: 600, marginBottom: 8 }}>Xu hướng thị trường:</div>
            {(aiInsights?.marketTrends || []).map((t, i) => {
              const etC = ['#00F0FF', '#FF00E5', '#8B5CF6', '#10B981', '#F59E0B'];
              const numMatch = t.match(/(\d+)%?/);
              const pct = numMatch ? parseInt(numMatch[1]) : 50;
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 3 }}>
                    <span style={{ color: '#ccc' }}>↑ {t}</span>
                  </div>
                  <div style={{ height: 5, background: '#222', borderRadius: 3 }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: etC[i % etC.length], borderRadius: 3, transition: 'width 1s' }} />
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600, margin: '14px 0 8px' }}>🎯 Khuyến nghị chiến lược:</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.7rem', color: '#ccc', lineHeight: 1.8 }}>
              {(aiInsights?.strategicRecommendations || []).map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(139,92,246,0.08)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.15)', fontSize: '0.68rem', color: '#8B5CF6' }}>
              🤖 Phân tích bởi Google Gemini AI dựa trên dữ liệu thực của hệ thống Lumina EMS
            </div>
          </div>
        </div>
        )}

        {/* Strategic Roadmap - AI Generated */}
        <div className="panel" style={{ padding: 18 }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#F59E0B' }}>🗺️ Lộ Trình Chiến Lược <span style={{ fontSize: '0.65rem', background: 'rgba(139,92,246,0.2)', padding: '2px 8px', borderRadius: 10, color: '#8B5CF6', marginLeft: 8 }}>🤖 AI Generated</span></h4>
          <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, left: 30, right: 30, height: 3, background: 'linear-gradient(90deg, #00F0FF, #FF00E5, #F59E0B, #10B981)', borderRadius: 2, zIndex: 0 }} />
            {(aiInsights?.roadmapPhases || [
              { phase: 'Q3/2026', title: 'Tối ưu hóa', items: ['Đang chờ AI...'] },
              { phase: 'Q4/2026', title: 'Cá nhân hóa', items: ['Đang chờ AI...'] },
              { phase: 'Q1/2027', title: 'Mở rộng', items: ['Đang chờ AI...'] },
              { phase: 'Q2/2027', title: 'Đại dương xanh', items: ['Đang chờ AI...'] },
            ]).map((p, i) => {
              const colors = ['#00F0FF', '#FF00E5', '#F59E0B', '#10B981'];
              const icons = ['⚡', '🎯', '🚀', '🌊'];
              return (
              <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${colors[i%4]}20`, border: `2px solid ${colors[i%4]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 18 }}>{icons[i%4]}</div>
                <div style={{ fontSize: '0.72rem', color: colors[i%4], fontWeight: 700, marginBottom: 2 }}>{p.phase}</div>
                <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600, marginBottom: 6 }}>{p.title}</div>
                <ul style={{ margin: 0, padding: '0 10px', listStyle: 'none', fontSize: '0.68rem', color: '#999', lineHeight: 1.7 }}>
                  {(p.items||[]).map((item, j) => <li key={j}>• {item}</li>)}
                </ul>
              </div>
              );
            })}
          </div>
        </div>

        {/* Data Mining Tools */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 16 }}>
          {[
            { name: 'SimilarWeb', desc: 'Lưu lượng & nguồn KH', icon: '🌐', color: '#00F0FF' },
            { name: 'SEMrush', desc: 'SEO & Quảng cáo', icon: '🔍', color: '#FF00E5' },
            { name: 'BuzzSumo', desc: 'Nội dung viral', icon: '📱', color: '#F59E0B' },
            { name: 'Gemini AI', desc: 'Phân tích tự động', icon: '🤖', color: '#10B981' },
          ].map((tool, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: `${tool.color}08`, border: `1px solid ${tool.color}20`, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{tool.icon}</div>
              <div style={{ fontSize: '0.78rem', color: tool.color, fontWeight: 700 }}>{tool.name}</div>
              <div style={{ fontSize: '0.65rem', color: '#888' }}>{tool.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: '10px 16px', background: 'rgba(245,158,11,0.06)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.15)', fontSize: '0.72rem', color: '#999', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} color="#F59E0B" />
          Lưu ý: Phân tích SWOT và xu hướng được tạo tự động bởi Gemini AI dựa trên dữ liệu THỰC TẾ của hệ thống. Nhấn nút "Phân tích lại" để cập nhật mới nhất.
        </div>
      </div>

      {/* Footer info */}
      <div style={{ marginTop: 20, padding: '12px 18px', background: 'rgba(0,240,255,0.03)', borderRadius: 10, border: '1px solid rgba(0,240,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={12} /> Tự động cập nhật mỗi 30 giây | Đa nền tảng (Responsive) | Phân quyền Admin</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span>🔗 Real-time WebSocket</span>
          <span>📊 {mr.length} thang du lieu</span>
          <span>🔮 {forecast.length} thang du bao</span>
        </div>
      </div>
    </div>
  );
}
