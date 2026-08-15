import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "What is InclusivePay?",
    a: "InclusivePay is an accessible, voice-first UPI payment Android application designed specifically for users with visual impairments, hearing/speech challenges, motor disabilities, and elderly individuals to make digital payments independently."
  },
  {
    q: "Is InclusivePay completely free to use?",
    a: "Yes! InclusivePay is 100% free with no hidden charges or subscription fees. It complies with NPCI zero-MDR guidelines for standard UPI transactions across Indian banks."
  },
  {
    q: "Is it secure and approved for UPI payments?",
    a: "Absolutely. InclusivePay adheres to official NPCI UPI security specifications, requiring bank-grade biometric authentication and encrypted UPI PIN verification for every single payment."
  },
  {
    q: "Who can use InclusivePay?",
    a: "Anyone with an active Indian bank account linked to a mobile number can use InclusivePay. While specially built for disabled and elderly citizens, its clean voice-first UI makes payments easier for all users."
  },
  {
    q: "How do I install the APK file on Android?",
    a: "Click the 'Download APK' button, open the downloaded file on your Android phone, enable 'Install from Unknown Sources' if prompted by your browser, and tap 'Install'."
  },
  {
    q: "Can I update the app in the future?",
    a: "Yes. InclusivePay features an automatic in-app update notification system whenever a new version is released on our official site."
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { speak } = useAccessibility();

  const handleToggle = (idx) => {
    if (openIndex === idx) {
      setOpenIndex(null);
    } else {
      setOpenIndex(idx);
      speak(`Question: ${faqs[idx].q}. Answer: ${faqs[idx].a}`);
    }
  };

  return (
    <section className="py-20" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            Help & Support
          </span>
          <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Got questions about InclusivePay? Here are answers to common inquiries.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden transition"
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full p-5 text-left font-bold text-slate-100 flex justify-between items-center space-x-4 focus:outline-none focus:bg-slate-800/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;
