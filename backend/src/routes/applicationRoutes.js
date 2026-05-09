import express from 'express';
import { 
  applyToJob, 
  getMyApplications, 
  getJobApplicants, 
  updateApplicationStatus 
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Student Routes
router.route('/')
  .post(protect, authorize('student'), uploadResume, applyToJob);

router.route('/me')
  .get(protect, authorize('student'), getMyApplications);

// Recruiter Routes
router.route('/job/:jobId')
  .get(protect, authorize('recruiter'), getJobApplicants);

router.route('/:id/status')
  .patch(protect, authorize('recruiter'), validateObjectId, updateApplicationStatus);

export default router;
