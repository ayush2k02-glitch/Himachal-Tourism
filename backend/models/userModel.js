const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const usersFilePath = path.join(__dirname, '..', 'users.json');

/**
 * Hashing utility for passwords using native crypto module.
 * @param {string} password 
 * @returns {string} SHA-256 hex digest
 */
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Reads all users from the JSON database file.
 * @returns {Array} List of users
 */
const readAll = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      writeAll([]);
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

/**
 * Writes the complete users list to the JSON database file.
 * @param {Array} users 
 * @returns {boolean} Success status
 */
const writeAll = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
};

/**
 * Creates and saves a new user.
 * @param {Object} userData 
 * @returns {Object} The created user object (excluding password)
 */
const create = (userData) => {
  const users = readAll();
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email.toLowerCase().trim(),
    password: hashPassword(userData.password),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  writeAll(users);
  
  // Return safe copy without password
  const { password, ...safeUser } = newUser;
  return safeUser;
};

/**
 * Finds a user by email.
 * @param {string} email 
 * @returns {Object|undefined} The user object
 */
const findByEmail = (email) => {
  const users = readAll();
  const searchEmail = email.toLowerCase().trim();
  return users.find(u => u.email === searchEmail);
};

/**
 * Verifies if a password matches a user's hashed password.
 * @param {Object} user 
 * @param {string} password 
 * @returns {boolean} Matching status
 */
const verifyPassword = (user, password) => {
  return user.password === hashPassword(password);
};

module.exports = {
  readAll,
  writeAll,
  create,
  findByEmail,
  verifyPassword,
  hashPassword
};
