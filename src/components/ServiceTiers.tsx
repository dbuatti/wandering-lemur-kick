"use client";

import { ArrowRight } from "lucide-react";

const ServiceTiers = () => {
  const tiers = [
    {
      name: "Maintenance",
      rate: "100",
      color: "bg-white",
      textColor: "text-foreground",
      desc: "Keep things running smoothly with regular checkups and support."
    },
    {
      name: "Optimization",
      rate: "130",
      color: "bg-[#93c5fd]",
      textColor: "text-blue-900",
      desc: "Save time and reduce frustration with a full workflow review."
    },
    {
      name: "Recovery",
      rate: "150",
      color: "bg-[#4c0519]",
      textColor: "text-white",
      desc: "Emergency response and long-term resilience planning."
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container px-6 mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-8">SERVICE <br />TIERS</h2>
            <p className="text-muted-foreground font-medium mb-8">
              Clear, outcome-based pricing for reliable digital systems. No hidden fees, just results.
            </p>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <button className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-8 grid md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <div key={index} className={`${tier.color} ${tier.textColor} p-10 rounded-[2.5rem] flex flex-col justify-between aspect-[3/4] card-shadow transition-transform hover:scale-[1.02] duration-300`}>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter mb-4 uppercase leading-none">{tier.name}</h3>
                  <p className="text-sm font-medium opacity-80">{tier.desc}</p>
                </div>
                
                <div>
                  <div className="text-4xl font-black mb-6">${tier.rate}<span className="text-sm opacity-60">/hr</span></div>
                  <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 group">
                    Read More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTiers;