/* GitPulse Component */
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

const Hero = ({ onSearch, loading }) => {
  const [username, setUsername] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) onSearch(username.trim());
  };

  const handleSuggestion = (name) => {
    setUsername(name);
    onSearch(name);
  };

  return (
    <section className="hero-section">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="hero-content">
        <h1 className="hero-title reveal">
          Unleash Your <span className="text-gradient">Github DNA</span>
        </h1>
        <p className="hero-subtitle reveal">
          Premium developer analytics with machine learning insights.
        </p>

        <form onSubmit={handleSubmit} className="search-container reveal">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter GitHub username... (Press / to focus)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <kbd className="search-hint">/</kbd>
          </div>
          <button type="submit" className="search-button" disabled={loading || !username}>
            {loading ? <div className="spinner" /> : 'Analyze'}
          </button>
        </form>

        <div className="hero-suggestions reveal">
          <span>Try these profiles:</span>
          {['torvalds', 'gaearon', 'sindresorhus'].map(name => (
            <button key={name} type="button" onClick={() => handleSuggestion(name)} className="suggestion-pill">
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
