import express from 'express';
import { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob 
} from '../controllers/jobController.js';
import { validateJob } from '../validators/jobValidator.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Base routes: /api/jobs
router.route('/')
  .get(getJobs)
  .post(validateJob, createJob); // Validate body before creating

// ID-specific routes: /api/jobs/:id
// validateObjectId runs first to ensure :id is a valid MongoDB ObjectId
router.route('/:id')
  .get(validateObjectId, getJobById)
  .put(validateObjectId, validateJob, updateJob) // Validate ID, then body
  .delete(validateObjectId, deleteJob);

export default router;
