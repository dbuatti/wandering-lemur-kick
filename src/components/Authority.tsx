"use client";

import { Shield, Clock, Users, MapPin, Music } from "lucide-react";

const Authority = () => {
  const signals = [
    {
      icon: <Clock className="h-5 w-5" />,
      text: "10+ years in high-pressure professional environments"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "Trusted by performers, directors & producers"
    },
    {
      icon: <Music className="h-5 w-5" />,
      text: "Background in both IT systems and creative production"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      text: "Melbourne-based, discreet & privacy-focused"
    }
  ];

  return (
    <section className="py-20 bg-black/40 border-y border-white/5">
      <div className="container px-6 mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold mb-2">Why Work With Me</h2>
            <p className="text-muted-foreground font-light">Systems operator for high-stakes environments.</p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {signals.map((signal, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-primary">{signal.icon}</div>
                  <span className="text-sm font-medium text-white/90">{signal.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Authority;