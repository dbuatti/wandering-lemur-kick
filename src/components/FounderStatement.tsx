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
                  I started this service because I saw how much time and energy is wasted on technical issues.
                </p>
                <p>
                  In professional environments, technology should be invisible. It should support your work, not distract from it.
                </p>
                <p>
                  My approach is logical and discreet. I don’t just fix devices; I organise your digital life so you can focus on what matters.
                </p>
              </div>
              
              <div className="mt-16 flex items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center font-bold text-white text-xl">
                  DB
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Daniele Buatti</div>
                  <div className="text-sm text-muted-foreground">Digital Specialist</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <div className="p-10 lg:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 relative">
                <div className="absolute -top-4 -left-4 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  My Background
                </div>
                <h3 className="text-xl font-bold mb-8 text-primary">The MD / IT Bridge</h3>
                <div className="space-y-6 text-sm text-muted-foreground leading-relaxed font-light">
                  <p>
                    As a Musical Director, I work in environments where things have to work perfectly. A broken file or a sync issue can stop a whole rehearsal.
                  </p>
                  <p>
                    I bring that same level of care to your technology. I set up systems that are stable, secure, and easy to use.
                  </p>
                  <p>
                    I understand how frustrating technical issues can be when you're trying to be creative. My job is to clear that away so you can work at your best.
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