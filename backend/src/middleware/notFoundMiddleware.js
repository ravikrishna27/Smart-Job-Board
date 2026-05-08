/**
 * Catch-all route middleware for handling unknown routes (404 Not Found).
 */
export const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the global error handler below
};
