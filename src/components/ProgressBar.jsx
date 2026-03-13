/* GitPulse Component */
import React, { useEffect, useState } from 'react';

const ProgressBar = ({ loading }) => {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let interval;
    if (loading) {
      setVisible(true);
      setWidth(0);
      interval = setInterval(() => {
        setWidth(prev => {
          if (prev >= 95) return prev;
          return prev + (100 - prev) * 0.1;
        });
      }, 200);
    } else {
      setWidth(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 500);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${width}%`, opacity: loading ? 1 : 0 }}
      />
    </div>
  );
};

export default ProgressBar;
