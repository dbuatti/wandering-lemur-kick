import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-32">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center space-x-3 mb-10">
              <div className="h-px w-12 bg-secondary"></div>
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-secondary">
                Melbourne, Australia
              </span>
            </div>
            
            <h1 className="text-7xl lg:text-9xl font-serif font-light text-primary mb-10 leading-[0.85] tracking-tighter">
              The Private <br />
              <span className="italic text-secondary/80">IT Director.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-14 font-sans font-light leading-relaxed max-w-lg">
              Institutional-grade security and seamless Apple ecosystems for high-impact individuals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8">
              <Button className="h-16 px-12 rounded-none bg-primary text-primary-foreground hover:bg-secondary transition-colors duration-500 text-xs font-bold uppercase tracking-widest">
                Book Consultation <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="h-16 px-12 rounded-none border border-primary/10 hover:border-primary text-xs font-bold uppercase tracking-widest">
                <Mail className="mr-3 h-4 w-4" /> Make Enquiry
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full lg:w-auto">
            <div className="relative aspect-[3/4] max-w-sm mx-auto lg:ml-auto">
              <div className="absolute -inset-4 border border-secondary/20 translate-x-8 translate-y-8 -z-10"></div>
              <div className="relative h-full w-full overflow-hidden bg-muted grayscale hover:grayscale-0 transition-all duration-1000">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-serif italic p-12 text-center text-lg">
                  [ Daniele's Professional Headshot ]
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-2xl border border-border">
                <div className="text-4xl font-serif font-light text-secondary leading-none">06</div>
                <div className="text-[9px] font-sans font-black uppercase tracking-widest text-muted-foreground mt-3">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/30 -z-10"></div>
    </section>
  );
};

export default Hero;