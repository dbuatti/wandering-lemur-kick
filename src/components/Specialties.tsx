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
    <section className="py-24 bg-secondary text-white">
      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-6">Specialized Solutions</h2>
            <p className="text-xl text-white/80 font-serif mb-10 leading-relaxed">
              I solve the "Tech Gap"—the space between professional business systems and a user-friendly home/mobile life.
            </p>
            <div className="space-y-8">
              {specialties.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-sans font-bold mb-1">{item.title}</h4>
                    <p className="text-white/70 font-serif">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-sans font-extrabold mb-4">6+</div>
                <div className="text-xl font-serif text-white/80">Years of High-End Experience</div>
                <div className="mt-8 flex justify-center gap-4 opacity-50 grayscale invert">
                  {/* Placeholder for logos like Monash, etc. */}
                  <div className="h-8 w-24 bg-white/20 rounded"></div>
                  <div className="h-8 w-24 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialties;