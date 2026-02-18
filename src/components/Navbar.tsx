import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4 bg-black/80 backdrop-blur-lg border-b border-white/10" : "py-8 bg-transparent"}`}>
      <div className="container px-6 mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter">
          DANIELE <span className="text-primary">BUATTI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-10">
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#specialties" className="nav-link">Specialties</a>
          <a href="#tiers" className="nav-link">Investment</a>
          <Button className="rounded-full px-6 h-10 text-xs font-bold uppercase tracking-widest">
            Book Now
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;