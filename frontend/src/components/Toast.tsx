import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  'data-toast'?: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000, ...props }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: '#4b5563',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 3000,
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '300px',
    animation: 'slideInUp 0.3s ease-out',
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={toastStyle} {...props}>{message}</div>
    </>
  );
};

export default Toast;
