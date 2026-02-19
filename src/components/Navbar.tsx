"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BookingDialog from "./BookingDialog";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Security", href: "#security" },
    { name: "Clean Sweep", href: "#clean-sweep" },
    { name: "Tiers", href: "#tiers" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4 bg-white/80 backdrop-blur-md border-b border-black/5" : "py-6 bg-transparent"}`}>
      <div className="container px-6 mx-auto flex justify-between items-center">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <span>DANIELE BUATTI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
          <BookingDialog>
            <Button className="rounded-full bg-secondary text-white hover:bg-secondary/90 px-6 font-bold text-xs uppercase tracking-widest">
              Get Started
            </Button>
          </BookingDialog>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-l border-black/5 w-[300px]">
              <SheetHeader className="text-left mb-12">
                <SheetTitle className="text-2xl font-black tracking-tighter">
                  DANIELE <span className="text-primary">BUATTI</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-xl font-black uppercase tracking-tighter hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <BookingDialog>
                  <Button className="w-full rounded-full h-14 bg-primary text-white font-bold uppercase tracking-widest">
                    Book Now
                  </Button>
                </BookingDialog>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;