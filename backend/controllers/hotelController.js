const fs = require('fs');
const path = require('path');
const hotelModel = require('../models/hotelModel');
const bookingModel = require('../models/bookingModel');
const { sendWhatsAppMessage } = require('../utils/whatsapp');
const { sendSMSMessage } = require('../utils/sms');

/**
 * @desc    Get all hotels (optional filtering by region)
 * @route   GET /api/hotels
 * @access  Public
 */
const getHotels = (req, res, next) => {
  try {
    let hotels = hotelModel.readAll();
    const { region } = req.query;

    if (region && region.toLowerCase() !== 'all') {
      hotels = hotels.filter(h => h.region.toLowerCase() === region.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single hotel by ID
 * @route   GET /api/hotels/:id
 * @access  Public
 */
const getHotelById = (req, res, next) => {
  try {
    const hotel = hotelModel.readById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${req.params.id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a new hotel booking
 * @route   POST /api/hotels/book
 * @access  Public
 */
const bookRoom = (req, res, next) => {
  try {
    const { hotelId, name, email, phone, checkIn, checkOut, guests, totalPrice } = req.body;

    // Validate fields
    if (!hotelId || !name || !email || !phone || !checkIn || !checkOut || !guests || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'All fields (hotelId, name, email, phone, checkIn, checkOut, guests, totalPrice) are required.'
      });
    }

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Basic phone check
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number.'
      });
    }

    // Check hotel availability
    const hotel = hotelModel.readById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found.'
      });
    }

    if (hotel.roomsAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: `Sorry, there are no rooms available at ${hotel.name} for the selected dates.`
      });
    }

    // Decrement room availability
    const updated = hotelModel.updateRoomsAvailable(hotelId, -1);
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update hotel room availability. Please try again.'
      });
    }

    // Create booking record
    const newBooking = bookingModel.create({
      hotelId,
      hotelName: hotel.name,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      totalPrice
    });

    console.log(`[INFO] New stay booking created at ${hotel.name} for ${name} from ${checkIn} to ${checkOut}.`);

    const whatsappMsg = `🏨 *New Stay Booking* 🏨\n` +
      `-----------------------------\n` +
      `🏨 *Hotel*: ${hotel.name}\n` +
      `👤 *Guest*: ${name}\n` +
      `📧 *Email*: ${email}\n` +
      `📞 *Phone*: ${phone}\n` +
      `📅 *Check-In*: ${checkIn}\n` +
      `📅 *Check-Out*: ${checkOut}\n` +
      `👥 *Guests*: ${guests}\n` +
      `💰 *Total Price*: ₹${totalPrice.toLocaleString()}\n` +
      `🆔 *Booking ID*: ${newBooking.id || 'N/A'}`;

    sendWhatsAppMessage(whatsappMsg).catch((err) => {
      console.error('[ERROR] WhatsApp background notification failed:', err);
    });

    const smsMsg = `🏨 New Stay Booking 🏨\n` +
      `-----------------------------\n` +
      `🏨 Hotel: ${hotel.name}\n` +
      `👤 Guest: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📞 Phone: ${phone}\n` +
      `📅 Check-In: ${checkIn}\n` +
      `📅 Check-Out: ${checkOut}\n` +
      `👥 Guests: ${guests}\n` +
      `💰 Total Price: ₹${totalPrice.toLocaleString()}\n` +
      `🆔 Booking ID: ${newBooking.id || 'N/A'}`;

    sendSMSMessage(smsMsg).catch((err) => {
      console.error('[ERROR] SMS background notification failed:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Booking successfully completed and room reserved.',
      data: newBooking,
      roomsRemaining: hotel.roomsAvailable - 1 // Return updated count
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all hotel bookings
 * @route   GET /api/hotels/bookings
 * @access  Public
 */
const getBookings = (req, res, next) => {
  try {
    const bookings = bookingModel.readAll();
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload real hotel image (Base64)
 * @route   POST /api/hotels/:id/upload
 * @access  Public
 */
const uploadHotelImage = (req, res, next) => {
  try {
    const hotelId = req.params.id;
    const hotel = hotelModel.readById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found.'
      });
    }

    const { image } = req.body;
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided. Please send a Base64-encoded image string.'
      });
    }

    // Decode base64 image data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Validate image format roughly
    if (buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base64 image data.'
      });
    }

    // Determine target file name and path
    const fileName = `hotel_${hotelId}_${Date.now()}.png`;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    // Write binary buffer to file
    fs.writeFileSync(filePath, buffer);

    // Build the resource URL and save to model
    const newImageUrl = `http://localhost:5000/uploads/${fileName}`;
    const updated = hotelModel.updateHotelImage(hotelId, newImageUrl);

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update hotel image path in records.'
      });
    }

    console.log(`[INFO] Real image uploaded for hotel ${hotel.name}. Served at: ${newImageUrl}`);

    return res.status(200).json({
      success: true,
      message: 'Hotel image successfully uploaded and updated.',
      imageUrl: newImageUrl
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHotels,
  getHotelById,
  bookRoom,
  getBookings,
  uploadHotelImage
};
