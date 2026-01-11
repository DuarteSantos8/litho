import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import MainPage from './pages/MainPage';
import ProjectDetail from './pages/PortfolioDetail';
import ProjectDetailCarousel from './components/portfolio/ProjectDetailCarousel';
// Other imports removed as they are now in MainPage

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/portfolio/:slug/slider" element={<ProjectDetailCarousel />} />
          <Route path="*" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;