import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServiceTiers from "@/components/ServiceTiers";
import Specialties from "@/components/Specialties";
import AboutMe from "@/components/AboutMe";
import Process from "@/components/Process";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div id="experience">
          <Experience />
        </div>
        <AboutMe />
        <Process />
        <div id="specialties">
          <Specialties />
        </div>
        <div id="tiers">
          <ServiceTiers />
        </div>
        <FAQ />
        
        {/* Dedicated Enquiry Section */}
        <section id="contact" className="section-padding bg-black/50">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">Need <span className="text-primary">Support?</span></h2>
                <p className="text-xl text-muted-foreground font-light">
                  Fill out the form below and I'll get back to you to discuss how I can help.
                </p>
              </div>
              <div className="bg-white/5 p-8 lg:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;