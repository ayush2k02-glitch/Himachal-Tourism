import React, { useState, useEffect, useRef } from 'react';
import { fetchHotels, uploadHotelImage } from '../js/api';
import StayBookingModal from './StayBookingModal';

const stayFilters = [
  { label: '🏨 All Stays', value: 'all' },
  { label: 'Shimla', value: 'shimla' },
  { label: 'Manali', value: 'manali' },
  { label: 'Dharamshala', value: 'dharamshala' },
  { label: 'Spiti', value: 'spiti' },
  { label: 'Kinnaur', value: 'kinnaur' },
  { label: 'Tirthan Valley', value: 'tirthan' },
  { label: 'Chamba', value: 'chamba' },
  { label: 'Mandi & Barot', value: 'mandi' },
  { label: 'Parvati Valley', value: 'kasol' }
];

export default function Stays() {
  const [hotels, setHotels] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [uploadingHotelId, setUploadingHotelId] = useState(null);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 4;

  // Booking Modal States
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  const selectedHotelIdRef = useRef(null);

  // Load hotels helper
  const loadHotels = async (filter) => {
    try {
      const res = await fetchHotels(filter);
      if (res.success) {
        setHotels(res.data);
        setError(null);
      } else {
        setError(res.message || 'Failed to fetch hotels.');
      }
    } catch (err) {
      console.error('Error loading hotels:', err);
      setError('Failed to connect to the booking server. Please ensure the backend is running.');
    }
  };

  // Fetch hotels on mount and when filter changes
  useEffect(() => {
    loadHotels(activeFilter);
    setCurrentPage(1); // Reset page on filter change
  }, [activeFilter]);

  // Periodic polling every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      // Only poll if the stays booking modal is not open
      if (!isBookingOpen) {
        fetchHotels(activeFilter)
          .then((res) => {
            if (res.success) {
              setHotels(res.data);
            }
          })
          .catch((err) => console.log('Silent polling error:', err));
      }
    }, 12000);

    return () => clearInterval(timer);
  }, [activeFilter, isBookingOpen]);

  // Handle uploader change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const hotelId = selectedHotelIdRef.current;
    if (!file || !hotelId) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    setUploadingHotelId(hotelId);

    const reader = new FileReader();
    reader.onload = function (event) {
      const base64Data = event.target.result;

      uploadHotelImage(hotelId, base64Data)
        .then((res) => {
          setUploadingHotelId(null);
          if (res.success) {
            // Update the state locally
            setHotels((prevHotels) =>
              prevHotels.map((h) => (h.id === hotelId ? { ...h, image: res.imageUrl } : h))
            );
          } else {
            alert('Image upload failed: ' + (res.message || 'Unknown error'));
          }
        })
        .catch((err) => {
          setUploadingHotelId(null);
          alert('Error uploading image: ' + err.message);
        });
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = (hotelId) => {
    selectedHotelIdRef.current = hotelId;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleOpenBooking = (hotel) => {
    setSelectedHotel(hotel);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (hotelId) => {
    // Decrement room available locally in memory to reflect in real time immediately
    setHotels((prevHotels) =>
      prevHotels.map((h) =>
        h.id === hotelId && h.roomsAvailable > 0
          ? { ...h, roomsAvailable: h.roomsAvailable - 1 }
          : h
      )
    );
  };

  // Render availability details
  const getAvailabilityInfo = (rooms) => {
    if (rooms === 0) {
      return { badgeClass: 'soldout', badgeText: '❌ Sold Out', isSoldOut: true };
    }
    if (rooms === 1) {
      return { badgeClass: 'low', badgeText: '⏳ Only 1 Room Left!', isSoldOut: false };
    }
    if (rooms <= 3) {
      return { badgeClass: 'low', badgeText: `⏳ Only ${rooms} Rooms Left`, isSoldOut: false };
    }
    return { badgeClass: 'available', badgeText: '✅ Available', isSoldOut: false };
  };

  const amenityIcons = {
    'wifi': '📶',
    'spa': '💆',
    'pool': '🏊',
    'mountain view': '🏔️',
    'restaurant': '🍽️',
    'adventure guide': '🧗',
    'balcony': '🌅',
    'stargazing deck': '🌌',
    'oxygen kit': '💨',
    'local cuisine': '🍲',
    'trout fishing': '🎣',
    'riverside garden': '🏡',
    'fireplace': '🔥',
    'apple orchard': '🍎',
    'yoga deck': '🧘',
    'historic carvings': '🏛️',
    'terrace café': '☕',
    'geodesic dome': '🎪',
    'campfire': '🔥',
    'riverside views': '🌊',
    'skiing gear': '🎿'
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  return (
    <section id="stays" className="stays-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Premium Stays</span>
          <h2 className="section-title text-gradient">Handpicked Mountain Retreats</h2>
          <p className="section-desc">
            Book highly-rated stays, heritage properties, or adventure lodges that let you experience Himachal like a local.
          </p>
        </div>

        <div className="stays-filters region-filters">
          {stayFilters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {error ? (
          <div style={{ textAlign: 'center', color: '#e76f51', padding: '3rem 0' }}>
            <h3>Failed to load hotel availability.</h3>
            <p>{error}</p>
          </div>
        ) : hotels.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
            <h3>No premium stays found in this region.</h3>
            <p>Please select another circuit or try again later.</p>
          </div>
        ) : (
          <div className="hotel-grid">
            {currentHotels.map((hotel) => {
              const { badgeClass, badgeText, isSoldOut } = getAvailabilityInfo(hotel.roomsAvailable);
              const isUploading = uploadingHotelId === hotel.id;

              return (
                <article
                  key={hotel.id}
                  className={`hotel-card glass-panel ${isUploading ? 'uploading' : ''}`}
                  data-region={hotel.region}
                >
                  <div className="card-img-wrapper">
                    <img src={hotel.image} alt={hotel.name} />
                    <span className={`availability-badge ${badgeClass}`}>{badgeText}</span>
                    <button
                      className="upload-image-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerUpload(hotel.id);
                      }}
                      title="Upload Real Image"
                      aria-label="Upload Hotel Image"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2 2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </button>
                  </div>
                  <div className="card-content">
                    <div className="card-meta">
                      <span className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {hotel.location}
                      </span>
                      <span className="meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {hotel.rating} Stars
                      </span>
                    </div>
                    <h3>{hotel.name}</h3>
                    <p>{hotel.description}</p>
                    <div className="hotel-amenities">
                      {hotel.amenities.map((amenity) => {
                        const icon = amenityIcons[amenity.toLowerCase()] || '✨';
                        return (
                          <span key={amenity} className="amenity-tag">
                            {icon} {amenity}
                          </span>
                        );
                      })}
                    </div>
                    <div className="card-footer">
                      <div className="card-price">
                        Starts at<span>₹{hotel.price.toLocaleString()}/night</span>
                      </div>
                      <div className="card-actions">
                        {isSoldOut ? (
                          <button className="card-btn sold-out-btn" disabled>
                            Sold Out
                          </button>
                        ) : (
                          <button className="card-btn" onClick={() => handleOpenBooking(hotel)}>
                            Book Stay
                            <svg viewBox="0 0 24 24">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Paginated Slides Navigation */}
        {!error && hotels.length > hotelsPerPage && (
          <div className="pagination-container">
            <button 
              className="pagination-btn pagination-arrow" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              &larr;
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button 
              className="pagination-btn pagination-arrow" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <StayBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedHotel={selectedHotel}
        onBookingSuccess={handleBookingSuccess}
      />
    </section>
  );
}
