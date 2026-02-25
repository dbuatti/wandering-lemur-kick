"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, MessageSquare, MoreHorizontal, ChevronRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  ticket: {
    id: string;
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
    low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  const statusColors = {
    open: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    in_progress: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    resolved: "bg-green-500/10 text-green-400 border-green-500/20",
    closed: "bg-slate-700/10 text-slate-500 border-slate-700/20"
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

  if (viewMode === 'list') {
    return (
      <div 
        className="group flex items-center gap-6 p-4 bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] rounded-2xl transition-all cursor-pointer"
        onClick={() => navigate(`/tickets/${ticket.id}`)}
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
          {ticket.client_display_name?.charAt(0) || 'T'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold truncate group-hover:text-primary transition-colors">{ticket.title}</h3>
            <Badge variant="outline" className={cn("text-[9px] uppercase tracking-widest font-bold px-2 py-0", statusColors[ticket.status])}>
              {ticket.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3 w-3" /> {ticket.client_display_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> {format(new Date(ticket.created_at), 'MMM d')}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Badge variant="outline" className={cn("text-[9px] uppercase tracking-widest font-bold px-2 py-0", priorityColors[ticket.priority])}>
            {ticket.priority}
          </Badge>
          <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold px-2 py-0 bg-white/5 border-white/10 text-muted-foreground">
            {ticket.category}
          </Badge>
        </div>

        <div className="flex-shrink-0">
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    );
  }

  return (
    <Card 
      className="bg-white/[0.02] border-white/10 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer group relative overflow-hidden rounded-[2rem]"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <div className={cn("absolute top-0 left-0 w-full h-1", ticket.priority === 'urgent' ? 'bg-red-500' : 'bg-transparent')} />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full", statusColors[ticket.status])}>
            {ticket.status.replace('_', ' ')}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full", priorityColors[ticket.priority])}>
              {ticket.priority}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {ticket.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-light leading-relaxed">
          {ticket.description}
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                {ticket.client_display_name?.charAt(0)}
              </div>
              <span className="font-medium text-white/80">{ticket.client_display_name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{format(new Date(ticket.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-2">
              {ticket.tags && ticket.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[10px] text-muted-foreground flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
              {ticket.tags && ticket.tags.length > 2 && (
                <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                  +{ticket.tags.length - 2}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary hover:bg-primary/10 rounded-xl font-bold text-xs">
              View Details <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;