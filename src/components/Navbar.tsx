"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, Search, User, LogOut, Settings, Ticket, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BookingDialog from "./BookingDialog";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = session ? [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Tickets", href: "/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "Clients", href: "/clients", icon: <Users className="h-4 w-4" /> },
  ] : [
    { name: "Security", href: "/#security" },
    { name: "Clean Sweep", href: "/#clean-sweep" },
    { name: "Tiers", href: "/#tiers" },
  ];

  const openCommandMenu = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      ctrlKey: true,
      bubbles: true
    });
    document.dispatchEvent(event);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4 bg-black/80 backdrop-blur-lg border-b border-white/10" : "py-6 lg:py-8 bg-transparent"}`}>
      <div className="container px-6 mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg lg:text-xl font-bold tracking-tighter group">
          DANIELE <span className="text-primary group-hover:text-white transition-colors">BUATTI</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`nav-link flex items-center gap-2 ${location.pathname === link.href ? 'text-primary' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          
          {!session ? (
            <BookingDialog>
              <Button className="rounded-full px-6 h-10 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                Book Now
              </Button>
            </BookingDialog>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={openCommandMenu}
                title="Search (⌘K)"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-white/10 text-white w-56 rounded-2xl p-2" align="end">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Daniele Buatti</span>
                      <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-xl focus:bg-primary/10 cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/tickets')} className="rounded-xl focus:bg-primary/10 cursor-pointer">
                    <Ticket className="mr-2 h-4 w-4" /> My Tickets
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => signOut()} className="rounded-xl focus:bg-red-500/10 text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                    <div className="space-y-4">
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
                      <Button 
                        variant="ghost" 
                        className="w-full rounded-2xl h-14 text-sm font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          setIsOpen(false);
                          signOut();
                        }}
                      >
                        Sign Out
                      </Button>
                    </div>
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