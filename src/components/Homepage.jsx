import React, { useState, useEffect, useRef } from 'react';
import './Homepage.css';

const Homepage = ({ onComplete }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dotRef = useRef(null);
  const [expandPos, setExpandPos] = useState({ top: '50%', left: '50%' });
  
  // Trigger initial animation
  useEffect(() => {
    // 1. Start Animation L!THO
    const timer1 = setTimeout(() => {
      setIsAnimated(true);

      // 2. Expand Circle
      const timer2 = setTimeout(() => {
        // Calculate dot position for expansion origin
        if (dotRef.current) {
           const rect = dotRef.current.getBoundingClientRect();
           setExpandPos({
               top: `${rect.top + rect.height / 2}px`,
               left: `${rect.left + rect.width / 2}px`
           });
        }

        setIsExpanded(true);

        // 3. Complete and switch to Main Page
        const timer3 = setTimeout(() => {
            if (onComplete) {
                onComplete();
            }
        }, 800); // Wait for expansion transition
        return () => clearTimeout(timer3);

      }, 800); // Wait for drop animation
      return () => clearTimeout(timer2);

    }, 1000); // Initial delay

    return () => clearTimeout(timer1);
  }, [onComplete]);

  return (
    <div className="litho-container">
      <div className={`splash ${isAnimated ? 'animate' : ''}`}>
        <div className="letter">L</div>
        <div className="i-container">
          <div className={`i-stem ${isAnimated ? 'animate' : ''}`}></div>
          <div 
            ref={dotRef} 
            className={`i-dot ${isAnimated ? 'animate' : ''}`}
            style={{ opacity: isExpanded ? 0 : 1 }}
          ></div>
        </div>
        <div className="letter">T</div>
        <div className="letter">H</div>
        <div className="letter">O</div>
      </div>

      {/* Expansion Circle */}
      <div 
        className="expansion-circle"
        style={{
            position: 'fixed',
            top: expandPos.top,
            left: expandPos.left,
            width: '20px',
            height: '20px',
            background: '#ff0000',
            borderRadius: '50%',
            transform: `translate(-50%, -50%) scale(${isExpanded ? 150 : 0})`,
            transition: 'transform 800ms cubic-bezier(0.86, 0, 0.07, 1)',
            zIndex: 15,
            pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default Homepage;
