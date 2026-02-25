"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Building2, User, Mail, Phone, Loader2, Edit, Trash2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import ClientForm from "./ClientForm";
import { useNavigate } from "react-router-dom";

const ClientList = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Individual' | 'Company'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('display_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      showError("Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientCreated = () => {
    fetchClients();
    setIsCreateDialogOpen(false);
    setEditingClient(null);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure? This will also delete all associated tickets.")) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      showSuccess("Client deleted successfully");
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      showError("Failed to delete client");
    }
  };

  const handleCreateTicket = (clientId: string) => {
    // Navigate to tickets page with client pre-selected
    // For now, just navigate to tickets
    navigate('/tickets');
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || client.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const stats = {
    total: clients.length,
    companies: clients.filter(c => c.type === 'Company').length,
    individuals: clients.filter(c => c.type === 'Individual').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Clients", value: stats.total, icon: <User className="h-4 w-4" /> },
          { label: "Companies", value: stats.companies, icon: <Building2 className="h-4 w-4" /> },
          { label: "Individuals", value: stats.individuals, icon: <User className="h-4 w-4" /> },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                <div className="text-primary">{stat.icon}</div>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-white/10">
        <CardHeader className="border-b border-white/5 bg-white/[0.02] px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <CardTitle className="text-2xl font-bold">Client Directory</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage clients and companies.</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) setEditingClient(null);
            }}>
              <DialogTrigger asChild>
                <Button className="h-10 bg-primary text-white hover:bg-primary/90 rounded-xl px-6 font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold">
                    {editingClient ? 'Edit Client' : 'Add New Client'}
                  </DialogTitle>
                </DialogHeader>
                <ClientForm 
                  client={editingClient}
                  onClientCreated={handleClientCreated}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 h-12">
              <Select onValueChange={(value) => setFilterType(value as any)} value={filterType}>
                <SelectTrigger className="border-none bg-transparent focus:ring-0 w-[150px] h-full p-0">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Individual">Individuals</SelectItem>
                  <SelectItem value="Company">Companies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No clients found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {clients.length === 0 
                  ? "Get started by adding your first client." 
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card key={client.id} className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${client.type === 'Company' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
                          {client.type === 'Company' ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{client.display_name}</h3>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-widest mt-1">
                            {client.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditClient(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      {client.email && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.job_title && (
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">
                          {client.job_title}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(client.created_at).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-primary hover:bg-primary/5 text-xs font-bold"
                        onClick={() => handleCreateTicket(client.id)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        New Ticket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;