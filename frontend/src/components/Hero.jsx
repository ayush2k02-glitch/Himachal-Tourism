import React, { useState } from 'react';

export default function Hero({ onQuickSearch }) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !duration) {
      alert('Please select both a destination and duration.');
      return;
    }
    onQuickSearch({ destination, duration, date });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-tag">
          🏔️ Devbhumi Himachal Tourism
        </div>
        <h1 className="text-gradient">Discover the Land of Gods</h1>
        <p className="hero-subtitle">
          Explore breathtaking snow-capped peaks, lush pine forests, pristine river valleys, 
          and ancient culture. Plan your journey with our smart itinerary builder and premium homestays.
        </p>

        <div className="search-widget glass-panel">
          <form className="widget-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Destination</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} required>
                  <option value="" disabled hidden>Where to?</option>
                  <option value="Shimla">Shimla & Kufri</option>
                  <option value="Manali">Kullu & Manali</option>
                  <option value="Dharamshala">Kangra & Dharamshala</option>
                  <option value="Spiti">Lahaul & Spiti Valley</option>
                  <option value="Kasol">Parvati Valley (Kasol)</option>
                  <option value="Dalhousie">Chamba & Dalhousie</option>
                  <option value="Kinnaur">Kinnaur Valley (Kalpa & Sangla)</option>
                  <option value="Tirthan">Tirthan Valley (GHNP)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Duration</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} required>
                  <option value="" disabled hidden>How long?</option>
                  <option value="3">3 Days (Weekend Break)</option>
                  <option value="5">5 Days (Explore Circuit)</option>
                  <option value="7">7 Days (Full Adventure)</option>
                  <option value="10">10 Days (Himalayan Odyssey)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Travel Date</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <button type="submit" className="widget-submit" aria-label="Search and Plan">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
