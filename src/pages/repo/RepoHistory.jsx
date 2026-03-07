import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../utils/api';

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
}

export default function RepoHistory() {
  const { repoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/${repoId}/history`);
        if (!active) return;
        setHistoryData(res?.data || null);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load repository history.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [repoId]);

  const orderedTrend = useMemo(() => {
    const trend = historyData?.trend || [];
    return [...trend].sort((a, b) => (b.version || 0) - (a.version || 0));
  }, [historyData]);
  const canDownloadReport = orderedTrend.length > 0;

  const handleDownload = async () => {
    if (!canDownloadReport) return;
    try {
      await api.download(`/${repoId}/report/pdf`, `repo-${repoId}-report.pdf`);
    } catch (err) {
      setError(err.message || 'Failed to download PDF report.');
    }
  };

  return (
    <div style={{ padding: 'clamp(12px,3vw,24px)', color: '#d8f3dc' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0 }}>Repository History</h2>
          <p style={{ margin: '8px 0 0', opacity: 0.8 }}>
            Saved analysis snapshots for repository <strong>{repoId}</strong>
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={!canDownloadReport}
          title={canDownloadReport ? 'Download Report PDF' : 'Report not generated yet'}
          style={{
            background: '#14532d',
            color: '#d8f3dc',
            border: '1px solid #22c55e',
            padding: '8px 12px',
            borderRadius: 6,
            cursor: canDownloadReport ? 'pointer' : 'not-allowed',
            opacity: canDownloadReport ? 1 : 0.5,
          }}
        >
          Download Report PDF
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Link to={`/${repoId}`} style={{ color: '#8ce99a', textDecoration: 'none' }}>Back to Overview</Link>
      </div>

      {loading && <p>Loading history...</p>}
      {!loading && error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

      {!loading && !error && orderedTrend.length === 0 && (
        <p>No saved report history available yet.</p>
      )}

      {!loading && !error && historyData && (
        <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
          <div style={{ border: '1px solid #2d6a4f', borderRadius: 8, padding: 14, background: '#081c15' }}>
            <strong>Repository Intelligence</strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginTop: 10 }}>
              <div>Regression Alert: {String(historyData.regression_alert ?? false)}</div>
              <div>Engineering Velocity: {historyData.engineering_velocity ?? 0}</div>
              <div>Stability Index: {historyData.stability_index ?? 0}</div>
              <div>Volatility Score: {historyData.volatility_score ?? 0}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                Degradation Prediction: {JSON.stringify(historyData.degradation_prediction ?? null)}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && orderedTrend.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {orderedTrend.map((item, index) => (
            <div
              key={`${item.version}-${item.created_at}`}
              style={{
                border: '1px solid #2d6a4f',
                borderRadius: 8,
                padding: 14,
                background: '#081c15',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{index === 0 ? 'Latest' : `Version ${item.version}`}</strong>
                <span>{formatDate(item.created_at)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
                <div>Architecture: {item.architecture_score ?? 0}</div>
                <div>Layer: {item.layer_score ?? 0}</div>
                <div>Avg Complexity: {(item.avg_complexity ?? 0).toFixed(2)}</div>
                <div>Dead Functions: {item.dead_functions ?? 0}</div>
                <div>Maturity: {item.maturity_score ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && historyData && <div style={{ marginTop: 16 }} />}
    </div>
  );
}
