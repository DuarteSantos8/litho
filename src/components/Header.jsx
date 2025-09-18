import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const menuItems = [
  { label: "HOME", path: "/" },
  { label: "SERVICE", path: "/service" },
  { label: "PORTFOLIO", path: "/portfolio" },
  { label: "MAKING OF", path: "/making-of" },
  { label: "ABOUT", path: "/about" },
  { label: "KONTAKT", path: "/kontakt" },
];

const Header = () => {
  const navigate = useNavigate();
  const dotRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: '50%', left: '50%' });

  const calculateMenuPosition = useCallback(() => {
    if (dotRef.current) {
      const dotRect = dotRef.current.getBoundingClientRect();
      const dotCenterX = dotRect.left + dotRect.width / 2;
      const dotCenterY = dotRect.top + dotRect.height / 2;
      
      setMenuPosition({
        top: `${dotCenterY}px`,
        left: `${dotCenterX}px`
      });
    }
  }, []);

  useEffect(() => {
    calculateMenuPosition();
  }, [calculateMenuPosition]);

  useEffect(() => {
    const handleResize = () => {
      if (menuOpen) {
        calculateMenuPosition();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    if (menuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, calculateMenuPosition]);

  const handleDotClick = (e) => {
    e.stopPropagation();
    calculateMenuPosition();
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (item) => {
    navigate(item.path);
    closeMenu();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <header className="litho-header">
        <div className="litho-logo-container" onClick={handleLogoClick}>
          <h1 className="litho-logo">L!THO</h1>
        </div>

        <button
          ref={dotRef}
          className="litho-dot"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          onClick={handleDotClick}
        />
      </header>

      {/* Overlay */}
      <div
        className={`litho-overlay ${menuOpen ? "active" : ""}`}
        onClick={closeMenu}
      />

      {/* Menu - grows from dot position */}
      <div 
        className={`litho-menu ${menuOpen ? 'open' : ''}`}
        style={{
          top: menuPosition.top,
          left: menuPosition.left
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <div className="litho-menu-close" onClick={closeMenu}>×</div>
      </div>

      {/* Menu items - separate from circle, fixed position */}
      {menuOpen && (
        <div className="litho-menu-items-container">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="litho-menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Header;