/**
 * Wraps async Express routes/controllers to automatically pass errors to the error handling middleware.
 * This eliminates the need for try/catch blocks in every single controller function.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
