import React from 'react';
import Header from '../components/Header';
import './Home.css';

const Home = () => {
  return (
    <>
      <Header />
      <main className="home-page">
        <div className="home-content">
          <div className="home-left">
            <div className="headline">
              <h2 className="title">Rita Lehnert-Bildbearbeitung</h2>
            </div>
            <div className="home-description">
              <p>
                Mit einem Blick fürs Detail, kreativen Ideen und präziser Bearbeitung wird das Beste aus Ihren Aufnahmen heraus geholt.
              </p>
              <p>
                Professionelle Bearbeitung kann Ihre Fotos deutlich aufwerten – egal, ob für digitale Medien oder den Druck auf Papier. Gut bearbeitete Bilder kommen überall optimal zur Geltung. Damit Ihre Bilder sowohl am Bildschirm als auch im Druck perfekt wirken, sind Fachwissen in Photoshop, Farbräumen, Druckverfahren sowie die Einhaltung wichtiger Standards wie FOGRA und ICC unerlässlich.
              </p>
            </div>
          </div>
          <div className="home-right">
            <h2 className="home-slogan">
              «Ihr Bild:<br />
              präzise<br />
              und auf den<br />
              Punkt»
            </h2>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;