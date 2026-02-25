"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, MoreHorizontal, Hash, Trash2, CheckCircle2, Link as LinkIcon, ExternalLink, PlayCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  onDelete?: (ticketId: string) => void;
}

const TicketCard = ({ ticket, viewMode = 'grid', onStatusChange, onAssign, onDelete }: TicketCardProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const priorityColors = {
    low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-500 border-red-500/20"
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
      setIsActionLoading(true);
      const { error } = await supabase.functions.invoke('update-ticket-status', {
        body: {
          ticket_id: ticket.id,
          status: newStatus
        }
      });

      if (error) throw error;

      onStatusChange(ticket.id, newStatus);
      showSuccess(`Status changed to ${newStatus.replace('_', ' ')}`);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      showError("Failed to update ticket status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    
    try {
      setIsActionLoading(true);
      const { error } = await supabase.functions.invoke('delete-ticket', {
        body: { ticket_id: ticket.id }
      });

      if (error) throw error;

      showSuccess("Ticket deleted");
      onDelete?.(ticket.id);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      showError("Failed to delete ticket");
    } finally {
      setIsActionLoading(false);
    }
  };

  const copyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = ticket.ticket_number?.toString() || ticket.id;
    navigator.clipboard.writeText(id);
    showSuccess("Ticket ID copied");
  };

  const timeProgress = ticket.estimated_hours && ticket.estimated_hours > 0 
    ? Math.min(((ticket.actual_hours || 0) / ticket.estimated_hours) * 100, 100) 
    : 0;

  return (
    <Card 
      className="bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <div className={cn("absolute top-0 left-0 w-1 h-full transition-colors", statusColors[ticket.status])} />
      
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={copyId}
              className="text-[10px] font-bold text-primary/60 uppercase tracking-widest flex items-center hover:text-primary transition-colors"
            >
              <Hash className="h-3 w-3 mr-0.5" />
              {ticket.ticket_number || ticket.id.slice(0, 8)}
            </button>
            {ticket.status === 'resolved' && (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            )}
          </div>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate pr-4">
            {ticket.title}
          </CardTitle>
        </div>
        <div className="relative flex items-center gap-1">
          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-green-500 hover:bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleStatusChange(e, 'resolved')}
              disabled={isActionLoading}
              title="Quick Resolve"
            >
              {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            </Button>
          )}
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
            <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-white/10 bg-card p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="py-1">
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}`); }}
                >
                  <ExternalLink className="h-3 w-3 mr-2" /> View Details
                </button>
                <div className="border-t border-white/10 my-1"></div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => handleStatusChange(e, 'in_progress')}
                  disabled={ticket.status === 'in_progress' || isActionLoading}
                >
                  Start Work
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                  onClick={(e) => handleStatusChange(e, 'resolved')}
                  disabled={ticket.status === 'resolved' || isActionLoading}
                >
                  Mark Resolved
                </button>
                <div className="border-t border-white/10 my-1"></div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                  onClick={handleDelete}
                  disabled={isActionLoading}
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
      
      <CardContent className="flex-grow flex flex-col">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5">
            {categoryLabels[ticket.category]}
          </Badge>
          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold px-2 py-0.5", priorityColors[ticket.priority])}>
            {ticket.priority}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow font-light">
          {ticket.description}
        </p>

        {ticket.estimated_hours && ticket.estimated_hours > 0 && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Time Progress</span>
              <span>{ticket.actual_hours || 0} / {ticket.estimated_hours}h</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  timeProgress >= 100 ? "bg-red-500" : "bg-primary"
                )}
                style={{ width: `${timeProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground min-w-0">
            <User className="h-3.5 w-3.5 mr-2 text-primary/60 flex-shrink-0" />
            <span className="truncate font-medium">{ticket.client_display_name || 'Unknown Client'}</span>
          </div>
          <div className="flex items-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold whitespace-nowrap ml-4">
            <Clock className="h-3 w-3 mr-1.5 text-primary/60" />
            {format(new Date(ticket.created_at), 'MMM d')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;