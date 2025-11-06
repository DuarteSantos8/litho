import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import Service from './pages/Service';
import Portfolio from './pages/Portfolio';
import MakingOf from './pages/MakingOf';
import About from './pages/About';
import Contact from './pages/Contact';
import PortfolioGrid from './pages/PortfolioGrid';
import ProjectDetail from './pages/PortfolioDetail';
import ProjectDetailCarousel from './components/portfolio/ProjectDetailCarousel';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/service" element={<Service />} />
          <Route path="/making-of" element={<MakingOf />} />
          <Route path="/about" element={<About />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<PortfolioGrid />} />
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/portfolio/:slug/slider" element={<ProjectDetailCarousel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;