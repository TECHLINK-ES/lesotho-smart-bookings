const jwt = require('jsonwebtoken');
// const ApiError = require('../utils/ApiError'); // REMOVED
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user
      const result = await db.query(
        'SELECT id, email, name, role, shop_id, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        const error = new Error('Not authorized, user not found');
        error.statusCode = 401;
        return next(error);
      }

      const user = result.rows[0];

      // --- NEW CHECK: Verify user is active ---
      if (!user.is_active) {
        const error = new Error('Not authorized, user account is deactivated');
        error.statusCode = 401;
        return next(error);
      }

      req.user = user;
      next();
    } catch (error) {
      const err = new Error('Not authorized, token failed');
      err.statusCode = 401;
      return next(err);
    }
  }

  if (!token) {
    const error = new Error('Not authorized, no token');
    error.statusCode = 401;
    return next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role ${req.user.role} is not authorized`);
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

module.exports = { protect, authorize };