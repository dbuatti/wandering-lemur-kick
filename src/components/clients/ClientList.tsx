"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, Users, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClientCard from "./ClientCard";
import ClientForm from "./ClientForm";
import { supabase } from "@/integrations/supabase/client";

const ClientList = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      // Only fetch clients where is_it_client is true
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('is_it_client', true)
        .order('display_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search IT clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-xl bg-primary text-white font-bold w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">New Client Entry</DialogTitle>
            </DialogHeader>
            <ClientForm onSuccess={() => {
              setIsDialogOpen(false);
              fetchClients();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 w-fit">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Showing IT Support Clients Only</span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading directory...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
          <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No IT clients found</h3>
          <p className="text-muted-foreground">Start by adding your first IT support client or company.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;