/**
 * Middleware to validate inquiry request body fields
 */
const validateInquiry = (req, res, next) => {
  const { name, email, phone, destination, date } = req.body;

  // Check required fields
  if (!name || !email || !phone || !destination || !date) {
    return res.status(400).json({
      success: false,
      message: 'All fields (name, email, phone, destination, date) are required.'
    });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  // Basic phone validation (10 to 15 digits)
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid phone number.'
    });
  }

  next();
};

module.exports = {
  validateInquiry
};
