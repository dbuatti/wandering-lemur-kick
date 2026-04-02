import Navbar from "@/components/Navbar";
import TicketList from "@/components/ticketing/TicketList";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Shield, Ticket, ArrowRight, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import EmailProcessor from "@/components/ticketing/EmailProcessor";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Tickets = () => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <div className="w-full">
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
                
                <div className="flex items-center gap-4">
                  <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-14 px-8 rounded-2xl border-primary/30 bg-primary/5 text-primary font-bold hover:bg-primary/10 group">
                        <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" /> AI Email Processor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] bg-card border-white/10 text-white rounded-[2.5rem] p-8 overflow-hidden flex flex-col max-h-[90vh]">
                      <DialogHeader className="mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Mail className="h-6 w-6" />
                          </div>
                          <div>
                            <DialogTitle className="text-2xl font-bold">AI Email Processor</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Analyze email chains to update or create tickets automatically.
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="overflow-y-auto pr-2 custom-scrollbar">
                        <EmailProcessor onComplete={() => {
                          setIsEmailDialogOpen(false);
                          queryClient.invalidateQueries({ queryKey: ['tickets'] });
                        }} />
                      </div>
                    </DialogContent>
                  </Dialog>

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