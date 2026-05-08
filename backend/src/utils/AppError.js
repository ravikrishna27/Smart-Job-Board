/**
 * Custom Error class that extends the standard Error object.
 * Allows us to easily attach HTTP status codes to our errors.
 * Usage: throw new AppError('Invalid credentials', 401);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
