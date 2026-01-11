import React, { useState, useRef, useEffect } from 'react';
import { FaEnvelope, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';
import { BsMicrosoftTeams } from "react-icons/bs";
import emailjs from '@emailjs/browser';
import "./ContactPage.css";

const ContactPage = () => {
  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [timeUntilNextMessage, setTimeUntilNextMessage] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Prüfe beim Laden der Komponente, ob eine Zeitbegrenzung aktiv ist
  useEffect(() => {
    checkRateLimit();
  }, []);

  // Timer-Funktion, die den verbleibenden Countdown aktualisiert
  useEffect(() => {
    let interval;
    if (timerActive && timeUntilNextMessage > 0) {
      interval = setInterval(() => {
        setTimeUntilNextMessage(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            setTimerActive(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeUntilNextMessage]);

  // Prüft, ob der Benutzer das Rate-Limit erreicht hat
  const checkRateLimit = () => {
    const lastMessageTime = localStorage.getItem('lastMessageTime');
    if (lastMessageTime) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - parseInt(lastMessageTime);
      const waitTime = 600000; // 10 Minuten in Millisekunden
      
      if (timeDiff < waitTime) {
        const remainingTime = Math.ceil((waitTime - timeDiff) / 1000);
        setTimeUntilNextMessage(remainingTime);
        setTimerActive(true);
        return true;
      }
    }
    return false;
  };

  // Formatiert die verbleibende Zeit in Minuten und Sekunden
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prüfe, ob der Benutzer eine Nachricht senden darf
    if (checkRateLimit()) {
      setSubmitStatus('rate-limited');
      return;
    }
    
    setIsSubmitting(true);

    emailjs.sendForm(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      formRef.current,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Speichere den Zeitstempel der gesendeten Nachricht
      localStorage.setItem('lastMessageTime', new Date().getTime().toString());
      setTimeUntilNextMessage(600); // 10 Minuten in Sekunden
      setTimerActive(true);
      
    }).catch((error) => {
      console.error('EmailJS error:', error);
      setSubmitStatus('error');
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="section-title">Contact</h2>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <p>Haben Sie Fragen oder möchten Sie zusammenarbeiten? Zögern Sie nicht, eine Nachricht zu hinterlassen und ich werde mich baldmöglichst melden.</p>

            <div className="contact-details">
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span> kontakt@litho.ch</span>
              </div>

              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span> Rita Lehnert, Malvenstrasse 12, 8057 Zürich</span>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form 
              className="contact-form" 
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Dein Name"
                  disabled={timerActive}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Deine E-Mail"
                  disabled={timerActive}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Betreff</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Betreff"
                  disabled={timerActive}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Nachricht</label>
                <div className="textarea-wrapper">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Deine Nachricht"
                    rows="6"
                    maxLength="500"
                    disabled={timerActive}
                  />
                  <span className={`char-counter ${formData.message.length >= 500 ? 'limit-reached' : ''}`}>
                    {formData.message.length}/500
                  </span>
                </div>
              </div>

              {timerActive ? (
                <div className="rate-limit-notice">
                  <p>Bitte warte {formatTime(timeUntilNextMessage)} bevor du eine weitere Nachricht sendest.</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting || timerActive}
                >
                  {isSubmitting ? 'Sende...' : 'Nachricht senden'}
                </button>
              )}

              {submitStatus === 'success' && (
                <div className="form-status success">
                  Nachricht erfolgreich gesendet! Ich melde mich bald bei dir.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-status error">
                  Es gab einen Fehler beim Senden deiner Nachricht. Bitte versuche es erneut.
                </div>
              )}

              {submitStatus === 'rate-limited' && (
                <div className="form-status warn">
                  Du kannst nur eine Nachricht alle 10 Minuten senden. Bitte warte.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;