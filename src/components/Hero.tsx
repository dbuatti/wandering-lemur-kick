import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase bg-primary/5 text-primary mb-8 border border-primary/10">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
              Melbourne, Australia
            </div>
            <h1 className="text-6xl lg:text-8xl font-sans font-extrabold text-primary mb-8 leading-[0.95] tracking-tighter">
              The Private <br />
              <span className="text-muted-foreground/40 italic font-serif font-light">IT Director.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 font-serif leading-relaxed max-w-xl">
              I help high-impact individuals master their digital world through institutional-grade security and seamless Apple ecosystems.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button size="lg" className="h-14 px-10 rounded-full text-base font-sans font-bold shadow-xl shadow-primary/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
                Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="lg" className="h-14 px-10 rounded-full text-base font-sans font-bold hover:bg-primary/5">
                <Mail className="mr-2 h-4 w-4" /> Make an Enquiry
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full lg:w-auto">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:ml-auto group">
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden border-[12px] border-white shadow-2xl shadow-primary/5">
                <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground font-serif italic p-12 text-center text-lg">
                  [ Daniele's Professional Headshot ]
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="text-3xl font-sans font-black text-primary leading-none">6+</div>
                <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground mt-1">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.02] to-transparent -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Hero;