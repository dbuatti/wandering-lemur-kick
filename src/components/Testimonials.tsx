import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Daniele's clear, direct, and thoughtful communication is truly exceptional. He transformed my digital mess into a streamlined system.",
      author: "Melissa",
      role: "Creative Professional"
    },
    {
      quote: "I used to dread tech updates. Now, I have a partner who ensures everything just works. The peace of mind is worth every cent.",
      author: "Queenie",
      role: "Boutique Business Owner"
    }
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-4xl lg:text-5xl font-sans font-extrabold mb-6">Client Feedback</h2>
          <p className="text-xl text-muted-foreground font-serif">
            Stories from the home office and the studio.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="relative group">
              <div className="absolute -top-6 -left-6 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
                <Quote size={120} strokeWidth={1} />
              </div>
              <div className="relative p-12 lg:p-16 rounded-[3rem] bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500">
                <p className="text-2xl lg:text-3xl font-serif italic text-primary mb-12 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center font-sans font-bold text-primary">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="text-lg font-sans font-bold text-primary">{t.author}</div>
                    <div className="text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/5 to-transparent -z-10"></div>
    </section>
  );
};

export default Testimonials;