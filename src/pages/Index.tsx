import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServiceTiers from "@/components/ServiceTiers";
import Specialties from "@/components/Specialties";
import AboutMe from "@/components/AboutMe";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Experience />
        <AboutMe />
        <Specialties />
        <Testimonials />
        <ServiceTiers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;