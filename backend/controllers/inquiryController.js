const inquiryModel = require('../models/inquiryModel');
const { sendWhatsAppMessage } = require('../utils/whatsapp');
const { sendSMSMessage } = require('../utils/sms');

/**
 * @desc    Submit a new booking inquiry
 * @route   POST /api/inquiry
 * @access  Public
 */
const createInquiry = (req, res, next) => {
  try {
    const { name, email, phone, destination, date, notes } = req.body;

    const newInquiry = inquiryModel.create({
      name,
      email,
      phone,
      destination,
      date,
      notes
    });

    console.log(`[INFO] New booking inquiry received from ${name} for ${destination} on ${date}.`);

    const whatsappMsg = `🏔️ *New Tour Inquiry* 🏔️\n` +
      `-----------------------------\n` +
      `👤 *Name*: ${name}\n` +
      `📧 *Email*: ${email}\n` +
      `📞 *Phone*: ${phone}\n` +
      `📍 *Destination*: ${destination}\n` +
      `📅 *Start Date*: ${date}\n` +
      `📝 *Notes*: ${notes || 'None'}`;

    sendWhatsAppMessage(whatsappMsg).catch((err) => {
      console.error('[ERROR] WhatsApp background notification failed:', err);
    });

    const smsMsg = `🏔️ New Tour Inquiry 🏔️\n` +
      `-----------------------------\n` +
      `👤 Name: ${name}\n` +
      `📧 Email: ${email}\n` +
      `📞 Phone: ${phone}\n` +
      `📍 Destination: ${destination}\n` +
      `📅 Start Date: ${date}\n` +
      `📝 Notes: ${notes || 'None'}`;

    sendSMSMessage(smsMsg).catch((err) => {
      console.error('[ERROR] SMS background notification failed:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry successfully received and saved.',
      data: newInquiry
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all received inquiries
 * @route   GET /api/inquiries
 * @access  Public (for monitoring/admin)
 */
const getInquiries = (req, res, next) => {
  try {
    const inquiries = inquiryModel.readAll();
    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries
};
