import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const styles = {
    success: 'bg-white border-l-4 border-emerald-500 shadow-lg shadow-emerald-500/10',
    error: 'bg-white border-l-4 border-red-500 shadow-lg shadow-red-500/10',
    info: 'bg-white border-l-4 border-brand-500 shadow-lg shadow-brand-500/10'
  };

  const icons = {
    success: (
      <div className="text-emerald-500">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="text-red-500">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    info: (
      <div className="text-brand-500">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  };

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-lg 
      animate-slide-up mb-2 mx-4 sm:mx-0 min-w-[280px] sm:min-w-[300px] max-w-md pointer-events-auto
      ${styles[toast.type]}
    `}>
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">
          {toast.message}
        </p>
      </div>

      <button onClick={() => onClose(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;