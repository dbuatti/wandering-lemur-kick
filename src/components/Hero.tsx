import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-secondary mr-2"></span>
              Melbourne's Personal Technology Partner
            </div>
            <h1 className="text-5xl lg:text-6xl font-sans font-extrabold text-primary mb-6 leading-tight">
              I help high-impact people <span className="text-secondary">master their digital world.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 font-serif leading-relaxed">
              You focus on your craft; I'll handle the complexity. From institutional-grade security to seamless Apple ecosystems, I provide the tech leadership you need to stay focused.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                Book a Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
                <Mail className="mr-2 h-5 w-5" /> Make an Enquiry
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              {/* Placeholder for Daniele's professional headshot */}
              <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground font-serif italic p-8 text-center">
                [ Daniele's Professional Headshot ]
              </div>
              <div className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg">
                <Mail className="h-6 w-6" />
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;