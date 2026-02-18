import { ShieldCheck, Apple, Zap } from "lucide-react";

const Experience = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      title: "Security & Privacy",
      description: "Professional security protocols adapted for personal and private use."
    },
    {
      icon: <Apple className="h-7 w-7" />,
      title: "Apple Specialist",
      description: "Expertise in creating a reliable and unified Apple ecosystem."
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Workflow Support",
      description: "Improving digital workflows to save time and reduce frustration."
    }
  ];

  return (
    <section className="section-padding bg-black border-y border-white/5">
      <div className="container px-6 mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-24">
          <div className="lg:col-span-6">
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
              Reliable <br /><span className="text-primary">IT Support.</span>
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              I help bridge the gap between complex business systems and your personal digital life, providing clear and practical support.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-10 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/[0.07] transition-all duration-500 group">
              <div className="mb-8 text-primary group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
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