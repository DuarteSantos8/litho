import React from 'react';
import { Link } from 'react-router-dom';
import projects from '../../data/portfolio/projects.json';
import { resolveAsset } from '../../utils/portfolioAssets';
import './Portfolio.css';

const PortfolioGrid = () => {
  return (
    <div className="portfolio">
      <div className="headline">
        <h2 className="title">Portfolio</h2>
      </div>
      <div className="portfolio-grid">
        {projects.map((p) => {
          const cover = resolveAsset(`${p.id}/${p.cover || '01-cover.jpg'}`);
          return (
            <Link key={p.id} to={`/portfolio/${p.slug}`} className="portfolio-card" aria-label={p.title}>
              {cover && <img src={cover} alt={p.title || ''} className="cover" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioGrid;
