const errorHandler = (err, req, res, next) => {
  // Standard errors don't spread nicely, so we read directly
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  // Log to console for dev
  console.error(err);

  // PostgreSQL unique violation (optional keep for later)
  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;