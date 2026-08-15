import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Mic, User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const SignupView = () => {
  const { registerLocal, loginWithGoogle, switchView } = useAuth();
  const { showToast, speak } = useAccessibility();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8) score += 1;
    return score;
  };

  const pwdStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      speak('Signup error: Name is required.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      speak('Signup error: Invalid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      speak('Signup error: Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      speak('Signup error: Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await registerLocal(name, email, password);
    setLoading(false);

    if (res.success) {
      showToast('🎉 Account created successfully! Welcome to InclusivePay.');
      speak('Account created successfully! Redirecting to home page.');
    } else {
      setErrorMsg(res.error || 'Registration failed.');
      speak(`Registration error: ${res.error}`);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      showToast('🎉 Account created via Google!');
      speak('Account created via Google!');
    } else {
      setErrorMsg(res.error || 'Google registration failed.');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="w-full glass-card rounded-3xl border border-slate-800/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">

        {/* Left Graphics Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#2E5747]/60 via-[#243036] to-[#2E5747]/40 p-8 sm:p-12 flex flex-col justify-between text-left border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-purple-300 text-xs font-semibold">
              <Mic className="w-4 h-4 text-purple-400" />
              <span>Join InclusivePay</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Create Your Inclusive Account Today
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of users enjoying independent, voice-assisted digital payments with bank-grade security.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-800/80 mt-8">
            <div className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Secure JWT Token & Firebase Auth</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
              <Mic className="w-5 h-5 text-emerald-400" />
              <span>UPI Voice Payment Shortcuts Enabled</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-6 p-8 sm:p-12 text-left flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Register for your InclusivePay digital wallet
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <span>❌ {errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" novalidate>
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abhay Singh"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Password Strength Meter */}
              <div className="mt-2 space-y-1">
                <div className="grid grid-cols-3 gap-1.5 h-1.5">
                  <div className={`rounded-full transition ${pwdStrength >= 1 ? 'bg-amber-400' : 'bg-slate-800'}`} />
                  <div className={`rounded-full transition ${pwdStrength >= 2 ? 'bg-[#5E8262]' : 'bg-slate-800'}`} />
                  <div className={`rounded-full transition ${pwdStrength >= 3 ? 'bg-[#9EB384]' : 'bg-slate-800'}`} />
                </div>
                <div className="text-[11px] text-slate-400">
                  {pwdStrength === 0 && 'Enter password (min 6 chars)'}
                  {pwdStrength === 1 && 'Weak password'}
                  {pwdStrength === 2 && 'Good password'}
                  {pwdStrength === 3 && 'Strong password'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Go to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase font-semibold absolute">OR</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-3 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.41-1.57-5.13-3.72L.97 13.02C2.47 16 5.48 18 9 18z" />
              <path fill="#FBBC05" d="M3.87 10.8c-.19-.56-.3-1.17-.3-1.8s.11-1.24.3-1.8L.97 4.98C.35 6.22 0 7.57 0 9s.35 2.78.97 4.02l2.9-2.22z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.47 2 1.05 4.98l2.9 2.22C4.67 5.07 6.62 3.58 9 3.58z" />
            </svg>
            <span>{loading ? 'Registering with Google...' : 'Continue with Google'}</span>
          </button>

          <div className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <button
              onClick={() => switchView('login')}
              className="text-indigo-400 font-semibold hover:underline"
            >
              Login here
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupView;
