import React from 'react';

const statsList = [
  { val: "100%", label: "Free & Non-Profit" },
  { val: "10+", label: "Indian Languages" },
  { val: "4.9 ★", label: "User Satisfaction" },
  { val: "WCAG", label: "AAA Compliant" }
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-slate-950/40 border-t border-slate-800/80" id="about" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 text-left space-y-4">
            <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
              Our Core Mission
            </span>
            <h2 id="about-heading" className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Empowering Financial Freedom For Everyone
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              InclusivePay is built to make UPI payments easier and more accessible for everyone, especially users with disabilities. It focuses on accessibility, ease of use, voice guidance, and inclusive design so every person can confidently perform digital transactions without depending on others.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              By removing visual barriers, small touch targets, and complex submenus, InclusivePay gives elderly citizens and disabled individuals the dignity of total financial independence.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {statsList.map((st, idx) => (
              <div
                key={idx}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-1"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
                  {st.val}
                </div>
                <div className="text-xs font-medium text-slate-400">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
