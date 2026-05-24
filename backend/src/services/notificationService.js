import Notification from '../models/Notification.js';
import { getIO } from '../config/socket.js';

class NotificationService {
  /**
   * Create a new notification and emit a socket event
   */
  async createNotification(recipientId, type, message, metadata = {}) {
    // 1. Save to database
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      message,
      metadata
    });

    // 2. Emit real-time event to the specific user's room
    try {
      const io = getIO();
      // We emit to the room named after the user's ID
      io.to(recipientId.toString()).emit('new_notification', notification);
    } catch (err) {
      console.warn('[SOCKET] Failed to emit notification:', err.message);
    }

    return notification;
  }

  /**
   * Get paginated notifications for a user
   */
  async getUserNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

    return {
      notifications,
      total,
      unreadCount,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Mark a specific notification as read
   */
  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { returnDocument: 'after' }
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  }
}

export const notificationService = new NotificationService();
