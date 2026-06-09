import React, { useState, useEffect } from 'react';
import { submitInquiry } from '../js/api';

export default function InquiryModal({ isOpen, onClose, destinationPreset }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('General Inquiry');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Set preset destination if supplied
  useEffect(() => {
    if (destinationPreset) {
      // Find matching select option
      const options = [
        { label: 'General Inquiry', val: 'General Inquiry' },
        { label: 'Shimla', val: 'Shimla' },
        { label: 'Manali', val: 'Manali' },
        { label: 'Dharamshala', val: 'Dharamshala' },
        { label: 'Spiti', val: 'Spiti' },
        { label: 'Kasol', val: 'Kasol' },
        { label: 'Dalhousie', val: 'Dalhousie' },
        { label: 'Kinnaur', val: 'Kinnaur' },
        { label: 'Tirthan', val: 'Tirthan' }
      ];
      const match = options.find(o => o.val.toLowerCase() === destinationPreset.toLowerCase() || destinationPreset.toLowerCase().includes(o.val.toLowerCase()));
      if (match) {
        setDestination(match.val);
      } else {
        setDestination('General Inquiry');
      }
    } else {
      setDestination('General Inquiry');
    }
  }, [destinationPreset, isOpen]);

  // Reset form helper
  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDestination('General Inquiry');
    setDate('');
    setNotes('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    onClose();
    // Delay resetting state to allow fade-out animation to complete
    setTimeout(handleReset, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !date) {
      alert('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      alert('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);

    submitInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      destination,
      date,
      notes: notes.trim()
    })
      .then((data) => {
        setIsSubmitting(false);
        if (data.success) {
          setIsSuccess(true);
        } else {
          alert('Submission failed: ' + (data.message || 'Unknown error'));
        }
      })
      .catch((error) => {
        console.error('Error submitting inquiry:', error);
        setIsSubmitting(false);
        alert('Failed to connect to the booking server: ' + error.message);
      });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && handleClose()}>
      <div className="modal-box glass-panel">
        <button className="modal-close" onClick={handleClose} aria-label="Close Modal">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header">
          <h3>Customize Your Trip</h3>
          <p>Fill out the form below, and our Himalayan travel experts will contact you with a customized quote.</p>
        </div>

        <form className="modal-form" id="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="book-name">Full Name</label>
            <div className="form-input-wrapper">
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <input
                type="text"
                id="book-name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="book-email">Email Address</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input
                  type="email"
                  id="book-email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="book-phone">Phone Number</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <input
                  type="tel"
                  id="book-phone"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="book-destination">Select Destination</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <select
                  id="book-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="General Inquiry">💬 General Inquiry</option>
                  <option value="Shimla">🏰 Shimla & Kufri</option>
                  <option value="Manali">❄️ Kullu & Manali</option>
                  <option value="Dharamshala">🛕 Kangra & Dharamshala</option>
                  <option value="Spiti">☸️ Lahaul & Spiti Valley</option>
                  <option value="Kasol">💨 Parvati Valley (Kasol)</option>
                  <option value="Dalhousie">🌲 Chamba & Dalhousie</option>
                  <option value="Kinnaur">🏔️ Kinnaur Valley (Kalpa & Sangla)</option>
                  <option value="Tirthan">🌲 Tirthan Valley (GHNP)</option>
                  <option value="Customized Tour Package">🗺️ Custom Package</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="book-date">Travel Start Date</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <input
                  type="date"
                  id="book-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="book-message">Additional Notes (Optional)</label>
            <div className="form-input-wrapper">
              <textarea
                id="book-message"
                placeholder="Tell us about your preferences (e.g. number of travelers, budget, special requirements)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="spinner"
                  viewBox="0 0 50 50"
                  style={{
                    width: '20px',
                    height: '20px',
                    animation: 'rotate 2s linear infinite',
                    stroke: '#070e17',
                    fill: 'none',
                    strokeWidth: 5,
                    strokeLinecap: 'round'
                  }}
                >
                  <circle cx="25" cy="25" r="20" strokeDasharray="90,150" strokeDashoffset="0"></circle>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Send Inquiry
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Success Overlay Screen */}
        <div className={`success-screen ${isSuccess ? 'active' : ''}`}>
          <div className="success-icon-wrapper">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>Inquiry Submitted!</h3>
          <p>Thank you for reaching out. Our Himalayan travel expert will connect with you within 24 hours.</p>
          <button className="success-btn" onClick={handleClose}>
            Back to Explore
          </button>
        </div>
      </div>
    </div>
  );
}
