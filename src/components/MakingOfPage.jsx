import React, { useState, useRef } from 'react';
import './MakingOfPage.css';

const MakingOf = () => {
  const [sliderPosition1, setSliderPosition1] = useState(50);
  const [sliderPosition2, setSliderPosition2] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);

  const handleMouseDown = (sliderRef, setPosition, e) => {
    setIsDragging(true);
    e.preventDefault();
    
    const handleMouseMove = (e) => {
      if (!sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Initial position set
    handleMouseMove(e);
  };

  const handleTouchStart = (sliderRef, setPosition, e) => {
    setIsDragging(true);
    e.preventDefault();
    
    const handleTouchMove = (e) => {
      if (!sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(percentage);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Initial position set
    handleTouchMove(e);
  };

  return (
    <div className="making-of-container">
      {/* Header */}
      <div className="header">
        <h1 className="title">Making Of</h1>
      </div>

      {/* Image Comparison Section 1 */}
      <div className="comparison-section">
        <div 
          className="image-comparison-container"
          ref={slider1Ref}
          onMouseDown={(e) => handleMouseDown(slider1Ref, setSliderPosition1, e)}
          onTouchStart={(e) => handleTouchStart(slider1Ref, setSliderPosition1, e)}
        >
          {/* Before Image (Vorher) */}
          <div className="image-layer">
            <img src="/src/v-n/1_V.jpg" alt="Vorher" />
            <div className="image-label before-label">VORHER</div>
          </div>

          {/* After Image (Nachher) - with clip */}
          <div 
            className="image-layer after-layer"
            style={{ 
              clipPath: `inset(0 ${100 - sliderPosition1}% 0 0)`,
              transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
            }}
          >
            <img src="/src/v-n/1_N.jpg" alt="Nachher" />
            <div className="image-label after-label">NACHHER</div>
          </div>

          {/* Slider Handle */}
          <div 
            className="slider-handle"
            style={{ 
              left: `${sliderPosition1}%`,
              transition: isDragging ? 'none' : 'left 0.1s ease-out'
            }}
          >
            <div className="slider-line"></div>
            <div className="slider-button">
              <span>‹</span>
              <span>›</span>
            </div>
          </div>
        </div>
        {/* Credits */}
          <div className="credits">
            <span><strong>Kunde:</strong> Theater Casino Zug</span>
            <span><strong>Grafik:</strong> Melanie Lindner, Céline Odermatt</span>
            <span><strong>Foto:</strong> Rita Palanikumar</span>
          </div>
      </div>

      {/* Image Comparison Section 2 */}
      <div className="comparison-section">
        <div 
          className="image-comparison-container"
          ref={slider2Ref}
          onMouseDown={(e) => handleMouseDown(slider2Ref, setSliderPosition2, e)}
          onTouchStart={(e) => handleTouchStart(slider2Ref, setSliderPosition2, e)}
        >
          {/* Before Image (Nacher) */}
          <div className="image-layer">
            <img src="/src/v-n/2_N.jpg" alt="Nacher" />
          </div>

          {/* After Image (Vorher) - with clip */}
          <div 
            className="image-layer after-layer"
            style={{ 
              clipPath: `inset(0 0 0 ${sliderPosition2}%)`,
              transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
            }}
          >
            <img src="/src/v-n/2_V.jpg" alt="Vorher" />
          </div>

          {/* Slider Handle */}
          <div 
            className="slider-handle"
            style={{ 
              left: `${sliderPosition2}%`,
              transition: isDragging ? 'none' : 'left 0.1s ease-out'
            }}
          >
            <div className="slider-line"></div>
            <div className="slider-button">
              <span>‹</span>
              <span>›</span>
            </div>
          </div>
        </div>
          <div className="credits">
            <span><strong>Kunde:</strong> Theater Casino Zug</span>
            <span><strong>Grafik:</strong> Melanie Lindner, Céline Odermatt</span>
            <span><strong>Foto:</strong> Rita Palanikumar</span>
          </div>
      </div>
    </div>
  );
};

export default MakingOf;