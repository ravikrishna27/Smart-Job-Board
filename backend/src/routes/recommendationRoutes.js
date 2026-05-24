import express from 'express';
import {
  getJobRecommendations,
  semanticSearchJobs,
  getStudentSkillGap,
  getRecruiterSkillTrends
} from '../controllers/recommendationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Semantic search is public to let anyone browse jobs with semantic matching
router.post('/search', semanticSearchJobs);

// All other endpoints require authentication
router.use(protect);

router.get('/', authorize('student'), getJobRecommendations);
router.get('/student-gap', authorize('student'), getStudentSkillGap);
router.get('/recruiter-trends', authorize('recruiter'), getRecruiterSkillTrends);

export default router;
