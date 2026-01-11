import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listProjectImages, resolveAsset } from '../../utils/portfolioAssets';
import './ProjectDetail.css';

// Alle Projekt-Detail-JSONs (01.json, 02.json, ...) laden
const jsonCtx = require.context('../../data/portfolio', false, /^\.\/*\d{2}\.json$/);
const details = jsonCtx.keys().map((k) => jsonCtx(k));
const detailBySlug = details.reduce((acc, d) => {
  acc[d.slug] = d;
  return acc;
}, {});

const ProjectDetail = () => {
  const { slug } = useParams();
  const meta = detailBySlug[slug] || null;

  // Hooks immer aufrufen (keine Early-Return davor!)
  const allImages = useMemo(() => (meta ? listProjectImages(meta.id) : []), [meta]);

  if (!meta) {
    return (
      <div className="project-detail">
        <p>Projekt nicht gefunden.</p>
        <Link to="/portfolio">Zurück</Link>
      </div>
    );
  }

  const pdfUrl = meta.pdf ? resolveAsset(`${meta.id}/${meta.pdf}`) : null;

  // Bild neben dem Text
  const textImgCandidate = meta.text_image
    ? `${meta.id}/${meta.text_image}`
    : `${meta.id}/01-title.jpg`;
  const textImage =
    resolveAsset(textImgCandidate) || resolveAsset(`${meta.id}/01.jpg`) || null;

  // Galerie: >= 02.jpg, ohne Cover & ohne Textbild
  const gallery = allImages
    .filter((p) => !/01-cover\./i.test(p))
    .filter((p) => {
      if (meta.text_image && p.toLowerCase().endsWith(`/${meta.text_image.toLowerCase()}`)) return false;
      if (!meta.text_image && /\/01(-title)?\./i.test(p)) return false;
      const m = p.match(/\/(\d+)[-_]?(?:title)?\./i);
      return m && Number(m[1]) >= 2;
    });

  return (
    <div className="project-detail">
      <header className="project-header">
        <div className="header-left">
          {/* Wrap Title in similar structure if desired, or just use class */}
          <div className="headline" style={{ marginBottom: 0 }}>
             <h1 className="title" style={{ width: '100%' }}>{meta.title}</h1>
          </div>
          {meta.subtitle && <p className="project-subtitle">{meta.subtitle}</p>}
          <ul className="project-facts">
            {meta.client && <li><strong>Auftraggeber:</strong> {meta.client}</li>}
            {meta.year && <li><strong>Jahr:</strong> {meta.year}</li>}
            {Array.isArray(meta.roles) && meta.roles.length > 0 && (
              <li><strong>Rolle:</strong> {meta.roles.join(', ')}</li>
            )}
          </ul>
          {Array.isArray(meta.body) && meta.body.length > 0 && (
            <div className="project-body">
              {meta.body.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          )}
          {pdfUrl && (
            <p className="project-links">
              <a href={pdfUrl} target="_blank" rel="noreferrer">PDF ansehen</a>
            </p>
          )}
        </div>

        <div className="header-right">
          {textImage && <img src={textImage} alt="" />}
        </div>
      </header>

      <section className="project-gallery">
        {gallery.map((path) => {
          const url = resolveAsset(path);
          return <img key={path} src={url} alt="" />;
        })}
      </section>

      {meta.credits && (
        <footer className="project-credits">
          <h4>Credits</h4>
          <ul>
            {meta.credits.photography && <li><strong>Foto:</strong> {meta.credits.photography}</li>}
            {meta.credits.editorial && <li><strong>Editorial:</strong> {meta.credits.editorial}</li>}
            {meta.credits.copyright && <li><strong>©</strong> {meta.credits.copyright}</li>}
          </ul>
        </footer>
      )}

      <div className="back-link">
        <Link to="/portfolio">← Zurück zur Übersicht</Link>
      </div>
    </div>
  );
};

export default ProjectDetail;
