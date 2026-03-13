/* GitPulse Component */
import React from 'react';

const LanguageChart = ({ languages }) => {
  if (!languages || languages.length === 0) return null;

  const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);

  return (
    <div className="card language-card">
      <h3 className="section-title">Language DNA</h3>
      <div className="language-list">
        {languages.map((lang, index) => {
          const percentage = ((lang.bytes / totalBytes) * 100).toFixed(1);
          return (
            <div key={lang.name} className="language-item" style={{ '--delay': `${index * 0.1}s` }}>
              <div className="language-info">
                <div className="language-name-wrapper">
                  <span className="language-dot" style={{ backgroundColor: lang.color }}></span>
                  <span className="language-name">{lang.name}</span>
                </div>
                <div className="language-meta">
                  <span className="language-bytes font-mono">{(lang.bytes / 1024).toFixed(1)} KB</span>
                  <span className="language-percentage font-mono">{percentage}%</span>
                </div>
              </div>
              <div className="language-bar-bg">
                <div 
                  className="language-bar-fill" 
                  style={{ 
                    backgroundColor: lang.color, 
                    width: `${percentage}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {languages.length === 1 && (
        <p className="language-note">100% of code is {languages[0].name}</p>
      )}
    </div>
  );
};

export default LanguageChart;
