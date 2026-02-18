import { UserCheck, Zap, Lock, Layout } from "lucide-react";

const WhoIWorkWith = () => {
  const problems = [
    {
      icon: <Layout className="h-6 w-6" />,
      title: "The '2-Laptop' Trap",
      description: "Separating work and personal life without carrying two devices, using secure MacOS profiles."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Privacy Paranoia",
      description: "Ensuring your photos, emails, and bank data are truly private and encrypted."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Digital De-cluttering",
      description: "Organizing years of digital mess into a clean, searchable, and backed-up system."
    }
  ];

  return (
    <section className="py-24 bg-secondary text-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-6">Who I Work With</h2>
          <p className="text-xl text-white/80 font-serif leading-relaxed">
            I partner with high-net-worth individuals, creative professionals, and boutique business owners who value their time and mental clarity over "saving a few bucks" on generic IT.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="mb-6 text-white/60">{item.icon}</div>
              <h3 className="text-xl font-sans font-bold mb-3">{item.title}</h3>
              <p className="text-white/70 font-serif leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIWorkWith;