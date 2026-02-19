"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Testimonials = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container px-6 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl lg:text-5xl font-bold tracking-tight mb-12 leading-tight">
            "Genuinely thoughtful professional who is easy to talk to, easy to quickly build trust with and critical to have in your corner."
          </blockquote>
          
          <div className="flex flex-col items-center">
            <Avatar className="w-20 h-20 mb-4 border-4 border-primary/10">
              <AvatarImage src="https://i.pravatar.cc/150?u=leisa" />
              <AvatarFallback>LB</AvatarFallback>
            </Avatar>
            <div className="font-bold text-lg">Leisa</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Creative Director</div>
          </div>

          <div className="flex justify-center gap-2 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-foreground' : 'bg-muted'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;