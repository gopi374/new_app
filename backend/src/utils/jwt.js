const jwt = require('jsonwebtoken');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dharohar_super_secret_access_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dharohar_super_secret_refresh_key_2026';

const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.user_role,
  };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
};
