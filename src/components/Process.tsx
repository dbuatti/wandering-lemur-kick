import { Search, Settings, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingDialog from "./BookingDialog";

const Process = () => {
  const steps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Initial Audit",
      description: "A review of your current hardware, software, and security to find areas for improvement."
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Practical Plan",
      description: "I create a plan that fits your specific needs and daily routine."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Setup",
      description: "Hands-on setup and training to make sure everything works correctly from the start."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Support",
      description: "Ongoing help for troubleshooting, updates, and security monitoring."
    }
  ];

  return (
    <section className="section-padding bg-black/20" aria-labelledby="process-heading">
      <div className="container px-6 mx-auto">
        <div className="max-w-3xl mb-20">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">How It Works</div>
          <h2 id="process-heading" className="text-4xl lg:text-6xl font-bold mb-6">From chaos to <span className="text-primary">calm.</span></h2>
          <p className="text-xl text-muted-foreground font-light">
            A straightforward approach to getting your technology organised and secure. It starts with a conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="mb-8 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {step.icon}
              </div>
              <div className="absolute top-7 left-14 right-0 h-px bg-white/5 hidden lg:block -z-10"></div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <BookingDialog>
            <Button className="h-14 px-10 rounded-full text-sm font-bold hover:scale-105 transition-all duration-300">
              Book a Consultation <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
          </BookingDialog>
        </div>
      </div>
    </section>
  );
};

export default Process;