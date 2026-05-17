import express from 'express';
import { 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

router.route('/')
  .get(getMyNotifications);

router.route('/read-all')
  .patch(markAllAsRead);

router.route('/:id/read')
  .patch(validateObjectId, markAsRead);

export default router;
