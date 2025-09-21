import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto remove after 5 seconds if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
      markAsRead
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification, markAsRead } = useNotification();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'order': return '📋';
      case 'payment': return '💳';
      case 'rating': return '⭐';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'warning': return 'yellow';
      case 'info': return 'blue';
      case 'order': return 'purple';
      case 'payment': return 'green';
      case 'rating': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 5).map((notification) => {
        const color = getNotificationColor(notification.type);
        const icon = getNotificationIcon(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`bg-white border-l-4 border-${color}-500 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{icon}</span>
              
              <div className="flex-grow">
                <h4 className="font-medium text-gray-800 mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {notification.message}
                </p>
                {notification.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      notification.action.onClick();
                      removeNotification(notification.id);
                    }}
                    className={`mt-2 text-sm font-medium text-${color}-600 hover:text-${color}-700`}
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Notification Bell Component for Navbar
export const NotificationBell = () => {
  const { notifications } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notificaciones</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay notificaciones
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    setShowDropdown(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {recentNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  clearAllNotifications();
                  setShowDropdown(false);
                }}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Limpiar todas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationContainer;