import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { X } from 'lucide-react';

const ModalDialog = () => {
  const { modal, closeModal } = useAccessibility();

  if (!modal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl text-left space-y-4 relative">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xl font-bold text-white">{modal.title}</h3>
          <button
            onClick={closeModal}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-slate-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto py-2">
          {modal.content}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;
