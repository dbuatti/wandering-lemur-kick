import { Mic2, Clapperboard, Building2, Home } from "lucide-react";

const audiences = [
  {
    icon: <Mic2 className="h-6 w-6" />,
    title: "Performers & creatives",
    desc: "Your scores, tracks, self-tapes and contacts organised, synced and backed up across your Mac, iPhone and iPad, and your accounts locked down.",
  },
  {
    icon: <Clapperboard className="h-6 w-6" />,
    title: "Directors, MDs & producers",
    desc: "Shared files that open on everyone's device, rehearsal tech that just works, and one calm person to call when something breaks.",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Production companies & arts schools",
    desc: "Staff devices, shared drives, email and websites set up properly, with security and backups you don't have to think about.",
  },
  {
    icon: <Home className="h-6 w-6" />,
    title: "Families & home offices",
    desc: "New devices set up, separate Apple IDs for the kids, parental controls, and a backup plan for the photos you can't replace.",
  },
];

const Audience = () => (
  <section className="section-padding bg-background" aria-labelledby="audience-heading">
    <div className="container px-6 mx-auto">
      <div className="max-w-3xl mb-16 lg:mb-20">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Who I Help</div>
        <h2 id="audience-heading" className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Built for people who work <span className="text-primary">to a deadline.</span>
        </h2>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
          I spend my working life in rehearsal rooms and theatres. I know what a crashed laptop means the night before tech week, and I set things up so it doesn't happen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {audiences.map((item) => (
          <div key={item.title} className="p-10 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all duration-500">
            <div className="mb-6 text-primary">{item.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Audience;
