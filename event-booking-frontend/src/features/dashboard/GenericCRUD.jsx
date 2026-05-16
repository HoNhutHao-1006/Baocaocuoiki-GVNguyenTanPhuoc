import React, { useState, useEffect } from 'react';
import { fetchGraphQL } from '../../api/axiosClient';

export default function GenericCRUD({ title, dataQuery, dataKey, columns, createMutation, formFields = [], dataFilter = null, headerIllustration = null, emptyMessage = null, enableDateFilter = false, dateFilterKey = 'createdAt' }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const limit = 10;

  const loadData = () => {
    let vars = {};
    if (dataQuery.includes('$page: Int')) {
      vars = { page, limit };
    }

    fetchGraphQL(dataQuery, vars)
      .then(res => {
        let fetchedData = res[dataKey] || [];
        if (dataFilter && typeof dataFilter === 'function') {
          fetchedData = fetchedData.filter(dataFilter);
        }
        setData(fetchedData);
      })
      .catch(e => {
        console.error(e);
        if (e.message && e.message.includes('Unauthorized')) alert("Phiên đăng nhập hết hạn hoặc bạn không có quyền!");
      });
  };

  useEffect(() => { loadData(); }, [dataQuery, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let vars = { ...formData };
      formFields.forEach(f => {
        if (f.type === 'number') vars[f.name] = Number(vars[f.name]);
      });
      await fetchGraphQL(createMutation, vars);
      alert("Thành công!");
      setShowModal(false);
      setFormData({});
      loadData();
    } catch (err) { alert(err.message); }
  };

  const filtered = data.filter(d => {
    const matchSearch = JSON.stringify(d).toLowerCase().includes(search.toLowerCase());
    if (!enableDateFilter || (!dateFrom && !dateTo)) return matchSearch;
    const raw = d[dateFilterKey];
    if (!raw) return matchSearch;
    const itemDate = new Date(isNaN(raw) ? raw : parseInt(raw));
    if (isNaN(itemDate)) return matchSearch;
    const item = itemDate.toISOString().slice(0, 10);
    if (dateFrom && item < dateFrom) return false;
    if (dateTo && item > dateTo) return false;
    return matchSearch;
  });

  return (
    <div>
      {/* Header with illustration */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {headerIllustration && (
            <div style={{ 
              width: 52, height: 52, borderRadius: 14, 
              background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,0,229,0.15))', 
              border: '1px solid rgba(0,240,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {headerIllustration}
            </div>
          )}
          <h2 className="page-title" style={{ marginBottom: 0 }}>{title}</h2>
        </div>
        {createMutation && <button className="btn" onClick={() => setShowModal(true)}>+ Thêm mới</button>}
      </div>

      {/* Stats ribbon */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 10, padding: '8px 18px', fontSize: '0.85rem', fontFamily: 'Outfit', fontWeight: 600 }}>
          📊 Tổng: <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>{data.length}</span> bản ghi
        </div>
        {filtered.length !== data.length && (
          <div style={{ background: 'rgba(255,0,229,0.08)', border: '1px solid rgba(255,0,229,0.2)', borderRadius: 10, padding: '8px 18px', fontSize: '0.85rem', fontFamily: 'Outfit', fontWeight: 600 }}>
            🔍 Kết quả: <span style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{filtered.length}</span>
          </div>
        )}
      </div>

      <div className="panel">
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="form-control" placeholder="🔍 Tim kiem du lieu..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 180 }} />
          {enableDateFilter && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#888' }}>
                <span>📅 Tu:</span>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #444', background: '#111', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
                <span>→ Den:</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #444', background: '#111', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
                {(dateFrom || dateTo) && <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#EF4444', cursor: 'pointer', fontSize: '0.72rem' }}>✕ Xoa</button>}
              </div>
            </>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #444' }}>
                {columns.map((c, i) => <th key={i} style={{ padding: 15, fontFamily: 'Outfit', fontWeight: 700, color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: 50, textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📭</div>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 600 }}>{emptyMessage || 'Chưa có dữ liệu nào'}</div>
                  </td>
                </tr>
              ) : filtered.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #333', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,240,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {columns.map((c, j) => <td key={j} style={{ padding: 15 }}>{c.render ? c.render(row, loadData) : row[c.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: 500 }}>
            <h2 className="page-title">Thêm mới {title}</h2>
            <form onSubmit={handleSubmit}>
              {formFields.map(f => (
                <div key={f.name} className="form-group">
                  <label>{f.label}</label>
                  {f.type === 'select' ? (
                    <select className="form-control" required value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}>
                      <option value="">-- Chọn --</option>
                      {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea className="form-control" required rows={3} value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} style={{ resize: 'vertical', minHeight: 80 }} />
                  ) : (
                    <input type={f.type || 'text'} className="form-control" required value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" className="btn">Lưu</button>
                <button type="button" className="btn outline" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
