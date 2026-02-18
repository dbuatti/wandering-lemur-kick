import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServiceTiers from "@/components/ServiceTiers";
import Specialties from "@/components/Specialties";
import AboutMe from "@/components/AboutMe";
import Footer from "@/components/Footer";

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
        <div id="specialties">
          <Specialties />
        </div>
        <div id="tiers">
          <ServiceTiers />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;