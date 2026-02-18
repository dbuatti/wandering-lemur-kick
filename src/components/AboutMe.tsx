const AboutMe = () => {
  return (
    <section className="section-padding bg-background overflow-hidden relative">
      <div className="container px-6 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-7">
              <div className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-6">My Philosophy</div>
              <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
                Technology should be a <span className="italic font-light text-muted-foreground">lever</span>, not a friction point.
              </h2>
              <div className="space-y-6 text-lg lg:text-xl text-muted-foreground font-light leading-relaxed">
                <p>
                  With over 6 years of experience as an IT Site Manager and Apple Specialist, I've seen how technology can either empower your craft or drain your energy.
                </p>
                <p>
                  I don't just fix devices; I partner with you to build a digital environment that supports your lifestyle. Whether you're a creative professional in Toorak or a boutique business owner in Parkdale, I bring the same level of care and precision to your personal tech.
                </p>
              </div>
              
              <div className="mt-12 flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl inline-flex">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center font-black text-background text-xl shadow-lg shadow-primary/20">
                  DB
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Daniele Buatti</div>
                  <div className="text-sm text-muted-foreground italic">Your Private IT Director</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl"></div>
                <div className="relative bg-card p-10 lg:p-12 rounded-[2.5rem] border border-border shadow-xl">
                  <h3 className="text-2xl font-bold mb-10 text-white">Why Work With Me</h3>
                  <ul className="space-y-10">
                    {[
                      { title: "Holistic Expertise", desc: "Security, efficiency, and hardware diagnostics in one place." },
                      { title: "Results-Focused", desc: "Leave every session feeling more confident and capable." },
                      { title: "Local & Personal", desc: "Based in Melbourne, providing on-site or remote support." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-6">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-2 text-white">{item.title}</h4>
                          <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;