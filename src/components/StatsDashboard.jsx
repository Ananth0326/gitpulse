/* GitPulse Component */
import React from 'react';
import StatsCard from './StatsCard';
import { 
  Activity, Zap, Target, Calendar, 
  Book, Star, GitFork, Code,
  Clock, Moon, TrendingUp, BarChart2
} from 'lucide-react';

const StatsDashboard = ({ stats }) => {
  if (!stats || !stats.summary) return null;
  const s = stats.summary;

  return (
    <div className="stats-dashboard">
      {/* ROW 1: Activity Stats */}
      <div className="stats-grid-row">
        <StatsCard 
          icon={Activity} 
          label="Total Commits" 
          value={s.total_commits} 
          color="#6366f1" 
          delay={0}
        />
        <StatsCard 
          icon={Zap} 
          label="Current Streak" 
          value={`${s.current_streak} days`} 
          color="#6366f1" 
          delay={100}
        />
        <StatsCard 
          icon={Target} 
          label="Longest Streak" 
          value={`${s.longest_streak} days`} 
          color="#6366f1" 
          delay={200}
        />
        <StatsCard 
          icon={Calendar} 
          label="Active Weeks" 
          value={`${s.active_weeks}/52`} 
          color="#6366f1" 
          delay={300}
        />
      </div>

      {/* ROW 2: Profile Stats */}
      <div className="stats-grid-row">
        <StatsCard 
          icon={Book} 
          label="Original Repos" 
          value={s.original_repos} 
          color="#10b981" 
          delay={400}
          tooltip="Repos you created from scratch — forks of other people's projects are excluded. Shows your original work only."
        />
        <StatsCard 
          icon={Star} 
          label="Stars Earned" 
          value={s.total_stars} 
          color="#10b981" 
          delay={500}
          tooltip="Total stars given to your repos by other developers. A star means someone found your work useful or impressive."
        />
        <StatsCard 
          icon={GitFork} 
          label="Forks Earned" 
          value={s.total_forks} 
          color="#10b981" 
          delay={600}
          tooltip="How many times other developers copied your repos to build their own version. High forks = high real-world impact."
        />
        <StatsCard 
          icon={Code} 
          label="Top Language" 
          value={s.top_language} 
          color="#10b981" 
          delay={700}
        />
      </div>

      {/* ROW 3: Behavior Stats */}
      <div className="stats-grid-row">
        <StatsCard 
          icon={Clock} 
          label="Most Active Day" 
          value={s.most_active_day} 
          color="#f59e0b" 
          delay={800}
        />
        <StatsCard 
          icon={Moon} 
          label="Most Active Month" 
          value={s.most_active_month} 
          color="#f59e0b" 
          delay={900}
        />
        <StatsCard 
          icon={TrendingUp} 
          label="Peak Day" 
          value={s.peak_day_commits} 
          color="#f59e0b" 
          delay={1000}
        />
        <StatsCard 
          icon={BarChart2} 
          label="Commits / Repo" 
          value={s.avg_commits_per_repo} 
          color="#f59e0b" 
          delay={1100}
        />
      </div>
    </div>
  );
};

export default StatsDashboard;
