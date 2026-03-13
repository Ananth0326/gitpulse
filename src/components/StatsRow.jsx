/* GitPulse Component */
import React from 'react';
import StatsCard from './StatsCard';
import { GitCommit, Activity, Calendar, TrendingUp } from 'lucide-react';

const StatsRow = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { label: 'Total Commits', value: stats.total_commits, icon: GitCommit, color: '#6366f1' },
    { label: 'Weekly Average', value: stats.avg_commits_per_week, icon: Activity, color: '#10b981' },
    { label: 'Peak Day', value: stats.most_active_day || 0, icon: Calendar, color: '#f59e0b' },
    { label: 'Peak Month', value: stats.most_active_month || 0, icon: TrendingUp, color: '#a78bfa' }
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <StatsCard key={index} {...item} />
      ))}
    </div>
  );
};

export default StatsRow;
