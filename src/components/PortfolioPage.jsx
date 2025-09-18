import React from "react";
import "./PortfolioPage.css";

const folders = [
  { name: "Bilder_Hutträger_Sandra", count: 5 },
  { name: "Bilder_Samuel_Schriftenfächer", count: 4 },
  { name: "Bilder_Schmuck_FrÄnzi", count: 8 },
  { name: "Bilder_Zahnarzt_Praxis_Aichinger", count: 6 },
];

function buildImages() {
  const list = [];
  for (const f of folders) {
    for (let i = 1; i <= f.count; i++) {
      const url = encodeURI(`/src/${f.name}/${i}.jpg`);
      list.push({
        src: url,
        alt: `${f.name.replace(/_/g, " ")} – ${i}`,
      });
    }
  }
  return list;
}

export default function PortfolioGrid() {
  const images = React.useMemo(buildImages, []);

  return (
    <main className="portfolio">
      <div className="headline">
        <h2 className="title">Portfolio</h2>
      </div>

      <section className="grid">
  {images.map((img, idx) => (
    <figure className="tile" key={idx}>
      <img
        src={img.src}
        alt={img.alt}
        loading={idx < 4 ? "eager" : "lazy"}
        fetchpriority={idx < 4 ? "high" : "auto"}
        decoding="async"
      />
    </figure>
  ))}
</section>

    </main>
  );
}
