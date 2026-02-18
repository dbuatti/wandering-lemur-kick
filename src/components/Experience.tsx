import { ShieldCheck, Apple, Zap } from "lucide-react";

const Experience = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Corporate Security",
      description: "Institutional-grade security protocols adapted for the private individual."
    },
    {
      icon: <Apple className="h-6 w-6" />,
      title: "Apple Specialist",
      description: "Certified expertise in creating a frictionless, unified Apple ecosystem."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Efficiency Consulting",
      description: "Optimizing digital workflows to reclaim hours of your professional week."
    }
  ];

  return (
    <section className="section-padding bg-white border-y border-border">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-24">
          <div className="lg:col-span-5">
            <h2 className="text-4xl lg:text-6xl font-serif font-light leading-tight">
              The Digital <br /><span className="italic text-secondary">Handshake.</span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-xl text-muted-foreground font-sans font-light leading-relaxed">
              I bridge the gap between professional business systems and a user-friendly personal life, projecting authority and trust through years of high-end experience.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 border-t border-border">
          {features.map((feature, index) => (
            <div key={index} className="p-12 lg:p-16 border-r last:border-r-0 border-border hover:bg-accent/20 transition-colors duration-500 group">
              <div className="mb-10 text-secondary group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-serif font-medium mb-6">{feature.title}</h3>
              <p className="text-muted-foreground font-sans font-light leading-relaxed">
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