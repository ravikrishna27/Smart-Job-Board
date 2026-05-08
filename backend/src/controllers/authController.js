import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User with this email already exists', 400));
  }

  // Create user
  // Password hashing is handled automatically by the pre-save hook in User.js
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    generateTokenAndSetCookie(res, user._id);
    
    return apiResponse(res, 201, {
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    }, 'User registered successfully');
  } else {
    return next(new AppError('Invalid user data', 400));
  }
});

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user email and explicitly select the password field since it's select: false
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if password matches using the schema method
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  generateTokenAndSetCookie(res, user._id);

  return apiResponse(res, 200, {
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  }, 'Logged in successfully');
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true
  });

  return apiResponse(res, 200, null, 'Logged out successfully');
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  return apiResponse(res, 200, { data: req.user }, 'User data fetched');
});
