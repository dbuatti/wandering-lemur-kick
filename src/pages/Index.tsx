import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServiceTiers from "@/components/ServiceTiers";
import Specialties from "@/components/Specialties";
import AboutMe from "@/components/AboutMe";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
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
        <Testimonials />
        <div id="tiers">
          <ServiceTiers />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;