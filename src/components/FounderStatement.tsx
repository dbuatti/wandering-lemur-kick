"use client";

const FounderStatement = () => {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-8">Founder Statement</div>
              <div className="space-y-8 text-xl lg:text-2xl text-white font-light leading-relaxed">
                <p>
                  I built this service because I saw how much creative energy gets lost to digital chaos.
                </p>
                <p>
                  In performance environments, technology must disappear. It should support the work — not distract from it.
                </p>
                <p>
                  My approach combines systems thinking, discretion, and creative empathy. I don’t just fix devices. I design calm digital environments.
                </p>
              </div>
              
              <div className="mt-16 flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center font-bold text-white text-xl">
                  DB
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Daniele Buatti</div>
                  <div className="text-sm text-muted-foreground">Digital Architect & Specialist</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <div className="p-10 lg:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 relative">
                <div className="absolute -top-4 -left-4 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Specialist Positioning
                </div>
                <h3 className="text-xl font-bold mb-8 text-primary">The MD / IT Bridge</h3>
                <div className="space-y-6 text-sm text-muted-foreground leading-relaxed font-light">
                  <p>
                    As a Musical Director, I work in environments where failure is not an option. A corrupted file, a mistimed cue, or a broken sync can derail an entire rehearsal.
                  </p>
                  <p>
                    That same precision informs my approach to technology. I design digital systems that are stable, secure, and built for performance environments.
                  </p>
                  <p>
                    I understand the psychology of creative work — and how digital friction disrupts it. My role is to architect digital clarity so you can operate at your highest level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStatement;