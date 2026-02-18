import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceTiers = () => {
  const tiers = [
    {
      id: "01",
      name: "System Reset",
      description: "A calm, structured session to restore clarity and performance to your digital life.",
      rate: "$110",
      bestFor: "Creatives who want clarity without overwhelm.",
      features: ["iCloud Cleanups", "Digital De-cluttering", "File Reorganisation", "Performance Tuning"]
    },
    {
      id: "02",
      name: "Workflow Architecture",
      description: "For those who want their digital systems to match the level of their professional output.",
      rate: "$140",
      bestFor: "Business owners and high-impact professionals.",
      features: ["Workflow Optimisation", "Security Hardening", "Profile Separation", "Privacy Audits"]
    },
    {
      id: "03",
      name: "Deep Repair & Recovery",
      description: "When something has failed—and needs precise, careful, and high-trust intervention.",
      rate: "$160",
      bestFor: "Critical hardware or data recovery needs.",
      features: ["Hardware Diagnostics", "Component Replacement", "Data Recovery", "Custom System Builds"]
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
              <p className="text-sm text-secondary font-bold mb-4 italic">Best for: {tier.bestFor}</p>
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
              <Button className="w-full rounded-full py-6">Book This Tier</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTiers;