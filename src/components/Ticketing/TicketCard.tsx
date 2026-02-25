"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  User, 
  MessageSquare, 
  MoreHorizontal, 
  Hash,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
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

  const priorityConfig = {
    low: { color: "bg-slate-500", label: "Low", icon: AlertCircle },
    medium: { color: "bg-yellow-500", label: "Medium", icon: Clock },
    high: { color: "bg-orange-500", label: "High", icon: AlertCircle },
    urgent: { color: "bg-red-500", label: "Urgent", icon: AlertCircle }
  };

  const statusConfig = {
    open: { color: "bg-blue-500", label: "Open" },
    in_progress: { color: "bg-purple-500", label: "In Progress" },
    pending: { color: "bg-slate-500", label: "Pending" },
    resolved: { color: "bg-green-500", label: "Resolved" },
    closed: { color: "bg-slate-700", label: "Closed" }
  };

  const categoryConfig = {
    security: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Security" },
    setup: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Setup" },
    optimization: { color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Optimization" },
    recovery: { color: "bg-orange-500/10 text-orange-400 border-orange-500/20", label: "Recovery" },
    other: { color: "bg-slate-500/10 text-slate-400 border-slate-500/20", label: "Other" }
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

  const getDaysOpen = () => {
    const created = new Date(ticket.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysOpen = getDaysOpen();
  const isStale = daysOpen > 7 && ticket.status !== 'resolved' && ticket.status !== 'closed';

  return (
    <Card 
      className="bg-white/5 border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 relative">
        {/* Status indicator bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${statusConfig[ticket.status].color}`} />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.1em] flex items-center gap-1">
              <Hash className="h-3 w-3" />
              #{ticket.ticket_number || ticket.id.slice(0, 8)}
            </span>
            {isStale && (
              <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[9px] uppercase tracking-widest">
                {daysOpen} days open
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {ticket.title}
          </CardTitle>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-20 w-56 rounded-xl border border-white/10 bg-card p-2 shadow-2xl">
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Change Status
                </div>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                      ticket.status === key 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-white/5'
                    }`}
                    onClick={(e) => handleStatusChange(e, key)}
                    disabled={ticket.status === key}
                  >
                    <div className={`h-2 w-2 rounded-full ${config.color}`} />
                    {config.label}
                  </button>
                ))}
                
                <div className="border-t border-white/10 my-1" />
                
                <button
                  className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    ticket.assigned_to 
                      ? 'bg-white/5 hover:bg-white/10' 
                      : 'hover:bg-white/5'
                  }`}
                  onClick={(e) => handleAssign(e, ticket.assigned_to ? null : 'current_user')}
                  disabled={isAssigning}
                >
                  <User className="h-4 w-4" />
                  {ticket.assigned_to ? 'Unassign from Me' : 'Assign to Me'}
                </button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
          {ticket.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge 
            variant="outline" 
            className={`${categoryConfig[ticket.category].color} text-[10px] uppercase tracking-wider font-bold px-2.5 py-1`}
          >
            {categoryConfig[ticket.category].label}
          </Badge>
          <Badge 
            className={`${priorityConfig[ticket.priority].color} text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1`}
          >
            {priorityConfig[ticket.priority].label}
          </Badge>
          <Badge 
            className={`${statusConfig[ticket.status].color} text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1`}
          >
            {statusConfig[ticket.status].label}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{ticket.client_display_name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(ticket.created_at), 'MMM d')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {ticket.assigned_to ? (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {ticket.assigned_to ? 'Assigned' : 'Unassigned'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex gap-1">
                {ticket.tags.slice(0, 2).map((tag, index) => (
                  <div key={index} className="h-5 px-2 rounded-full bg-white/5 border border-white/10 text-[9px] flex items-center text-muted-foreground">
                    #{tag}
                  </div>
                ))}
                {ticket.tags.length > 2 && (
                  <div className="h-5 px-2 rounded-full bg-white/5 border border-white/10 text-[9px] flex items-center text-muted-foreground">
                    +{ticket.tags.length - 2}
                  </div>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-primary hover:text-primary/80 hover:bg-primary/5 text-xs font-bold"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;