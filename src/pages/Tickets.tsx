import Navbar from "@/components/Navbar";
import TicketList from "@/components/Ticketing/TicketList";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Shield, Ticket, ArrowRight } from "lucide-react";

const Tickets = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Secure Support Portal
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                    Service <span className="text-primary">Dashboard.</span>
                  </h1>
                  <p className="text-lg text-muted-foreground font-light max-w-2xl">
                    Manage your ongoing IT projects, security audits, and technical support requests in one centralized location.
                  </p>
                </div>
                
                <div className="hidden lg:flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Session</div>
                    <div className="text-sm font-medium">Daniele Buatti Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <TicketList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tickets;