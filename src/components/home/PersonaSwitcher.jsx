import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Hand, Volume2, UserCheck, CheckCircle2, Mic } from 'lucide-react';

const personaData = {
  visual: {
    title: "Voice-Guided Assist for Visually Impaired",
    desc: "Full screen-reader compatibility with TalkBack/VoiceOver, complete voice command navigation, audio confirmation of recipient names and transaction amounts, and high contrast tactile design.",
    features: [
      "Continuous voice prompt navigation & confirmation",
      "Sound & haptic pattern feedback on keypress",
      "Auto speech feedback of remaining bank balance"
    ],
    demoText: "Voice Assist Active: 'Say pay Ramesh 500 rupees'",
    icon: Eye
  },
  physical: {
    title: "Single-Tap & Large Touch Area for Physical Disabilities",
    desc: "Designed with generous 56px+ target areas, adjustable touch delay sensitivities, single-gesture payment shortcuts, and full support for external switch access devices.",
    features: [
      "Minimum 48px to 64px touch target zones",
      "External Bluetooth Switch Access compatibility",
      "Zero precision drag-and-drop requirements"
    ],
    demoText: "Large Target & Switch Access Mode Enabled",
    icon: Hand
  },
  hearing: {
    title: "Visual Haptics & Sign Guidance for Hearing & Speech Impaired",
    desc: "Replaces sound cues with clear high-contrast visual banners, customizable vibrations, visual QR transaction confirmations, and speech-to-text live prompts.",
    features: [
      "Vibrational haptic code pattern confirmations",
      "Instant visual transaction receipt banners",
      "Real-time visual QR & text communication"
    ],
    demoText: "Visual Haptics & High-Contrast Banner Cues Active",
    icon: Volume2
  },
  elderly: {
    title: "Simple Mode & Extra-Large Text for Elderly Citizens",
    desc: "Removes overwhelming submenus in favor of a clean 4-button dashboard, extra-large clear fonts, simple language prompts, and 1-tap emergency support.",
    features: [
      "Extra-large 20pt+ font readability options",
      "Simplified 4-tile main dashboard layout",
      "Family & trusted contact payment verification"
    ],
    demoText: "Senior Citizen Simple Dashboard Mode Active",
    icon: UserCheck
  }
};

const PersonaSwitcher = () => {
  const [activeTab, setActiveTab] = useState('visual');
  const { speak } = useAccessibility();

  const handleSelectPersona = (key) => {
    setActiveTab(key);
    const data = personaData[key];
    speak(data.demoText);
  };

  const activeData = personaData[activeTab];

  return (
    <section className="py-16 bg-slate-950/60 border-y border-slate-800/80" aria-labelledby="persona-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            Inclusive Design Solutions
          </span>
          <h2 id="persona-heading" className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Crafted for Every Unique Need
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Select a user profile to discover how InclusivePay customizes UI, speech, touch, and guidance feedback.
          </p>
        </div>

        {/* Persona Tabs Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8" role="tablist">
          {Object.entries(personaData).map(([key, item]) => {
            const Icon = item.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectPersona(key)}
                className={`flex items-center justify-center space-x-2.5 py-3.5 px-4 rounded-2xl font-semibold text-sm transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{key === 'visual' ? 'Visually Impaired' : key === 'physical' ? 'Physical Disabled' : key === 'hearing' ? 'Hearing & Speech' : 'Elderly Citizens'}</span>
              </button>
            );
          })}
        </div>

        {/* Display Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {activeData.title}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {activeData.desc}
            </p>

            <ul className="space-y-2.5 pt-2">
              {activeData.features.map((feat, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Mic className="w-7 h-7" />
              </div>
              <div className="font-semibold text-indigo-300 text-sm">
                "{activeData.demoText}"
              </div>
              <div className="text-xs text-slate-400">
                Audio feedback enabled for TalkBack & Voice Reader Demo
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PersonaSwitcher;
