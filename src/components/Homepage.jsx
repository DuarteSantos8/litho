import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [isAnimated, setIsAnimated] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: '50%', left: '50%' });
  const dotRef = useRef(null);

  const menuItems = [
    { label: 'HOME', path: '/' },
    { label: 'SERVICE', path: '/service' },
    { label: 'PORTFOLIO', path: '/portfolio' },
    { label: 'MAKING OF', path: '/making-of' },
    { label: 'ABOUT', path: '/about' },
    { label: 'KONTAKT', path: '/kontakt' }
  ];

  // Trigger initial animation
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsAnimated(true);
      const timer2 = setTimeout(() => {
        setAnimationComplete(true);
        // Position nach der Animation einmal setzen
        calculateMenuPosition();
      }, 600);
      return () => clearTimeout(timer2);
    }, 1000);

    return () => clearTimeout(timer1);
  }, []);

  // Position bei Window Resize aktualisieren
  useEffect(() => {
    const handleResize = () => {
      if (animationComplete) {
        calculateMenuPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animationComplete]);

  const calculateMenuPosition = () => {
    if (dotRef.current) {
      const dotRect = dotRef.current.getBoundingClientRect();
      const centerX = dotRect.left + dotRect.width / 2;
      const centerY = dotRect.top + dotRect.height / 2;
      
      setMenuPosition({
        top: `${centerY}px`,
        left: `${centerX}px`
      });
    }
  };

  const handleDotClick = (e) => {
    e.stopPropagation();
    if (!animationComplete) return;
    
    // Position nochmal vor dem Öffnen aktualisieren (für den Fall, dass sich etwas geändert hat)
    if (!menuOpen) {
      calculateMenuPosition();
      // Kurz warten, damit die Position gesetzt wird, bevor das Menü öffnet
      requestAnimationFrame(() => {
        setMenuOpen(true);
      });
    } else {
      setMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (item) => {
    console.log('Navigating to:', item.path);
    navigate(item.path);
    closeMenu();
  };

  return (
    <div className="litho-container">
      {/* Overlay */}
      <div 
        className={`overlay ${menuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* Main Splash */}
      <div 
        className={`splash ${isAnimated ? 'animate' : ''}`}
      >
        <span className="letter">L</span>
        
        {/* Custom I with dot */}
        <div className="i-container">
          <div className={`i-stem ${isAnimated ? 'animate' : ''}`} />
          <div 
            ref={dotRef}
            className={`i-dot ${isAnimated ? 'animate' : ''} ${menuOpen ? 'menu-active' : ''}`}
            onClick={handleDotClick}
          />
        </div>
        
        <span className="letter">T</span>
        <span className="letter">H</span>
        <span className="letter">O</span>
      </div>

      {/* Menu */}
      <div 
        className={`menu ${menuOpen ? 'open' : ''}`}
        style={{
          top: menuPosition.top,
          left: menuPosition.left
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="close-btn" onClick={closeMenu}>×</div>

        {/* Menu items */}
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => handleMenuItemClick(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;