"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TicketCard from "./TicketCard";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface TicketListProps {
  initialFilter?: {
    status?: string;
    priority?: string;
    category?: string;
  };
}

const TicketList = ({ initialFilter }: TicketListProps) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    status: initialFilter?.status || '',
    priority: initialFilter?.priority || '',
    category: initialFilter?.category || '',
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTickets = async (reset = false) => {
    if (isFetching) return;
    
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-tickets', {
        body: {
          status: filter.status || undefined,
          priority: filter.priority || undefined,
          category: filter.category || undefined,
          limit: 10,
          offset: reset ? 0 : page * 10,
          sort_by: 'created_at',
          sort_order: 'desc'
        }
      });

      if (error) throw error;

      if (reset) {
        setTickets(data || []);
      } else {
        setTickets(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore(data?.length === 10);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      showError("Failed to load tickets");
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(true);
  }, [filter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setPage(0);
    setTickets([]);
    setHasMore(true);
  };

  const handleStatusChange = (ticketId: string, status: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status } : ticket
      )
    );
  };

  const handleAssign = (ticketId: string, userId: string | null) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, assigned_to: userId } : ticket
      )
    );
  };

  const loadMore = () => {
    if (!hasMore || isFetching) return;
    setPage(prev => prev + 1);
    fetchTickets();
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.client_display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold">Tickets</CardTitle>
          <p className="text-muted-foreground">Manage and track all client issues</p>
        </div>
        <Button className="h-10" onClick={() => {
          // This would open a modal to create a new ticket
          showSuccess("Create ticket modal would open here");
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select onValueChange={(value) => handleFilterChange('status', value)} value={filter.status}>
              <SelectTrigger className="bg-white/5 border-white/10 w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('priority', value)} value={filter.priority}>
              <SelectTrigger className="bg-white/5 border-white/10 w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('category', value)} value={filter.category}>
              <SelectTrigger className="bg-white/5 border-white/10 w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="">All</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="setup">Setup</SelectItem>
                <SelectItem value="optimization">Optimization</SelectItem>
                <SelectItem value="recovery">Recovery</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tickets found. Create your first ticket to get started!
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
              />
            ))}
          </div>
        )}

        {hasMore && !isLoading && !isFetching && (
          <div className="flex justify-center mt-8">
            <Button onClick={loadMore} variant="outline" className="h-10">
              Load More
            </Button>
          </div>
        )}

        {isFetching && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketList;