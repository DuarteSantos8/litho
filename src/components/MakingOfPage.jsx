import React, { useMemo, useState, useRef } from 'react';
import metaData from '../data/making-of.json';      // Credits/Infos pro id
import './MakingOfPage.css';

/* ===== Bilder automatisch laden (CRA/Webpack) ===== */
const imagesByName = {};
function importAll(r) {
  r.keys().forEach((key) => {
    const file = key.replace('./', '');            // z.B. "1_v.jpg"
    imagesByName[file.toLowerCase()] = r(key);     // URL
  });
}
// Pfad ggf. anpassen:
importAll(require.context('../assets/projects/making_of', false, /\.(jpe?g|png|webp)$/i));

/* ===== Aus Dateinamen Paare bilden: id_v + id_n ===== */
const buildPairsFromFolder = () => {
  const pairs = new Map(); // id -> { id, beforeName, afterName }

  const rx = /^(\d+)_([vn])\.(jpg|jpeg|png|webp)$/i;
  Object.keys(imagesByName).forEach((name) => {
    const m = name.match(rx);
    if (!m) return;
    const id = Number(m[1]);
    const kind = m[2].toLowerCase(); // 'v' oder 'n'
    const entry = pairs.get(id) || { id, beforeName: null, afterName: null };
    if (kind === 'v') entry.beforeName = name;
    if (kind === 'n') entry.afterName  = name;
    pairs.set(id, entry);
  });

  return Array.from(pairs.values())
    .filter((p) => p.beforeName && p.afterName)
    .sort((a, b) => a.id - b.id);
};

const resolveImage = (filename) => {
  if (!filename) return null;
  return imagesByName[filename.toLowerCase()] ?? null;
};

const ComparisonSlider = ({ beforeSrc, afterSrc }) => {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const startPointer = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
    const onMove = (evt) => startPointer(evt.clientX);
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    startPointer(e.clientX);
  };

  const onTouchStart = (e) => {
    setIsDragging(true);
    // e.preventDefault(); // Removed to allow vertical scrolling (use touch-action: pan-y in CSS)
    const onMove = (evt) => startPointer(evt.touches[0].clientX);
    const onEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    startPointer(e.touches[0].clientX);
  };

  if (!beforeSrc || !afterSrc) return null;

  return (
    <div
      className="image-comparison-container"
      ref={sliderRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="group"
      aria-label="Bildvergleich"
    >
      {/* Unsichtbares Sizer-Image, damit die Box die natürliche Bildhöhe annimmt */}
      <img className="sizer" src={beforeSrc} alt="" aria-hidden="true" />

      {/* Nachher (Layer 1 - Bottom - Right Side) */}
      <div className="image-layer">
        <img src={afterSrc} alt="Nachher" />
        <span className="comparison-label label-after">NACHHER</span>
      </div>

      {/* Vorher (Layer 2 - Top - Left Side - Clipped) */}
      <div
        className="image-layer top-layer"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
        }}
      >
        <img src={beforeSrc} alt="Vorher" />
        <span className="comparison-label label-before">VORHER</span>
      </div>

      {/* Slider Handle */}
      <div
        className="slider-handle"
        style={{
          left: `${position}%`,
          transition: isDragging ? 'none' : 'left 0.1s ease-out'
        }}
        aria-hidden
      >
        <div className="slider-line"></div>
        <div className="slider-button">
          <span>‹</span>
          <span>›</span>
        </div>
      </div>
    </div>
  );
};

const MakingOf = () => {
  // Paare aus Ordner + Metadaten aus JSON mergen
  const items = useMemo(() => {
    const pairs = buildPairsFromFolder();
    const metaById = new Map(metaData.map(m => [Number(m.id), m]));
    return pairs.map(p => ({
      ...p,
      meta: metaById.get(p.id) || null
    }));
  }, []);

  return (
    <div className="making-of-container">
      <div className="headline">
        <h2 className="title">Making Of</h2>
      </div>

      <div className="making-of-content">
        {items.map(({ id, beforeName, afterName, meta }) => {
          const beforeSrc = resolveImage(beforeName);
          const afterSrc  = resolveImage(afterName);
          if (!beforeSrc || !afterSrc) {
            console.warn('[MakingOf] Bild nicht gefunden:', { id, beforeName, afterName });
            return null;
          }

          return (
            <div className="comparison-section" key={id}>
              <ComparisonSlider beforeSrc={beforeSrc} afterSrc={afterSrc} />
              {/* Credits aus JSON unter dem Bild */}
              {meta && (
                <div className="credits">
                  {meta.client && <span><strong>Kunde:</strong> {meta.client}</span>}
                  {Array.isArray(meta.graphics) && meta.graphics.length > 0 && (
                    <span><strong>Grafik:</strong> {meta.graphics.join(', ')}</span>
                  )}
                  {meta.photo && <span><strong>Foto:</strong> {meta.photo}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MakingOf;
