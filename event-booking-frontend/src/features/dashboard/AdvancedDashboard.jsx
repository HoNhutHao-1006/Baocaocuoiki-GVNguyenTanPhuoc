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

const SVGLineChartForecast = ({ history, forecast }) => {
  const actualPoints = history || [];
  const predictedPoints = forecast || [];
  
  const allPoints = [
    ...actualPoints.map(p => ({ month: p.month, val: p.revenue, isForecast: false })),
    ...predictedPoints.map(p => ({ month: p.month, val: p.projectedRevenue, isForecast: true }))
  ];

  if (allPoints.length === 0) return <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Không có dữ liệu biểu đồ</div>;

  const maxVal = Math.max(...allPoints.map(p => p.val), 1);
  const w = 500;
  const h = 160;
  const paddingX = 45;
  const paddingY = 20;

  const getX = (idx) => paddingX + (idx / (allPoints.length - 1)) * (w - 2 * paddingX);
  const getY = (val) => h - paddingY - (val / maxVal) * (h - 2 * paddingY);

  let actualPath = '';
  let forecastPath = '';
  const lastActualIdx = actualPoints.length - 1;

  actualPoints.forEach((p, idx) => {
    const x = getX(idx);
    const y = getY(p.revenue);
    if (idx === 0) actualPath = `M ${x} ${y}`;
    else actualPath += ` L ${x} ${y}`;
  });

  if (lastActualIdx >= 0 && predictedPoints.length > 0) {
    const startX = getX(lastActualIdx);
    const startY = getY(actualPoints[lastActualIdx].revenue);
    forecastPath = `M ${startX} ${startY}`;
    predictedPoints.forEach((p, idx) => {
      const globalIdx = lastActualIdx + 1 + idx;
      const x = getX(globalIdx);
      const y = getY(p.projectedRevenue);
      forecastPath += ` L ${x} ${y}`;
    });
  }

  return (
    <div style={{ width: '100%' }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = getY(maxVal * ratio);
          return (
            <g key={i}>
              <line x1={paddingX} y1={y} x2={w - paddingX} y2={y} stroke="#222" strokeDasharray="3 3" />
              <text x={paddingX - 8} y={y + 3} fill="#555" fontSize="8" textAnchor="end">{(maxVal * ratio / 1000000).toFixed(1)}M</text>
            </g>
          );
        })}

        {actualPath && (
          <path d={actualPath} fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {forecastPath && (
          <path d={forecastPath} fill="none" stroke="#FF00E5" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
        )}

        {allPoints.map((p, idx) => {
          const x = getX(idx);
          const y = getY(p.val);
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="3.5" fill={p.isForecast ? '#FF00E5' : '#00F0FF'} stroke="#111" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="8" fill="transparent" style={{ cursor: 'pointer' }}>
                <title>{`${p.month}: ${(p.val).toLocaleString()}đ ${p.isForecast ? '(Dự báo)' : '(Thực tế)'}`}</title>
              </circle>
              <text x={x} y={h - 5} fill={p.isForecast ? '#FF00E5' : '#666'} fontSize="7" textAnchor="middle">{p.month.slice(5)}</text>
            </g>
          );
        })}
      </svg>
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
  const [feedbackStates, setFeedbackStates] = useState({});
  const [devInsightsOpen, setDevInsightsOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState(null);
  const [drillDownLoading, setDrillDownLoading] = useState(false);
  const [drillDownTab, setDrillDownTab] = useState('revenue');

  const loadData = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchGraphQL(`query { getSystemStats { totalRevenue totalTicketsSold activeUsers totalEvents pendingProposals totalContracts totalRefunded cancelledCount approvedEventsCount } }`),
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

  const loadAiInsights = useCallback((forceRefresh = false) => {
    setAiLoading(true);
    fetchGraphQL(`query GetAIInsightsV2($force: Boolean) {
      getAIInsightsV2(forceRefresh: $force) {
        businessHealth {
          score
          revenueStatus
          conversionRate
          retentionRate
          cancellationRate
          marketCompetitiveness
        }
        systemHealth {
          status
          slowestApis {
            endpoint
            responseTime
            errorRate
          }
          databaseInsights {
            collectionName
            suggestedIndexes
            reason
          }
          errorModules
        }
        forecasts {
          month
          historicalAverage
          projectedRevenue
          trendDirection
        }
        actionItems {
          id
          action
          reason
          category
          confidence
          impactScore
          priority
        }
        executiveSummary
        generatedAt
        isCached
      }
    }`, { force: forceRefresh })
      .then(d => {
        if (d && d.getAIInsightsV2) {
          setAiInsights(d.getAIInsightsV2);
        }
        setAiLoading(false);
      })
      .catch(() => setAiLoading(false));
  }, []);

  const handleFeedback = (actionId, isUseful) => {
    fetchGraphQL(`mutation SubmitFeedback($id: String!, $val: Boolean!) {
      submitActionFeedback(actionId: $id, isUseful: $val)
    }`, { id: actionId, val: isUseful })
      .then(() => {
        setFeedbackStates(prev => ({
          ...prev,
          [actionId]: isUseful ? 'useful' : 'useless'
        }));
      })
      .catch(err => console.error('Feedback submission failed:', err));
  };

  useEffect(() => { loadData(); const iv = setInterval(loadData, 30000); return () => clearInterval(iv); }, [loadData]);
  useEffect(() => {
    loadAiInsights(false);
  }, [loadAiInsights]);

  const loadDrillDown = useCallback(() => {
    setDrillDownLoading(true);
    fetchGraphQL(`query { getRevenueBreakdown {
      revenueByEvent { eventId eventTitle ticketRevenue contractRevenue totalRevenue ticketCount orderCount }
      recentTickets { orderId eventTitle memberName quantity totalAmount status createdAt seatLabels zoneName }
      topMembers { memberId memberName totalSpent orderCount }
      contractBreakdown { contractId proposalTitle totalAmount status createdAt }
      totalTicketRevenue totalContractRevenue
    } }`)
    .then(res => {
      setDrillDownData(res.getRevenueBreakdown);
      setDrillDownLoading(false);
    })
    .catch(() => setDrillDownLoading(false));
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

  const healthScore = aiInsights?.businessHealth?.score || 80;
  const systemHealth = aiInsights?.systemHealth || { status: 'Healthy', databaseInsights: [], slowestApis: [], errorModules: [] };
  const actionItems = aiInsights?.actionItems || [];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,rgba(0,240,255,0.2),rgba(255,0,229,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,240,255,0.3)' }}>
            <BarChart3 size={28} color="#00F0FF" />
          </div>
          <div>
            <h2 className="page-title" style={{ marginBottom: 0 }}>Thống Kê & Báo Cáo Toàn Cầu V2</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Dashboard phân tích dữ liệu & Business Engine | Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}</p>
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

      {/* AI Business Health Score Panel (Widget #1) */}
      <div className="panel" style={{ padding: '20px', marginBottom: '22px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(0, 240, 255, 0.05))', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
          {/* Circular Gauge Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '150px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#10B981', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Sức khỏe Doanh nghiệp</h4>
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke={healthScore >= 80 ? '#10B981' : healthScore >= 50 ? '#F59E0B' : '#EF4444'} 
                  strokeWidth="8" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)" 
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
                <text x="50" y="56" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="900" fontFamily="Outfit">{healthScore}</text>
              </svg>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#ccc', fontWeight: 600, marginTop: '8px' }}>Cạnh tranh: <strong style={{ color: '#00F0FF' }}>{aiInsights?.businessHealth?.marketCompetitiveness || 'Trung bình'}</strong></span>
          </div>

          {/* Sub-metrics info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#888' }}>Doanh thu tháng này</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginTop: '3px' }}>{aiInsights?.businessHealth?.revenueStatus || 'N/A'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#888' }}>Tỷ lệ Chuyển đổi</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981', fontFamily: 'Outfit', marginTop: '3px' }}>{aiInsights?.businessHealth?.conversionRate || 0}%</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#888' }}>Tỷ lệ Giữ chân</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00F0FF', fontFamily: 'Outfit', marginTop: '3px' }}>{aiInsights?.businessHealth?.retentionRate || 0}%</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#888' }}>Tỷ lệ Hủy vé</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EF4444', fontFamily: 'Outfit', marginTop: '3px' }}>{aiInsights?.businessHealth?.cancellationRate || 0}%</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ flex: '1.5 1 300px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#00F0FF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🔮 Tóm tắt Phân tích Điều hành (AI Narrative)</span>
              {aiInsights?.isCached && <span style={{ fontSize: '0.65rem', background: 'rgba(0,240,255,0.15)', color: '#00F0FF', padding: '2px 8px', borderRadius: '10px' }}>Cached</span>}
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#ddd', lineHeight: '1.6', margin: 0 }}>
              {aiInsights?.executiveSummary || (aiLoading ? 'AI đang lập luận báo cáo...' : 'Chưa có phân tích. Nhấp vào "Phân tích lại" để yêu cầu AI lập luận.')}
            </p>
          </div>
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
          <div key={i} className="panel" style={{ padding: '16px', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = ''} onClick={() => { setDrillDownTab(i === 0 ? 'revenue' : i === 1 ? 'tickets' : i === 2 ? 'members' : i === 5 ? 'contracts' : 'revenue'); loadDrillDown(); }}>
            <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: `${s.color}08` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            </div>
            <div style={{ color: '#777', fontSize: '0.7rem', fontWeight: 500, marginBottom: 3 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: '1.3rem', fontFamily: 'Outfit', fontWeight: 900, lineHeight: 1 }}>{s.fmt(s.value)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 6, fontSize: '0.65rem', color: s.up ? '#10B981' : '#F59E0B' }}>
              {s.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{s.trend}
            </div>
            <div style={{ fontSize: '0.58rem', color: '#555', marginTop: 4, textAlign: 'right' }}>🔍 Chi tiết</div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr', gap: 16, marginBottom: 22 }}>
        {/* SVG Line Chart Forecast (Moving Average V2) */}
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><TrendingUp size={18} color="#00F0FF" /><h3 style={{ margin: 0, fontSize: '0.9rem' }}>Doanh Thu & Dự Báo (Moving Average V2)</h3></div>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.7rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 4, borderRadius: 2, background: '#00F0FF' }} /> Thực tế</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 10, height: 4, borderRadius: 2, background: '#FF00E5', strokeDasharray: '2 2' }} /> Dự báo MA</span>
            </div>
          </div>
          <div style={{ padding: '10px 0' }}>
            <SVGLineChartForecast history={mr} forecast={aiInsights?.forecasts} />
          </div>
          {drillDown && <div style={{ padding: '10px 14px', background: 'rgba(0,240,255,0.05)', borderRadius: 8, border: '1px solid rgba(0,240,255,0.15)', fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }}>📋 Drill-down: Tháng {drillDown} — {mr.find(m => m.month === drillDown)?.orders || 0} đơn hàng, doanh thu {(mr.find(m => m.month === drillDown)?.revenue || 0).toLocaleString()}đ</div>}
        </div>

        {/* Donut - Event Types */}
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}><PieChart size={18} color="#FF00E5" /><h3 style={{ margin: 0, fontSize: '0.9rem' }}>Loại Sự Kiện</h3></div>
          <DonutChart data={analytics?.eventTypeStats || []} colors={etColors} />
          <div style={{ marginTop: 16, borderTop: '1px solid #333', paddingTop: 12 }}>
            <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: 6 }}>Trạng thái đơn hàng (Funnel)</div>
            {osData.length === 0 ? (
              <div style={{ padding: '20px 0', fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>Chưa có dữ liệu đơn hàng</div>
            ) : (
              <FunnelChart data={osData} colors={funnelColors} />
            )}
          </div>
        </div>
      </div>

      {/* Middle Grid - Contracts, Transactions, and Developer Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 1.5fr', gap: 16, marginBottom: 22 }}>
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
        <div className="panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><Activity size={16} color="var(--accent-color)" /><h3 style={{ margin: 0, fontSize: '0.88rem' }}>Bảng Giao Dịch Gần Đây</h3></div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #444' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Ngày</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Dự án</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Giá trị</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', color: '#00F0FF', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {contracts.slice(0, 6).map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #2a2a2a' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,240,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '8px 10px', color: '#999' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                    <td style={{ padding: '8px 10px', color: '#ddd', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.proposalTitle || c.details?.slice(0, 30) || '—'}</td>
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

        {/* Developer Insights (System Health) - Collapsible */}
        <div className="panel" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.01)', overflow: 'hidden' }}>
          <div 
            onClick={() => setDevInsightsOpen(prev => !prev)} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
          >
            <span style={{ fontSize: '1.2rem' }}>🛠️</span>
            <h3 style={{ margin: 0, fontSize: '0.88rem', fontFamily: 'Outfit', color: '#fff' }}>Developer Insights</h3>
            <span style={{ 
              fontSize: '0.65rem', 
              padding: '2px 8px', 
              borderRadius: '10px', 
              fontWeight: 700,
              background: systemHealth?.status === 'Critical' ? 'rgba(239,68,68,0.2)' : systemHealth?.status === 'Warning' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
              color: systemHealth?.status === 'Critical' ? '#EF4444' : systemHealth?.status === 'Warning' ? '#F59E0B' : '#10B981'
            }}>
              {systemHealth?.status || 'Healthy'}
            </span>
            <span style={{ 
              marginLeft: 'auto', 
              fontSize: '0.75rem', 
              color: '#888', 
              transition: 'transform 0.3s ease',
              transform: devInsightsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              display: 'inline-block'
            }}>▼</span>
          </div>

          <div style={{ 
            maxHeight: devInsightsOpen ? '500px' : '0px', 
            overflow: 'hidden', 
            transition: 'max-height 0.35s ease, opacity 0.3s ease, margin-top 0.3s ease',
            opacity: devInsightsOpen ? 1 : 0,
            marginTop: devInsightsOpen ? '14px' : '0px'
          }}>
            {/* Missing index alerts */}
            {systemHealth?.databaseInsights && systemHealth.databaseInsights.length > 0 ? (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '8px 10px', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔴</span> CẢNH BÁO MONGODB THIẾU INDEX
                </div>
                {systemHealth.databaseInsights.map((insight, idx) => (
                  <div key={idx} style={{ fontSize: '0.68rem', color: '#ccc', marginTop: '6px', lineHeight: '1.4' }}>
                    • Collection <strong style={{ color: '#fff' }}>{insight.collectionName}</strong>: Thiếu index trên <strong>{insight.suggestedIndexes.join(', ')}</strong>.
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.72rem', color: '#10B981', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✅</span> MongoDB Indexes đã được tối ưu hóa
              </div>
            )}

            {/* Slowest APIs */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600, marginBottom: '6px' }}>⚠️ API phản hồi chậm nhất:</div>
              {systemHealth?.slowestApis?.map((api, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', padding: '5px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', marginBottom: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#ccc', fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }} title={api.endpoint}>{api.endpoint}</span>
                  <span style={{ color: api.responseTime > 2.0 ? '#EF4444' : '#F59E0B', fontWeight: 700 }}>{api.responseTime}s</span>
                </div>
              ))}
            </div>

            {/* Error Modules */}
            <div>
              <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600, marginBottom: '6px' }}>❌ Modules lỗi nhiều nhất:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {systemHealth?.errorModules?.map((mod, idx) => (
                  <span key={idx} style={{ fontSize: '0.62rem', background: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Board V2 (AI Action items with feedback loop) */}
      <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(255,0,229,0.05))', borderRadius: 14, border: '1px solid rgba(139,92,246,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔮</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Outfit' }}>Bảng Hành Động Đề Xuất & Chiến Lược AI (V2)</h3>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>Gemini AI | Phân tích giải thích lý do & lập luận {aiInsights?.generatedAt ? `| Cập nhật: ${new Date(aiInsights.generatedAt).toLocaleString('vi-VN')}` : ''}</div>
            </div>
          </div>
          <button 
            onClick={() => loadAiInsights(true)} 
            disabled={aiLoading}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {aiLoading ? '⏳ AI đang phân tích...' : '🤖 Phân tích lại bằng AI'}
          </button>
        </div>

        {aiLoading && !aiInsights ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div style={{ fontSize: 30, marginBottom: 10 }}>🤖</div><div style={{ color: '#8B5CF6', fontFamily: 'Outfit' }}>Gemini AI đang phân tích dữ liệu hệ thống...</div></div>
        ) : (
          <div>
            <div className="panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', color: '#00F0FF', fontWeight: 600 }}>Phân loại</th>
                      <th style={{ padding: '8px 10px', color: '#00F0FF', fontWeight: 600 }}>Đề xuất hành động</th>
                      <th style={{ padding: '8px 10px', color: '#00F0FF', fontWeight: 600 }}>Lập luận & Lý do của AI</th>
                      <th style={{ padding: '8px 10px', color: '#00F0FF', fontWeight: 600, textAlign: 'center' }}>Độ tin cậy</th>
                      <th style={{ padding: '8px 10px', color: '#00F0FF', fontWeight: 600, textAlign: 'center' }}>Tác động</th>
                      <th style={{ padding: '8px 10px', color: '#00F0FF', fontWeight: 600, textAlign: 'center' }}>Ưu tiên</th>
                      <th style={{ padding: '8px 10px', color: '#00F0FF', fontWeight: 600, textAlign: 'center' }}>Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #222' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,240,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                        <td style={{ padding: '10px' }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            padding: '3px 8px', 
                            borderRadius: '4px', 
                            fontWeight: 700,
                            background: item.category === 'Pricing' ? 'rgba(139,92,246,0.15)' : item.category === 'Marketing' ? 'rgba(0,240,255,0.15)' : 'rgba(245,158,11,0.15)',
                            color: item.category === 'Pricing' ? '#8B5CF6' : item.category === 'Marketing' ? '#00F0FF' : '#F59E0B'
                          }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontWeight: 600, color: '#fff', width: '180px' }}>{item.action}</td>
                        <td style={{ padding: '10px', color: '#aaa', fontStyle: 'italic', maxWidth: '300px', lineHeight: '1.4' }}>{item.reason}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                            <div style={{ width: '40px', height: '4px', background: '#222', borderRadius: '2px' }}>
                              <div style={{ width: `${item.confidence || 50}%`, height: '100%', background: '#10B981', borderRadius: '2px' }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#10B981' }}>{item.confidence || 50}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#10B981', fontWeight: 700 }}>+{item.impactScore || 0}%</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontWeight: 700,
                            background: item.priority === 'Cao' ? 'rgba(239,68,68,0.15)' : item.priority === 'Trung bình' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                            color: item.priority === 'Cao' ? '#EF4444' : item.priority === 'Trung bình' ? '#F59E0B' : '#10B981'
                          }}>
                            {item.priority}
                          </span>
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          {feedbackStates[item.id] ? (
                            <span style={{ fontSize: '0.7rem', color: feedbackStates[item.id] === 'useful' ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                              {feedbackStates[item.id] === 'useful' ? '👍 Hữu ích' : '👎 Không hữu ích'}
                            </span>
                          ) : (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleFeedback(item.id, true)} 
                                style={{ background: 'transparent', border: '1px solid #333', color: '#888', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.color = '#10B981'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}
                              >
                                👍
                              </button>
                              <button 
                                onClick={() => handleFeedback(item.id, false)} 
                                style={{ background: 'transparent', border: '1px solid #333', color: '#888', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}
                              >
                                👎
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {actionItems.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#666' }}>Không có đề xuất hành động nào được tạo.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Data Mining Tools */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 16 }}>
          {[
            { name: 'SimilarWeb', desc: 'Lưu lượng & nguồn KH', icon: '🌐', color: '#00F0FF' },
            { name: 'SEMrush', desc: 'SEO & Quảng cáo', icon: '🔍', color: '#FF00E5' },
            { name: 'BuzzSumo', desc: 'Nội dung viral', icon: '📱', color: '#F59E0B' },
            { name: 'Gemini AI V2', desc: 'Phân tích tự động', icon: '🤖', color: '#10B981' },
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
          Lưu ý: Phân tích sức khỏe doanh nghiệp, sức khỏe hệ thống và hành động được thiết lập bởi thuật toán Business Engine kết hợp cùng lập luận giải thích của Gemini AI.
        </div>
      </div>

      {/* Footer info */}
      <div style={{ marginTop: 20, padding: '12px 18px', background: 'rgba(0,240,255,0.03)', borderRadius: 10, border: '1px solid rgba(0,240,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={12} /> Tự động cập nhật mỗi 30 giây | Đa nền tảng (Responsive) | Phân quyền Admin</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span>🔗 Real-time WebSocket</span>
          <span>📊 {mr.length} tháng dữ liệu</span>
          <span>🔮 {aiInsights?.forecasts?.length || 3} tháng dự báo</span>
        </div>
      </div>

      {/* ====== DRILL-DOWN MODAL ====== */}
      {drillDownData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setDrillDownData(null)}>
          <div style={{ background: '#111', borderRadius: 16, border: '1px solid rgba(0,240,255,0.2)', width: '90%', maxWidth: '1000px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Outfit', fontSize: '1.1rem', color: '#fff' }}>📊 Chi Tiết Doanh Thu & Giao Dịch</h3>
                <div style={{ fontSize: '0.72rem', color: '#888', marginTop: 4 }}>
                  Vé: <strong style={{ color: '#00F0FF' }}>{(drillDownData.totalTicketRevenue || 0).toLocaleString()}đ</strong> | Hợp đồng: <strong style={{ color: '#8B5CF6' }}>{(drillDownData.totalContractRevenue || 0).toLocaleString()}đ</strong>
                </div>
              </div>
              <button onClick={() => setDrillDownData(null)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>✕ Đóng</button>
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 24px', borderBottom: '1px solid #222', display: 'flex', gap: 0 }}>
              {[
                { key: 'revenue', label: '🎯 Doanh thu theo Sự kiện' },
                { key: 'tickets', label: '🎫 Vé gần đây' },
                { key: 'members', label: '👑 Top Khách hàng' },
                { key: 'contracts', label: '📝 Hợp đồng' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setDrillDownTab(tab.key)} style={{
                  padding: '12px 18px', background: 'transparent', border: 'none', borderBottom: drillDownTab === tab.key ? '2px solid #00F0FF' : '2px solid transparent',
                  color: drillDownTab === tab.key ? '#00F0FF' : '#888', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s'
                }}>{tab.label}</button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>

              {/* Tab: Revenue by Event */}
              {drillDownTab === 'revenue' && (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Sự kiện</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Vé</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>DT Vé</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>DT HĐ</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillDownData.revenueByEvent?.map((r, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #1a1a1a' }}>
                          <td style={{ padding: '10px 8px', color: '#fff', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: etColors[idx % etColors.length], flexShrink: 0 }} />
                              <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{r.eventTitle}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', padding: '10px 8px', color: '#ccc' }}>{r.ticketCount} vé ({r.orderCount} đơn)</td>
                          <td style={{ textAlign: 'right', padding: '10px 8px', color: '#00F0FF', fontWeight: 700, fontFamily: 'Outfit' }}>{(r.ticketRevenue || 0).toLocaleString()}đ</td>
                          <td style={{ textAlign: 'right', padding: '10px 8px', color: '#8B5CF6', fontWeight: 700, fontFamily: 'Outfit' }}>{(r.contractRevenue || 0).toLocaleString()}đ</td>
                          <td style={{ textAlign: 'right', padding: '10px 8px', color: '#10B981', fontWeight: 800, fontFamily: 'Outfit', fontSize: '0.85rem' }}>{(r.totalRevenue || 0).toLocaleString()}đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!drillDownData.revenueByEvent || drillDownData.revenueByEvent.length === 0) && <div style={{ textAlign: 'center', color: '#666', padding: 30 }}>Chưa có dữ liệu doanh thu</div>}
                </div>
              )}

              {/* Tab: Recent Tickets */}
              {drillDownTab === 'tickets' && (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Người mua</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Sự kiện</th>
                        <th style={{ textAlign: 'center', padding: '10px 8px', color: '#888', fontWeight: 600 }}>SL</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Tiền</th>
                        <th style={{ textAlign: 'center', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Ghế/Khu</th>
                        <th style={{ textAlign: 'center', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Trạng thái</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillDownData.recentTickets?.map((t, idx) => {
                        const statusColors = { Paid: '#10B981', CheckedIn: '#00F0FF', Held: '#F59E0B', Cancelled: '#EF4444' };
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '8px', color: '#fff', fontWeight: 600 }}>{t.memberName}</td>
                            <td style={{ padding: '8px', color: '#ccc', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.eventTitle}</td>
                            <td style={{ padding: '8px', textAlign: 'center', color: '#ccc' }}>{t.quantity}</td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#00F0FF', fontWeight: 700, fontFamily: 'Outfit' }}>{(t.totalAmount || 0).toLocaleString()}đ</td>
                            <td style={{ padding: '8px', textAlign: 'center', color: '#999', fontSize: '0.68rem' }}>{t.seatLabels?.join(', ') || '-'} {t.zoneName ? `(${t.zoneName})` : ''}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, background: `${statusColors[t.status] || '#666'}18`, color: statusColors[t.status] || '#666', border: `1px solid ${statusColors[t.status] || '#666'}30` }}>{t.status}</span>
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#888', fontSize: '0.68rem' }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {(!drillDownData.recentTickets || drillDownData.recentTickets.length === 0) && <div style={{ textAlign: 'center', color: '#666', padding: 30 }}>Chưa có vé nào</div>}
                </div>
              )}

              {/* Tab: Top Members */}
              {drillDownTab === 'members' && (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'center', padding: '10px 8px', color: '#888', fontWeight: 600, width: 40 }}>#</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Khách hàng</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Tổng chi</th>
                        <th style={{ textAlign: 'center', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Số đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillDownData.topMembers?.map((m, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #1a1a1a' }}>
                          <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '0.85rem' }}>{idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1}</td>
                          <td style={{ padding: '10px 8px', color: '#fff', fontWeight: 600 }}>{m.memberName}</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right', color: '#10B981', fontWeight: 800, fontFamily: 'Outfit' }}>{(m.totalSpent || 0).toLocaleString()}đ</td>
                          <td style={{ padding: '10px 8px', textAlign: 'center', color: '#ccc' }}>{m.orderCount} đơn</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!drillDownData.topMembers || drillDownData.topMembers.length === 0) && <div style={{ textAlign: 'center', color: '#666', padding: 30 }}>Chưa có dữ liệu</div>}
                </div>
              )}

              {/* Tab: Contracts */}
              {drillDownTab === 'contracts' && (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Hợp đồng</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Giá trị</th>
                        <th style={{ textAlign: 'center', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Trạng thái</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600 }}>Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drillDownData.contractBreakdown?.map((c, idx) => {
                        const cColors = { Paid: '#10B981', Deposited: '#8B5CF6', Pending: '#F59E0B', Approved: '#00F0FF', Cancelled: '#EF4444' };
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '10px 8px', color: '#fff', fontWeight: 600, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.proposalTitle}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#8B5CF6', fontWeight: 800, fontFamily: 'Outfit' }}>{(c.totalAmount || 0).toLocaleString()}đ</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                              <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, background: `${cColors[c.status] || '#666'}18`, color: cColors[c.status] || '#666', border: `1px solid ${cColors[c.status] || '#666'}30` }}>{c.status}</span>
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'right', color: '#888', fontSize: '0.72rem' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {(!drillDownData.contractBreakdown || drillDownData.contractBreakdown.length === 0) && <div style={{ textAlign: 'center', color: '#666', padding: 30 }}>Chưa có hợp đồng</div>}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Loading overlay for drill-down */}
      {drillDownLoading && !drillDownData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
            <div style={{ color: '#00F0FF', fontFamily: 'Outfit', fontSize: '1rem' }}>Đang tải chi tiết doanh thu...</div>
          </div>
        </div>
      )}
    </div>
  );
}
