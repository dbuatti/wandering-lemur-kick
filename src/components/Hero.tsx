import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48 overflow-hidden">
      <div className="container px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Melbourne, Australia
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-[9rem] font-bold text-white mb-12 leading-[0.9] tracking-tighter">
            The Private <br />
            <span className="text-primary">IT Director.</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-16 font-light leading-relaxed max-w-2xl mx-auto">
            Institutional-grade security and seamless Apple ecosystems for high-impact individuals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="h-16 px-12 rounded-full bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-sm font-bold">
              Book Consultation <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-16 px-12 rounded-full border-white/10 hover:bg-white/5 text-sm font-bold">
              <Mail className="mr-3 h-4 w-4" /> Make Enquiry
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
    </section>
  );
};

export default Hero;