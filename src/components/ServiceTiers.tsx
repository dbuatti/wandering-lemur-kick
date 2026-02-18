import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceTiers = () => {
  const tiers = [
    {
      id: "01",
      name: "Tech Concierge",
      description: "Software 'How-to', iCloud cleanups, and performance tuning.",
      rate: "$100",
      features: ["iCloud Optimization", "Software Training", "Performance Tuning", "Email Setup"]
    },
    {
      id: "02",
      name: "Efficiency Partner",
      description: "Workflow audits, security hardening, and business profile separation.",
      rate: "$130",
      features: ["Workflow Audits", "Security Hardening", "Profile Separation", "Privacy Audits"]
    },
    {
      id: "03",
      name: "Hardware Surgery",
      description: "Deep-dive diagnostics, hardware repairs, and custom system builds.",
      rate: "$150",
      features: ["Hardware Diagnostics", "Component Repairs", "Custom Builds", "Data Recovery"]
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-4">Service Tiers</h2>
          <p className="text-lg text-muted-foreground font-serif">
            Transparent, premium rates for specialized expertise.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div key={tier.id} className="relative p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="text-sm font-bold text-secondary mb-4">TIER {tier.id}</div>
              <h3 className="text-2xl font-sans font-bold mb-2">{tier.name}</h3>
              <p className="text-muted-foreground font-serif mb-6 flex-grow">{tier.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-sans font-extrabold text-primary">{tier.rate}</span>
                <span className="text-muted-foreground font-serif">/hr</span>
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm font-serif">
                    <Check className="h-4 w-4 text-secondary mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full rounded-full py-6">Select Tier</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTiers;