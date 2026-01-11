import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProjectDetailCarousel.css';

/* ---- Detail-JSONs laden (01.json, 02.json, ...) ---- */
const jsonCtx = require.context('../../data/portfolio', false, /^\.\/*\d{2}\.json$/);
const details = jsonCtx.keys().map((k) => jsonCtx(k));
const detailBySlug = details.reduce((acc, d) => { acc[d.slug] = d; return acc; }, {});

/* ---- Bilder/Assets laden ---- */
const assetsCtx = require.context('../../assets/projects', true, /\.(jpe?g|png|webp)$/i);
const resolveAsset = (projectId, filename) => {
  if (!filename) return null;
  const key = `./${projectId}/${filename}`;
  try { return assetsCtx(key); } catch { return null; }
};
const listProjectImages = (projectId) => {
  const keys = assetsCtx.keys().filter(k => k.startsWith(`./${projectId}/`));
  const list = keys.map(k => k.replace(`./${projectId}/`, '')); // z.B. "02.jpg"
  // sortiert nach führender Nummer (01, 02, 03 …), "01-title" bleibt bei 1
  list.sort((a, b) => {
    const na = Number((a.match(/^(\d+)/) || [,'9999'])[1]);
    const nb = Number((b.match(/^(\d+)/) || [,'9999'])[1]);
    return na - nb || a.localeCompare(b);
  });
  return list;
};

export default function ProjectDetailCarousel() {
  const { slug } = useParams();
  const meta = detailBySlug[slug] || null;

  // Hooks immer aufrufen
  const [index, setIndex] = useState(0);
  const viewportRef = useRef(null);
  const touchStartX = useRef(null);

  // Alle Images im Projektordner
  const all = useMemo(() => (meta ? listProjectImages(meta.id) : []), [meta]);

  // Slides zusammenstellen:
  // 1) 01-cover.jpg
  // 2) Intro-Slide (graue Box) mit Text + 01-title.jpg (Fallback: 01.jpg)
  // 3..) 02.jpg, 03.jpg, ...
  const slides = useMemo(() => {
    if (!meta) return [];
    const cover = resolveAsset(meta.id, '01-cover.jpg');
    
    // Handle text_image being a string or an array
    const textImgNames = Array.isArray(meta.text_image) 
      ? meta.text_image 
      : [meta.text_image || '01-title.jpg'];
      
    // Resolve one or multiple intro images
    let introImages = textImgNames
      .map(name => resolveAsset(meta.id, name))
      .filter(Boolean);

    // Flashback to 01.jpg if nothing found
    if (introImages.length === 0) {
      const fallback = resolveAsset(meta.id, '01.jpg');
      if (fallback) introImages = [fallback];
    }

    // Galerie-Bilder >= 02.jpg (ohne cover & ohne text images)
    const galleryFiles = all.filter((name) => {
      // Exclude cover
      if (/^01-cover\./i.test(name)) return false;
      
      // Exclude explicitly defined text images
      if (meta.text_image) {
        if (Array.isArray(meta.text_image)) {
           if (meta.text_image.some(t => t.toLowerCase() === name.toLowerCase())) return false;
        } else {
           if (name.toLowerCase() === meta.text_image.toLowerCase()) return false;
        }
      } 
      
      // Exclude default text images if not defined
      if (!meta.text_image && /^01(-title)?\./i.test(name)) return false;

      const m = name.match(/^(\d+)/);
      return m && Number(m[1]) >= 2;
    });

    const gallery = galleryFiles.map((name) => ({
      type: 'image',
      src: resolveAsset(meta.id, name),
      key: `img-${name}`
    }));

    const arr = [];
    if (cover) arr.push({ type: 'cover', src: cover, key: 'cover' });
    // Pass 'imgs' array instead of single 'img'
    arr.push({ type: 'intro', imgs: introImages, key: 'intro' });
    return [...arr, ...gallery];
  }, [meta, all]);

  // Tastatursteuerung
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides.length]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(slides.length - 1, i + 1));

  // Touch/Swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const THRESHOLD = 40;
    if (dx < -THRESHOLD) next();
    else if (dx > THRESHOLD) prev();
    touchStartX.current = null;
  };

  if (!meta) {
    return (
      <div className="proj-slider">
        <div className="proj-head">
          <Link to="/portfolio" className="back">← Zurück</Link>
          <div className="spacer" />
        </div>
        <div className="empty">Projekt nicht gefunden.</div>
      </div>
    );
  }

  return (
    <div className="proj-slider">
      <div className="proj-head">
        <Link 
          to="/#portfolio" 
          state={{ skipSplash: true }}
          className="back-arrow" 
          aria-label="Zurück"
        >
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        </Link>
        <div className="pager">{slides.length ? index + 1 : 0} / {slides.length}</div>
      </div>

      <div
        className="proj-viewport"
        ref={viewportRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.length > 0 && (
          <Slide slide={slides[index]} meta={meta} />
        )}

        <button className="nav prev" onClick={prev} aria-label="Vorherige" disabled={index === 0}>
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
           </svg>
        </button>
        <button className="nav next" onClick={next} aria-label="Nächste" disabled={index === slides.length - 1}>
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
           </svg>
        </button>
      </div>
    </div>
  );
}

/* ---- Einzel-Slide ---- */
function Slide({ slide, meta }) {
  if (slide.type === 'cover') {
    return (
      <div className="slide slide-image">
        <img src={slide.src} alt="" />
      </div>
    );
  }

  if (slide.type === 'intro') {
    return (
      <div className="slide slide-intro">
        <div className="intro-wrap">
          <div className="intro-text">
            <h2 className="intro-title">{meta.title}</h2>
            <ul className="facts">
              {meta.client && <li className="client">{meta.client}</li>}
              {/* Credits / Custom Fields */}
              {meta.credits && (
                <>
                  {meta.credits.photography && <li><strong>Foto:</strong> {meta.credits.photography}</li>}
                  {meta.credits.graphic && <li><strong>Grafik:</strong> {meta.credits.graphic}</li>}
                  {meta.credits.copyright && <li><strong>©</strong> {meta.credits.copyright}</li>}
                  {meta.credits.product_photo && <li><strong>Produktfotos:</strong> {meta.credits.product_photo}</li>}
                  {meta.credits.paper && <li><strong>Papier:</strong> {meta.credits.paper}</li>}
                  {meta.credits.feature && <li><strong>Besonderheit:</strong> {meta.credits.feature}</li>}
                  {meta.credits.print && <li><strong>Druck:</strong> {meta.credits.print}</li>}
                  {meta.credits.website && <li><a href={`https://${meta.credits.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{meta.credits.website}</a></li>}
                </>
              )}
              {meta.year && <li><strong>Jahr:</strong> {meta.year}</li>}
              {Array.isArray(meta.roles) && meta.roles.length > 0 && (
                <li><strong>Rolle:</strong> {meta.roles.join(', ')}</li>
              )}
            </ul>
            {Array.isArray(meta.body) && meta.body.length > 0 && (
              <div className="body">
                {meta.body.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            )}
          </div>
          {slide.imgs && slide.imgs.length > 0 && (
            <div className={`intro-images count-${slide.imgs.length}`}>
              {slide.imgs.map((src, i) => (
                <div className="intro-image-item" key={i}>
                   <img src={src} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard: einzelnes Bild (02.jpg, 03.jpg, …)
  return (
    <div className="slide slide-image">
      <img src={slide.src} alt="" />
    </div>
  );
}
