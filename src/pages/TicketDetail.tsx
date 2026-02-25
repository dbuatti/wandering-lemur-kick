"use client";

import Navbar from "@/components/Navbar";
import TicketComments from "@/components/Ticketing/TicketComments";
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
  MessageSquare,
  AlertCircle,
  BarChart3
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTicket = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          client:client_id (
            id,
            display_name,
            email,
            phone,
            type
          )
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

  useEffect(() => {
    if (id) {
      fetchTicket();
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

  const handleAssignToMe = async () => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('tickets')
        .update({ 
          assigned_to: user.id, 
          updated_at: new Date().toISOString() 
        })
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

  const priorityConfig = {
    low: { color: "bg-slate-500", label: "Low Priority", textColor: "text-slate-400" },
    medium: { color: "bg-yellow-500", label: "Medium Priority", textColor: "text-yellow-400" },
    high: { color: "bg-orange-500", label: "High Priority", textColor: "text-orange-400" },
    urgent: { color: "bg-red-500", label: "Urgent", textColor: "text-red-400" }
  };

  const statusConfig = {
    open: { 
      color: "bg-blue-500", 
      label: "Open", 
      textColor: "text-blue-400",
      icon: AlertCircle
    },
    in_progress: { 
      color: "bg-purple-500", 
      label: "In Progress", 
      textColor: "text-purple-400",
      icon: Clock
    },
    pending: { 
      color: "bg-slate-500", 
      label: "Pending", 
      textColor: "text-slate-400",
      icon: Clock
    },
    resolved: { 
      color: "bg-green-500", 
      label: "Resolved", 
      textColor: "text-green-400",
      icon: CheckCircle2
    },
    closed: { 
      color: "bg-slate-700", 
      label: "Closed", 
      textColor: "text-slate-400",
      icon: XCircle
    }
  };

  const categoryConfig = {
    security: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Security" },
    setup: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Setup" },
    optimization: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Optimization" },
    recovery: { color: "bg-orange-500/10 text-orange-400 border-orange-500/20", label: "Recovery" },
    other: { color: "bg-slate-500/10 text-slate-400 border-slate-500/20", label: "Other" }
  };

  const daysOpen = Math.ceil((Date.now() - new Date(ticket.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const isStale = daysOpen > 7 && ticket.status !== 'resolved' && ticket.status !== 'closed';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb / Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/tickets')}
              className="mb-8 text-muted-foreground hover:text-white -ml-4 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to Tickets
            </Button>

            <div className="grid lg:grid-cols-12 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-8">
                {/* Ticket Header */}
                <div className="bg-white/5 p-8 lg:p-10 rounded-[2.5rem] border border-white/10">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 text-primary">
                      <Hash className="h-4 w-4" />
                      <span className="text-sm font-bold uppercase tracking-widest">
                        Ticket #{ticket.ticket_number || ticket.id.slice(0, 8)}
                      </span>
                    </div>
                    {isStale && (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px] uppercase tracking-widest font-bold">
                        {daysOpen} days open
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                    {ticket.title}
                  </h1>

                  <div className="flex flex-wrap gap-3 mb-8">
                    <Badge 
                      variant="outline" 
                      className={`${categoryConfig[ticket.category].color} text-[10px] uppercase tracking-widest font-bold px-3 py-1.5`}
                    >
                      {categoryConfig[ticket.category].label}
                    </Badge>
                    <Badge 
                      className={`${priorityConfig[ticket.priority].color} text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5`}
                    >
                      {priorityConfig[ticket.priority].label}
                    </Badge>
                    <Badge 
                      className={`${statusConfig[ticket.status].color} text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5`}
                    >
                      {statusConfig[ticket.status].label}
                    </Badge>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>
                </div>

                {/* Activity Timeline */}
                <TicketComments ticketId={ticket.id} />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* Client Card */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Client Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Name</p>
                      <p className="font-medium text-lg">{ticket.client?.display_name || ticket.client_display_name || 'Unknown'}</p>
                      {ticket.client?.type && (
                        <Badge variant="outline" className="mt-2 text-[10px] uppercase tracking-widest">
                          {ticket.client.type}
                        </Badge>
                      )}
                    </div>
                    
                    {ticket.client?.email && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email</p>
                        <a 
                          href={`mailto:${ticket.client.email}`}
                          className="font-medium text-primary hover:underline flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          {ticket.client.email}
                        </a>
                      </div>
                    )}
                    
                    {ticket.client?.phone && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Phone</p>
                        <a 
                          href={`tel:${ticket.client.phone}`}
                          className="font-medium flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4 text-primary" />
                          {ticket.client.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ticket Details Card */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Ticket Details
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Created</p>
                        <p className="font-medium">{format(new Date(ticket.created_at), 'PPP')}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Last Updated</p>
                        <p className="font-medium">{format(new Date(ticket.updated_at), 'PPP')}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {ticket.estimated_hours && (
                      <div className="flex items-start gap-4">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Estimated Hours</p>
                          <p className="font-medium">{ticket.estimated_hours}h</p>
                        </div>
                      </div>
                    )}

                    {ticket.actual_hours && (
                      <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Actual Hours</p>
                          <p className="font-medium">{ticket.actual_hours}h</p>
                        </div>
                      </div>
                    )}

                    {ticket.tags && ticket.tags.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {ticket.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-white/5 text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Card */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    {ticket.status !== 'resolved' && (
                      <Button 
                        onClick={() => handleStatusUpdate('resolved')}
                        disabled={isUpdating}
                        className="w-full h-12 rounded-xl bg-green-600 text-white hover:bg-green-700 font-bold"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Resolved
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

                    {ticket.assigned_to && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                        <p className="text-sm text-primary font-medium">
                          Assigned to you
                        </p>
                      </div>
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