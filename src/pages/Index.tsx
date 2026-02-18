import Hero from "@/components/Hero";
import PersonalPositioning from "@/components/PersonalPositioning";
import WhoIWorkWith from "@/components/WhoIWorkWith";
import ServiceTiers from "@/components/ServiceTiers";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <PersonalPositioning />
        <WhoIWorkWith />
        <ServiceTiers />
      </main>
      <Footer />
    </div>
  );
};

export default Index;