const express = require('express');
const router = express.Router();

const { createInquiry, getInquiries } = require('../controllers/inquiryController');
const { validateInquiry } = require('../middleware/validationMiddleware');

// Route for submitting a new inquiry
router.post('/inquiry', validateInquiry, createInquiry);

// Route for listing all inquiries
router.get('/inquiries', getInquiries);

module.exports = router;
