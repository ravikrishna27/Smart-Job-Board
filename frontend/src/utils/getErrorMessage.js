/**
 * Extracts a readable error message from various API error responses.
 * Ensures the frontend always has a clean string to display to the user.
 * 
 * @param {Error} error - The caught error object
 * @returns {string} - Clean error message
 */
export const getErrorMessage = (error) => {
  // If it's an Axios error and the backend sent a specific message
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  
  // If the backend sent a generic error object without a message property
  if (error.response && error.response.data) {
    return JSON.stringify(error.response.data);
  }

  // If it's a standard JS error
  if (error.message) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred';
};
