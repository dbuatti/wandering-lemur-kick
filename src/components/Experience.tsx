import { ShieldCheck, Apple, Zap } from "lucide-react";

const Experience = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Corporate Security",
      description: "Former IT Site Manager for Multi-Office Accounting Firms. I bring institutional-grade security to your personal devices."
    },
    {
      icon: <Apple className="h-8 w-8" />,
      title: "Apple Specialist",
      description: "Certified expertise in the Apple ecosystem. Seamlessly syncing your iPhone, Mac, and iPad for peak performance."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Efficiency Consulting",
      description: "I don't just fix tech; I optimize your life. Learn to use your tools to save 5+ hours of work every week."
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-sans font-extrabold mb-6 leading-tight">The Digital Handshake</h2>
            <p className="text-xl text-muted-foreground font-serif leading-relaxed">
              Projecting authority, security, and personal trust through years of high-end experience.
            </p>
          </div>
          <div className="hidden lg:block h-px flex-grow mx-12 bg-border/50 mb-6"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group p-10 rounded-[2rem] bg-background border border-transparent hover:border-primary/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
              <div className="mb-8 p-4 bg-primary/5 rounded-2xl inline-block text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-sans font-bold mb-4 group-hover:translate-x-1 transition-transform duration-300">{feature.title}</h3>
              <p className="text-muted-foreground font-serif leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;