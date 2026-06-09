import React from 'react';

export default function Footer() {
  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Col 1: Brand */}
        <div className="footer-col">
          <a href="#home" className="logo" onClick={handleScrollToTop}>
            <svg className="logo-icon" viewBox="0 0 24 24">
              <path
                d="M17 11l-5-5-5 5M12 2L2 12h3v8h14v-8h3L12 2z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            HIMA<span>CHAL</span>
          </a>
          <p>
            The official travel planner and guide for Himachal Pradesh. Discover the serene mountains, gushing rivers, and ancient temples of Devbhumi.
          </p>
          <div className="social-links">
            <a href="#home" className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a >
            <a href="#home" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a >
            <a href="#home" className="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a >
          </div>
        </div>

        {/* Col 2: Circuits */}
        <div className="footer-col">
          <h4>Travel Circuits</h4>
          <ul className="footer-links">
            <li><a href="#destinations">Shimla & Kufri</a></li>
            <li><a href="#destinations">Kullu & Manali</a></li>
            <li><a href="#destinations">Kangra & Dharamshala</a></li>
            <li><a href="#destinations">Lahaul & Spiti Valley</a></li>
          </ul>
        </div>

        {/* Col 3: Resources */}
        <div className="footer-col">
          <h4>Travel Resources</h4>
          <ul className="footer-links">
            <li><a href="#planner">Itinerary Planner</a></li>
            <li><a href="#weather">Packing Checklist</a></li>
            <li><a href="#stays">Stays Directory</a></li>
            <li><a href="#map-explorer">Interactive Map</a></li>
          </ul>
        </div>

        {/* Col 4: Emergency Helplines */}
        <div className="footer-col">
          <h4>Emergency Helplines</h4>
          <ul className="footer-links" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <li style={{ marginBottom: '0.25rem' }}>📞 HP Tourism: <strong>1800-180-8077</strong></li>
            <li style={{ marginBottom: '0.25rem' }}>🚓 State Police: <strong>112 / 100</strong></li>
            <li style={{ marginBottom: '0.25rem' }}>🧗 Mountain Rescue: <strong>0177-2680193</strong></li>
            <li style={{ marginBottom: '0.25rem' }}>🏥 Ambulance: <strong>108</strong></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Credits */}
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Himachal Pradesh Tourism Corporation. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#home">Privacy Policy</a>
          <a href="#home">Terms of Use</a>
          <a href="#home">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
