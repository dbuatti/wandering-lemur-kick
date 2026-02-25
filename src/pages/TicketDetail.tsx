"use client";

import Navbar from "@/components/Navbar";
import TicketComments from "@/components/Ticketing/TicketComments";
import TicketTimeLog from "@/components/Ticketing/TicketTimeLog";
import TicketAIAnalysis from "@/components/Ticketing/TicketAIAnalysis";
import Footer from "@/components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const { data: ticket, isLoading, refetch } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(`*`)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('delete-ticket', {
        body: { ticket_id: id }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Ticket deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      navigate('/tickets');
    },
    onError: (error: any) => {
      console.error("Error deleting ticket:", error);
      showError("Failed to delete ticket. Check database permissions.");
    }
  });

  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase.functions.invoke('update-ticket-status', {
        body: { ticket_id: id, status: newStatus }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Status updated");
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      refetch();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
            <h2 className="text-3xl font-bold mb-4">Ticket Not Found</h2>
            <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const priorityColors: any = {
    low: "bg-slate-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  };

  const statusColors: any = {
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
              <Button variant="ghost" onClick={() => navigate('/tickets')} className="text-muted-foreground hover:text-white -ml-4">
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
                      This action cannot be undone. This will permanently delete the ticket.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteMutation.mutate()}
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
                    <Badge className={`${priorityColors[ticket.priority]} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={`${statusColors[ticket.status]} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{ticket.title}</h1>
                  <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                </div>

                <TicketComments ticketId={ticket.id} />
              </div>

              <div className="lg:col-span-4 space-y-8">
                <TicketAIAnalysis ticket={ticket} comments={[]} />

                <TicketTimeLog 
                  ticketId={ticket.id}
                  currentActualHours={ticket.actual_hours}
                  estimatedHours={ticket.estimated_hours}
                  onUpdate={refetch}
                />

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                  <h3 className="text-xl font-bold mb-6">Actions</h3>
                  <div className="space-y-4">
                    {ticket.status !== 'resolved' && (
                      <Button 
                        onClick={() => statusMutation.mutate('resolved')}
                        disabled={statusMutation.isPending}
                        className="w-full h-12 rounded-xl bg-green-600 text-white font-bold"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved
                      </Button>
                    )}
                    {ticket.status !== 'closed' && (
                      <Button 
                        onClick={() => statusMutation.mutate('closed')}
                        disabled={statusMutation.isPending}
                        variant="outline"
                        className="w-full h-12 rounded-xl border-white/10 font-bold"
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Close Ticket
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

import { Loader2 } from "lucide-react";
export default TicketDetail;