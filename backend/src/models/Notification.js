import mongoose from 'mongoose';
import { NOTIFICATION_TYPES } from '../constants/notificationTypes.js';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPES),
    required: true
  },
  message: {
    type: String,
    required: true
  },
  metadata: {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    jobSlug: { type: String },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
