import jwt from 'jsonwebtoken';
import { cookieOptions } from './cookieOptions.js';

/**
 * Generate a JWT token, sign it with the user's ID, and attach it to the response as an HTTP-only cookie.
 * @param {Response} res - Express response object
 * @param {string} userId - MongoDB user ID
 */
export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Attach token to cookie
  res.cookie('jwt', token, cookieOptions);
};
