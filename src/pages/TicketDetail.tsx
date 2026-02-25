import Navbar from "@/components/Navbar";
import TicketCard from "@/components/Ticketing/TicketCard";
import TicketComments from "@/components/Ticketing/TicketComments";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            clients:client_id (display_name, email, phone),
            owner:owner_user_id (email),
            assigned:assigned_to (email)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setTicket(data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        showError("Failed to load ticket details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading ticket...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ticket not found</h2>
            <p className="text-muted-foreground mb-6">The ticket you're looking for doesn't exist or you don't have access to it.</p>
            <a href="/tickets" className="text-primary hover:text-primary/80 underline">Back to Tickets</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-6 py-12 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{ticket.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {ticket.category}
                </Badge>
                <Badge className={`bg-${ticket.priority === 'urgent' ? 'red' : ticket.priority === 'high' ? 'orange' : ticket.priority === 'medium' ? 'yellow' : 'gray'}-500 text-white`}>
                  {ticket.priority}
                </Badge>
                <Badge className={`bg-${ticket.status === 'resolved' ? 'green' : ticket.status === 'closed' ? 'gray' : ticket.status === 'in_progress' ? 'purple' : ticket.status === 'pending' ? 'gray' : 'blue'}-500 text-white`}>
                  {ticket.status}
                </Badge>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 mb-8">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
                  
                  {ticket.internal_notes && (
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h3 className="font-bold text-blue-400 mb-2">Internal Notes</h3>
                      <p className="text-blue-200">{ticket.internal_notes}</p>
                    </div>
                  )}
                </div>

                <TicketComments ticketId={ticket.id} />
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="font-bold mb-4">Ticket Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Client:</span>
                      <p className="font-medium">{ticket.client_display_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{ticket.client_email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{ticket.client_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{new Date(ticket.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated:</span>
                      <p className="font-medium">{new Date(ticket.updated_at).toLocaleDateString()}</p>
                    </div>
                    {ticket.estimated_hours && (
                      <div>
                        <span className="text-muted-foreground">Est. Hours:</span>
                        <p className="font-medium">{ticket.estimated_hours}h</p>
                      </div>
                    )}
                    {ticket.actual_hours && (
                      <div>
                        <span className="text-muted-foreground">Actual Hours:</span>
                        <p className="font-medium">{ticket.actual_hours}h</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Owner:</span>
                      <p className="font-medium">{ticket.owner?.email || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Assigned To:</span>
                      <p className="font-medium">{ticket.assigned?.email || 'Unassigned'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="font-bold mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full h-10 bg-primary text-white hover:bg-primary/90">
                      Mark as Resolved
                    </Button>
                    <Button className="w-full h-10 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Close Ticket
                    </Button>
                    <Button className="w-full h-10 bg-transparent border border-white/20 text-white hover:bg-white/10">
                      Assign to Me
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TicketDetail;