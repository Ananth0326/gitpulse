/* GitPulse Component */
import React, { useState, useEffect } from 'react';

const ScoreRing = ({ score, label, tooltip }) => {
  const [offset, setOffset] = useState(283); // 2 * PI * 45
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    const progress = (score / 100) * 283;
    setOffset(283 - progress);
  }, [score]);

  const getColor = (s) => {
    if (s >= 70) return '#22c55e';
    if (s >= 40) return '#eab308';
    return '#ef4444';
  };

  const color = getColor(score);

  return (
    <div className="score-item">
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <svg width="100" height="100" className="score-ring-svg">
          <circle 
            cx="50" cy="50" r="45" 
            fill="transparent" 
            stroke="#1e1e3a" 
            strokeWidth="8" 
          />
          <circle 
            cx="50" cy="50" r="45" 
            fill="transparent" 
            stroke={color} 
            strokeWidth="8" 
            strokeDasharray="283"
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
        </svg>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: '700',
          color: '#fff'
        }} className="font-mono">
          {Math.round(score)}
        </div>

        {tooltip && (
          <div 
            className="info-icon-wrapper"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ top: '-5px', right: '-5px' }}
          >
            <div className="info-icon">i</div>
            {showTooltip && (
              <div className="tooltip-bubble" style={{ width: '220px' }}>
                {tooltip}
                <div className="tooltip-arrow"></div>
              </div>
            )}
          </div>
        )}
      </div>
      <span className="score-label">{label}</span>

      <style>{`
        .info-icon-wrapper {
          position: absolute;
          cursor: pointer;
          z-index: 50;
        }
        .info-icon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid #4B5563;
          color: #9CA3AF;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          background: #0d0d1a;
          transition: border-color 0.2s, color 0.2s;
        }
        .info-icon-wrapper:hover .info-icon {
          border-color: #6366f1;
          color: #fff;
        }
        .tooltip-bubble {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: #1e1e3a;
          border: 1px solid #6366f1;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #e2e8f0;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          animation: fadeIn 150ms ease-out;
          line-height: 1.4;
          text-align: left;
        }
        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #6366f1;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

const DeveloperScores = ({ stats }) => {
  if (!stats || !stats.summary) return null;
  const s = stats.summary;
  const langs = stats.languages || [];

  const consistency = (s.active_weeks / 52) * 100;

  const langCount = langs.length;
  const diversityMap = [10, 20, 40, 55, 70, 85, 100];
  const diversity = diversityMap[Math.min(langCount, 6)];

  const avgWeekly = s.avg_commits_per_week;
  let activity = 0;
  if (avgWeekly >= 7) activity = 100;
  else if (avgWeekly >= 4) activity = 85;
  else if (avgWeekly >= 2) activity = 70;
  else if (avgWeekly >= 1) activity = 50;
  else if (avgWeekly >= 0.5) activity = 30;
  else activity = 10;

  const impactScore = s.total_stars + (s.total_forks * 2);
  let impact = 0;
  if (impactScore >= 60) impact = 100;
  else if (impactScore >= 31) impact = 85;
  else if (impactScore >= 16) impact = 70;
  else if (impactScore >= 6) impact = 50;
  else if (impactScore >= 1) impact = 30;
  else impact = 10;

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
      <h3 className="section-title" style={{ marginBottom: '2rem' }}>Developer DNA Score</h3>
      <div className="scores-row">
        <ScoreRing 
          score={consistency} 
          label="Consistency" 
          tooltip="How regularly you commit over the year. Committing every week scores higher than bursts with long gaps. Based on percentage of weeks with at least 1 commit."
        />
        <ScoreRing 
          score={diversity} 
          label="Diversity" 
          tooltip="How many programming languages you use across your repos. More languages = broader skill set."
        />
        <ScoreRing 
          score={activity} 
          label="Activity" 
          tooltip="Your average weekly commit volume over the last year. Higher weekly output = higher score."
        />
        <ScoreRing score={impact} label="Impact" />
      </div>
    </div>
  );
};

export default DeveloperScores;
