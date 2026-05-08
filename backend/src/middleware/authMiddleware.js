import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';

/**
 * Protect routes - verifies JWT and attaches user to req
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // If no token exists, throw 401 Unauthorized
  if (!token) {
    return next(new AppError('Not authorized to access this route. Please log in.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB and attach to request, excluding password
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
});

/**
 * Authorize roles - restricts access to specific roles
 * Must be used AFTER protect middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role '${req.user.role}' is not authorized to access this route`, 403));
    }
    next();
  };
};
