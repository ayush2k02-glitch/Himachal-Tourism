const userModel = require('../models/userModel');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const userExists = userModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Create user
    const newUser = userModel.create({
      name,
      email,
      password
    });

    console.log(`[INFO] New user registered: ${newUser.name} (${newUser.email})`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! You can now log in.',
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user by email
    const user = userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verify password match
    const isPasswordValid = userModel.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    console.log(`[INFO] User logged in successfully: ${user.name}`);

    // Return user details and mock token
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: `mock-jwt-token-for-${user.id}-${Date.now()}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser
};
