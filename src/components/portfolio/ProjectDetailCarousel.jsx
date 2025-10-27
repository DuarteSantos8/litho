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
    const textImgName = meta.text_image || '01-title.jpg';
    const textImg = resolveAsset(meta.id, textImgName) || resolveAsset(meta.id, '01.jpg');

    // Galerie-Bilder >= 02.jpg (ohne cover & ohne 01-title/01.jpg)
    const galleryFiles = all.filter((name) => {
      if (/^01-cover\./i.test(name)) return false;
      if (meta.text_image && name.toLowerCase() === meta.text_image.toLowerCase()) return false;
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
    arr.push({ type: 'intro', img: textImg, key: 'intro' });
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
        <Link to="/portfolio" className="back">← Zurück</Link>
        <div className="title">
          <h1>{meta.title}</h1>
          {meta.subtitle && <p>{meta.subtitle}</p>}
        </div>
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

        <button className="nav prev" onClick={prev} aria-label="Vorherige" disabled={index === 0}>‹</button>
        <button className="nav next" onClick={next} aria-label="Nächste" disabled={index === slides.length - 1}>›</button>
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
            <ul className="facts">
              {meta.client && <li><strong>Auftraggeber:</strong> {meta.client}</li>}
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
          {slide.img && (
            <div className="intro-image">
              <img src={slide.img} alt="" />
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
