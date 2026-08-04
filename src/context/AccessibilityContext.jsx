import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontScale, setFontScale] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Modal dialog state
  const [modal, setModal] = useState({ isOpen: false, title: '', content: '' });

  // Update root HTML font size when fontScale changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  // Update high contrast class on body
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [isHighContrast]);

  const increaseFontSize = () => {
    if (fontScale < 130) {
      const nextScale = fontScale + 10;
      setFontScale(nextScale);
      showToast(`🔤 Font Size Increased (${nextScale}%)`);
      speak(`Font size increased to ${nextScale} percent`);
    }
  };

  const decreaseFontSize = () => {
    if (fontScale > 90) {
      const nextScale = fontScale - 10;
      setFontScale(nextScale);
      showToast(`🔤 Font Size Decreased (${nextScale}%)`);
      speak(`Font size decreased to ${nextScale} percent`);
    }
  };

  const resetFontSize = () => {
    setFontScale(100);
    showToast(`🔤 Font Size Reset (100%)`);
    speak(`Font size reset to default 100 percent`);
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      showToast(next ? '👁️ High Contrast Mode Enabled' : '👁️ Normal Contrast Mode Enabled');
      speak(next ? 'High Contrast mode enabled' : 'Normal contrast mode restored');
      return next;
    });
  };

  const toggleTTS = () => {
    setIsTTSEnabled((prev) => {
      const next = !prev;
      if (next) {
        showToast('🔊 Voice Reader Demo Activated');
        speak('InclusivePay Voice Reader Assistant activated.');
      } else {
        showToast('🔇 Voice Reader Demo Deactivated');
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      }
      return next;
    });
  };

  const speak = (text) => {
    if (!isTTSEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const showModal = (title, content) => {
    setModal({ isOpen: true, title, content });
    speak(`${title}. ${content}`);
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: '', content: '' });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontScale,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        isHighContrast,
        toggleHighContrast,
        isTTSEnabled,
        toggleTTS,
        speak,
        toasts,
        showToast,
        modal,
        showModal,
        closeModal
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
