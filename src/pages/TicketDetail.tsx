"use client";

import Navbar from "@/components/Navbar";
import TicketComments from "@/components/Ticketing/TicketComments";
import TicketTimeLog from "@/components/Ticketing/TicketTimeLog";
import TicketAIAnalysis from "@/components/Ticketing/TicketAIAnalysis";
import Footer from "@/components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Hash,
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTicket = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`*`)
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

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-ticket-comments', {
        body: { ticket_id: id }
      });
      if (!error) setComments(data.data || []);
    } catch (e) {
      console.error("Error fetching comments for AI context:", e);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
      fetchComments();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.functions.invoke('update-ticket-status', {
        body: {
          ticket_id: id,
          status: newStatus
        }
      });

      if (error) throw error;

      showSuccess(`Ticket marked as ${newStatus.replace('_', ' ')}`);
      fetchTicket();
    } catch (error) {
      console.error("Error updating status:", error);
      showError("Failed to update ticket status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTicket = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.functions.invoke('delete-ticket', {
        body: { ticket_id: id }
      });

      if (error) throw error;

      showSuccess("Ticket deleted successfully");
      navigate('/tickets');
    } catch (error) {
      console.error("Error deleting ticket:", error);
      showError("Failed to delete ticket");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignToMe = async () => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('tickets')
        .update({ assigned_to: user.id, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      showSuccess("Ticket assigned to you");
      fetchTicket();
    } catch (error) {
      console.error("Error assigning ticket:", error);
      showError("Failed to assign ticket");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Loading ticket details...</p>
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
          <div className="text-center max-w-md px-6">
            <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ticket Not Found</h2>
            <p className="text-muted-foreground mb-8">The ticket you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/tickets')} className="rounded-full px-8">
              Back to Tickets
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const priorityColors = {
    low: "bg-slate-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  };

  const statusColors = {
    open: "bg-blue-500",
    in_progress: "bg-purple-500",
    pending: "bg-slate-500",
    resolved: "bg-green-500",
    closed: "bg-slate-700"
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <div className="w-full">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/tickets')}
                className="text-muted-foreground hover:text-white -ml-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tickets
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Ticket
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-white/10 text-white rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This action cannot be undone. This will permanently delete the ticket and all associated activity logs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteTicket}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                    >
                      Delete Ticket
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-primary uppercase tracking-[0.3em] flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      Ticket {ticket.ticket_number || ticket.id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {ticket.category}
                    </Badge>
                    <Badge className={`${priorityColors[ticket.priority]} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={`${statusColors[ticket.status]} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{ticket.title}</h1>
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Description</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                </div>

                <TicketComments ticketId={ticket.id} />
              </div>

              <div className="lg:col-span-4 space-y-8">
                <TicketAIAnalysis ticket={ticket} comments={comments} />

                <TicketTimeLog 
                  ticketId={ticket.id}
                  currentActualHours={ticket.actual_hours}
                  estimatedHours={ticket.estimated_hours}
                  onUpdate={fetchTicket}
                />

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                  <h3 className="text-xl font-bold mb-6">Client Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Name</p>
                        <p className="font-medium">{ticket.client_display_name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                        <p className="font-medium truncate max-w-[200px]">{ticket.client_email || 'N/A'}</p>
                      </div>
                    </div>
                    {ticket.client_phone && (
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                          <p className="font-medium">{ticket.client_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                  <h3 className="text-xl font-bold mb-6">Actions</h3>
                  <div className="space-y-4">
                    {ticket.status !== 'resolved' && (
                      <Button 
                        onClick={() => handleStatusUpdate('resolved')}
                        disabled={isUpdating}
                        className="w-full h-12 rounded-xl bg-green-600 text-white hover:bg-green-700 font-bold"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved
                      </Button>
                    )}
                    {ticket.status !== 'closed' && (
                      <Button 
                        onClick={() => handleStatusUpdate('closed')}
                        disabled={isUpdating}
                        variant="outline"
                        className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold"
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Close Ticket
                      </Button>
                    )}
                    {!ticket.assigned_to && (
                      <Button 
                        onClick={handleAssignToMe}
                        disabled={isUpdating}
                        variant="secondary"
                        className="w-full h-12 rounded-xl font-bold"
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Assign to Me
                      </Button>
                    )}
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