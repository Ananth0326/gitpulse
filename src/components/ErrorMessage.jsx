/* GitPulse Component */
import React from 'react';
import { RefreshCcw } from 'lucide-react';

const ErrorMessage = ({ message, status, onRetry }) => {
  const getErrorMessage = () => {
    if (status === 404) return "This GitHub user doesn't exist. Check the username and try again.";
    if (status === 429) return "GitHub API rate limit hit. Wait a minute and try again.";
    if (status === 500) return "Something went wrong on our end. Try again shortly.";
    return message || "An unexpected error occurred.";
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      textAlign: 'center'
    }}>
      <div className="card" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '48px' }}>🤖</span>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Something went wrong</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{getErrorMessage()}</p>
        
        <button 
          onClick={onRetry}
          style={{
            marginTop: '12px',
            background: 'transparent',
            border: '1px solid var(--primary)',
            color: 'var(--primary)',
            padding: '8px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}
        >
          <RefreshCcw size={16} />
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
