"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import BookingDialog from "./BookingDialog";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = session ? [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tickets", href: "/tickets" },
    { name: "Clients", href: "/clients" },
  ] : [
    { name: "Security", href: "/#security" },
    { name: "Clean Sweep", href: "/#clean-sweep" },
    { name: "Tiers", href: "/#tiers" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4 bg-black/80 backdrop-blur-lg border-b border-white/10" : "py-6 lg:py-8 bg-transparent"}`}>
      <div className="container px-6 mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg lg:text-xl font-bold tracking-tighter">
          DANIELE <span className="text-primary">BUATTI</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`nav-link ${location.pathname === link.href ? 'text-primary' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          {!session ? (
            <BookingDialog>
              <Button className="rounded-full px-6 h-10 text-xs font-bold uppercase tracking-widest">
                Book Now
              </Button>
            </BookingDialog>
          ) : (
            <Link to="/dashboard">
              <Button variant="outline" size="icon" className="rounded-full border-white/10">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-4">
          {!session && (
            <BookingDialog>
              <Button size="sm" className="rounded-full px-4 h-9 text-[10px] font-bold uppercase tracking-widest">
                Book
              </Button>
            </BookingDialog>
          )}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-white/10 text-white w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left mb-12">
                <SheetTitle className="text-white text-xl font-bold tracking-tighter">
                  DANIELE <span className="text-primary">BUATTI</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    className={`text-2xl font-bold hover:text-primary transition-colors ${location.pathname === link.href ? 'text-primary' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8 border-t border-white/10">
                  {!session ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">Ready to start?</p>
                      <BookingDialog>
                        <Button className="w-full rounded-2xl h-14 text-sm font-bold uppercase tracking-widest">
                          Book a Consultation
                        </Button>
                      </BookingDialog>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full rounded-2xl h-14 text-sm font-bold uppercase tracking-widest border-white/10"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/dashboard');
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;