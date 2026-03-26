import React, { useEffect, useState } from "react";
import { TOAST_CLOSE_MS, DEFAULT_TOAST_DURATION_MS } from "../config/constants";
import { X, Check, AlertCircle, Info, Bell } from "lucide-react";

interface NotificationToastProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    isRead: boolean;
    actionUrl?: string;
    relatedTaskId?: number;
    createdAt: string;
    readAt?: string;
    timeAgo: string;
  };
  onClose: () => void;
  onClick?: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onClose, 
  onClick 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, TOAST_CLOSE_MS);
    }, DEFAULT_TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case "TaskCreated":
      case "TaskUpdated":
      case "TaskDeleted":
        return <Check className="w-4 h-4" />;
      case "TaskDueSoon":
      case "TaskOverdue":
        return <AlertCircle className="w-4 h-4" />;
      case "ReminderFired":
        return <Bell className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "Critical":
        return "bg-red-500 border-red-600";
      case "High":
        return "bg-orange-500 border-orange-600";
      case "Medium":
        return "bg-blue-500 border-blue-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  const handleToastClick = () => {
    if (onClick) {
      onClick();
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border ${getPriorityColor()} transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      onClick={handleToastClick}
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white ${getPriorityColor()}`}>
            {getIcon()}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {notification.title}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {notification.timeAgo}
          </p>
        </div>
        <div className="ml-4 pl-4 border-l border-gray-200 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
