import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Mic, Menu, X, Download, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

const Navbar = () => {
  const { currentUser, activeView, switchView, logout } = useAuth();
  const { speak } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (viewId, sectionId) => {
    setMobileMenuOpen(false);
    if (viewId !== activeView) {
      switchView(viewId);
    }
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleDownloadClick = () => {
    setMobileMenuOpen(false);
    switchView('download-hub');
    speak('Navigating to Official APK Download Center');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home', 'home')}
          className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          aria-label="InclusivePay Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition transform">
            <Mic className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
              InclusivePay
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
              Accessible UPI
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => handleNavClick('home', 'home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeView === 'home' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick(currentUser ? 'dashboard' : 'login')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeView === 'dashboard' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={handleDownloadClick}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
              activeView === 'download-hub'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download APK</span>
          </button>

          <button
            onClick={() => handleNavClick(currentUser ? 'profile' : 'login')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeView === 'profile' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            My Profile
          </button>

          <button
            onClick={() => handleNavClick('home', 'contact')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeView === 'contact' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
              <UserAvatar user={currentUser} className="w-8 h-8 text-xs font-bold" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-100 max-w-[100px] truncate">
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] text-slate-400 max-w-[100px] truncate">
                  {currentUser.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Log out"
                aria-label="Log out of account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => switchView('login')}
                className="px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => switchView('signup')}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 backdrop-blur-2xl">
          <button
            onClick={() => handleNavClick('home', 'home')}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick(currentUser ? 'dashboard' : 'login')}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Dashboard
          </button>
          <button
            onClick={handleDownloadClick}
            className="block w-full text-left px-3 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white flex items-center justify-between shadow-lg shadow-indigo-600/30"
          >
            <span>Download APK</span>
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNavClick(currentUser ? 'profile' : 'login')}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            My Profile
          </button>
          <button
            onClick={() => handleNavClick('home', 'contact')}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Contact
          </button>

          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            {currentUser ? (
              <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center space-x-3">
                  <UserAvatar user={currentUser} className="w-9 h-9 text-sm font-bold" />
                  <div>
                    <div className="text-sm font-semibold text-white">{currentUser.displayName}</div>
                    <div className="text-xs text-slate-400">{currentUser.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    switchView('login');
                  }}
                  className="w-full py-2.5 text-center text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold border border-slate-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    switchView('signup');
                  }}
                  className="w-full py-2.5 text-center text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
