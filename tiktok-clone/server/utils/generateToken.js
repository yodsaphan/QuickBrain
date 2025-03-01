const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {string} id - User ID to include in the token
 * @param {number} expiresIn - Token expiration time in seconds (default: 30 days)
 * @returns {string} JWT token
 */
const generateToken = (id, expiresIn = 30 * 24 * 60 * 60) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn
  });
};

module.exports = generateToken; 