import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import ServiceTiers from "@/components/ServiceTiers";
import Specialties from "@/components/Specialties";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Experience />
        <Specialties />
        <ServiceTiers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;