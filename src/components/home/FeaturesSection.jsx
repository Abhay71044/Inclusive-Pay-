import React from 'react';
import { Mic, Volume2, Hand, Moon, Globe, Shield, Zap, Accessibility } from 'lucide-react';

const featuresList = [
  {
    icon: Mic,
    title: "Voice Navigation",
    desc: "Perform entire UPI transactions by speaking naturally in regional Indian languages with automatic speech recognition."
  },
  {
    icon: Volume2,
    title: "Screen Reader Support",
    desc: "Native screen-reader hooks optimized for Android TalkBack with informative semantic ARIA labels and landmarks."
  },
  {
    icon: Hand,
    title: "Large Touch Buttons",
    desc: "Extra-large hit targets (minimum 48px to 64px height) prevent accidental taps and reduce tremor stress."
  },
  {
    icon: Moon,
    title: "Dark & High Contrast",
    desc: "Eye-friendly deep dark canvas with bright glowing indigo highlights and switchable WCAG AAA high contrast mode."
  },
  {
    icon: Globe,
    title: "Multiple Languages",
    desc: "Seamless support for Hindi, English, Tamil, Telugu, Marathi, Gujarati, Bengali, and other official regional languages."
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    desc: "Fingerprint, Face Unlock, and voice-assisted secure PIN entry compliant with NPCI UPI security standards."
  },
  {
    icon: Zap,
    title: "Fast Payments",
    desc: "Instant 1-tap & voice-triggered money transfer directly linked to bank accounts with real-time audio receipt."
  },
  {
    icon: Accessibility,
    title: "Designed for Accessibility",
    desc: "Co-designed with disability advocates and accessibility specialists to ensure independence in daily transactions."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20" id="features" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            Powerful Features
          </span>
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Built Without Accessibility Compromises
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Every single feature is engineered from the ground up to ensure seamless, dignifying UPI payment access.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article
                key={idx}
                className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800/80 flex flex-col text-left space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
