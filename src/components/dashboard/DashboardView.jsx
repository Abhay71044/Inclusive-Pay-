import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Download, ShieldCheck, Smartphone, CheckCircle, FileText, ExternalLink, Copy, HelpCircle, ArrowRight } from 'lucide-react';
import { APK_LINK, downloadAPKFile } from '../../config';

const DashboardView = () => {
  const { currentUser, switchView } = useAuth();
  const { showToast, speak } = useAccessibility();
  const [copiedChecksum, setCopiedChecksum] = useState(false);

  const checksumText = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const handleCopyChecksum = () => {
    navigator.clipboard.writeText(checksumText);
    setCopiedChecksum(true);
    showToast("📋 SHA-256 Checksum copied to clipboard!");
    speak("Checksum copied to clipboard");
    setTimeout(() => setCopiedChecksum(false), 3000);
  };

  const handleDownload = (version = "v2.4.0") => {
    if (!currentUser) {
      showToast("🔒 Login required! Please log in to download the APK.");
      speak("Login required. Please log in to download the InclusivePay APK.");
      switchView('login');
      return;
    }
    speak(`Initiating download for InclusivePay ${version} APK`);
    downloadAPKFile(speak, showToast);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 text-left">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official APK Distribution & User Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome Back, <span className="text-indigo-400">{currentUser?.displayName || 'User'}</span>!
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Access official InclusivePay Android APK releases, verify package checksums, and manage app installation resources.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleDownload("v2.4.0")}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center space-x-2.5 shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            <span>Download APK (v2.4.0)</span>
          </button>
        </div>
      </div>

      {/* APK Portal Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Download className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">v2.4.0 Stable</div>
            <div className="text-xs text-slate-400 mt-0.5">Latest APK Release (235.4 MB)</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">100% Verified</div>
            <div className="text-xs text-slate-400 mt-0.5">Play Protect & Malware Safe</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">Android 8.0+</div>
            <div className="text-xs text-slate-400 mt-0.5">TalkBack & WCAG AAA Ready</div>
          </div>
        </div>
      </div>

      {/* APK Quick Actions & Services */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">APK Management & Support</h3>
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Quick Actions</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleDownload("v2.4.0")}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex flex-col items-start justify-between space-y-4 group transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-100">Download APK</div>
              <div className="text-xs text-slate-400 mt-1">Get official v2.4.0 build file</div>
            </div>
          </button>

          <button
            onClick={() => switchView('download-hub')}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex flex-col items-start justify-between space-y-4 group transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-100">Install Guide</div>
              <div className="text-xs text-slate-400 mt-1">Step-by-step setup instructions</div>
            </div>
          </button>

          <button
            onClick={() => {
              showToast("📋 Opening Release Changelog for v2.4.0");
              speak("Showing release notes for version 2.4.0");
            }}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex flex-col items-start justify-between space-y-4 group transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-100">Release Notes</div>
              <div className="text-xs text-slate-400 mt-1">See what's new in v2.4.0</div>
            </div>
          </button>

          <button
            onClick={() => switchView('profile')}
            className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex flex-col items-start justify-between space-y-4 group transition text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-100">My Profile</div>
              <div className="text-xs text-slate-400 mt-1">Account & Preference settings</div>
            </div>
          </button>
        </div>
      </div>

      {/* Official APK Version Releases Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xl font-bold text-white">Official APK Downloads & Build History</h3>
            <p className="text-xs text-slate-400 mt-1">Download current and previous production builds of the InclusivePay Android application.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-full font-semibold">
            Direct Server Downloads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Target OS</th>
                <th className="py-3 px-4">Release Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-4 px-4 font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  InclusivePay v2.4.0
                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">Latest</span>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-slate-300">235.4 MB</td>
                <td className="py-4 px-4 text-xs text-slate-300">Android 8.0+</td>
                <td className="py-4 px-4 text-xs text-slate-400">August 2026</td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => handleDownload("v2.4.0")}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-4 px-4 font-medium text-slate-300">
                  InclusivePay v2.3.5
                  <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 ml-2">Stable</span>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-slate-400">228.1 MB</td>
                <td className="py-4 px-4 text-xs text-slate-400">Android 7.0+</td>
                <td className="py-4 px-4 text-xs text-slate-400">July 2026</td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => handleDownload("v2.3.5")}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-4 px-4 font-medium text-slate-300">
                  InclusivePay v2.2.0
                  <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 ml-2">LTS</span>
                </td>
                <td className="py-4 px-4 font-mono text-xs text-slate-400">215.0 MB</td>
                <td className="py-4 px-4 text-xs text-slate-400">Android 7.0+</td>
                <td className="py-4 px-4 text-xs text-slate-400">June 2026</td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => handleDownload("v2.2.0")}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Security & SHA-256 Checksum */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Package Verification (SHA-256)</span>
          </h3>
          <span className="text-xs text-slate-400">Verify file integrity before installing</span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 overflow-hidden w-full">
            <span className="text-[11px] text-slate-400 font-mono uppercase">InclusivePay_v2.4.0.apk SHA-256</span>
            <div className="text-xs font-mono text-indigo-300 truncate select-all">{checksumText}</div>
          </div>
          <button
            onClick={handleCopyChecksum}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 shrink-0 transition"
          >
            <Copy className="w-4 h-4 text-indigo-400" />
            <span>{copiedChecksum ? 'Copied!' : 'Copy Checksum'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default DashboardView;

