import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import backendUrl from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';

const MessageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await backendUrl.get('/api/notifications/');
      setNotifications(response.data.notifications);
      setCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Mark notifications as read
  const markAsRead = async (notificationIds) => {
    try {
      await backendUrl.post('/api/notifications/mark-read/', { ids: notificationIds });
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
      setCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };



  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-pink-400">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/conversations/${notification.conversation_id}`)}
                >
                  <div className='text-pink-400'> New Message </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {notification.sender}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.content}
                      </p>
                    </div>
                    <div>
                      <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t">
              <button
                onClick={() => markAsRead(notifications.map(n => n.id))}
                className="w-full text-sm text-pink-500 hover:text-pink-800 font-medium cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageNotifications;