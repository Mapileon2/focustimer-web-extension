import React from 'react';
import { ToastType, ToastAction } from '../hooks/useToast';

interface ToastProps {
    message: string;
    type: ToastType;
    onDismiss: () => void;
    action?: ToastAction;
}

const Toast = ({ message, type, onDismiss, action }: ToastProps) => {
  const baseClasses = 'w-full max-w-sm p-4 rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-300';
  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
  };

  const handleActionClick = () => {
    if (action) {
      action.onClick();
    }
    onDismiss();
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className="flex-grow">{message}</span>
      {action && (
        <button onClick={handleActionClick} className="font-bold underline hover:opacity-80">
          {action.label}
        </button>
      )}
      <button onClick={onDismiss} className="text-xl font-bold">&times;</button>
    </div>
  );
};

export default Toast;
