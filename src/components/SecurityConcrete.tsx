"use client";

import { CheckCircle2 } from "lucide-react";

const SecurityConcrete = () => {
  const deliverables = [
    "Password manager setup and data migration",
    "Two-factor authentication for all major accounts",
    "Review of leaked data and account exposure",
    "Google and Apple account security review",
    "Verification of device encryption",
    "Backup setup (local and encrypted cloud)",
    "Account recovery plan (so you are never locked out)"
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container px-6 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Security & Privacy</div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                Professional security for your <span className="text-primary">personal life.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light mb-10 leading-relaxed">
                I use the same security methods as large businesses to protect your personal accounts, data, and identity.
              </p>
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
                <p className="text-lg font-medium text-white italic">
                  "I apply high-level security principles to your personal digital life."
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 p-10 lg:p-12 rounded-[2.5rem] border border-white/10">
              <h3 className="text-xl font-bold mb-8">Privacy & Security Audit Includes:</h3>
              <ul className="space-y-6">
                {deliverables.map((item, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityConcrete;