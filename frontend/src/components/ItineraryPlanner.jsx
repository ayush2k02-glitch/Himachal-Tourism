import React, { useState, useEffect } from 'react';
import { itineraries } from '../js/itineraryData';

const vibes = [
  { value: 'adventure', label: 'Adventure', icon: '🧗' },
  { value: 'spiritual', label: 'Spiritual', icon: '🧘' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'solo', label: 'Solo Wanderer', icon: '🎒' }
];

const durations = [3, 5, 7, 10];

export default function ItineraryPlanner() {
  const [selectedVibe, setSelectedVibe] = useState('adventure');
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const generateItinerary = (vibe, duration) => {
    const itinerary = itineraries[vibe]?.[duration];
    setGeneratedItinerary(itinerary || null);
  };

  // Run on mount to initialize default
  useEffect(() => {
    generateItinerary(selectedVibe, selectedDuration);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    generateItinerary(selectedVibe, selectedDuration);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert('Itinerary link copied to clipboard! Share it with your travel buddies.');
  };

  return (
    <section id="planner" className="itinerary-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">AI Itinerary Planner</span>
          <h2 className="section-title text-gradient">Tailored Himalayan Journeys</h2>
          <p className="section-desc">
            Customize your trip timeline by selecting your travel vibe and duration to unlock the perfect mountain experience.
          </p>
        </div>

        <div className="planner-container">
          <aside className="planner-sidebar glass-panel">
            <h3>Configure Journey</h3>
            <form id="itinerary-form" onSubmit={handleSubmit}>
              <div className="planner-form-group">
                <label>Choose Travel Vibe</label>
                <div className="vibe-grid">
                  {vibes.map((v) => (
                    <div
                      key={v.value}
                      className={`vibe-option ${selectedVibe === v.value ? 'active' : ''}`}
                      onClick={() => setSelectedVibe(v.value)}
                    >
                      <input
                        type="radio"
                        name="vibe"
                        value={v.value}
                        checked={selectedVibe === v.value}
                        onChange={() => {}} // Controlled via parent onClick
                      />
                      <span className="vibe-icon">{v.icon}</span>
                      <span className="vibe-label">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="planner-form-group">
                <label>Select Duration</label>
                <div className="duration-selector">
                  {durations.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`duration-btn ${selectedDuration === d ? 'active' : ''}`}
                      onClick={() => setSelectedDuration(d)}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="planner-generate-btn">
                Generate Plan
              </button>
            </form>
          </aside>

          <main className="planner-output" id="planner-output">
            {generatedItinerary ? (
              <div className="glass-panel itinerary-card">
                <div className="itinerary-header">
                  <div className="itinerary-title">
                    <h3>{generatedItinerary.title}</h3>
                    <p>{generatedItinerary.subtitle}</p>
                  </div>
                  <div className="itinerary-actions">
                    <button
                      className="itinerary-action-btn"
                      onClick={handlePrint}
                      title="Print Itinerary"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                    </button>
                    <button
                      className="itinerary-action-btn"
                      onClick={handleShare}
                      title="Share link"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="timeline">
                  {generatedItinerary.days.map((dayInfo) => (
                    <div key={dayInfo.day} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-day">{dayInfo.day}</div>
                      <h4 className="timeline-title">{dayInfo.title}</h4>
                      <p className="timeline-desc">{dayInfo.desc}</p>
                      <div className="timeline-highlights">
                        {dayInfo.tags.map((tag) => (
                          <span key={tag} className="timeline-tag">
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />
                            </svg>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-panel itinerary-card" style={{ textAlign: 'center' }}>
                <h3>No itinerary found. Please try another combination.</h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
