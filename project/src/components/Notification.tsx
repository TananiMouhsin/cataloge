import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, ShoppingCart } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'info':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'info':
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
      default:
        return 'bg-gradient-to-r from-green-400 to-green-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBackgroundColor()} text-white rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm`}
        >
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-5">
                  {message}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={onClose}
                  className="inline-flex text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
