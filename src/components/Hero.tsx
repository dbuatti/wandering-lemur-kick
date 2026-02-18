import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-secondary mr-2"></span>
            Melbourne's Premier Tech Concierge
          </div>
          <h1 className="text-5xl lg:text-7xl font-sans font-extrabold text-primary mb-6 leading-tight">
            Personal Technology Management for <span className="text-secondary">High-Impact People.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-10 font-serif leading-relaxed">
            Specialist IT support for creative professionals and boutique businesses. 
            Ex-Accounting Firm Site Manager & Apple Specialist. Based in Melbourne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              Book a Consultation <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
              View Services
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Hero;