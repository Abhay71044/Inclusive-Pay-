import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';

const ToastContainer = () => {
  const { toasts } = useAccessibility();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900/95 border border-indigo-500/40 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl text-xs sm:text-sm font-medium flex items-center space-x-2 animate-bounce-short border-l-4 border-l-indigo-500"
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
