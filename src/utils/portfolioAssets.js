// Alle Assets aus /assets/portfolio/** (Bilder + PDFs) einsammeln
const ctx = require.context('../assets/projects', true, /\.(jpe?g|png|webp|pdf)$/i);

const assets = {};
ctx.keys().forEach((key) => {
  // z.B. key = "./01/01-cover.jpg" -> "01/01-cover.jpg"
  const clean = key.replace(/^\.\//, '');
  assets[clean.toLowerCase()] = ctx(key);
});

export const resolveAsset = (relativePath) => {
  if (!relativePath) return null;
  const norm = relativePath.replace(/^\.\//, '').toLowerCase();
  return assets[norm] || null;
};

// Alle Bilder eines Projekts (z. B. "01") sortiert zurückgeben
export const listProjectImages = (projectId) => {
  if (!projectId) return [];
  const list = Object.keys(assets).filter((p) =>
    p.startsWith(`${projectId}/`) && /\.(jpe?g|png|webp)$/i.test(p)
  );

  // Nach führender Nummer sortieren: 01, 02, 03 ...
  list.sort((a, b) => {
    const na = Number((a.match(/\/(\d+)[-_]?(?:title)?\./i) || [,'9999'])[1]);
    const nb = Number((b.match(/\/(\d+)[-_]?(?:title)?\./i) || [,'9999'])[1]);
    return na - nb || a.localeCompare(b);
  });

  return list;
};
