import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Placeholder Controller Logic
const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get user profile - Route is working" });
});

// Routes
router.route('/profile').get(getUserProfile);

export default router;
