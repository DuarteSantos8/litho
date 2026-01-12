import React from "react";
import "./AboutPage.css";

export default function About() {
  return (
      <main className="about-page">
        {/* Titel wie im Portfolio */}
        <div className="headline">
          <h2 className="title">About</h2>
        </div>

        <section className="about-content">
          <div className="about-text">
            <p>Hallo, ich bin Rita</p>
            <p>
              «Mach mal schön» – das ist wohl eines der häufigsten ‘Briefings’, die ich bekomme. Aufgrund meiner langjährigen Berufserfahrung weiss ich, wie dieses «schön» zu erreichen ist.
            </p>
            <p>
              Ich bin Mediengestalterin, Lithografin und Photoshop-Expertin. Als ausgebildete Reproherstellerin und Scanner Operatorin bin ich absolut farbsicher. Ein Bild kann sehr viele Pixel haben – und ich finde sie alle!
            </p>
            <p>
              Mein Einstieg in die digitale Bildbearbeitung begann bereits mit der Photoshop Version 2.0 – und ich bin immer noch mit Begeisterung dabei. Gern auch für Sie
            </p>
          </div>          {/* Grauer Platzhalter (Quadrat) */}
          <div className="about-placeholder" aria-hidden="true" />
        </section>
      </main>
  );
}
