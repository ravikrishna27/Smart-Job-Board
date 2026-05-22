import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User as UserIcon, Check, Calendar, CheckSquare, MessageSquare, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../context/SocketContext';
import { notificationService } from '../../services/notificationService';
import { toast } from 'sonner';

export default function Topbar({ toggleSidebar }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotifications(1, 15);
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      } catch (err) {
        console.warn('[NOTIFICATIONS] Failed to load:', err.message);
      }
    };
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Handle real-time notification events
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 15));
      setUnreadCount((prev) => prev + 1);
      toast.info(notification.message, {
        description: 'New update from Smart Job Board',
        action: {
          label: 'View',
          onClick: () => setIsDropdownOpen(true)
        }
      });
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark read:', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.warn('Failed to mark all read:', err.message);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_received':
        return <CheckSquare className="text-blue-500 w-4 h-4" />;
      case 'application_status_update':
        return <MessageSquare className="text-green-500 w-4 h-4" />;
      default:
        return <ShieldAlert className="text-purple-500 w-4 h-4" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 600);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      
      {/* Mobile Menu Toggle */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Welcome back, {user?.name || 'User'}
        </h2>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-2 rounded-full transition-colors relative ${
              isDropdownOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[10px] text-white font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
                <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all as read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification._id}
                      onClick={() => handleMarkAsRead(notification._id)}
                      className={`flex gap-3 p-4 text-left transition-colors cursor-pointer ${
                        notification.isRead ? 'hover:bg-gray-50/50' : 'bg-blue-50/40 hover:bg-blue-50/70 border-l-2 border-blue-500'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-gray-800 break-words ${notification.isRead ? 'font-normal' : 'font-medium'}`}>
                          {notification.message}
                        </p>
                        <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 self-center flex-shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-700 leading-none">{user?.name || 'Guest'}</p>
            <p className="text-gray-500 text-xs mt-1 capitalize">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>

    </header>
  );
}
