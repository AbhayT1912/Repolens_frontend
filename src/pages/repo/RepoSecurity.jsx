import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export default function RepoSecurity() {
  const { repoId } = useParams();
  const [findings, setFindings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSecurityData();
  }, [repoId]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const [summaryRes, findingsRes] = await Promise.all([
        api.get(`/repos/${repoId}/security/summary`),
        api.get(`/repos/${repoId}/security/findings?limit=100`),
      ]);

      setSummary(summaryRes.data);
      setFindings(findingsRes.data.findings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: '#ff1744',
      HIGH: '#ff9100',
      MEDIUM: '#ffd600',
      LOW: '#76ff03',
    };
    return colors[severity] || '#4ade80';
  };

  const getTypeIcon = (type) => {
    const icons = {
      SECRET: '🔐',
      CVE: '⚠️',
      MALICIOUS_PATTERN: '🎯',
      BAD_PRACTICE: '📋',
      LICENSE_ISSUE: '⚖️',
    };
    return icons[type] || '🔍';
  };

  const filteredFindings = findings.filter((f) => {
    const typeMatch = filter === 'ALL' || f.type === filter;
    const severityMatch = severityFilter === 'ALL' || f.severity === severityFilter;
    return typeMatch && severityMatch;
  });

  const trustScoreStyles = {
    background: summary?.trust_score < 30 ? '#ff1744' : 
                summary?.trust_score < 60 ? '#ff9100' :
                summary?.trust_score < 80 ? '#ffd600' : '#76ff03',
    boxShadow: `0 0 20px ${summary?.trust_score < 30 ? '#ff1744' : 
                          summary?.trust_score < 60 ? '#ff9100' :
                          summary?.trust_score < 80 ? '#ffd600' : '#76ff03'}40`,
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#4ade80' }}>
        <p>🔍 Scanning for security issues...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: '#4ade80', fontFamily: 'VT323, monospace' }}>
      <style>{`
        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }
        .metric-card {
          background: #020c06;
          border: 2px solid #1a4528;
          padding: 16px;
          text-align: center;
          transition: all 0.2s;
        }
        .metric-card:hover {
          border-color: #4ade80;
          box-shadow: 0 0 12px rgba(74, 222, 128, 0.3);
        }
        .metric-value {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 8px;
          font-family: 'Press Start 2P', monospace;
        }
        .metric-label {
          font-size: 12px;
          color: #2d6a3f;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .trust-score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          border: 3px solid currentColor;
          font-size: 36px;
          font-weight: bold;
        }
        .findings-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .finding-item {
          background: #020c06;
          border: 2px solid #1a4528;
          padding: 16px;
          transition: all 0.2s;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .finding-item:hover {
          border-color: #4ade80;
          box-shadow: 0 0 12px rgba(74, 222, 128, 0.2);
          transform: translateX(4px);
        }
        .severity-badge {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
          border: 1px solid currentColor;
        }
        .finding-content {
          flex: 1;
        }
        .finding-title {
          font-size: 16px;
          color: #4ade80;
          margin-bottom: 6px;
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
        }
        .finding-desc {
          font-size: 12px;
          color: #2d6a3f;
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .finding-meta {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #1a4528;
        }
        .filter-btn {
          background: #020c06;
          border: 2px solid #1a4528;
          color: #2d6a3f;
          padding: 8px 16px;
          cursor: pointer;
          font-family: 'VT323', monospace;
          font-size: 14px;
          transition: all 0.2s;
          margin-right: 8px;
        }
        .filter-btn.active {
          border-color: #4ade80;
          color: #4ade80;
          box-shadow: 0 0 12px rgba(74, 222, 128, 0.3);
        }
        .filter-btn:hover {
          border-color: #4ade80;
          color: #4ade80;
        }
        .type-badge {
          display: inline-block;
          background: #1a4528;
          border: 1px solid #2d6a3f;
          padding: 4px 8px;
          margin-right: 8px;
          font-size: 10px;
          margin-bottom: 4px;
        }
      `}</style>

      <h1 style={{ fontSize: '24px', marginBottom: '32px', color: '#4ade80', textShadow: '2px 2px 0 #040d07' }}>
        🔒 Security Analysis
      </h1>

      {/* Summary Metrics */}
      {summary && (
        <div className="security-grid">
          <div className="metric-card">
            <div className="trust-score-circle" style={trustScoreStyles}>
              {summary.trust_score}
            </div>
            <div className="metric-label">Trust Score</div>
          </div>

          <div className="metric-card">
            <div className="metric-value" style={{ color: '#ff1744' }}>
              {summary.critical_vulnerabilities}
            </div>
            <div className="metric-label">🔴 Critical</div>
          </div>

          <div className="metric-card">
            <div className="metric-value" style={{ color: '#ff9100' }}>
              {summary.total_findings}
            </div>
            <div className="metric-label">Total Findings</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {Object.values(summary.by_type).reduce((a, b) => a + b, 0)}
            </div>
            <div className="metric-label">Issue Types</div>
          </div>
        </div>
      )}

      {/* Finding Type Breakdown */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: '🔐 Secrets', count: summary.by_type?.secrets || 0, type: 'SECRET' },
            { label: '⚠️ CVEs', count: summary.by_type?.dependencies || 0, type: 'CVE' },
            { label: '🎯 Malicious', count: summary.by_type?.malicious || 0, type: 'MALICIOUS_PATTERN' },
            { label: '📋 Bad Practice', count: summary.by_type?.sast || 0, type: 'BAD_PRACTICE' },
            { label: '⚖️ Licenses', count: summary.by_type?.licenses || 0, type: 'LICENSE_ISSUE' },
          ].map((item) => (
            <div
              key={item.type}
              className="metric-card"
              style={{
                cursor: 'pointer',
                opacity: filter === 'ALL' || filter === item.type ? 1 : 0.6,
              }}
              onClick={() => setFilter(filter === item.type ? 'ALL' : item.type)}
            >
              <div className="metric-value" style={{ fontSize: '20px' }}>
                {item.count}
              </div>
              <div className="metric-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '12px', fontSize: '14px' }}>Filter by Severity:</div>
        <div>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              className={`filter-btn ${severityFilter === sev ? 'active' : ''}`}
              onClick={() => setSeverityFilter(sev)}
              style={{
                color: sev !== 'ALL' ? getSeverityColor(sev) : '#2d6a3f',
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#4ade80' }}>
          📋 Findings ({filteredFindings.length})
        </h2>

        {filteredFindings.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#2d6a3f' }}>
            ✓ No findings match your filters
          </div>
        ) : (
          <div className="findings-container">
            {filteredFindings.map((finding) => (
              <div key={finding._id} className="finding-item">
                <div style={{ fontSize: '20px', minWidth: '24px' }}>
                  {getTypeIcon(finding.type)}
                </div>
                <div className="finding-content">
                  <div className="finding-title">{finding.title}</div>
                  <div className="finding-desc">{finding.description}</div>
                  <div className="type-badge">{finding.type}</div>
                  {finding.file_path && (
                    <div className="finding-meta">
                      <span>📁 {finding.file_path}</span>
                      {finding.line_number && <span>📍 Line {finding.line_number}</span>}
                    </div>
                  )}
                </div>
                <div
                  className="severity-badge"
                  style={{
                    color: getSeverityColor(finding.severity),
                    backgroundColor: getSeverityColor(finding.severity) + '20',
                  }}
                >
                  {finding.severity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Findings Summary */}
      {summary?.top_findings && summary.top_findings.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#ff9100' }}>
            ⚡ Top Findings to Fix
          </h2>
          <div style={{ background: '#020c06', border: '2px solid #1a4528', padding: '16px' }}>
            {summary.top_findings.map((finding, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: idx < summary.top_findings.length - 1 ? '1px solid #1a4528' : 'none',
                  color: getSeverityColor(finding.severity),
                }}
              >
                <span>{`${idx + 1}. ${finding.title}`}</span>
                <span style={{ fontSize: '11px' }}>{finding.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
