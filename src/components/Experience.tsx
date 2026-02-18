import { ShieldCheck, Apple, Zap } from "lucide-react";

const Experience = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-secondary" />,
      title: "Corporate Security",
      description: "Former IT Site Manager for Multi-Office Accounting Firms. I bring institutional-grade security to your personal devices."
    },
    {
      icon: <Apple className="h-10 w-10 text-secondary" />,
      title: "Apple Specialist",
      description: "Certified expertise in the Apple ecosystem. Seamlessly syncing your iPhone, Mac, and iPad for peak performance."
    },
    {
      icon: <Zap className="h-10 w-10 text-secondary" />,
      title: "Efficiency Consulting",
      description: "I don't just fix tech; I optimize your life. Learn to use your tools to save 5+ hours of work every week."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-4">The Digital Handshake</h2>
          <p className="text-lg text-muted-foreground font-serif">
            Projecting authority, security, and personal trust through years of high-end experience.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl bg-background border border-border/50 hover:border-secondary/30 transition-colors group">
              <div className="mb-6 p-3 bg-secondary/5 rounded-xl inline-block group-hover:bg-secondary/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-sans font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground font-serif leading-relaxed">
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