import { CheckCircle2 } from "lucide-react";

const Specialties = () => {
  const specialties = [
    {
      title: "Separating Work & Personal",
      description: "Managing multiple roles without needing multiple devices through secure profiles."
    },
    {
      title: "Privacy Audits",
      description: "Ensuring your personal data, emails, and accounts are secure and encrypted."
    },
    {
      title: "Digital Organisation",
      description: "Sorting through digital clutter to create a clean, searchable, and backed-up system."
    }
  ];

  return (
    <section className="py-24 bg-secondary text-white">
      <div className="container px-6 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-6">Specialised Solutions</h2>
            <p className="text-xl text-white/80 font-serif mb-10 leading-relaxed">
              I focus on the practical side of technology—making sure your devices work for you, not against you.
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
            <div className="aspect-square rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-sans font-bold mb-4 text-white">Practical IT</div>
                <div className="text-xl font-serif text-white/80">Support for your home and office</div>
                <div className="mt-6 h-px w-24 bg-white/30 mx-auto"></div>
                <div className="mt-6 text-sm font-sans font-bold uppercase tracking-widest text-white/60">Melbourne Based</div>
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