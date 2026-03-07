import { useParams, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const getSeverityColor = (severity) => {
  const severityMap = {
    'CRITICAL': '#f87171',
    'HIGH': '#fb923c',
    'MEDIUM': '#fbbf24',
    'LOW': '#86efac'
  };
  return severityMap[severity] || '#1a4a2e';
};

const getRiskLevel = (riskScore) => {
  if (riskScore > 70) return 'HIGH';
  if (riskScore > 40) return 'MEDIUM';
  return 'LOW';
};

const SectionLabel = ({ title, sub, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}>
    <div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 'clamp(10px,3vw,16px)', letterSpacing: 2, color: '#4ade80', marginBottom: 4 }}>{title}</div>
      <div style={{ fontFamily: "'VT323',monospace", fontSize: 'clamp(12px,2vw,16px)', color: '#1a4a2e', opacity: 0.8 }}>{sub}</div>
    </div>
    {right}
  </div>
);

const CornerPip = ({ color = '#4ade80' }) => (
  <>
    <div style={{ position: 'absolute', top: -8, left: -8, width: 14, height: 14, background: color, opacity: 0.5 }} />
    <div style={{ position: 'absolute', top: -8, right: -8, width: 14, height: 14, background: color, opacity: 0.5 }} />
    <div style={{ position: 'absolute', bottom: -8, left: -8, width: 14, height: 14, background: color, opacity: 0.5 }} />
    <div style={{ position: 'absolute', bottom: -8, right: -8, width: 14, height: 14, background: color, opacity: 0.5 }} />
  </>
);

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');
  
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
  @keyframes mcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
  @keyframes neonPulse{0%,100%{text-shadow:2px 2px 0 #040d07,0 0 12px rgba(74,222,128,0.3);}50%{text-shadow:2px 2px 0 #040d07,0 0 28px rgba(74,222,128,0.7);}}
  @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
  
  .pg{position:absolute;inset:0;background-image:linear-gradient(rgba(74,222,128,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.02) 1px,transparent 1px);background-size:34px 34px;pointer-events:none;z-index:0;}
  .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
  .scanline::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(74,222,128,0.04);animation:scanMove 14s linear infinite;}
  
  .mc-card{background:#0b1e10;border:3px solid #1a4528;position:relative;overflow:hidden;}
  .mc-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(74,222,128,0.03) 0%,transparent 60%);pointer-events:none;}
  
  .mc-btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:'Press Start 2P',monospace;font-size:8px;letter-spacing:1px;padding:10px 18px;color:#4ade80;text-decoration:none;cursor:pointer;background:transparent;border:3px solid #22c55e;box-shadow:3px 3px 0 #052e16;transition:all 0.1s;}
  .mc-btn-ghost:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #052e16;background:rgba(74,222,128,0.06);}
  .mc-btn-ghost:disabled{opacity:0.5;cursor:not-allowed;}
`;

const Torch = () => (
  <div style={{ fontSize: '16px', opacity: 0.5, color: '#4ade80', letterSpacing: 2 }}>||</div>
);

const DiamondOre = () => (
  <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: '12px', animation: 'mcFloat 2s ease-in-out infinite', color: '#4ade80' }}>
    ANALYSIS
  </div>
);

function RepoTabBar({ repoId }) {
  const tabs = [
    { to: `/${repoId}`,           label: 'Overview',   end: true },
    { to: `/${repoId}/structure`, label: 'Structure'             },
    { to: `/${repoId}/graph`,     label: 'Call Graph'            },
    { to: `/${repoId}/analytics`, label: 'Analytics'             },
    { to: `/${repoId}/pr-analysis`, label: 'PR Analysis'         },
    { to: `/${repoId}/ask`,       label: 'Ask AI'                },
    { to: `/${repoId}/history`,   label: 'History'               },
  ];
  return (
    <div style={{ display: 'flex', borderBottom: '3px solid #22c55e', marginBottom: 28, gap: 0, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
      <Torch style={{ alignSelf: 'center', marginRight: 6 }} />
      {tabs.map(({ to, label, end }) => (
        <NavLink key={to} to={to} end={end}
          className={({ isActive }) => `tab-link${isActive ? ' tab-active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
      <Torch style={{ alignSelf: 'center', marginLeft: 6 }} />
    </div>
  );
}

function Page({ children }) {
  return (
    <>
      <style>{SHARED_CSS}</style>
      <div style={{ background: '#040d07', minHeight: '100%', padding: 'clamp(14px,3vw,28px)', position: 'relative', animation: 'fadeUp 0.4s ease both' }}>
        <div className="pg" /><div className="scanline" />
        {children}
      </div>
    </>
  );
}

const TAB_CSS = `
  .tab-link{padding:10px 18px;font-family:'Press Start 2P',monospace;font-size:7px;letter-spacing:1px;text-decoration:none;transition:all 0.12s;white-space:nowrap;border-bottom:3px solid transparent;margin-bottom:-3px;color:#1a4a2e;background:transparent;}
  .tab-link:hover{color:#4ade80;background:rgba(74,222,128,0.04);}
  .tab-active{color:#4ade80!important;background:#0d2a14!important;border-bottom:3px solid #4ade80!important;}
`;

export default function RepoPRAnalysis() {
  const { repoId } = useParams();
  const [analyses, setAnalyses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPR, setSelectedPR] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnalyses();
    fetchSummary();
  }, [repoId, page]);

  async function fetchAnalyses() {
    try {
      setLoading(true);
      const response = await api.get(`/${repoId}/pr-analyses?limit=${itemsPerPage}&skip=${(page-1)*itemsPerPage}`);
      if (response.success) {
        const payload = response?.data;
        const nestedPayload = payload?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(nestedPayload)
          ? nestedPayload
          : Array.isArray(payload?.analyses)
          ? payload.analyses
          : Array.isArray(nestedPayload?.analyses)
          ? nestedPayload.analyses
          : [];
        setAnalyses(list);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load PR analyses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSummary() {
    try {
      const response = await api.get(`/${repoId}/pr-analyses/summary`);
      if (response.success) {
        const payload = response?.data?.data || response?.data || {};
        setSummary({
          ...payload,
          issue_breakdown: payload?.issue_breakdown || {},
        });
      }
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  }

  return (
    <Page>
      <style>{TAB_CSS}</style>
      <div style={{ background: '#040d07', padding: 'clamp(14px,3vw,28px)', position: 'relative', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div className="pg" /><div className="scanline" />
        <RepoTabBar repoId={repoId} />
        <SectionLabel title="PR ANALYSIS" sub={`Automated code review for pull requests in ${repoId}`} right={<DiamondOre />} />

        {error && (
          <div className="mc-card" style={{ padding: '16px 20px', background: 'rgba(248,113,113,0.1)', border: '2px solid #f87171', marginBottom: 20, animation: 'fadeUp 0.3s ease both' }}>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#f87171' }}>{error}</div>
          </div>
        )}

        {/* Summary Stats */}
        {summary && (
          <div className="mc-card" style={{ padding: '24px', marginBottom: 28, boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.2s ease both' }}>
            <CornerPip color="#22c55e" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div style={{ padding: '12px 16px', background: '#0b1e10', border: '2px solid #1a4528' }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1, marginBottom: 8 }}>AVG RISK</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{getRiskLevel(summary.average_risk_score || 0)}</span>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 24, color: '#4ade80' }}>{Math.round(summary.average_risk_score || 0)}</span>
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: '#0b1e10', border: '2px solid #1a4528' }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1, marginBottom: 8 }}>TOTAL ISSUES</div>
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 24, color: '#fb923c' }}>{summary.total_issues_found || 0}</div>
              </div>
              <div style={{ padding: '12px 16px', background: '#0b1e10', border: '2px solid #1a4528' }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1, marginBottom: 8 }}>PRS ANALYZED</div>
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 24, color: '#a78bfa' }}>{summary.total_prs_analyzed || 0}</div>
              </div>
            </div>
            
            {summary.issue_breakdown && (
              <div>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#4ade80', letterSpacing: 1, marginBottom: 12 }}>SEVERITY BREAKDOWN</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {(() => {
                    const b = summary.issue_breakdown || {};
                    const critical = Number(b.critical ?? b.CRITICAL ?? 0);
                    const high = Number(b.high ?? b.HIGH ?? 0);
                    const medium = Number(b.medium ?? b.MEDIUM ?? 0);
                    const low = Number(b.low ?? b.LOW ?? 0);
                    return [
                      { level: 'CRITICAL', count: critical, color: '#f87171' },
                      { level: 'HIGH', count: high, color: '#fb923c' },
                      { level: 'MEDIUM', count: medium, color: '#fbbf24' },
                      { level: 'LOW', count: low, color: '#86efac' },
                    ];
                  })().map(({ level, count, color }) => (
                    <div key={level} style={{ padding: '10px 12px', background: '#020c06', border: `2px solid ${color}`, borderRadius: 2 }}>
                      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color, letterSpacing: 1, marginBottom: 4 }}>{level}</div>
                      <div style={{ fontFamily: "'VT323',monospace", fontSize: 20, color }}>{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PR List or Selected PR Detail */}
        {selectedPR ? (
          <div className="mc-card" style={{ padding: '24px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.2s ease both' }}>
            <CornerPip color="#a78bfa" />
            <button onClick={() => setSelectedPR(null)} className="mc-btn-ghost" style={{ marginBottom: 20 }}>BACK TO LIST</button>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#a78bfa', letterSpacing: 1, marginBottom: 12 }}>
                PR #{selectedPR.pr_number}
              </div>
              <div style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#86efac', marginBottom: 8 }}>{selectedPR.pr_title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: '6px 12px', background: '#020c06', border: '2px solid #a78bfa' }}>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#a78bfa' }}>
                    Risk: {getRiskLevel(selectedPR.overall_risk_score)} {Math.round(selectedPR.overall_risk_score)}/100
                  </div>
                </div>
                <div style={{ padding: '6px 12px', background: '#020c06', border: '2px solid #4ade80', fontFamily: "'VT323',monospace", fontSize: 16, color: '#4ade80' }}>
                  Files: {Array.isArray(selectedPR.files_analyzed) ? selectedPR.files_analyzed.length : selectedPR.files_changed || 0}
                </div>
              </div>
            </div>

            {Array.isArray(selectedPR.file_impacts) && selectedPR.file_impacts.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#f87171', letterSpacing: 1, marginBottom: 10 }}>
                  FILE-LEVEL MERGE IMPACT
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedPR.file_impacts.map((impact, idx) => (
                    <div key={`${impact.file}-${idx}`} className="mc-card" style={{ padding: '12px 14px', background: '#020c06', border: `2px solid ${getSeverityColor(impact.severity)}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 6, alignItems: 'center' }}>
                        <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#86efac', overflowWrap: 'anywhere' }}>
                          {impact.file}
                        </div>
                        <div style={{ padding: '4px 8px', border: `1px solid ${getSeverityColor(impact.severity)}`, fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: getSeverityColor(impact.severity) }}>
                          {impact.severity}
                        </div>
                      </div>
                      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', letterSpacing: 0.5, marginBottom: 6 }}>
                        {String(impact.change_type || 'modified').toUpperCase()} | RISK POINTS: {Math.round(Number(impact.risk_points || 0))}
                      </div>
                      <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#2d6a3f', marginBottom: 4 }}>
                        {impact.summary}
                      </div>
                      <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#86efac', marginBottom: impact.recommendation ? 6 : 0 }}>
                        Impact after merge: {impact.merge_impact}
                      </div>
                      {impact.recommendation && (
                        <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#fbbf24' }}>
                          Recommended fix: {impact.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(selectedPR.github_comment_body || selectedPR.ai_review) && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#60a5fa', letterSpacing: 1, marginBottom: 10 }}>
                  REVIEW COMMENT
                </div>
                <div className="mc-card" style={{ padding: '14px 16px', background: '#020c06', border: '2px solid #60a5fa', whiteSpace: 'pre-wrap' }}>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#86efac', lineHeight: 1.5 }}>
                    {selectedPR.github_comment_body || selectedPR.ai_review}
                  </div>
                </div>
              </div>
            )}

            {Array.isArray(selectedPR.criticality_reduction_fixes) && selectedPR.criticality_reduction_fixes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#fbbf24', letterSpacing: 1, marginBottom: 10 }}>
                  CRITICALITY REDUCTION FIXES
                </div>
                <div className="mc-card" style={{ padding: '14px 16px', background: '#020c06', border: '2px solid #fbbf24' }}>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {selectedPR.criticality_reduction_fixes.map((fix, idx) => (
                      <li key={idx} style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#86efac', lineHeight: 1.5, marginBottom: 6 }}>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Issues by Type */}
            {selectedPR.issues && selectedPR.issues.length > 0 && (
              <div>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 1, marginBottom: 16 }}>DETECTED ISSUES ({selectedPR.issues.length})</div>
                
                {['complexity', 'architecture', 'dead_code', 'security', 'performance', 'quality'].map(issueType => {
                  const typeIssues = selectedPR.issues.filter(i => i.type === issueType);
                  if (typeIssues.length === 0) return null;
                  return (
                    <div key={issueType} style={{ marginBottom: 20 }}>
                      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#4ade80', letterSpacing: 1, marginBottom: 8 }}>
                        {issueType.toUpperCase()} ({typeIssues.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {typeIssues.map((issue, idx) => (
                          <div key={idx} className="mc-card" style={{ padding: '12px 16px', background: '#020c06', border: `2px solid ${getSeverityColor(issue.severity)}`, opacity: 0.9 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 8 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#86efac', marginBottom: 4 }}>
                                  {issue.file}:{issue.line}
                                </div>
                                <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#2d6a3f' }}>{issue.message}</div>
                              </div>
                              <div style={{ padding: '4px 8px', background: '#020c06', border: `1px solid ${getSeverityColor(issue.severity)}` }}>
                                
                                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: getSeverityColor(issue.severity), marginLeft: 4, letterSpacing: 0.5 }}>
                                  {issue.severity}
                                </span>
                              </div>
                            </div>
                            {issue.suggestion && (
                              <div style={{ padding: '8px 12px', background: 'rgba(74,222,128,0.05)', border: '1px solid #1a4528', marginTop: 8 }}>
                                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', letterSpacing: 0.5, marginBottom: 4 }}>SUGGESTION</div>
                                <div style={{ fontFamily: "'VT323',monospace", fontSize: 12, color: '#1a4a2e' }}>{issue.suggestion}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {(!selectedPR.issues || selectedPR.issues.length === 0) && (
              <div style={{ padding: '20px', background: '#0b1e10', border: '2px solid #1a4528', textAlign: 'center' }}>
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>No issues detected in this PR</div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* PR List */}
            <div className="mc-card" style={{ padding: '24px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.2s ease both', marginBottom: 20 }}>
              <CornerPip color="#22c55e" />
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 1, marginBottom: 16 }}>PULL REQUESTS</div>
              
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#a78bfa' }}>
                    Loading...
                  </span>
                </div>
              ) : analyses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {analyses.map((analysis) => (
                    <div 
                      key={analysis._id || analysis.github_pr_id}
                      onClick={() => setSelectedPR(analysis)}
                      className="mc-card"
                      style={{ 
                        padding: '16px 20px', 
                        background: '#0b1e10', 
                        border: '2px solid #1a4528',
                        cursor: 'pointer',
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr 80px 120px',
                        alignItems: 'center',
                        gap: 16,
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#4ade80'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a4528'}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 28 }}>{getRiskLevel(analysis.overall_risk_score)}</div>
                        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', letterSpacing: 0.5, marginTop: 4 }}>
                          {Math.round(analysis.overall_risk_score)}
                        </div>
                      </div>
                      
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#4ade80', marginBottom: 4 }}>
                          #{analysis.pr_number}
                        </div>
                        <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#2d6a3f', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          {analysis.pr_title}
                        </div>
                        {(analysis.github_comment_body || analysis.ai_review) && (
                          <div style={{ fontFamily: "'VT323',monospace", fontSize: 13, color: '#86efac', marginTop: 6, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {analysis.github_comment_body || analysis.ai_review}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', letterSpacing: 0.5, marginBottom: 4 }}>ISSUES</div>
                        <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#fb923c' }}>
                          {(analysis.issues || []).length}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', letterSpacing: 0.5, marginBottom: 4 }}>COMPLEXITY</div>
                        <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#a78bfa' }}>
                          {Math.round(analysis.complexity_delta || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px', background: '#0b1e10', border: '2px solid #1a4528', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>No PR analyses yet</div>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#1a4a2e', marginTop: 8, opacity: 0.7 }}>
                    Create a pull request to get started with automated code review
                  </div>
                </div>
              )}
            </div>

                        {/* Pagination */}
            {analyses.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p-1))} 
                  disabled={page === 1}
                  className="mc-btn-ghost"
                  style={{ opacity: page === 1 ? 0.5 : 1 }}
                >
                  PREVIOUS
                </button>
                <div style={{ padding: '10px 16px', background: '#020c06', border: '2px solid #1a4528', alignSelf: 'center' }}>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#4ade80' }}>Page {page}</span>
                </div>
                <button 
                  onClick={() => setPage(p => p+1)} 
                  disabled={analyses.length < itemsPerPage}
                  className="mc-btn-ghost"
                  style={{ opacity: analyses.length < itemsPerPage ? 0.5 : 1 }}
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}





