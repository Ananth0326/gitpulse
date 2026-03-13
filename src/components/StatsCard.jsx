/* GitPulse Component */
import React, { useState, useEffect } from 'react';

const StatsCard = ({ icon: Icon, label, value, color, delay = 0, tooltip }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) {
        setDisplayValue(value);
        return;
    }
    
    // Staggered start
    const timer = setTimeout(() => {
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = easeProgress * end;
          
          setDisplayValue(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue(end);
          }
        };

        requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const isNumeric = !isNaN(parseFloat(value));

  return (
    <div className="card stat-card overhaul" style={{ '--accent-color': color }}>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      
      {tooltip && (
        <div 
          className="info-icon-wrapper"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="info-icon">i</div>
          {showTooltip && (
            <div className="tooltip-bubble">
              {tooltip}
              <div className="tooltip-arrow"></div>
            </div>
          )}
        </div>
      )}

      <div className="stat-value font-mono">
        {isNumeric ? displayValue.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value}
      </div>
      <div className="stat-label">{label}</div>

      <style>{`
        .info-icon-wrapper {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          z-index: 50;
        }
        .info-icon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid #4B5563;
          color: #9CA3AF;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          transition: border-color 0.2s, color 0.2s;
        }
        .info-icon-wrapper:hover .info-icon {
          border-color: #6366f1;
          color: #fff;
        }
        .tooltip-bubble {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background: #1e1e3a;
          border: 1px solid #6366f1;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #e2e8f0;
          width: 200px;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          animation: fadeIn 150ms ease-out;
          line-height: 1.4;
          text-transform: none;
          letter-spacing: normal;
          font-weight: normal;
        }
        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #6366f1;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default StatsCard;
