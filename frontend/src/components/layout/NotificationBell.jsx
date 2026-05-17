import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';

export default function NotificationBell() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch initial notifications
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications(1, 10); // get top 10
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();
  }, [user]);

  // Listen for real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      // 1. Play subtle sound or show toast
      toast.info(notification.message, {
        icon: '🔔',
        description: 'Just now'
      });

      // 2. Add to list and increment badge
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  // Helper to get a link based on notification type
  const getNotificationLink = (notification) => {
    if (user?.role === 'recruiter' && notification.metadata?.jobSlug) {
      return `/recruiter/jobs/${notification.metadata.jobId || ''}/applicants`; // You can make this smarter later
    }
    if (user?.role === 'student') {
      return `/student/dashboard`;
    }
    return '#';
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none rounded-full hover:bg-gray-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
              >
                <Check size={14} /> Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm">You have no notifications.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map(notification => (
                  <li 
                    key={notification._id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <Link 
                      to={getNotificationLink(notification)}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification._id, { preventDefault: () => {}, stopPropagation: () => {} })}
                      className="flex items-start gap-3"
                    >
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-blue-600' : 'bg-gray-300'}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button 
                          onClick={(e) => handleMarkAsRead(notification._id, e)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 text-center bg-gray-50/50">
              <button className="text-sm text-gray-500 font-medium hover:text-gray-700">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
