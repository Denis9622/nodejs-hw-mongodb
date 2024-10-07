// utils/token.js
const jwt = require('jsonwebtoken');

// Генерация accessToken
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

// Генерация refreshToken
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
