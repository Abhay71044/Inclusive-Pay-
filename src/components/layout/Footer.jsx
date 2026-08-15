import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { Mic, Heart } from 'lucide-react';

const Footer = () => {
  const { showModal } = useAccessibility();
  const { switchView, currentUser } = useAuth();

  const handleLinkClick = (sectionId) => {
    switchView('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-8 border-b border-slate-900 text-left">

          {/* Left Brand Area */}
          <div className="space-y-2 max-w-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">InclusivePay</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 inline mx-0.5 fill-rose-500" /> for Accessibility and universal financial inclusion across India.
            </p>
          </div>

          {/* Right Legal & Accessibility Area */}
          <div className="space-y-3 md:text-right">
            <h4 className="font-bold text-white text-base">Legal & Accessibility</h4>
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300">
              <button
                onClick={() => showModal('Privacy Policy', 'InclusivePay respects user privacy. No personal transaction data or telemetry is collected by this website.')}
                className="hover:text-indigo-400 transition"
              >
                Privacy Policy
              </button>
              <span className="text-slate-700 hidden md:inline">•</span>
              <button
                onClick={() => showModal('Terms of Service', 'InclusivePay is an open accessibility initiative. All app resources and code are provided free for universal usage.')}
                className="hover:text-indigo-400 transition"
              >
                Terms of Service
              </button>
              <span className="text-slate-700 hidden md:inline">•</span>
              <button
                onClick={() => showModal('Accessibility Statement', 'InclusivePay is engineered to strictly conform with WCAG 2.1 Level AAA guidelines, including TalkBack compatibility, high contrast mode, and voice controls.')}
                className="hover:text-indigo-400 transition"
              >
                Accessibility Statement
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <span>&copy; 2026 InclusivePay. All rights reserved.</span>
          <span>Promotional Website & Accessible Web Application</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
