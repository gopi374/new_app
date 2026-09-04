const { verifyAccessToken } = require('../utils/jwt');
const { ApiError } = require('./errorHandler');

const ROLE_HIERARCHY = {
  VISITOR: 1,
  CONTRIBUTOR: 2,
  LOCAL_EXPERT: 3,
  MODERATOR: 4,
  ADMIN: 5,
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token missing or invalid format'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
};

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifyAccessToken(token);
    } catch (e) {
      // Ignore token verification errors for optional auth
    }
  }
  next();
};

const requireRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const userRoleValue = ROLE_HIERARCHY[req.user.role] || 0;
    const minRoleValue = ROLE_HIERARCHY[minRole] || 0;

    if (userRoleValue < minRoleValue) {
      return next(new ApiError(403, `Access denied. Minimum required role: ${minRole}`));
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  requireRole,
  ROLE_HIERARCHY,
};
