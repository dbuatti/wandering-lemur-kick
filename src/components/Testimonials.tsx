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
    <section className="py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-4">Client Feedback</h2>
          <p className="text-lg text-muted-foreground font-serif">
            Stories from the home office and the studio.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-border shadow-sm relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-secondary/10" />
              <p className="text-xl font-serif italic text-primary mb-8 leading-relaxed">
                "{t.quote}"
              </p>
              <div>
                <div className="font-bold text-primary">{t.author}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;