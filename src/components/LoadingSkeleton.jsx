/* GitPulse Component */
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="dashboard-section">
      {/* Profile Card Skeleton */}
      <div className="card skeleton" style={{ height: '180px', animationDelay: '0s' }}></div>
      
      {/* Stats Row Skeleton */}
      <div className="stats-grid">
        <div className="card skeleton" style={{ height: '120px', animationDelay: '0.1s' }}></div>
        <div className="card skeleton" style={{ height: '120px', animationDelay: '0.2s' }}></div>
        <div className="card skeleton" style={{ height: '120px', animationDelay: '0.3s' }}></div>
        <div className="card skeleton" style={{ height: '120px', animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Chart Skeletons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card skeleton" style={{ height: '340px', animationDelay: '0.5s' }}></div>
        <div className="card skeleton" style={{ height: '340px', animationDelay: '0.6s' }}></div>
      </div>

      {/* Heatmap Skeleton */}
      <div className="card skeleton" style={{ height: '200px', animationDelay: '0.7s' }}></div>

      {/* Table Skeleton */}
      <div className="card skeleton" style={{ height: '400px', animationDelay: '0.8s' }}></div>
    </div>
  );
};

export default LoadingSkeleton;
