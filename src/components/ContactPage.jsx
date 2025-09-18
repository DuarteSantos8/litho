import React, { useState } from "react";
import "./ContactPage.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    anfrage: '',
    name: '',
    email: '',
    telefon: '',
    rueckrufzeit: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validierung
    if (!formData.anfrage.trim() || !formData.name.trim() || !formData.email.trim()) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    console.log('Captcha korrekt gelöst!');
    
    // Form zurücksetzen
    setFormData({
      anfrage: '',
      name: '',
      email: '',
      telefon: '',
      rueckrufzeit: '',
    });
    alert('Nachricht erfolgreich gesendet!');
  };

  return (
    <main className="contact-page">
      {/* Titel */}
      <div className="headline">
        <h2 className="title">Kontakt</h2>
      </div>

      <section className="contact-content">
        <div className="contact-info">
          <div className="contact-details">
            <p className="contact-name">Rita Lehnert</p>
            <p className="contact-address">Malvenstrasse 12</p>
            <p className="contact-address">8057 Zürich</p>
            
            <div className="contact-links">
              <p className="contact-email">kontakt@litho.ch</p>
              <p className="contact-phone">+41 76 205 32 64</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="anfrage">Anfrage *</label>
              <textarea
                id="anfrage"
                name="anfrage"
                value={formData.anfrage}
                onChange={handleChange}
                rows="2"
                className="form-textarea"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">E-Mail *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefon">Telefon (optional)</label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rueckrufzeit">Rückrufzeit (optional)</label>
                <input
                  type="text"
                  id="rueckrufzeit"
                  name="rueckrufzeit"
                  value={formData.rueckrufzeit}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="DD/MM/YY HH:MM"
                />
              </div>
            </div>
            <button type="submit" className="submit-button">
              senden
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}