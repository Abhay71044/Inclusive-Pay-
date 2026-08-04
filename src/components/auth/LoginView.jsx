import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Mic, Lock, Mail, ArrowRight, Zap, ShieldCheck, Volume2 } from 'lucide-react';

const LoginView = () => {
  const { loginLocal, loginWithGoogle, switchView } = useAuth();
  const { showToast, speak } = useAccessibility();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      speak('Login error: Invalid email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      speak('Login error: Password is required');
      return;
    }

    setLoading(true);
    const res = await loginLocal(email, password);
    setLoading(false);

    if (res.success) {
      showToast('✓ Login successful! Welcome back.');
      speak('Login successful! Redirecting to home page.');
    } else {
      setErrorMsg(res.error || 'Invalid email or password.');
      speak(`Login error: ${res.error || 'Invalid email or password.'}`);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      showToast('✓ Google Login successful!');
      speak('Google Login successful!');
    } else {
      setErrorMsg(res.error || 'Google login failed.');
      speak('Google login failed.');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="w-full glass-card rounded-3xl border border-slate-800/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        
        {/* Left Graphics Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-purple-950/60 p-8 sm:p-12 flex flex-col justify-between text-left border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold">
              <Mic className="w-4 h-4 text-indigo-400" />
              <span>Voice-First Accessible UPI</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Empowering Everyone with Accessible Payments
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience hands-free UPI payments, voice guidance, TalkBack optimization, and secure instant transfers crafted for all abilities.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-800/80 mt-8">
            <div className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span>Instant Google OAuth 2.0 Direct Login</span>
            </div>

            <div className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>End-to-End Encrypted Session Sync</span>
            </div>

            <div className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <span>Voice Guidance & Screen Reader Compatible</span>
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 text-left flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Sign in to your InclusivePay account
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <span>❌ {errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" novalidate>
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Password...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase font-semibold absolute">OR</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-3 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.41-1.57-5.13-3.72L.97 13.02C2.47 16 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.87 10.8c-.19-.56-.3-1.17-.3-1.8s.11-1.24.3-1.8L.97 4.98C.35 6.22 0 7.57 0 9s.35 2.78.97 4.02l2.9-2.22z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.47 2 1.05 4.98l2.9 2.22C4.67 5.07 6.62 3.58 9 3.58z"/>
            </svg>
            <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
            <button
              onClick={() => showToast('🔑 Password reset link sent to your email (Demo).')}
              className="hover:text-indigo-400 transition"
            >
              Forgot Password?
            </button>
            <button
              onClick={() => switchView('signup')}
              className="text-indigo-400 font-semibold hover:underline"
            >
              Create New Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginView;
