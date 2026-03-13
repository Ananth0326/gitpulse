/* GitPulse Component */
import React from 'react';
import { Book, Star, GitFork, ExternalLink, GitCommit } from 'lucide-react';
import ClusterBadge from './ClusterBadge';

const RepoTable = ({ repos, total, onRepoClick }) => {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="card repo-card" style={{ marginBottom: '3rem' }}>
      <div className="repo-header">
        <h3 className="section-title">Repositories</h3>
        <span className="repo-count">{total} total</span>
      </div>
      
      <div className="table-container">
        <table className="repo-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Type</th>
              <th>Status</th>
              <th>Commits</th>
              <th>Stars</th>
              <th>Forks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {repos.map((repo, index) => (
              <tr key={repo.name} className="repo-row" style={{ '--row-index': index }}>
                <td>
                  <div className="repo-name-cell">
                    <Book size={18} className="repo-icon" />
                    <div className="repo-meta">
                      <span className="repo-name">{repo.name}</span>
                      <span className="repo-lang">{repo.language || 'Plain Text'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <ClusterBadge label={repo.cluster_label || 'Learning'} />
                </td>
                <td>
                  {repo.is_fork ? (
                    <span className="cluster-tag" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Fork</span>
                  ) : (
                    <span className="cluster-tag" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>Original</span>
                  )}
                </td>
                <td className="font-mono">
                  <button 
                    className="commit-btn"
                    onClick={() => onRepoClick(repo.name)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--primary-color)', 
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <GitCommit size={14} />
                    {repo.commit_count || 0}
                  </button>
                </td>
                <td className="font-mono">{repo.stars}</td>
                <td className="font-mono">{repo.forks}</td>
                <td>
                  <a 
                    href={repo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    <ExternalLink size={16} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepoTable;
