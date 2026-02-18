import { CheckCircle2 } from "lucide-react";

const Specialties = () => {
  const specialties = [
    {
      title: "Separating Work & Personal",
      description: "Avoiding the '2-laptop' trap via MacOS User Profiles and secure containers."
    },
    {
      title: "Privacy Audits",
      description: "Ensuring your photos, emails, and bank data are truly private and encrypted."
    },
    {
      title: "Digital De-cluttering",
      description: "Organizing 10+ years of digital mess into a clean, searchable, and backed-up system."
    }
  ];

  return (
    <section className="py-24 bg-card border-y border-white/5">
      <div className="container px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Specialized Solutions</h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              I solve the "Tech Gap"—the space between professional business systems and a user-friendly home/mobile life.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {specialties.map((item, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-500">
                <CheckCircle2 className="h-8 w-8 text-primary mb-6" />
                <h4 className="text-xl font-bold mb-4 text-white">{item.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialties;