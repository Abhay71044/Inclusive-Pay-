import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { User, Mail, ShieldCheck, LogOut, Save } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

const ProfileView = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const { showToast, speak } = useAccessibility();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');

  const handleSave = (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      showToast('⚠️ Please enter a valid name');
      return;
    }
    updateUserProfile({ displayName });
    showToast('✓ Profile updated successfully!');
    speak('Profile updated successfully!');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Card */}
        <div className="md:col-span-4 glass-card rounded-3xl p-6 border border-slate-800 flex flex-col items-center text-center space-y-4">
          <UserAvatar user={currentUser} className="w-24 h-24 text-3xl font-extrabold" />

          <div>
            <h2 className="text-xl font-bold text-white">{displayName || 'User'}</h2>
            <p className="text-xs text-slate-400">{currentUser?.email}</p>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs flex items-center justify-center space-x-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Main Settings Form */}
        <div className="md:col-span-8 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-white">Account & Security Settings</h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-2">
                Email Address (Verified)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-400 text-sm opacity-80 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </form>

          <hr className="border-slate-800 my-6" />

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Security & Authentication</h3>
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold text-white">Authentication Status</div>
                <div className="text-xs text-slate-400">
                  {currentUser?.provider === 'google' ? 'Connected via Google OAuth 2.0' : 'Local Account Synced'}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Active Session
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileView;
