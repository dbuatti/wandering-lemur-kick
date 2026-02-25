"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, MessageSquare, MoreHorizontal, Hash } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TicketCardProps {
  ticket: {
    id: string;
    ticket_number?: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
    category: 'security' | 'setup' | 'optimization' | 'recovery' | 'other';
    created_at: string;
    updated_at: string;
    client_display_name: string;
    owner_user_id: string;
    assigned_to: string | null;
    estimated_hours: number | null;
    actual_hours: number | null;
    tags: string[];
  };
  viewMode?: 'grid' | 'list';
  onStatusChange: (ticketId: string, status: string) => void;
  onAssign: (ticketId: string, userId: string | null) => void;
}

const TicketCard = ({ ticket, viewMode = 'grid', onStatusChange, onAssign }: TicketCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

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

  const categoryLabels = {
    security: "Security",
    setup: "Setup",
    optimization: "Optimization",
    recovery: "Recovery",
    other: "Other"
  };

  const handleStatusChange = async (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    try {
      setIsAssigning(true);
      const { error } = await supabase.functions.invoke('update-ticket-status', {
        body: {
          ticket_id: ticket.id,
          status: newStatus
        }
      });

      if (error) throw error;

      onStatusChange(ticket.id, newStatus);
      toast({
        title: "Ticket updated",
        description: `Status changed to ${newStatus.replace('_', ' ')}`,
      });
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssign = async (e: React.MouseEvent, userId: string | null) => {
    e.stopPropagation();
    try {
      setIsAssigning(true);
      const { error } = await supabase.functions.invoke('update-ticket-status', {
        body: {
          ticket_id: ticket.id,
          status: ticket.status,
          assigned_to: userId
        }
      });

      if (error) throw error;

      onAssign(ticket.id, userId);
      toast({
        title: "Ticket assigned",
        description: userId ? "Ticket assigned successfully" : "Ticket unassigned",
      });
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast({
        title: "Error",
        description: "Failed to assign ticket",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card 
      className="bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest flex items-center">
              <Hash className="h-3 w-3 mr-0.5" />
              {ticket.ticket_number || ticket.id.slice(0, 8)}
            </span>
          </div>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{ticket.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ticket.description}</p>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-white/10 bg-card p-1 shadow-2xl">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => handleStatusChange(e, 'in_progress')}
                  disabled={ticket.status === 'in_progress'}
                >
                  Start Work
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => handleStatusChange(e, 'resolved')}
                  disabled={ticket.status === 'resolved'}
                >
                  Mark Resolved
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => handleStatusChange(e, 'closed')}
                  disabled={ticket.status === 'closed'}
                >
                  Close Ticket
                </button>
                <div className="border-t border-white/10 my-1"></div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => handleAssign(e, ticket.assigned_to ? null : 'current_user')}
                  disabled={isAssigning}
                >
                  {ticket.assigned_to ? 'Unassign' : 'Assign to Me'}
                </button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase tracking-wider font-bold">
            {categoryLabels[ticket.category]}
          </Badge>
          <Badge className={`${priorityColors[ticket.priority]} text-white text-[10px] uppercase tracking-wider font-bold`}>
            {ticket.priority}
          </Badge>
          <Badge className={`${statusColors[ticket.status]} text-white text-[10px] uppercase tracking-wider font-bold`}>
            {ticket.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2 text-primary/60" />
            <span className="truncate">{ticket.client_display_name || 'Unknown Client'}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary/60" />
            {format(new Date(ticket.created_at), 'MMM d')}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex -space-x-2">
            {ticket.tags && ticket.tags.slice(0, 3).map((tag, index) => (
              <div key={index} className="h-6 px-2 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center text-muted-foreground">
                #{tag}
              </div>
            ))}
            {ticket.tags && ticket.tags.length > 3 && (
              <div className="h-6 px-2 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center text-muted-foreground">
                +{ticket.tags.length - 3}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 h-8 px-2"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;