/* GitPulse Component */
import React from 'react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CodingHours = ({ distribution }) => {
  if (!distribution) return null;

  // Find max for color scaling
  const maxVal = Math.max(...Object.values(distribution), 1);

  const getCellColor = (count) => {
    if (count === 0) return '#1e1e3a';
    const intensity = count / maxVal;
    if (intensity < 0.3) return '#6366f1';
    if (intensity < 0.7) return '#818cf8';
    return '#a78bfa';
  };

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
      <h3 className="section-title" style={{ marginBottom: '1rem' }}>Coding Rhythm</h3>
      <p className="stat-label" style={{ marginBottom: '1.5rem' }}>When you do your best work</p>
      
      <div className="coding-hours-container">
        {DAYS.map(day => (
          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4px' }}>
            <span style={{ width: '80px', fontSize: '12px', color: 'var(--text-muted)' }}>{day.slice(0, 3)}</span>
            <div className="coding-hours-grid" style={{ flex: 1, marginTop: 0 }}>
              {HOURS.map(hour => {
                const count = distribution[`${day}:${hour}`] || 0;
                return (
                  <div 
                    key={hour}
                    className="hour-cell"
                    style={{ background: getCellColor(count) }}
                    data-tooltip={`${day} at ${hour}:00 - ${count} sampled commits`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', fontSize: '10px', color: 'var(--text-muted)' }}>
        <span>Less active</span>
        <div style={{ display: 'flex', gap: '2px' }}>
          <div style={{ width: 10, height: 10, background: '#1e1e3a', borderRadius: 2 }}></div>
          <div style={{ width: 10, height: 10, background: '#6366f1', borderRadius: 2 }}></div>
          <div style={{ width: 10, height: 10, background: '#a78bfa', borderRadius: 2 }}></div>
        </div>
        <span>Peak focus</span>
      </div>
    </div>
  );
};

export default CodingHours;
