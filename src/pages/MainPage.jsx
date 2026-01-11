import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import HomeSection from '../components/HomeSection';
import ServicePage from '../components/ServicePage';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import MakingOfPage from '../components/MakingOfPage';
import AboutPage from '../components/AboutPage';
import ContactPage from '../components/ContactPage';
import Splash from '../components/Homepage';
import './Home.css'; // Re-use Home styles if needed, or create Main.css

const MainPage = () => {
  const location = useLocation();
  // Skip splash if user navigated with state flag or if there is a hash anchor
  const shouldSkipSplash = location.state?.skipSplash || (location.hash && location.hash.length > 1);
  const [splashFinished, setSplashFinished] = useState(shouldSkipSplash);
  
  // Handle scrolling to anchor when mounting with skipped splash
  useEffect(() => {
      if (shouldSkipSplash && location.hash) {
          const id = location.hash.replace('#', '');
          // Give a small delay to ensure DOM is ready
          setTimeout(() => {
              const el = document.getElementById(id);
              if (el) {
                  const headerOffset = 150; 
                  const elementPosition = el.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.scrollY - headerOffset;
                  
                  window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                  });
              }
          }, 300);
      }
  }, [shouldSkipSplash, location.hash]);

  const handleSplashComplete = () => {
    setSplashFinished(true);
  };

  return (
    <div className="main-page-container">
      {!splashFinished && (
        <div className="splash-overlay" style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 9999, 
            background: 'white'
        }}>
            <Splash onComplete={handleSplashComplete} />
        </div>
      )}

      <div className={`content-container ${!splashFinished ? 'hidden' : ''}`} style={{ opacity: splashFinished ? 1 : 0, transition: 'opacity 1s ease-in' }}>
        <Header />
        
        <section id="home">
          <HomeSection />
        </section>

        <section id="service">
          <ServicePage />
        </section>

        <section id="portfolio">
          <PortfolioGrid />
        </section>
        
        <section id="making-of">
          <MakingOfPage />
        </section>

        <section id="about">
          <AboutPage />
        </section>

        <section id="kontakt">
            <ContactPage />
        </section>
      </div>
    </div>
  );
};

export default MainPage;
