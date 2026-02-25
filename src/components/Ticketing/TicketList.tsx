"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Loader2, Filter, LayoutGrid, List, BarChart3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TicketCard from "./TicketCard";
import TicketForm from "./TicketForm";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState({
    status: initialFilter?.status || 'all',
    priority: initialFilter?.priority || 'all',
    category: initialFilter?.category || 'all',
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
          status: filter.status === 'all' ? undefined : filter.status,
          priority: filter.priority === 'all' ? undefined : filter.priority,
          category: filter.category === 'all' ? undefined : filter.category,
          limit: 12,
          offset: reset ? 0 : page * 12,
        }
      });

      if (error) throw error;

      if (reset) {
        setTickets(data || []);
      } else {
        setTickets(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore(data?.length === 12);
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

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
    };
  }, [tickets]);

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
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tickets", value: stats.total, icon: <BarChart3 className="h-4 w-4" />, color: "text-primary" },
          { label: "Open", value: stats.open, icon: <AlertCircle className="h-4 w-4" />, color: "text-blue-400" },
          { label: "In Progress", value: stats.inProgress, icon: <Clock className="h-4 w-4" />, color: "text-purple-400" },
          { label: "Resolved", value: stats.resolved, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-400" },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10 overflow-hidden relative group">
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.color.replace('text-', 'bg-')}`} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                <div className={`${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/[0.02] px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <CardTitle className="text-2xl font-bold">Ticket Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Track and resolve client requests with precision.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 w-8 p-0 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 w-8 p-0 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 bg-primary text-white hover:bg-primary/90 rounded-xl px-6 font-bold">
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold">Create New Ticket</DialogTitle>
                  </DialogHeader>
                  <TicketForm 
                    onTicketCreated={() => {
                      setIsCreateDialogOpen(false);
                      fetchTickets(true);
                    }} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, client, or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-12">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select onValueChange={(value) => handleFilterChange('status', value)} value={filter.status}>
                  <SelectTrigger className="border-none bg-transparent focus:ring-0 w-[130px] h-full p-0">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-12">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <Select onValueChange={(value) => handleFilterChange('priority', value)} value={filter.priority}>
                  <SelectTrigger className="border-none bg-transparent focus:ring-0 w-[130px] h-full p-0">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Synchronizing tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No tickets found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button 
                variant="link" 
                className="mt-4 text-primary"
                onClick={() => {
                  setFilter({ status: 'all', priority: 'all', category: 'all' });
                  setSearchTerm('');
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  viewMode={viewMode}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssign}
                />
              ))}
            </div>
          )}

          {hasMore && !isLoading && !isFetching && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={loadMore} 
                variant="outline" 
                className="h-12 rounded-xl border-white/10 hover:bg-white/5 px-8 font-bold transition-all"
              >
                Load More Tickets
              </Button>
            </div>
          )}

          {isFetching && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketList;