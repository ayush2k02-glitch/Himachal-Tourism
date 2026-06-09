require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const inquiryRoutes = require('./routes/inquiryRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log(`[INFO] Created uploads directory at: ${uploadsDir}`);
}

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api', inquiryRoutes);
app.use('/api', hotelRoutes);
app.use('/api', authRoutes);

// Root Status Check Route
app.get('/', (req, res) => {
  res.send('🏔️ Himachal Tourism Booking API is active. Send POST requests to /api/inquiry.');
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🏔️ Himachal Tourism Backend Server running on port ${PORT}`);
  console.log(`👉 Test API status: http://localhost:${PORT}/`);
  console.log(`👉 View inquiries list: http://localhost:${PORT}/api/inquiries`);
  console.log(`===================================================`);
});
