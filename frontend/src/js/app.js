/* ==========================================================
   Himachal Tourism - Interactive Modular App Logic
   ========================================================== */

import { itineraries, weatherData } from './itineraryData.js';
import { submitInquiry, fetchHotels, bookHotelRoom, uploadHotelImage } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation Menu ---
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');
  
  burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = burgerMenu.querySelector('svg');
    if (navLinks.classList.contains('active')) {
      icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    } else {
      icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = burgerMenu.querySelector('svg');
      icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
    });
  });

  // --- Scroll Active Navigation Link Highlight ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // --- Search and Filtering Logic for Destinations ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const destCards = document.querySelectorAll('.dest-card');
  const destSearchInput = document.getElementById('dest-search-input');
  const noSearchResults = document.getElementById('no-search-results');

  let activeFilter = 'all';

  function filterDestinations() {
    const query = destSearchInput ? destSearchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    destCards.forEach(card => {
      const cardRegion = card.getAttribute('data-region') || '';
      
      const cardTitle = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('p')?.textContent.toLowerCase() || '';
      const cardTag = card.querySelector('.card-tag')?.textContent.toLowerCase() || '';
      
      const regionMatch = (activeFilter === 'all' || cardRegion === activeFilter);
      const textMatch = !query || 
                        cardTitle.includes(query) || 
                        cardDesc.includes(query) || 
                        cardTag.includes(query) || 
                        cardRegion.includes(query);

      const isVisibleNow = card.style.display === 'block';

      if (regionMatch && textMatch) {
        visibleCount++;
        if (!isVisibleNow) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        }
      } else {
        card.style.display = 'none';
      }
    });

    if (noSearchResults) {
      if (visibleCount === 0) {
        noSearchResults.style.display = 'block';
        const googleSearchBtn = document.getElementById('fallback-google-search');
        const googleMapsBtn = document.getElementById('fallback-google-maps');
        
        if (googleSearchBtn) {
          googleSearchBtn.href = `https://www.google.com/search?q=Himachal+Tourism+${encodeURIComponent(query)}`;
        }
        if (googleMapsBtn) {
          googleMapsBtn.href = `https://www.google.com/maps/search/?api=1&query=Himachal+Tourism+${encodeURIComponent(query)}`;
        }
      } else {
        noSearchResults.style.display = 'none';
      }
    }
  }

  if (destSearchInput) {
    destSearchInput.addEventListener('input', filterDestinations);
  }


  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterDestinations();
    });
  });

  // --- Itinerary Planner Interactive Logic ---
  const plannerForm = document.getElementById('itinerary-form');
  const vibeOptions = document.querySelectorAll('.vibe-option');
  const durationBtns = document.querySelectorAll('.duration-btn');
  const plannerOutput = document.getElementById('planner-output');

  let selectedVibe = 'adventure';
  let selectedDuration = 5;

  // Vibe Choice Selection
  vibeOptions.forEach(option => {
    option.addEventListener('click', () => {
      vibeOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      const radio = option.querySelector('input[type="radio"]');
      radio.checked = true;
      selectedVibe = radio.value;
    });
  });

  // Duration Choice Selection
  durationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDuration = parseInt(btn.getAttribute('data-days'));
    });
  });

  // Generate Itinerary
  if (plannerForm) {
    plannerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      renderItinerary(selectedVibe, selectedDuration);
    });
  }

  function renderItinerary(vibe, duration) {
    const itinerary = itineraries[vibe]?.[duration];
    if (!itinerary) {
      plannerOutput.innerHTML = `<div class="glass-panel itinerary-card" style="text-align: center;"><h3>No itinerary found. Please try another combination.</h3></div>`;
      return;
    }

    let daysHtml = '';
    itinerary.days.forEach(dayInfo => {
      let tagsHtml = '';
      dayInfo.tags.forEach(tag => {
        tagsHtml += `
          <span class="timeline-tag">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/></svg>
            ${tag}
          </span>
        `;
      });

      daysHtml += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-day">${dayInfo.day}</div>
          <h4 class="timeline-title">${dayInfo.title}</h4>
          <p class="timeline-desc">${dayInfo.desc}</p>
          <div class="timeline-highlights">${tagsHtml}</div>
        </div>
      `;
    });

    plannerOutput.innerHTML = `
      <div class="glass-panel itinerary-card">
        <div class="itinerary-header">
          <div class="itinerary-title">
            <h3>${itinerary.title}</h3>
            <p>${itinerary.subtitle}</p>
          </div>
          <div class="itinerary-actions">
            <button class="itinerary-action-btn" id="print-itinerary-btn" title="Print Itinerary">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
            <button class="itinerary-action-btn" id="share-itinerary-btn" title="Share link">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </button>
          </div>
        </div>
        <div class="timeline">
          ${daysHtml}
        </div>
      </div>
    `;

    // Print Listener
    const printBtn = document.getElementById('print-itinerary-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Share Listener
    const shareBtn = document.getElementById('share-itinerary-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        alert('Itinerary link copied to clipboard! Share it with your travel buddies.');
      });
    }

    // Smooth scroll output into view
    plannerOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Initialize Default Itinerary
  renderItinerary('adventure', 5);

  // --- Weather and Packing Checklist Interactive Data ---
  const monthSelect = document.getElementById('month-selector');
  const tempNumber = document.querySelector('.weather-temp');
  const tempLabel = document.querySelector('.weather-label');
  const tempDesc = document.querySelector('.weather-summary-box p');
  const checklistContainer = document.getElementById('packing-checklist-container');
  const gaugeProgress = document.querySelector('.gauge-progress');

  if (monthSelect) {
    monthSelect.addEventListener('change', () => {
      updateWeatherWidget(monthSelect.value);
    });

    // Initialize widget on load
    updateWeatherWidget('january');
  }

  function updateWeatherWidget(month) {
    const data = weatherData[month];
    if (!data) return;

    // Update Text
    tempNumber.textContent = `${data.temp}°C`;
    tempLabel.textContent = data.condition;
    tempDesc.textContent = `${data.desc}`;

    // Update Circular Gauge
    // Radius of circle = 70. Circumference = 2 * PI * 70 = 439.8
    const minTemp = -5;
    const maxTemp = 30;
    let percentage = (data.temp - minTemp) / (maxTemp - minTemp);
    percentage = Math.max(0, Math.min(1, percentage));
    const offset = 439.8 * (1 - percentage);
    gaugeProgress.style.strokeDashoffset = offset;

    // Render Packing List Checkboxes
    let listHtml = '';
    
    // Group 1: Essentials
    let essentialItemsHtml = '';
    data.items.base.forEach((item, index) => {
      essentialItemsHtml += `
        <label class="checklist-item">
          <input type="checkbox" id="essential-${index}">
          <span class="check-custom"></span>
          <span>${item}</span>
        </label>
      `;
    });

    listHtml += `
      <div class="checklist-cat">
        <h4 class="checklist-cat-title">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Essential Gear & Clothes
        </h4>
        <div class="checklist-list">
          ${essentialItemsHtml}
        </div>
      </div>
    `;

    // Group 2: Recommended/Optional
    let optionalItemsHtml = '';
    data.items.optional.forEach((item, index) => {
      optionalItemsHtml += `
        <label class="checklist-item">
          <input type="checkbox" id="optional-${index}">
          <span class="check-custom"></span>
          <span>${item}</span>
        </label>
      `;
    });

    listHtml += `
      <div class="checklist-cat">
        <h4 class="checklist-cat-title">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          Highly Recommended
        </h4>
        <div class="checklist-list">
          ${optionalItemsHtml}
        </div>
      </div>
    `;

    checklistContainer.innerHTML = listHtml;
  }

  // --- Culture Tab Switcher ---
  const cultureTabBtns = document.querySelectorAll('.culture-tab-btn');
  const cultureContents = document.querySelectorAll('.culture-content');

  cultureTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cultureTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-tab');
      cultureContents.forEach(content => {
        if (content.getAttribute('id') === `culture-${targetId}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // --- Booking Inquiry Modal Logic ---
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  const bookingForm = document.getElementById('booking-form');
  const successScreen = document.querySelector('.success-screen');
  const closeSuccessBtn = document.getElementById('success-close-btn');

  function openModal(destName = '') {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (destName) {
      const selectDest = document.getElementById('book-destination');
      if (selectDest) {
        for (let i = 0; i < selectDest.options.length; i++) {
          if (selectDest.options[i].value.toLowerCase() === destName.toLowerCase()) {
            selectDest.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      bookingForm.reset();
      successScreen.classList.remove('active');
    }, 300);
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dest = btn.getAttribute('data-destination');
      openModal(dest);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeModal);
  }

  // Booking Form Submission & Validation
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-name').value.trim();
      const email = document.getElementById('book-email').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const date = document.getElementById('book-date').value;

      if (!name || !email || !phone || !date) {
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

      // Show loader on the submit button
      const submitBtn = bookingForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 50 50" style="width: 20px; height: 20px; animation: rotate 2s linear infinite; stroke: #070e17; fill: none; stroke-width: 5; stroke-linecap: round;">
          <circle cx="25" cy="25" r="20" stroke-dasharray="90,150" stroke-dashoffset="0"></circle>
        </svg>
        Processing...
      `;

      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        @keyframes rotate { 100% { transform: rotate(360deg); } }
      `;
      document.head.appendChild(styleEl);

      const destination = document.getElementById('book-destination').value;
      const notes = document.getElementById('book-message').value.trim();

      // Submit inquiry via our encapsulated api.js module
      submitInquiry({
        name,
        email,
        phone,
        destination,
        date,
        notes
      })
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        if (data.success) {
          successScreen.classList.add('active');
        } else {
          alert('Submission failed: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(error => {
        console.error('Error submitting inquiry:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        alert('Failed to connect to the booking server: ' + error.message);
      });
    });
  }

  // Handle quick planner search bar submission
  const quickSearchForm = document.getElementById('quick-search-form');
  if (quickSearchForm) {
    quickSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const destination = document.getElementById('search-destination').value;
      const duration = document.getElementById('search-duration').value;
      const date = document.getElementById('search-date').value;

      if (!destination || !duration) {
        alert('Please select both a destination and duration.');
        return;
      }

      openModal(destination);

      const bookDest = document.getElementById('book-destination');
      if (bookDest) {
        for (let i = 0; i < bookDest.options.length; i++) {
          if (bookDest.options[i].value.toLowerCase() === destination.toLowerCase()) {
            bookDest.selectedIndex = i;
            break;
          }
        }
      }

      const bookDate = document.getElementById('book-date');
      if (bookDate && date) {
        bookDate.value = date;
      }
    });
  }

  // --- Real-time Hotel Stays & Booking Logic ---
  let hotelsData = [];
  let activeStayFilter = 'all';

  const hotelContainer = document.getElementById('hotel-container');
  const stayFilterButtons = document.querySelectorAll('[data-stay-filter]');

  const fileUploader = document.getElementById('hotel-image-uploader');
  let targetUploadHotelId = null;

  // Hotel Booking Modal elements
  const hotelBookingOverlay = document.getElementById('hotel-booking-overlay');
  const hotelModalClose = document.getElementById('hotel-modal-close');
  const hotelBookingForm = document.getElementById('hotel-booking-form');
  const hotelSuccessScreen = document.getElementById('hotel-success-screen');
  const hotelSuccessCloseBtn = document.getElementById('hotel-success-close-btn');
  const selectedHotelNameSpan = document.getElementById('selected-hotel-name');
  const hotelIdInput = document.getElementById('hotel-id-input');

  const checkInInput = document.getElementById('hotel-book-checkin');
  const checkOutInput = document.getElementById('hotel-book-checkout');
  const totalPriceSpan = document.getElementById('hotel-booking-total-price');

  let currentSelectedHotel = null;

  // Render all amenities using styled tag elements
  function getAmenityHtml(amenities) {
    const iconMap = {
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
      'apple orchard': '🍎'
    };
    
    return amenities.map(amenity => {
      const lower = amenity.toLowerCase();
      const icon = iconMap[lower] || '✨';
      return `<span class="amenity-tag">${icon} ${amenity}</span>`;
    }).join('');
  }

  // Render hotel grid dynamically
  function renderHotels() {
    if (!hotelContainer) return;
    
    if (hotelsData.length === 0) {
      hotelContainer.innerHTML = `
        <div style="text-align: center; grid-column: 1/-1; padding: 4rem 1rem; color: var(--color-text-muted);">
          <h3>No premium stays found in this region.</h3>
          <p>Please select another circuit or try again later.</p>
        </div>
      `;
      return;
    }

    let hotelsHtml = '';
    hotelsData.forEach(hotel => {
      // Create Availability Badge
      let badgeClass = 'available';
      let badgeText = '✅ Available';
      
      if (hotel.roomsAvailable === 0) {
        badgeClass = 'soldout';
        badgeText = '❌ Sold Out';
      } else if (hotel.roomsAvailable === 1) {
        badgeClass = 'low';
        badgeText = '⏳ Only 1 Room Left!';
      } else if (hotel.roomsAvailable <= 3) {
        badgeClass = 'low';
        badgeText = `⏳ Only ${hotel.roomsAvailable} Rooms Left`;
      }

      // Create Button
      const buttonHtml = hotel.roomsAvailable === 0
        ? `<button class="card-btn sold-out-btn" disabled>Sold Out</button>`
        : `<button class="card-btn open-hotel-modal" data-hotel-id="${hotel.id}">
            Book Stay
            <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
           </button>`;

      hotelsHtml += `
        <article class="hotel-card glass-panel" data-region="${hotel.region}">
          <div class="card-img-wrapper">
            <img src="${hotel.image}" alt="${hotel.name}">
            <span class="availability-badge ${badgeClass}">${badgeText}</span>
            <button class="upload-image-btn" data-hotel-id="${hotel.id}" title="Upload Real Image">
              <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2 2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${hotel.location}
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ${hotel.rating} Stars
              </span>
            </div>
            <h3>${hotel.name}</h3>
            <p>${hotel.description}</p>
            <div class="hotel-amenities">
              ${getAmenityHtml(hotel.amenities)}
            </div>
            <div class="card-footer">
              <div class="card-price">Starts at<span>₹${hotel.price.toLocaleString()}/night</span></div>
              <div class="card-actions">
                ${buttonHtml}
              </div>
            </div>
          </div>
        </article>
      `;
    });

    hotelContainer.innerHTML = hotelsHtml;

    // Attach click listeners to stay booking buttons
    const openModalBtns = hotelContainer.querySelectorAll('.open-hotel-modal');
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const hotelId = btn.getAttribute('data-hotel-id');
        openHotelBookingModal(hotelId);
      });
    });

    // Attach click listeners to image upload buttons
    const uploadImageBtns = hotelContainer.querySelectorAll('.upload-image-btn');
    uploadImageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        targetUploadHotelId = btn.getAttribute('data-hotel-id');
        if (fileUploader) {
          fileUploader.value = '';
          fileUploader.click();
        }
      });
    });
  }

  // Fetch hotels from the API
  async function loadHotels() {
    try {
      const res = await fetchHotels(activeStayFilter);
      if (res.success) {
        hotelsData = res.data;
        renderHotels();
      }
    } catch (err) {
      console.error('Error loading hotels:', err);
      if (hotelContainer) {
        hotelContainer.innerHTML = `
          <div style="text-align: center; grid-column: 1/-1; padding: 4rem 1rem; color: #e76f51;">
            <h3>Failed to load hotel availability.</h3>
            <p>Make sure the backend server is running and try again.</p>
          </div>
        `;
      }
    }
  }

  // Price Calculation Logic
  function calculateTotalPrice() {
    if (!currentSelectedHotel) return;
    
    const basePrice = currentSelectedHotel.price;
    if (!checkInInput.value || !checkOutInput.value) {
      totalPriceSpan.textContent = basePrice.toLocaleString();
      return;
    }

    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);
    const diffTime = checkOut - checkIn;
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isNaN(nights) || nights <= 0) {
      nights = 1;
    }

    const total = nights * basePrice;
    totalPriceSpan.textContent = total.toLocaleString();
  }

  // Event Listeners for Date changes to update price
  if (checkInInput) checkInInput.addEventListener('change', calculateTotalPrice);
  if (checkOutInput) checkOutInput.addEventListener('change', calculateTotalPrice);

  // Set default dates for booking input
  function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);

    if (checkInInput && checkOutInput) {
      checkInInput.value = tomorrow.toISOString().split('T')[0];
      checkOutInput.value = dayAfter.toISOString().split('T')[0];
      checkInInput.min = today.toISOString().split('T')[0];
      checkOutInput.min = tomorrow.toISOString().split('T')[0];
    }
  }

  // Open Stay booking modal
  function openHotelBookingModal(hotelId) {
    currentSelectedHotel = hotelsData.find(h => h.id === hotelId);
    if (!currentSelectedHotel) return;

    if (selectedHotelNameSpan) selectedHotelNameSpan.textContent = currentSelectedHotel.name;
    if (hotelIdInput) hotelIdInput.value = hotelId;
    
    setDefaultDates();
    calculateTotalPrice();

    if (hotelBookingOverlay) {
      hotelBookingOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close Stay booking modal
  function closeHotelBookingModal() {
    if (hotelBookingOverlay) {
      hotelBookingOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
      setTimeout(() => {
        if (hotelBookingForm) hotelBookingForm.reset();
        if (hotelSuccessScreen) hotelSuccessScreen.classList.remove('active');
      }, 300);
    }
  }

  // Modal Closures
  if (hotelModalClose) hotelModalClose.addEventListener('click', closeHotelBookingModal);
  if (hotelSuccessCloseBtn) hotelSuccessCloseBtn.addEventListener('click', closeHotelBookingModal);
  if (hotelBookingOverlay) {
    hotelBookingOverlay.addEventListener('click', (e) => {
      if (e.target === hotelBookingOverlay) {
        closeHotelBookingModal();
      }
    });
  }

  // Handle stay filters
  stayFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      stayFilterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeStayFilter = button.getAttribute('data-stay-filter') || 'all';
      loadHotels();
    });
  });

  // Hotel Booking Form submission
  if (hotelBookingForm) {
    hotelBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const hotelId = hotelIdInput.value;
      const name = document.getElementById('hotel-book-name').value.trim();
      const email = document.getElementById('hotel-book-email').value.trim();
      const phone = document.getElementById('hotel-book-phone').value.trim();
      const checkIn = checkInInput.value;
      const checkOut = checkOutInput.value;
      const guests = document.getElementById('hotel-book-guests').value;

      if (!hotelId || !name || !email || !phone || !checkIn || !checkOut || !guests) {
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

      // Calculate final total price
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = checkOutDate - checkInDate;
      let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (isNaN(nights) || nights <= 0) nights = 1;
      const totalPrice = nights * currentSelectedHotel.price;

      // Show spinner loader
      const submitBtn = document.getElementById('hotel-submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 50 50" style="width: 20px; height: 20px; animation: rotate 2s linear infinite; stroke: #070e17; fill: none; stroke-width: 5; stroke-linecap: round;">
          <circle cx="25" cy="25" r="20" stroke-dasharray="90,150" stroke-dashoffset="0"></circle>
        </svg>
        Processing Stay...
      `;

      // Call API
      bookHotelRoom({
        hotelId,
        name,
        email,
        phone,
        checkIn,
        checkOut,
        guests,
        totalPrice
      })
      .then(res => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        if (res.success) {
          // Fill success screen details
          document.getElementById('success-hotel-name').textContent = currentSelectedHotel.name;
          document.getElementById('success-booking-id').textContent = res.data.id;
          
          if (hotelSuccessScreen) hotelSuccessScreen.classList.add('active');

          // Decrement room available locally in memory to reflect in real time
          const hotelObj = hotelsData.find(h => h.id === hotelId);
          if (hotelObj && hotelObj.roomsAvailable > 0) {
            hotelObj.roomsAvailable -= 1;
          }
          renderHotels();
        } else {
          alert('Booking failed: ' + (res.message || 'Unknown error'));
        }
      })
      .catch(err => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert('Failed to connect to the booking server: ' + err.message);
      });
    });
  }

  // Initial load
  loadHotels();

  // File uploader handler
  if (fileUploader) {
    fileUploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file || !targetUploadHotelId) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const cardEl = hotelContainer.querySelector(`.upload-image-btn[data-hotel-id="${targetUploadHotelId}"]`)?.closest('.hotel-card');
      if (cardEl) {
        cardEl.classList.add('uploading');
      }

      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Data = event.target.result;
        
        uploadHotelImage(targetUploadHotelId, base64Data)
          .then(res => {
            if (cardEl) cardEl.classList.remove('uploading');
            if (res.success) {
              const hotel = hotelsData.find(h => h.id === targetUploadHotelId);
              if (hotel) {
                hotel.image = res.imageUrl;
              }
              renderHotels();
            } else {
              alert('Image upload failed: ' + (res.message || 'Unknown error'));
            }
          })
          .catch(err => {
            if (cardEl) cardEl.classList.remove('uploading');
            alert('Error uploading image: ' + err.message);
          });
      };
      reader.readAsDataURL(file);
    });
  }

  // Setup periodic polling cycle (every 12 seconds) to keep room counts in sync
  setInterval(() => {
    // Only poll when the booking modal is not active to avoid UI interruptions
    if (hotelBookingOverlay && !hotelBookingOverlay.classList.contains('active')) {
      fetchHotels(activeStayFilter)
        .then(res => {
          if (res.success) {
            hotelsData = res.data;
            renderHotels();
          }
        })
        .catch(err => console.log('Silent polling error:', err));
    }
  }, 12000);
});
