/* GitPulse Component */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, GitCommit, Calendar, User } from 'lucide-react';

const CommitDrawer = ({ isOpen, onClose, username, repoName }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && username && repoName) {
      fetchCommits();
    }
  }, [isOpen, username, repoName]);

  const fetchCommits = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/commits/${username}/${repoName}`);
      setCommits(response.data);
    } catch (err) {
      setError("Could not load commits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' · ' + d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`commit-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{repoName}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recent Activity</span>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {loading && (
            <div className="commit-list">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '8px', marginBottom: '1rem' }}></div>
              ))}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && commits.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No commits found
            </div>
          )}

          {!loading && !error && commits.map(commit => (
            <div key={commit.sha} className="commit-row">
              {commit.author_avatar ? (
                <img src={commit.author_avatar} alt="" className="commit-avatar" />
              ) : (
                <div className="commit-avatar" style={{ background: '#1e1e3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={12} />
                </div>
              )}
              <div className="commit-main">
                <div className="commit-header">
                  <span className="commit-date">{formatDate(commit.date)}</span>
                </div>
                <div className="commit-msg">{commit.message}</div>
                <div className="commit-footer">
                  <span className="commit-sha font-mono">{commit.sha.slice(0, 7)}</span>
                  <span>·</span>
                  <span>{commit.author_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommitDrawer;
