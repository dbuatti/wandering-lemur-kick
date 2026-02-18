import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import ContactDialog from "./ContactDialog";
import BookingDialog from "./BookingDialog";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-64 lg:pb-48 overflow-hidden">
      <div className="container px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 lg:mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Melbourne, Australia
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-bold text-white mb-8 lg:mb-12 leading-[1] lg:leading-[0.9] tracking-tighter">
            Personal <br className="hidden sm:block" />
            <span className="text-primary">IT Support.</span>
          </h1>
          
          <p className="text-lg lg:text-2xl text-muted-foreground mb-12 lg:with-16 font-light leading-relaxed max-w-2xl mx-auto px-4">
            Professional security and seamless Apple ecosystems for individuals and small businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center px-4">
            <BookingDialog>
              <Button className="h-14 lg:h-16 px-8 lg:px-12 rounded-full bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-sm font-bold">
                Book a Consultation <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
            </BookingDialog>
            
            <ContactDialog>
              <Button 
                variant="outline" 
                className="h-14 lg:h-16 px-8 lg:px-12 rounded-full border-white/20 hover:bg-white hover:text-black transition-all duration-300 text-sm font-bold"
              >
                <Mail className="mr-3 h-4 w-4" /> Send Enquiry
              </Button>
            </ContactDialog>
          </div>
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[800px] h-[300px] lg:h-[800px] bg-primary/10 rounded-full blur-[80px] lg:blur-[120px] -z-10"></div>
    </section>
  );
};

export default Hero;