/**
 * Standard cookie configuration for JWT tokens.
 * Centralizing this ensures consistency across login, register, and refresh endpoints.
 */
export const cookieOptions = {
  httpOnly: true, // Prevents client-side JS from reading the cookie (protects against XSS)
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: 'strict', // Prevents CSRF attacks
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
};
