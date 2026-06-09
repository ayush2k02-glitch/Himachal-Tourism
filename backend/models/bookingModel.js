const fs = require('fs');
const path = require('path');

const bookingsFilePath = path.join(__dirname, '..', 'hotelBookings.json');

/**
 * Reads all bookings from the JSON database file.
 * @returns {Array} List of bookings
 */
const readAll = () => {
  try {
    if (!fs.existsSync(bookingsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(bookingsFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading hotel bookings file:', error);
    return [];
  }
};

/**
 * Writes the complete bookings list to the JSON database file.
 * @param {Array} bookings 
 * @returns {boolean} Success status
 */
const writeAll = (bookings) => {
  try {
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing hotel bookings file:', error);
    return false;
  }
};

/**
 * Creates and saves a new hotel booking.
 * @param {Object} bookingData 
 * @returns {Object} The created booking object
 */
const create = (bookingData) => {
  const bookings = readAll();
  const newBooking = {
    id: Date.now().toString(),
    hotelId: bookingData.hotelId,
    hotelName: bookingData.hotelName,
    name: bookingData.name,
    email: bookingData.email,
    phone: bookingData.phone,
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    guests: parseInt(bookingData.guests),
    totalPrice: parseFloat(bookingData.totalPrice),
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeAll(bookings);
  return newBooking;
};

module.exports = {
  readAll,
  writeAll,
  create
};
