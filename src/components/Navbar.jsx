/* GitPulse Component */
import React from 'react';
import { Star } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      height: '56px',
      background: 'rgba(8, 8, 15, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--primary)',
          boxShadow: '0 0 10px var(--primary-glow)'
        }}></div>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>GitPulse</span>
      </div>

      <a 
        href="https://github.com" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid var(--primary)',
          color: 'var(--primary)',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'var(--primary-glow)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Star size={16} />
        Star on GitHub
      </a>
    </nav>
  );
};

export default Navbar;
