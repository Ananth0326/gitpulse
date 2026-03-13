/* GitPulse Component */
import React from 'react';

const CommitHeatmap = ({ activity, total }) => {
  if (!activity || activity.length === 0) return null;

  const getColor = (count) => {
    if (count === 0) return 'var(--glass)';
    if (count < 3) return '#312e81';
    if (count < 6) return '#4338ca';
    if (count < 10) return '#6366f1';
    return '#818cf8';
  };

  return (
    <div className="card heatmap-card">
      <div className="heatmap-header">
        <h3 className="section-title">Contribution Pulse</h3>
        <p className="heatmap-summary">
          <span className="text-gradient font-mono">{total}</span> contributions in the last year
        </p>
      </div>

      <div className="heatmap-container">
        <div className="heatmap-grid">
          {activity.map((day, i) => (
            <div
              key={i}
              className="heatmap-square"
              style={{ backgroundColor: getColor(day.count) }}
            >
              <div className="heatmap-tooltip">
                <span className="tooltip-date">{day.date}</span>
                <span className="tooltip-count font-mono">{day.count} commits</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-footer">
        <div className="heatmap-legend">
          <span>Less</span>
          {[0, 2, 5, 8, 12].map(c => (
            <div key={c} className="legend-square" style={{ backgroundColor: getColor(c) }}></div>
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommitHeatmap);
