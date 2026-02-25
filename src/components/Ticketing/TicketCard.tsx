"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Tag, AlertCircle, CheckCircle2, ArrowRight, MessageSquare, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  onStatusChange: (ticketId: string, status: string) => void;
  onAssign: (ticketId: string, userId: string | null) => void;
}

const TicketCard = ({ ticket, onStatusChange, onAssign }: TicketCardProps) => {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const priorityColors = {
    low: "bg-gray-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  };

  const statusColors = {
    open: "bg-blue-500",
    in_progress: "bg-purple-500",
    pending: "bg-gray-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500"
  };

  const categoryLabels = {
    security: "Security",
    setup: "Setup",
    optimization: "Optimization",
    recovery: "Recovery",
    other: "Other"
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsAssigning(true);
      const { data, error } = await supabase.functions.invoke('update-ticket-status', {
        body: {
          ticket_id: ticket.id,
          status: newStatus
        }
      });

      if (error) throw error;

      onStatusChange(ticket.id, newStatus);
      toast({
        title: "Ticket updated",
        description: `Status changed to ${newStatus}`,
      });
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

  const handleAssign = async (userId: string | null) => {
    try {
      setIsAssigning(true);
      const { data, error } = await supabase.functions.invoke('update-ticket-status', {
        body: {
          ticket_id: ticket.id,
          status: ticket.status,
          actual_hours: ticket.actual_hours
        }
      });

      if (error) throw error;

      onAssign(ticket.id, userId);
      toast({
        title: "Ticket assigned",
        description: userId ? "Ticket assigned to you" : "Ticket unassigned",
      });
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
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg font-bold line-clamp-2">{ticket.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-10 w-48 rounded-md border bg-popover p-1 shadow-lg">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => handleStatusChange('in_progress')}
                  disabled={ticket.status === 'in_progress'}
                >
                  {ticket.status === 'in_progress' ? 'In Progress' : 'Start Work'}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => handleStatusChange('pending')}
                  disabled={ticket.status === 'pending'}
                >
                  {ticket.status === 'pending' ? 'Pending' : 'Mark Pending'}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => handleStatusChange('resolved')}
                  disabled={ticket.status === 'resolved'}
                >
                  {ticket.status === 'resolved' ? 'Resolved' : 'Mark Resolved'}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => handleStatusChange('closed')}
                  disabled={ticket.status === 'closed'}
                >
                  {ticket.status === 'closed' ? 'Closed' : 'Close Ticket'}
                </button>
                <div className="border-t my-1"></div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => handleAssign(ticket.assigned_to ? null : 'me')}
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
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {categoryLabels[ticket.category]}
          </Badge>
          <Badge className={`${priorityColors[ticket.priority]} text-white`}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </Badge>
          <Badge className={`${statusColors[ticket.status]} text-white`}>
            {ticket.status.replace('_', ' ').toUpperCase()}
          </Badge>
          {ticket.tags && ticket.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            {ticket.client_display_name || 'Unknown Client'}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Created: {format(new Date(ticket.created_at), 'MMM d, yyyy')}
          </div>
          {ticket.estimated_hours && (
            <div className="flex items-center text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              Est. {ticket.estimated_hours}h
            </div>
          )}
          {ticket.actual_hours && (
            <div className="flex items-center text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Actual: {ticket.actual_hours}h
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            View Comments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;