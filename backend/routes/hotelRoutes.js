const express = require('express');
const router = express.Router();

const { getHotels, getHotelById, bookRoom, getBookings, uploadHotelImage } = require('../controllers/hotelController');

// Route for getting all hotels (with optional region query)
router.get('/hotels', getHotels);

// Route for listing all bookings
router.get('/hotels/bookings', getBookings);

// Route for getting single hotel details
router.get('/hotels/:id', getHotelById);

// Route for booking a room
router.post('/hotels/book', bookRoom);

// Route for uploading a hotel image
router.post('/hotels/:id/upload', uploadHotelImage);

module.exports = router;
