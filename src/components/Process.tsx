import { Search, Settings, Shield, Zap } from "lucide-react";

const Process = () => {
  const steps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Digital Audit",
      description: "A deep dive into your current hardware, software, and security posture to identify friction points."
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Tailored Strategy",
      description: "I design a custom ecosystem plan that aligns your professional needs with your personal lifestyle."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Implementation",
      description: "Hands-on setup, optimization, and training to ensure your new systems are seamless from day one."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Ongoing Support",
      description: "Priority access for troubleshooting, updates, and proactive security monitoring."
    }
  ];

  return (
    <section className="section-padding bg-black/20">
      <div className="container px-6 mx-auto">
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">The <span className="text-primary">Process.</span></h2>
          <p className="text-xl text-muted-foreground font-light">
            A structured approach to transforming your digital life from chaotic to concierge-managed.
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