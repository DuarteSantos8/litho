import React from 'react';
import { Link } from 'react-router-dom';
import projects from '../../data/portfolio/projects.json';
import { resolveAsset } from '../../utils/portfolioAssets';
import './Portfolio.css';

const PortfolioGrid = () => {
  return (
    <div className="portfolio-grid">
      {projects.map((p) => {
        const cover = resolveAsset(`${p.id}/${p.cover || '01-cover.jpg'}`);
        return (
          <Link key={p.id} to={`/portfolio/${p.slug}`} className="portfolio-card" aria-label={p.title}>
            {cover && <img src={cover} alt={p.title || ''} className="cover" />}
            <div className="meta">
              <h3>{p.title}</h3>
              {p.year && <span className="year">{p.year}</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PortfolioGrid;
