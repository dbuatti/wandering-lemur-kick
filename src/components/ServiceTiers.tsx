"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tiers } from "@/content/services";
import BookingDialog from "./BookingDialog";

const ServiceTiers = () => {
  return (
    <section className="section-padding bg-black" aria-labelledby="tiers-heading">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Pricing</div>
            <h2 id="tiers-heading" className="text-5xl lg:text-7xl font-bold">Service Tiers</h2>
          </div>
          <p className="text-lg text-muted-foreground font-light max-w-xs">
            Simple hourly rates in AUD. On-site visits have a 1-hour minimum; remote support is booked in 30-minute blocks.
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

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 lg:p-10 rounded-[2rem] bg-primary/5 border border-primary/10">
          <p className="text-lg text-white font-light text-center sm:text-left">
            Not sure which tier fits? Book a consultation and I'll recommend one.
          </p>
          <BookingDialog>
            <Button className="h-12 px-8 rounded-full text-sm font-bold flex-shrink-0">Book a Consultation</Button>
          </BookingDialog>
        </div>
      </div>
    </section>
  );
};

export default ServiceTiers;