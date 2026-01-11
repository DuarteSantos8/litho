import React from "react";
import "./ServicePage.css";

export default function ServicePage() {
  return (
    <main className="service-page">
      {/* Titel wie in anderen Seiten */}
      <div className="headline">
        <h2 className="title">Service</h2>
      </div>

      <section className="service-content">
        <div className="service-text">
          <p>
            Egal, ob es um eine einfache Farbkorrektur, aufwändige Retuschen, kreatives Composing oder Fotomontagen geht – ich prüfe die Qualität sorgfältig und setze Ihre Wünsche kreativ, professionell und nach aktuellen Standards um. Mit langjähriger Erfahrung und einer Leidenschaft für Details biete ich individuelle Lösungen für Fotograf:innen und Grafiker:innen, Agenturen, Unternehmen und Privatpersonen.
          </p>
        </div>

        <div className="service-list">
          <p className="service-intro">
            Aufbereitung der Bilder z.B. für Anzeigen, Apps, Ausstellungen, Bücher, Einladungen, Flyer, Fotoalben Jahresberichte, Kataloge, Magazine, Plakate, Portraits, Poster, Prospekte, Websiten...
          </p>

          <div className="service-items">
            <p>• Bildbearbeitung</p>
            <p>• Retuschen</p>
            <p>• Farbkorrekturen</p>
            <p>• Objekte angleichen an Farbmuster</p>
            <p>• Hauttöne angleichen</p>
            <p>• Freisteller</p>
            <p>• Composing</p>
            <p>• Lookfindung</p>
            <p>• Farbraumkonvertierung</p>
            <p>• Bilder auf gewünschte Formate bringen</p>
            <p>• Druckdaten erstellen</p>
            <p>• Mediengestaltung</p>
          </div>
        </div>
      </section>
    </main>
  );
}
