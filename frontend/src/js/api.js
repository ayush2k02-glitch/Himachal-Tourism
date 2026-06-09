const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Submits a new booking inquiry to the backend server.
 * @param {Object} inquiryData 
 * @returns {Promise<Object>} API response data
 */
export async function submitInquiry(inquiryData) {
  const response = await fetch(`${API_URL}/api/inquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inquiryData)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Network response was not ok');
  }
  
  return response.json();
}

/**
 * Fetches all available hotels (optionally filtered by region).
 * @param {string} region 
 * @returns {Promise<Object>} API response with hotel data
 */
export async function fetchHotels(region = '') {
  const url = region && region.toLowerCase() !== 'all' 
    ? `${API_URL}/api/hotels?region=${encodeURIComponent(region)}` 
    : `${API_URL}/api/hotels`;
    
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch hotels from server');
  }
  
  return response.json();
}

/**
 * Submits a new stay booking inquiry to the backend.
 * @param {Object} bookingData 
 * @returns {Promise<Object>} API response data
 */
export async function bookHotelRoom(bookingData) {
  const response = await fetch(`${API_URL}/api/hotels/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Hotel booking failed');
  }
  
  return response.json();
}

/**
 * Uploads a base64 encoded image for a hotel.
 * @param {string} hotelId 
 * @param {string} base64Image 
 * @returns {Promise<Object>} API response data
 */
export async function uploadHotelImage(hotelId, base64Image) {
  const response = await fetch(`${API_URL}/api/hotels/${hotelId}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: base64Image })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Hotel image upload failed');
  }
  
  return response.json();
}

/**
 * Registers a new user.
 * @param {Object} userData 
 * @returns {Promise<Object>} API response data
 */
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.message || 'Registration failed');
  }
  
  return resData;
}

/**
 * Logins a user.
 * @param {Object} credentials 
 * @returns {Promise<Object>} API response data
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  
  const resData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(resData.message || 'Login failed');
  }
  
  return resData;
}
