const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // PostgreSQL unique violation
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = new ApiError(400, message);
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    const message = 'Invalid reference ID provided';
    error = new ApiError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;