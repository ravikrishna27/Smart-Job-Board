/**
 * Global Error Handler Middleware.
 * Catches any errors thrown in routes/controllers and formats them as a standard JSON response.
 */
export const errorMiddleware = (err, req, res, next) => {
  // If the error has a statusCode (from AppError), use it. 
  // Otherwise, if the response is 200 (default), change it to 500 (Internal Server Error)
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  res.status(statusCode);
  
  res.json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only show stack traces in development mode for security reasons
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
