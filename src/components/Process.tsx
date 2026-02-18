import { Search, Settings, Shield, Zap } from "lucide-react";

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
    <section className="section-padding bg-black/20">
      <div className="container px-6 mx-auto">
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">The <span className="text-primary">Process.</span></h2>
          <p className="text-xl text-muted-foreground font-light">
            A straightforward approach to getting your technology organised and secure.
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
      </div>
    </section>
  );
};

export default Process;