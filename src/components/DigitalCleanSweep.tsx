"use client";

import { Zap, ShieldCheck, BarChart3, Sparkles } from "lucide-react";

const DigitalCleanSweep = () => {
  const benefits = [
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Remove Duplicates",
      color: "bg-orange-50"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      title: "Organise Storage",
      color: "bg-blue-50"
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-purple-500" />,
      title: "Lower Costs",
      color: "bg-purple-50"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-pink-500" />,
      title: "Clear Clutter",
      color: "bg-pink-50"
    }
  ];

  return (
    <section className="section-padding bg-[#1a2b3b] text-white rounded-[3rem] mx-4 lg:mx-8 mb-24">
      <div className="container px-6 mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">EFFICIENT SERVICES</h2>
          <p className="text-white/60 font-medium">Tools and systems we trust to keep you organized.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className={`aspect-[4/5] ${benefit.color} rounded-3xl flex flex-col items-center justify-center p-8 transition-transform hover:-translate-y-2 duration-300`}>
              <div className="mb-6">{benefit.icon}</div>
              <div className="text-black font-black text-center text-sm uppercase tracking-tighter leading-tight">
                {benefit.title}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-white/60 leading-relaxed">
            At DB IT, we're all about the background checks and we only recommend systems we trust. Of course, there's no one size fits all, so we've found the best in class for our many and varied clients.
          </p>
          <button className="mt-6 text-primary font-bold text-sm underline underline-offset-4">View all services</button>
        </div>
      </div>
    </section>
  );
};

export default DigitalCleanSweep;