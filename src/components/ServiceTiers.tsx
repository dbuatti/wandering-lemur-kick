"use client";

import { ArrowUpRight, Check } from "lucide-react";

const ServiceTiers = () => {
  const tiers = [
    {
      id: "01",
      name: "Maintenance",
      subtitle: "Keep things running.",
      rate: "100",
      focus: "For professionals who want:",
      features: ["Fast troubleshooting", "Device setup", "Basic security checks", "Ongoing support access"]
    },
    {
      id: "02",
      name: "Optimization",
      subtitle: "Save time and reduce frustration.",
      rate: "130",
      focus: "Includes:",
      features: ["Workflow review", "File system organisation", "Cloud consolidation", "Security review", "Basic automation", "Subscription audit"]
    },
    {
      id: "03",
      name: "Recovery & Resilience",
      subtitle: "When things go wrong.",
      rate: "150",
      focus: "Includes:",
      features: ["Data recovery help", "Full system rebuild", "Secure migration", "Emergency response", "Long-term backup planning"]
    }
  ];

  return (
    <section className="section-padding bg-black">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Pricing</div>
            <h2 className="text-5xl lg:text-7xl font-bold">Service Tiers</h2>
          </div>
          <p className="text-lg text-muted-foreground font-light max-w-xs">
            Clear, outcome-based pricing for reliable digital systems.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all duration-500 flex flex-col group">
              <div className="flex justify-between items-start mb-12">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">TIER {tier.id}</span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-3xl font-bold mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-8 font-light">{tier.subtitle}</p>
              
              <div className="mb-12">
                <span className="text-5xl font-bold text-white">${tier.rate}</span>
                <span className="text-sm font-medium text-muted-foreground ml-2">/ hr</span>
              </div>
              
              <div className="mb-6 text-xs font-bold uppercase tracking-widest text-white/40">{tier.focus}</div>
              
              <ul className="space-y-5 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="text-sm font-light text-muted-foreground flex items-center">
                    <Check className="h-4 w-4 text-primary mr-4" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTiers;