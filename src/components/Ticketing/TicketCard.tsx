"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, MessageSquare, MoreHorizontal, Hash, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TicketCardProps {
  ticket: any;
  viewMode?: 'grid' | 'list';
  onStatusChange?: (ticketId: string, status: string) => void;
  onAssign?: (ticketId: string, userId: string | null) => void;
  onDelete?: (ticketId: string) => void;
}

const TicketCard = ({ ticket, viewMode = 'grid', onStatusChange, onAssign, onDelete }: TicketCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke('delete-ticket', {
        body: { ticket_id: ticket.id }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Ticket deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      onDelete?.(ticket.id);
      setIsMenuOpen(false);
    },
    onError: (error: any) => {
      console.error("Error deleting ticket:", error);
      showError("Failed to delete ticket. Check database permissions.");
    }
  });

  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase.functions.invoke('update-ticket-status', {
        body: { ticket_id: ticket.id, status: newStatus }
      });
      if (error) throw error;
      return newStatus;
    },
    onSuccess: (newStatus) => {
      showSuccess(`Status changed to ${newStatus.replace('_', ' ')}`);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      onStatusChange?.(ticket.id, newStatus);
      setIsMenuOpen(false);
    }
  });

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this ticket?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <Card 
      className="bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${statusColors[ticket.status]}`} />
      
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest flex items-center">
              <Hash className="h-3 w-3 mr-0.5" />
              {ticket.ticket_number || ticket.id.slice(0, 8)}
            </span>
          </div>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{ticket.title}</CardTitle>
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
                  onClick={(e) => { e.stopPropagation(); statusMutation.mutate('in_progress'); }}
                  disabled={statusMutation.isPending}
                >
                  Start Work
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => { e.stopPropagation(); statusMutation.mutate('resolved'); }}
                  disabled={statusMutation.isPending}
                >
                  Mark Resolved
                </button>
                <div className="border-t border-white/10 my-1"></div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <div className="flex items-center">
                    <Trash2 className="h-3 w-3 mr-2" /> Delete
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={`${priorityColors[ticket.priority]} text-white text-[10px] uppercase tracking-wider font-bold`}>
            {ticket.priority}
          </Badge>
          <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 text-[10px] uppercase tracking-wider font-bold">
            {ticket.status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2 text-primary/60" />
            <span className="truncate">{ticket.client_display_name || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-primary/60" />
            {format(new Date(ticket.created_at), 'MMM d')}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {ticket.actual_hours > 0 && (
              <div className="flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Clock className="h-3 w-3 mr-1 text-primary" />
                {ticket.actual_hours}h
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-8 px-2">
            <MessageSquare className="h-4 w-4 mr-1" /> Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;