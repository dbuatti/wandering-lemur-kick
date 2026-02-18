import { Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceTiers = () => {
  const tiers = [
    {
      id: "01",
      name: "Tech Concierge",
      description: "Software 'How-to', iCloud cleanups, and performance tuning.",
      rate: "100",
      features: ["iCloud Optimization", "Software Training", "Performance Tuning", "Email Setup"]
    },
    {
      id: "02",
      name: "Efficiency Partner",
      description: "Workflow audits, security hardening, and business profile separation.",
      rate: "130",
      features: ["Workflow Audits", "Security Hardening", "Profile Separation", "Privacy Audits"]
    },
    {
      id: "03",
      name: "Hardware Surgery",
      description: "Deep-dive diagnostics, hardware repairs, and custom system builds.",
      rate: "150",
      features: ["Hardware Diagnostics", "Component Repairs", "Custom Builds", "Data Recovery"]
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-block text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6">Investment</div>
          <h2 className="text-4xl lg:text-6xl font-sans font-extrabold mb-8">Service Tiers</h2>
          <p className="text-xl text-muted-foreground font-serif leading-relaxed">
            Transparent, premium rates for specialized expertise. No hidden fees, just results.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div key={tier.id} className="group relative p-10 lg:p-12 rounded-[2.5rem] bg-background border border-border hover:border-primary/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="text-xs font-black tracking-widest text-muted-foreground/40 uppercase">Tier {tier.id}</div>
                <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              
              <h3 className="text-3xl font-sans font-bold mb-4">{tier.name}</h3>
              <p className="text-lg text-muted-foreground font-serif mb-10 flex-grow leading-relaxed">{tier.description}</p>
              
              <div className="mb-12 flex items-baseline gap-1">
                <span className="text-sm font-serif text-muted-foreground">$</span>
                <span className="text-6xl font-sans font-black text-primary tracking-tighter">{tier.rate}</span>
                <span className="text-sm font-serif text-muted-foreground">/hr</span>
              </div>
              
              <ul className="space-y-5 mb-12">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-base font-serif text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mr-4 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button className="w-full h-14 rounded-full font-sans font-bold text-base group-hover:scale-[1.02] transition-transform">
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