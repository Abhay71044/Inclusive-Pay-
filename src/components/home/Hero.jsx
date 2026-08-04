import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Mic, Download, ArrowRight, ShieldCheck, Zap, Award, Bell, Eye, EyeOff, Send, QrCode, FileText, History } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

const Hero = () => {
  const { switchView, currentUser } = useAuth();
  const { speak, showToast } = useAccessibility();

  const [isBalanceRevealed, setIsBalanceRevealed] = useState(false);

  const toggleBalance = () => {
    setIsBalanceRevealed((prev) => {
      const next = !prev;
      if (next) {
        speak('Bank balance revealed: 18 thousand 4 hundred 50 rupees');
        showToast('👁️ Available Balance Revealed: ₹18,450.00');
      } else {
        speak('Available balance hidden');
        showToast('🔒 Available Balance Hidden');
      }
      return next;
    });
  };

  const handleQuickAction = (actionName, speechMsg) => {
    showToast(`📱 Action Triggered: ${actionName}`);
    speak(speechMsg);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:py-24" id="home">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Content */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold w-fit shadow-inner">
              <Mic className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Voice-First Accessible UPI App</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              InclusivePay – <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Accessible UPI</span> for Everyone
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Experience a smarter, safer, and more accessible way to make digital payments. Designed especially for users with visual, hearing, physical, speech disabilities and elderly citizens with a voice-first guidance system.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  switchView('download-hub');
                  speak('Navigating to APK download center');
                }}
                className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base flex items-center space-x-2.5 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition"
                aria-label="Download InclusivePay Android APK"
              >
                <Download className="w-5 h-5" />
                <span>Download APK Build</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  speak('Scrolling to features section');
                }}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-base flex items-center space-x-2 border border-slate-700/80 hover:border-slate-600 transition"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Value Badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 sm:gap-6 border-t border-slate-800/80">
              <div className="flex items-center space-x-2 text-slate-300 text-xs sm:text-sm font-medium">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>100% Free & Open</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 text-xs sm:text-sm font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>NPCI & UPI Safe</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300 text-xs sm:text-sm font-medium">
                <Award className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>WCAG AAA Rated</span>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/18] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-800 shadow-2xl shadow-indigo-500/20 ring-1 ring-slate-700">
              
              {/* Phone Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
              </div>

              {/* Phone Screen Container */}
              <div className="w-full h-full bg-slate-900 rounded-[34px] p-4 flex flex-col justify-between overflow-hidden relative border border-slate-800/60 pt-8">
                
                {/* App Header Bar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2.5">
                      <UserAvatar user={currentUser} className="w-9 h-9 text-sm font-bold" />
                      <div className="text-left">
                        <div className="text-[11px] text-slate-400 font-medium">नमस्ते (Hello)</div>
                        <div className="text-sm font-bold text-white max-w-[140px] truncate">
                          {currentUser?.displayName || 'Abhay Singh'}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        showToast('🔔 0 Pending Notifications');
                        speak('You have no new notifications');
                      }}
                      className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white transition"
                      aria-label="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Gradient Bank Card Panel */}
                  <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-4 text-white shadow-xl shadow-indigo-900/40 relative overflow-hidden mb-4 border border-indigo-400/20">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[11px] font-medium tracking-wide text-indigo-100/90">InclusivePay Digital Bank</span>
                      <button 
                        onClick={toggleBalance}
                        className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-[11px] font-semibold flex items-center gap-1 transition"
                      >
                        {isBalanceRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isBalanceRevealed ? 'छिपाएं' : 'चेक करें'}</span>
                      </button>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-indigo-200/80 mb-0.5">Available Balance</div>
                      <div className="text-2xl font-extrabold tracking-tight font-mono">
                        {isBalanceRevealed ? '₹ 18,450.00' : '••••••••'}
                      </div>
                    </div>
                  </div>

                  {/* Squircle Quick Action Tiles */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                      onClick={() => handleQuickAction('Send Money', 'Opening Voice Send Money... Say recipient name or phone number')}
                      className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                        <Send className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300">भेजें</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('Scan QR', 'Opening Accessible QR Camera Scanner with audio positioning cues')}
                      className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300">स्कैन</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('Pay Bills', 'Opening Utility Bills payment manager with simplified layout')}
                      className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300">बिल</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('History', 'Opening Transaction History. Last transaction: ₹500 paid to Ramesh')}
                      className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                        <History className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300">इतिहास</span>
                    </button>
                  </div>
                </div>

                {/* Microphone Glowing Action Button */}
                <div className="flex flex-col items-center my-2">
                  <button
                    onClick={() => {
                      speak('Listening to your voice command... Say pay Ramesh 500 rupees');
                      showToast('🎙️ Voice Assistant Listening...');
                    }}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/50 hover:scale-110 active:scale-95 transition animate-pulse-glow"
                    aria-label="Activate Voice Assistant Command"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                  <span className="text-[10px] font-medium text-slate-400 mt-1.5">
                    Tap to speak payment
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
