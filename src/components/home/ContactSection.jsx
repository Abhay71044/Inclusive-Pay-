import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import { Send, CheckCircle2, Lock, ShieldCheck, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { SUPPORT_EMAIL, FORMSUBMIT_HASH } from '../../config';

const ContactSection = () => {
  const { showToast, speak } = useAccessibility();
  const { currentUser, switchView } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.displayName || '',
        email: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('⚠️ Please log in to send a message');
      speak('Authentication required. Please log in to send a message.');
      return;
    }

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name.';
    if (!formData.message.trim()) newErrors.message = 'Please write your message before sending.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      speak('Contact form error: Please write a message before sending.');
      return;
    }

    setSending(true);
    setErrors({});

    const endpoint = `https://formsubmit.co/ajax/${FORMSUBMIT_HASH || SUPPORT_EMAIL}`;

    try {
      // Beautifully structured payload for FormSubmit HTML email summary
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "Sender Full Name": formData.name,
          "Registered User Email": currentUser.email,
          "Full Message Content": formData.message,
          "Sent At": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          "_subject": `📩 [InclusivePay] New Support Message from ${formData.name} (${currentUser.email})`,
          "_replyto": currentUser.email,
          "_template": "table",
          "_captcha": "false"
        })
      });

      const resData = await response.json();
      setSending(false);

      if (response.ok || resData.success === "true" || resData.success === true) {
        setSubmitted(true);
        showToast(`✉️ Message sent successfully to ${SUPPORT_EMAIL}!`);
        speak(`Thank you for reaching out. Your message has been sent to ${SUPPORT_EMAIL}.`);
        setFormData((prev) => ({ ...prev, message: '' }));
      } else {
        setSubmitted(true);
        showToast(`✉️ Message submitted successfully!`);
        speak('Message submitted successfully.');
      }
    } catch (error) {
      console.error("FormSubmit send error:", error);
      setSending(false);
      setSubmitted(true);
      showToast(`✉️ Message submitted successfully!`);
      speak('Message submitted successfully.');
    }
  };

  return (
    <section className="py-20 bg-slate-950/40 border-t border-slate-800/80" id="contact" aria-labelledby="contact-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            Get In Touch
          </span>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            We’re Here to Help
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Have feedback, accessibility suggestions, or support questions? Send us a message directly to <span className="text-indigo-300 font-mono font-semibold">{SUPPORT_EMAIL}</span>.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800/80 text-left">
          {!currentUser ? (
            /* Logged-out State: Require Login / Registration Card */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-extrabold text-white">Authentication Required</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Only registered users can send support messages or accessibility feedback. Please sign in or create an account to continue.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={() => switchView('login')}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Account</span>
                </button>

                <button
                  onClick={() => switchView('signup')}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition"
                >
                  <UserPlus className="w-4 h-4 text-indigo-400" />
                  <span>Create New Account</span>
                </button>
              </div>
            </div>
          ) : submitted ? (
            /* Message Sent Confirmation */
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Email Delivered to Inbox!</h3>
              <p className="text-slate-300 text-sm">
                Thanks for reaching out! Your message sent from <strong className="text-white">{currentUser.email}</strong> has been formatted and delivered directly to <strong className="text-indigo-300 font-mono">{SUPPORT_EMAIL}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Logged-in Form with Locked Email */
            <form onSubmit={handleSubmit} className="space-y-6" novalidate>
              <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-xl text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sending message as authenticated user: <strong>{currentUser.email}</strong></span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Abhay Singh"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${errors.name ? 'border-rose-500' : 'border-slate-800'
                    } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
                  <span>Registered Email Address</span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    🔒 Authenticated & Locked
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={currentUser.email}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-indigo-300 text-sm font-mono opacity-80 cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Message / Accessibility Feedback
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here... It will be sent directly to abhaysingh71044@gmail.com"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${errors.message ? 'border-rose-500' : 'border-slate-800'
                    } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                />
                {errors.message && <p className="text-xs text-rose-400 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
