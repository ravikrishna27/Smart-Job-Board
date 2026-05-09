import express from 'express';
import { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob,
  getMyJobs,
  updateJobStatus
} from '../controllers/jobController.js';
import { validateJob } from '../validators/jobValidator.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Recruiter specific routes
router.route('/my-jobs')
  .get(protect, authorize('recruiter'), getMyJobs);

// Base routes: /api/jobs
router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter'), validateJob, createJob);

// ID-specific routes: /api/jobs/:id
// Note: GET does not use validateObjectId because it can receive a slug (string)
router.route('/:id')
  .get(getJobById)
  .put(protect, authorize('recruiter'), validateObjectId, validateJob, updateJob)
  .delete(protect, authorize('recruiter'), validateObjectId, deleteJob);

// Status specific route
router.route('/:id/status')
  .patch(protect, authorize('recruiter'), validateObjectId, updateJobStatus);

export default router;
