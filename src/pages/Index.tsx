import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Authority from "@/components/Authority";
import SecurityConcrete from "@/components/SecurityConcrete";
import DigitalCleanSweep from "@/components/DigitalCleanSweep";
import ServiceTiers from "@/components/ServiceTiers";
import FounderStatement from "@/components/FounderStatement";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/EnquiryForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Authority />
        
        <div id="security">
          <SecurityConcrete />
        </div>
        
        <div id="clean-sweep">
          <DigitalCleanSweep />
        </div>
        
        <div id="tiers">
          <ServiceTiers />
        </div>
        
        <FounderStatement />
        
        <FAQ />
        
        <section id="contact" className="section-padding bg-black/50">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">Start a <span className="text-primary">Conversation.</span></h2>
                <p className="text-xl text-muted-foreground font-light">
                  I typically respond to new enquiries within 24 hours.
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