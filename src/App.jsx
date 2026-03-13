import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProfileCard from './components/ProfileCard';
import StatsDashboard from './components/StatsDashboard';
import CommitTrend from './components/CommitTrend';
import DeveloperScores from './components/DeveloperScores';
import CodingHours from './components/CodingHours';
import LanguageChart from './components/LanguageChart';
import CommitHeatmap from './components/CommitHeatmap';
import ClusterSection from './components/ClusterSection';
import RepoTable from './components/RepoTable';
import CommitDrawer from './components/CommitDrawer';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';
import { fetchProfile, fetchRepos, fetchStats } from './api';
import './App.css';
import ProgressBar from './components/ProgressBar';
import { Share2, Check } from 'lucide-react';

const App = () => {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [errorType, setErrorStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, [status, data]);

  const handleSearch = async (targetUser) => {
    setStatus('loading');
    setUsername(targetUser);
    
    try {
      const [profile, repos, stats] = await Promise.all([
        fetchProfile(targetUser),
        fetchRepos(targetUser),
        fetchStats(targetUser)
      ]);
      
      setData({ profile, repos, stats });
      setStatus('success');
      
      // Delay to ensure DOM updates before observer re-runs
      setTimeout(() => {
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => el.classList.remove('active'));
      }, 0);

    } catch (err) {
      console.error("Search failed full error:", err);
      setErrorStatus(err.response?.status || 500);
      setStatus('error');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?user=${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openDrawer = (repoName) => {
    setSelectedRepo(repoName);
    setIsDrawerOpen(true);
  };

  return (
    <div className="app-container">
      <ProgressBar loading={status === 'loading'} />
      <Navbar />
      
      <main className="content-wrapper">
        <Hero onSearch={handleSearch} loading={status === 'loading'} />

        {status === 'loading' && <LoadingSkeleton />}
        
        {status === 'error' && (
          <ErrorMessage 
            type={errorType} 
            onRetry={() => handleSearch(username)} 
          />
        )}

        {status === 'success' && data && (
          <div className="dashboard-grid">
            <div className="reveal">
              <ProfileCard profile={data.profile} />
            </div>
            
            <div className="reveal">
              <StatsDashboard stats={data.stats} />
            </div>

            <div className="reveal">
              <DeveloperScores stats={data.stats} />
            </div>

            <div className="reveal">
              <CommitTrend weeklyData={data.stats.weekly_commits} />
            </div>

            <div className="reveal">
              <LanguageChart languages={data.stats.languages} />
            </div>

            <div className="reveal">
               <CommitHeatmap activity={data.stats.heatmap} total={data.stats.summary.total_commits} />
            </div>

            {data.stats.coding_hours && (
              <div className="reveal">
                <CodingHours distribution={data.stats.coding_hours} />
              </div>
            )}

            <div className="reveal">
              <ClusterSection clusters={data.stats.clusters} distribution={data.stats.distribution} />
            </div>

            <div className="reveal">
              <RepoTable 
                repos={data.repos.repos} 
                total={data.repos.total_repos} 
                onRepoClick={openDrawer}
              />
            </div>

            <footer className="share-footer reveal">
              <button 
                className={`share-button ${copied ? 'copied' : ''}`} 
                type="button"
                onClick={handleShare}
              >
                {copied ? (
                  <span className="share-status"><Check size={20} /> Copied!</span>
                ) : (
                  <span className="share-status"><Share2 size={20} /> Share your GitPulse</span>
                )}
              </button>
            </footer>
          </div>
        )}
      </main>

      <CommitDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        username={username}
        repoName={selectedRepo}
      />

      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default App;
