import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Volume2, VolumeX, Type } from 'lucide-react';

const AccessibilityBar = () => {
  const {
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isHighContrast,
    toggleHighContrast,
    isTTSEnabled,
    toggleTTS
  } = useAccessibility();

  return (
    <aside
      className="bg-slate-950/90 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 backdrop-blur-md"
      aria-label="Accessibility Preferences Bar"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-indigo-400" />
            Accessibility:
          </span>
          <button
            onClick={decreaseFontSize}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700"
            aria-label="Decrease Font Size"
            title="Decrease font size"
          >
            A-
          </button>
          <button
            onClick={resetFontSize}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700"
            aria-label="Reset Font Size"
            title="Reset font size to default"
          >
            Default
          </button>
          <button
            onClick={increaseFontSize}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700"
            aria-label="Increase Font Size"
            title="Increase font size"
          >
            A+
          </button>
          <button
            onClick={toggleHighContrast}
            className={`px-3 py-1 rounded text-xs transition flex items-center gap-1.5 border ${isHighContrast
              ? 'bg-yellow-400 text-slate-950 font-bold border-yellow-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            aria-label="Toggle High Contrast Mode"
            title="Toggle high contrast"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isHighContrast ? 'Normal Contrast' : 'High Contrast'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTTS}
            className={`px-3 py-1 rounded text-xs transition flex items-center gap-1.5 border ${isTTSEnabled
              ? 'bg-indigo-600 text-white font-medium border-indigo-500 shadow-sm shadow-indigo-500/50'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            aria-label="Toggle Voice Assistant Demo"
            title="Enable text-to-speech assistant demo"
          >
            {isTTSEnabled ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isTTSEnabled ? 'Voice Reader Active' : 'Voice Reader Demo'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AccessibilityBar;
