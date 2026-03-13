/* GitPulse Component */
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter GitHub username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        style={{
          width: '100%',
          height: '56px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '0 140px 0 24px',
          fontSize: '16px',
          color: 'var(--text-primary)',
          transition: 'all 0.2s',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        style={{
          position: 'absolute',
          right: '8px',
          top: '8px',
          bottom: '8px',
          background: 'var(--primary)',
          color: '#fff',
          borderRadius: '8px',
          padding: '0 20px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          opacity: (isLoading || !query.trim()) ? 0.6 : 1
        }}
        onMouseOver={(e) => {
          if (!isLoading && query.trim()) {
            e.currentTarget.style.background = '#4f46e5';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.4)';
          }
        }}
        onMouseOut={(e) => {
          if (!isLoading && query.trim()) {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>Analyze <span>→</span></>
        )}
      </button>
    </form>
  );
};

export default SearchBar;
