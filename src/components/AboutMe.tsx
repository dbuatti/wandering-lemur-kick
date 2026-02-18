const AboutMe = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-6">My Approach</h2>
              <p className="text-lg text-muted-foreground font-serif leading-relaxed mb-6">
                With over 6 years of experience as an IT Site Manager and Apple Specialist, I've seen how technology can either be a powerful lever or a constant source of friction.
              </p>
              <p className="text-lg text-muted-foreground font-serif leading-relaxed mb-8">
                I don't just fix devices; I partner with you to build a digital environment that supports your lifestyle. Whether you're a creative professional in Toorak or a boutique business owner in Parkdale, I bring the same level of care and precision to your personal tech as I did for multi-office accounting firms.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center font-sans font-bold text-secondary">
                  DB
                </div>
                <div>
                  <div className="font-bold text-primary">Daniele Buatti</div>
                  <div className="text-sm text-muted-foreground">Your Private IT Director</div>
                </div>
              </div>
            </div>
            <div className="bg-background p-8 rounded-3xl border border-border">
              <h3 className="text-xl font-sans font-bold mb-6">Why Work With Me</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  </div>
                  <p className="font-serif text-muted-foreground">
                    <strong className="text-primary block mb-1">Holistic Expertise</strong>
                    Security, efficiency, and hardware diagnostics in one place.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  </div>
                  <p className="font-serif text-muted-foreground">
                    <strong className="text-primary block mb-1">Results-Focused</strong>
                    Leave every session feeling more confident and capable.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  </div>
                  <p className="font-serif text-muted-foreground">
                    <strong className="text-primary block mb-1">Local & Personal</strong>
                    Based in Melbourne, providing on-site or remote support.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;