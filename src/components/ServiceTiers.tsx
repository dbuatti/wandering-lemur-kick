import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceTiers = () => {
  const tiers = [
    {
      id: "01",
      name: "Tech Concierge",
      rate: "100",
      features: ["iCloud Optimization", "Software Training", "Performance Tuning"]
    },
    {
      id: "02",
      name: "Efficiency Partner",
      rate: "130",
      features: ["Workflow Audits", "Security Hardening", "Profile Separation"]
    },
    {
      id: "03",
      name: "Hardware Surgery",
      rate: "150",
      features: ["Hardware Diagnostics", "Component Repairs", "Data Recovery"]
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-secondary mb-6">Investment</div>
            <h2 className="text-5xl lg:text-7xl font-serif font-light">Service Tiers</h2>
          </div>
          <p className="text-lg text-muted-foreground font-sans font-light max-w-xs">
            Transparent, premium rates for specialized expertise.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-px bg-border border border-border">
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-white p-12 lg:p-16 hover:bg-accent/10 transition-colors duration-500 flex flex-col">
              <div className="flex justify-between items-start mb-16">
                <span className="text-[10px] font-sans font-black text-secondary tracking-widest">TIER {tier.id}</span>
                <ArrowUpRight className="h-5 w-5 text-border group-hover:text-secondary transition-colors" />
              </div>
              
              <h3 className="text-3xl font-serif font-medium mb-8">{tier.name}</h3>
              
              <div className="mb-12">
                <span className="text-5xl font-serif font-light text-primary">${tier.rate}</span>
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground ml-2">/ hr</span>
              </div>
              
              <ul className="space-y-4 mb-16 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="text-sm font-sans font-light text-muted-foreground flex items-center">
                    <div className="h-1 w-1 rounded-full bg-secondary mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button className="w-full h-14 rounded-none bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-500 text-xs font-bold uppercase tracking-widest">
                Select Tier
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTiers;