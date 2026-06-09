const fs = require('fs');
const path = require('path');

const inquiriesFilePath = path.join(__dirname, '..', 'inquiries.json');

/**
 * Reads all inquiries from the JSON database file.
 * @returns {Array} List of inquiries
 */
const readAll = () => {
  try {
    if (!fs.existsSync(inquiriesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(inquiriesFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading inquiries file:', error);
    return [];
  }
};

/**
 * Writes the complete inquiries list to the JSON database file.
 * @param {Array} inquiries 
 * @returns {boolean} Success status
 */
const writeAll = (inquiries) => {
  try {
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(inquiries, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing inquiries file:', error);
    return false;
  }
};

/**
 * Creates and saves a new inquiry.
 * @param {Object} inquiryData 
 * @returns {Object} The created inquiry object
 */
const create = (inquiryData) => {
  const inquiries = readAll();
  const newInquiry = {
    id: Date.now().toString(),
    name: inquiryData.name,
    email: inquiryData.email,
    phone: inquiryData.phone,
    destination: inquiryData.destination,
    date: inquiryData.date,
    notes: inquiryData.notes || '',
    createdAt: new Date().toISOString()
  };
  
  inquiries.push(newInquiry);
  writeAll(inquiries);
  return newInquiry;
};

module.exports = {
  readAll,
  writeAll,
  create
};
