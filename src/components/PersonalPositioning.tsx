import { Brain, Shield, Sparkles } from "lucide-react";

const PersonalPositioning = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-8">Why Work With Me?</h2>
            <div className="space-y-6 text-lg text-muted-foreground font-serif leading-relaxed">
              <p>
                I’m not a generic IT contractor. I’ve worked as an IT Site Manager in multi-office accounting firms, managing security, infrastructure, and compliance at an institutional level.
              </p>
              <p>
                <span className="text-primary font-bold">I’m also a working creative.</span>
              </p>
              <p>
                That means I understand both the rigid requirements of data protection and the fluid, often chaotic way creative professionals actually think and work. My approach is structured, discreet, and calm.
              </p>
              <p>
                I don’t overwhelm you with jargon. I design systems you can actually maintain.
              </p>
            </div>
          </div>
          
          <div className="bg-background p-10 rounded-3xl border border-border/50">
            <h3 className="text-2xl font-sans font-bold mb-8 flex items-center gap-3">
              <Sparkles className="text-secondary h-6 w-6" />
              The Creative Advantage
            </h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-lg mb-1">Optimizing for Flow</h4>
                  <p className="text-muted-foreground font-serif">Most IT pros optimize for control. I optimize for flow, ensuring your systems support thinking and output, not just compliance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-lg mb-1">Nervous-System Aware</h4>
                  <p className="text-muted-foreground font-serif">I understand digital overwhelm. My goal is to reduce friction and eliminate the cognitive load of "tech mess."</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-border/50">
              <ul className="grid grid-cols-2 gap-4 text-sm font-sans font-bold text-primary">
                <li className="flex items-center gap-2">• Reduce Friction</li>
                <li className="flex items-center gap-2">• Increase Security</li>
                <li className="flex items-center gap-2">• Save 5–10 Hours/Week</li>
                <li className="flex items-center gap-2">• Eliminate Stress</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalPositioning;