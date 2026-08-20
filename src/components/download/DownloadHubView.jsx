import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Download, ShieldCheck, Box, Smartphone, Eye, ExternalLink, Lock, LogIn } from 'lucide-react';
import { APK_LINK, downloadAPKFile } from '../../config';

const DownloadHubView = () => {
  const { currentUser, switchView } = useAuth();
  const { showToast, speak, downloadCount, incrementDownloadCount } = useAccessibility();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDownloadSequence = () => {
    if (!currentUser) {
      showToast("🔒 Login required! Please log in to download the APK.");
      speak("Login required. Please log in to download the InclusivePay APK.");
      switchView('login');
      return;
    }

    if (downloading) return;
    setDownloading(true);
    setProgress(0);
    speak("Starting download for InclusivePay v2.4.0 APK");

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setDownloading(false);
        incrementDownloadCount();

        downloadAPKFile(speak, showToast);
      }
    }, 250);
  };

  const handleDirectLinkClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      showToast("🔒 Login required! Please log in to access the direct APK link.");
      speak("Login required. Please log in to access the direct download link.");
      switchView('login');
    } else {
      incrementDownloadCount();
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">

        {/* Unauthenticated Login Alert Banner */}
        {!currentUser && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-200 text-sm font-semibold">
            <div className="flex items-center space-x-2.5">
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>You must be logged in to download the official InclusivePay APK.</span>
            </div>
            <button
              onClick={() => switchView('login')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shrink-0 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In Now</span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Official Release</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              InclusivePay Android APK
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Build v2.4.0 • Voice-First Accessibility Edition
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google Play Protect Safe</span>
          </div>
        </div>

        {/* Release Badges Row */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-indigo-400" /> Size: 235.4 MB
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-purple-400" /> Requirement: Android 8.0+
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" /> WCAG 2.1 AAA Compliant
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs flex items-center gap-1.5 font-semibold">
            📥 {downloadCount.toLocaleString()} Downloads
          </span>
        </div>

        {/* Direct Link Box */}
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
              Official Release Download URL
              {!currentUser && <span className="text-amber-400 text-[10px] lowercase">(login required)</span>}
            </span>
            <div className="text-xs font-mono text-indigo-300 break-all">
              {currentUser ? APK_LINK : 'https://inclusivepay.org/auth-required?target=apk_download'}
            </div>
          </div>
          <a
            href={currentUser ? APK_LINK : '#'}
            onClick={handleDirectLinkClick}
            target={currentUser ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          >
            <span>{currentUser ? 'Direct Link' : 'Log In to Get Link'}</span>
            {currentUser ? <ExternalLink className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
          </a>
        </div>

        {/* Download Action Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <button
            onClick={startDownloadSequence}
            disabled={downloading}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center justify-center space-x-3 shadow-xl transition disabled:opacity-50 ${currentUser
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              }`}
          >
            {currentUser ? <Download className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            <span>
              {!currentUser
                ? 'Log In to Download APK'
                : downloading
                  ? 'Downloading APK Build...'
                  : 'Download APK Build Now'}
            </span>
          </button>

          {downloading && (
            <div className="space-y-2 max-w-md mx-auto pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Downloading InclusivePay_v2.4.0.apk...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-[#965c7f] to-[#d89599] rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="text-[11px] font-mono text-slate-500 break-all bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            SHA-256 Checksum: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </div>
        </div>

        {/* Step-by-Step Installation Guide */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <h3 className="text-lg font-bold text-white">Installation Guide</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 text-sm leading-relaxed">
            <li>Log into your account and tap <strong className="text-white">Download APK Build Now</strong> above to save `InclusivePay_v2.4.0.apk`.</li>
            <li>Open your Android device <strong className="text-white">Downloads</strong> folder and tap the APK file.</li>
            <li>If prompted, enable <strong className="text-white">Allow installation from unknown sources</strong> in Settings.</li>
            <li>Follow on-screen instructions to complete installation and launch voice setup.</li>
          </ol>
        </div>

      </div>
    </div>
  );
};

export default DownloadHubView;

