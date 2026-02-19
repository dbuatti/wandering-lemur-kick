"use client";

import { Sparkles, Zap, ShieldCheck, BarChart3 } from "lucide-react";

const DigitalCleanSweep = () => {
  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Remove Duplicates",
      desc: "Stop paying for multiple cloud services and subscriptions you don't need."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Organise Storage",
      desc: "One simple, searchable, and backed-up system for all your files."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Lower Monthly Costs",
      desc: "In many cases, the savings cover the cost of my service within a few months."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Clear the Clutter",
      desc: "Get rid of the digital mess that slows down your work."
    }
  ];

  return (
    <section className="section-padding bg-black">
      <div className="container px-6 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Core Service</div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-8">The Digital Clean Sweep</h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Most professionals pay for old platforms they no longer use and have files scattered everywhere. I review your entire setup to bring everything into order.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-10 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all duration-500">
              <div className="mb-6 text-primary">{benefit.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalCleanSweep;