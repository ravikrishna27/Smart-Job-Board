/**
 * Standardized API Response formatter
 * Ensures all API endpoints return data in a predictable format.
 */
export const apiResponse = (res, statusCode, data, message = '') => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...data // Spread the data object (could contain count, page, totalPages, data array)
  });
};
