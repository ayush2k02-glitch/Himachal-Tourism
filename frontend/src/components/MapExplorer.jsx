import React from 'react';

export default function MapExplorer() {
  return (
    <section id="map-explorer" className="map-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Interactive Map</span>
          <h2 className="section-title text-gradient">Explore Himachal Routes</h2>
          <p className="section-desc">
            Browse key travel circuits, high passes, and mountain landmarks directly on our interactive map.
          </p>
        </div>
        <div
          className="map-container glass-panel"
          style={{
            borderRadius: 'var(--card-radius)',
            overflow: 'hidden',
            height: '480px',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3410714.417246479!2d75.14324209594412!3d32.08420608553258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39046c603e3527b3%3A0x861bd670b4356e9c!2sHimachal%20Pradesh!5e0!3m2!1sen!2sin!4v1717666000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Interactive Himachal Tourism Map"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
