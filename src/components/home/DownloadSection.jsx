import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Download, ShieldCheck, Box, Smartphone } from 'lucide-react';

const DownloadSection = () => {
  const { switchView } = useAuth();
  const { speak } = useAccessibility();

  const handleGoToDownloadHub = () => {
    switchView('download-hub');
    speak('Opening official APK Download Hub');
  };

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-800/80" id="download" aria-labelledby="download-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-indigo-500/30 bg-gradient-to-br from-[#2E5747]/40 via-[#243036]/90 to-[#2E5747]/30 text-center flex flex-col items-center space-y-6 relative overflow-hidden">

          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Android APK • Official Release</span>
          </div>

          <h2 id="download-heading" className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl">
            Download InclusivePay Today
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Get the latest version of InclusivePay directly to your Android device and experience accessible, voice-first UPI payments.
          </p>

          <button
            onClick={handleGoToDownloadHub}
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg flex items-center space-x-3 shadow-xl shadow-indigo-600/40 hover:scale-[1.03] transition"
          >
            <Download className="w-6 h-6" />
            <span>Go to Download Center</span>
          </button>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center space-x-1.5">
              <Box className="w-4 h-4 text-indigo-400" />
              <span>File Size: <strong className="text-white">235.4 MB</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Version: <strong className="text-white">v2.4.0 (Latest)</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Requirement: <strong className="text-white">Android 8.0+</strong></span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
