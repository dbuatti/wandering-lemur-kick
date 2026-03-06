"use client";

import Navbar from "@/components/Navbar";
import TicketComments from "@/components/ticketing/TicketComments";
import TicketTimeLog from "@/components/ticketing/TicketTimeLog";
import TicketAIAnalysis from "@/components/ticketing/TicketAIAnalysis";
import Footer from "@/components/Footer";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  AlertTriangle,
  Copy,
  ChevronRight,
  MoreVertical,
  PlayCircle,
  FileText
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  const handleGenerateInvoice = async () => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true });
      const invoiceNumber = `INV-${String((count || 0) + 1).padStart(4, '0')}`;
      
      const rate = ticket.priority === 'urgent' ? 150 : 130;
      const hours = ticket.actual_hours || 1;
      const subtotal = hours * rate;
      const tax = subtotal * 0.1;
      
      const { data: invoice, error } = await supabase.from('invoices').insert([{
        number: invoiceNumber,
        client_id: ticket.client_id,
        client_display_name: ticket.client_display_name,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        type: 'IT Support', // Using existing 'type' column instead of 'is_it_invoice'
        line_items: [{
          description: `IT Support: ${ticket.title} (#${ticket.ticket_number})`,
          quantity: hours,
          unit_price: rate,
          tax_rate: 10
        }],
        untaxed_amount: subtotal,
        total_amount: subtotal + tax,
        owner_user_id: user?.id
      }]).select().single();

      if (error) throw error;

      await supabase.from('tickets').update({ related_invoice_id: invoice.id }).eq('id', id);
      
      showSuccess("Invoice generated successfully");
      navigate(`/invoices/${invoice.id}`);
    } catch (e) {
      console.error(e);
      showError("Failed to generate invoice");
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

  const copyTicketId = () => {
    const idToCopy = ticket.ticket_number?.toString() || ticket.id;
    navigator.clipboard.writeText(idToCopy);
    showSuccess("Ticket ID copied to clipboard");
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <div className="w-full">
            {/* Breadcrumbs & Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div className="space-y-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/tickets">Tickets</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-primary font-bold">
                        #{ticket.ticket_number || ticket.id.slice(0, 8)}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/tickets')}
                    className="text-muted-foreground hover:text-white -ml-2 h-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <div className="h-4 w-px bg-white/10" />
                  <button 
                    onClick={copyTicketId}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy className="h-3 w-3" /> Copy ID
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {ticket.status === 'resolved' && !ticket.related_invoice_id && (
                  <Button onClick={handleGenerateInvoice} disabled={isUpdating} className="rounded-xl bg-primary text-white font-bold h-11 px-6">
                    <FileText className="mr-2 h-4 w-4" /> Generate Invoice
                  </Button>
                )}
                {ticket.related_invoice_id && (
                  <Button variant="outline" onClick={() => navigate(`/invoices/${ticket.related_invoice_id}`)} className="rounded-xl border-primary/30 text-primary h-11 px-6">
                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 h-11 px-6 font-bold">
                      Status: {ticket.status.replace('_', ' ')} <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-white/10 text-white w-48">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={() => handleStatusUpdate('open')} className="focus:bg-primary/10">Open</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate('in_progress')} className="focus:bg-primary/10">In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate('pending')} className="focus:bg-primary/10">Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate('resolved')} className="focus:bg-primary/10 text-green-400">Resolved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate('closed')} className="focus:bg-primary/10 text-muted-foreground">Closed</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-white/10 text-white rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        Delete Ticket?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This will permanently remove this ticket and all its history. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteTicket}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                      >
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <div className="mb-12">
                  <div className="flex flex-wrap gap-3 mb-8">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {ticket.category}
                    </Badge>
                    <Badge className={`${priorityColors[ticket.priority]} text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                      {ticket.priority} Priority
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight tracking-tighter">{ticket.title}</h1>
                  
                  <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">
                      <PlayCircle className="h-4 w-4" /> Issue Overview
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap font-light">
                      {ticket.description}
                    </p>
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

                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-8">Client Profile</h3>
                    <div className="space-y-8">
                      <Link to={`/clients/${ticket.client_id}`} className="flex items-start gap-4 group">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                          <User className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Name</p>
                          <p className="font-bold text-lg group-hover:text-primary transition-colors truncate">{ticket.client_display_name || 'Unknown'}</p>
                        </div>
                      </Link>
                      
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                          <p className="font-medium truncate text-muted-foreground">{ticket.client_email || 'N/A'}</p>
                        </div>
                      </div>

                      {ticket.client_phone && (
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                            <Phone className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                            <p className="font-medium text-muted-foreground">{ticket.client_phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-10 pt-8 border-t border-white/5">
                      <Button 
                        variant="outline" 
                        className="w-full rounded-xl border-white/10 hover:bg-white/5 h-11 font-bold"
                        onClick={() => navigate(`/clients/${ticket.client_id}`)}
                      >
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                  <h3 className="text-xl font-bold mb-8">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {ticket.status !== 'resolved' && (
                      <Button 
                        onClick={() => handleStatusUpdate('resolved')}
                        disabled={isUpdating}
                        className="w-full h-14 rounded-2xl bg-green-600 text-white hover:bg-green-700 font-bold shadow-lg shadow-green-600/10"
                      >
                        <CheckCircle2 className="mr-2 h-5 w-5" /> Mark Resolved
                      </Button>
                    )}
                    {!ticket.assigned_to && (
                      <Button 
                        onClick={() => {}}
                        disabled={isUpdating}
                        variant="secondary"
                        className="w-full h-14 rounded-2xl font-bold"
                      >
                        <UserPlus className="mr-2 h-5 w-5" /> Assign to Me
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 font-bold"
                      onClick={() => window.print()}
                    >
                      <Hash className="mr-2 h-5 w-5" /> Print Ticket
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