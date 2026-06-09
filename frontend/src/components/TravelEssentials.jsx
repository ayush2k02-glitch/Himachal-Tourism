import React, { useState, useEffect } from 'react';
import { weatherData } from '../js/itineraryData';

const months = [
  { value: 'january', label: 'January' },
  { value: 'february', label: 'February' },
  { value: 'march', label: 'March' },
  { value: 'april', label: 'April' },
  { value: 'may', label: 'May' },
  { value: 'june', label: 'June' },
  { value: 'july', label: 'July' },
  { value: 'august', label: 'August' },
  { value: 'september', label: 'September' },
  { value: 'october', label: 'October' },
  { value: 'november', label: 'November' },
  { value: 'december', label: 'December' }
];

export default function TravelEssentials() {
  const [selectedMonth, setSelectedMonth] = useState('january');
  const [checkedItems, setCheckedItems] = useState({});

  const data = weatherData[selectedMonth] || weatherData['january'];

  // Reset checked items when month changes
  useEffect(() => {
    setCheckedItems({});
  }, [selectedMonth]);

  const toggleCheck = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Temperature Gauge Circle Math
  const minTemp = -5;
  const maxTemp = 30;
  const tempVal = data.temp;
  let percentage = (tempVal - minTemp) / (maxTemp - minTemp);
  percentage = Math.max(0, Math.min(1, percentage));
  const strokeDashoffset = 439.8 * (1 - percentage);

  return (
    <section id="weather" className="utility-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Travel Essentials</span>
          <h2 className="section-title text-gradient">Climate & Gear Checklists</h2>
          <p className="section-desc">
            Himachal's weather changes drastically across seasons and altitudes. Select your travel month to see average conditions and matching gear checklists.
          </p>
        </div>

        <div className="utility-grid">
          <div className="utility-card glass-panel">
            <div className="month-picker-wrapper">
              <h3>Packing Checklist</h3>
              <select
                className="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="checklist-container" id="packing-checklist-container">
              {/* Group 1: Essentials */}
              <div className="checklist-cat">
                <h4 className="checklist-cat-title">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Essential Gear & Clothes
                </h4>
                <div className="checklist-list">
                  {data.items.base.map((item, idx) => {
                    const id = `essential-${idx}`;
                    return (
                      <label key={id} className="checklist-item">
                        <input
                          type="checkbox"
                          id={id}
                          checked={!!checkedItems[id]}
                          onChange={() => toggleCheck(id)}
                        />
                        <span className="check-custom"></span>
                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Recommended */}
              <div className="checklist-cat">
                <h4 className="checklist-cat-title">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Highly Recommended
                </h4>
                <div className="checklist-list">
                  {data.items.optional.map((item, idx) => {
                    const id = `optional-${idx}`;
                    return (
                      <label key={id} className="checklist-item">
                        <input
                          type="checkbox"
                          id={id}
                          checked={!!checkedItems[id]}
                          onChange={() => toggleCheck(id)}
                        />
                        <span className="check-custom"></span>
                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="utility-card glass-panel">
            <div className="weather-card">
              <div className="weather-header">
                <h3>Climate Guide</h3>
                <p>Regional Averages & Overview</p>
              </div>

              <div className="weather-temp-container">
                <svg className="weather-gauge" viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="weather-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-accent)" />
                      <stop offset="100%" stopColor="#e76f51" />
                    </linearGradient>
                  </defs>
                  <circle className="gauge-bg" cx="80" cy="80" r="70" />
                  <circle
                    className="gauge-progress"
                    cx="80"
                    cy="80"
                    r="70"
                    style={{ strokeDashoffset }}
                  />
                </svg>
                <div className="weather-value-wrapper">
                  <div className="weather-temp">{data.temp}°C</div>
                  <div className="weather-label">{data.condition}</div>
                </div>
              </div>

              <div className="weather-summary-box">
                <p>{data.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
