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
            <p>Hallo, ich bin Rita – Mach mal schön … und ich bin immer noch mit Begeisterung dabei. Gern auch für Sie.</p>

            <p>
              Ich bin Mediengestalterin, Lithografin und Photoshop-Expertin mit
              langjähriger Berufserfahrung. Als ausgebildete Reproherstellerin
              und Scanneroperatorin bin ich absolut farbsicher.
            </p>

            <p>
              Mein Einstieg in die digitale Bildbearbeitung begann bereits mit
              der Photoshop Version 2.0.
            </p>

            <p>Ein Bild kann sehr viele PiXEL haben – und ich finde sie alle!</p>
          </div>          {/* Grauer Platzhalter (Quadrat) */}
          <div className="about-placeholder" aria-hidden="true" />
        </section>
      </main>
  );
}
