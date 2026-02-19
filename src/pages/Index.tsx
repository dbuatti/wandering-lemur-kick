import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InteractiveVisual from "@/components/InteractiveVisual";
import SecurityConcrete from "@/components/SecurityConcrete";
import DigitalCleanSweep from "@/components/DigitalCleanSweep";
import Testimonials from "@/components/Testimonials";
import ServiceTiers from "@/components/ServiceTiers";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <InteractiveVisual />
        
        <div id="security">
          <SecurityConcrete />
        </div>
        
        <Testimonials />
        
        <div id="clean-sweep">
          <DigitalCleanSweep />
        </div>
        
        <div id="tiers">
          <ServiceTiers />
        </div>
        
        <FAQ />
        
        <section id="contact" className="section-padding bg-muted/30">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">START A <br /><span className="text-primary">CONVERSATION</span></h2>
                <p className="text-xl text-muted-foreground font-medium">
                  I typically respond to new enquiries within 24 hours.
                </p>
              </div>
              <div className="bg-white p-8 lg:p-12 rounded-[3rem] card-shadow">
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