import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-10">
            <div className="h-px w-12 bg-secondary"></div>
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-secondary">
              Melbourne, Australia
            </span>
            <div className="h-px w-12 bg-secondary"></div>
          </div>
          
          <h1 className="text-7xl lg:text-[10rem] font-serif font-light text-primary mb-12 leading-[0.85] tracking-tighter">
            The Private <br />
            <span className="italic text-secondary/80">IT Director.</span>
          </h1>
          
          <p className="text-xl lg:text-3xl text-muted-foreground mb-16 font-sans font-light leading-relaxed max-w-2xl mx-auto">
            Institutional-grade security and seamless Apple ecosystems for high-impact individuals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button className="h-16 px-12 rounded-none bg-primary text-primary-foreground hover:bg-secondary transition-colors duration-500 text-xs font-bold uppercase tracking-widest">
              Book Consultation <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
            <Button variant="ghost" className="h-16 px-12 rounded-none border border-primary/10 hover:border-primary text-xs font-bold uppercase tracking-widest">
              <Mail className="mr-3 h-4 w-4" /> Make Enquiry
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-accent/10 -z-10"></div>
    </section>
  );
};

export default Hero;