class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[API Error] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`, details || '');
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
};

module.exports = { ApiError, errorHandler };
