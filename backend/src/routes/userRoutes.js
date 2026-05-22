import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfileResume,
  getSavedJobs, 
  saveJob, 
  unsaveJob, 
  getRecruiterAnalytics,
  updatePassword
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// All routes here require authentication
router.use(protect);

// Profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.route('/update-password')
  .put(updatePassword);

router.post('/profile/resume', authorize('student'), uploadResume, uploadProfileResume);

// Saved jobs routes
router.route('/saved-jobs')
  .get(authorize('student'), getSavedJobs);

router.route('/saved-jobs/:jobId')
  .post(authorize('student'), validateObjectId, saveJob)
  .delete(authorize('student'), validateObjectId, unsaveJob);

// Analytics route
router.route('/analytics')
  .get(authorize('recruiter'), getRecruiterAnalytics);

export default router;
