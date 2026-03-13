/* GitPulse Component */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ClusterSection = ({ clusters, distribution }) => {
  if (!clusters || distribution.length === 0) return null;

  const COLORS = {
    'Production-grade': '#6366f1',
    'Learning': '#10b981',
    'Hobby': '#f59e0b',
    'Project': '#94a3b8'
  };

  return (
    <div className="card cluster-card">
      <h3 className="section-title">Repository DNA</h3>
      <div className="cluster-container">
        <div className="cluster-chart-wrapper">
          <div className="donut-center">
            <span className="donut-label">DNA Split</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="label"
                animationBegin={200}
                animationDuration={1200}
                stroke="none"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.label] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="cluster-details">
          {distribution.map((dist) => (
            <div key={dist.label} className="cluster-info-item">
              <div className="cluster-badge-pulse" style={{ backgroundColor: COLORS[dist.label] }}>
                {dist.label}
              </div>
              <p className="cluster-count">{dist.count} Repositories</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClusterSection;
