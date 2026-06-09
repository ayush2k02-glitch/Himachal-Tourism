import React, { useState, useEffect } from 'react';
import { bookHotelRoom } from '../js/api';

export default function StayBookingModal({ isOpen, onClose, selectedHotel, onBookingSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [totalPrice, setTotalPrice] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Set default dates on load or when modal opens
  useEffect(() => {
    if (isOpen && selectedHotel) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 2);

      const checkInVal = tomorrow.toISOString().split('T')[0];
      const checkOutVal = dayAfter.toISOString().split('T')[0];

      setCheckIn(checkInVal);
      setCheckOut(checkOutVal);
      setTotalPrice(selectedHotel.price * 2);
    }
  }, [isOpen, selectedHotel]);

  // Recalculate price when dates change
  useEffect(() => {
    if (selectedHotel && checkIn && checkOut) {
      const basePrice = selectedHotel.price;
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = checkOutDate - checkInDate;
      let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (isNaN(nights) || nights <= 0) {
        nights = 1;
      }
      setTotalPrice(nights * basePrice);
    }
  }, [checkIn, checkOut, selectedHotel]);

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setGuests('2');
    setIsSuccess(false);
    setBookingId('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(handleReset, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedHotel || !name.trim() || !email.trim() || !phone.trim() || !checkIn || !checkOut || !guests) {
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

    bookHotelRoom({
      hotelId: selectedHotel.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      checkIn,
      checkOut,
      guests,
      totalPrice
    })
      .then((res) => {
        setIsSubmitting(false);
        if (res.success) {
          setBookingId(res.data.id);
          setIsSuccess(true);
          // Decrement room available locally
          onBookingSuccess(selectedHotel.id);
        } else {
          alert('Booking failed: ' + (res.message || 'Unknown error'));
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        alert('Failed to connect to the booking server: ' + err.message);
      });
  };

  if (!selectedHotel) return null;

  return (
    <div
      id="hotel-booking-overlay"
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={(e) => e.target.id === 'hotel-booking-overlay' && handleClose()}
    >
      <div className="modal-box glass-panel">
        <button id="hotel-modal-close" className="modal-close" onClick={handleClose} aria-label="Close Modal">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header">
          <h3>Book Premium Stay</h3>
          <p>Reserving a room at <span id="selected-hotel-name" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{selectedHotel.name}</span></p>
        </div>

        <form className="modal-form" id="hotel-booking-form" onSubmit={handleSubmit}>
          <input type="hidden" id="hotel-id-input" value={selectedHotel.id} />

          <div className="form-group">
            <label htmlFor="hotel-book-name">Guest Full Name</label>
            <div className="form-input-wrapper">
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <input
                type="text"
                id="hotel-book-name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hotel-book-email">Email Address</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input
                  type="email"
                  id="hotel-book-email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hotel-book-phone">Phone Number</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <input
                  type="tel"
                  id="hotel-book-phone"
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
              <label htmlFor="hotel-book-checkin">Check-in Date</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <input
                  type="date"
                  id="hotel-book-checkin"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hotel-book-checkout">Check-out Date</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <input
                  type="date"
                  id="hotel-book-checkout"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row" style={{ gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'center' }}>
            <div className="form-group">
              <label htmlFor="hotel-book-guests">Number of Guests</label>
              <div className="form-input-wrapper">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <select
                  id="hotel-book-guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                  <option value="5">5 Adults</option>
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'right', paddingRight: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-accent)', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Total Price</div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-light)' }}>
                ₹<span id="hotel-booking-total-price">{totalPrice.toLocaleString()}</span>
              </span>
            </div>
          </div>

          <button type="submit" id="hotel-submit-btn" className="submit-btn" disabled={isSubmitting}>
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
                  <circle cx="25" cy="25" r="20" stroke-dasharray="90,150" stroke-dashoffset="0"></circle>
                </svg>
                Processing Stay...
              </>
            ) : (
              <>
                Confirm Stay Booking
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Success Screen Overlay */}
        <div id="hotel-success-screen" className={`success-screen ${isSuccess ? 'active' : ''}`}>
          <div className="success-icon-wrapper" style={{ borderColor: 'var(--color-emerald)', background: 'rgba(42, 157, 143, 0.1)', color: 'var(--color-emerald)' }}>
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>Booking Confirmed!</h3>
          <p>
            Your stay at <strong id="success-hotel-name">{selectedHotel.name}</strong> is successfully reserved.<br />
            Booking ID: <strong id="success-booking-id" style={{ color: 'var(--color-accent)' }}>{bookingId}</strong>
          </p>
          <button id="hotel-success-close-btn" className="success-btn" onClick={handleClose}>
            Back to Directory
          </button>
        </div>
      </div>
    </div>
  );
}
