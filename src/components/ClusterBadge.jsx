/* GitPulse Component */
import React from 'react';

const ClusterBadge = ({ label }) => {
  const getStyles = () => {
    switch(label) {
      case 'Production-grade':
        return { background: '#14532d', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.25)' };
      case 'Learning':
        return { background: '#422006', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.25)' };
      case 'Hobby':
        return { background: '#450a0a', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' };
      default:
        return { background: 'var(--border)', color: 'var(--text-secondary)', border: '1px solid var(--border)' };
    }
  };

  const styles = getStyles();

  return (
    <span style={{
      ...styles,
      borderRadius: '999px',
      padding: '3px 10px',
      fontSize: '11px',
      fontWeight: '600',
      display: 'inline-block',
      animation: 'bounce 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) 1'
    }}>
      {label}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </span>
  );
};

export default ClusterBadge;
