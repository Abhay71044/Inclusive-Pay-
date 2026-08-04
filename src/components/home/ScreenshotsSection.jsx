import React from 'react';
import { Smartphone, Mic, CreditCard, Send } from 'lucide-react';

const previews = [
  {
    icon: Smartphone,
    title: "1. Home Screen",
    caption: "Clean, minimal interface with voice trigger and clear balance card.",
    subtitle: "Home Dashboard",
    subcaption: "Quick balance reveal & large squircle tiles"
  },
  {
    icon: Mic,
    title: "2. Voice Payment",
    caption: "Speak recipient and amount naturally in your mother tongue.",
    subtitle: "Voice Payment",
    subcaption: "Speak payment details with sound confirmations"
  },
  {
    icon: CreditCard,
    title: "3. Balance Check",
    caption: "Discreet audio feedback and high-visibility text layout.",
    subtitle: "Balance Check",
    subcaption: "Accessible 1-tap balance speak and hide toggle"
  },
  {
    icon: Send,
    title: "4. Send Money",
    caption: "Spacious touch buttons with audio/haptic feedback on keypress.",
    subtitle: "Send Money",
    subcaption: "Large phone keypad & QR scanner with sound cues"
  }
];

const ScreenshotsSection = () => {
  return (
    <section className="py-20" id="screenshots" aria-labelledby="screenshots-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            App Preview
          </span>
          <h2 id="screenshots-heading" className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Explore App Interfaces
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            A visual glimpse into InclusivePay's clean, high-contrast visual screens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previews.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card glass-card-hover rounded-3xl p-5 border border-slate-800/80 flex flex-col text-left space-y-4"
              >
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-800 p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-white text-sm">{item.subtitle}</div>
                  <div className="text-[11px] text-slate-400">{item.subcaption}</div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ScreenshotsSection;
