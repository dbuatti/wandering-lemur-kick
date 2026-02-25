"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Ticket, 
  Users, 
  LayoutDashboard, 
  Plus, 
  Search,
  Shield,
  Settings,
  LogOut,
  UserPlus,
  PlusCircle,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";

const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const [tRes, cRes] = await Promise.all([
          supabase.from('tickets').select('id, title, ticket_number').limit(5).order('created_at', { ascending: false }),
          supabase.from('clients').select('id, display_name').limit(5).order('display_name', { ascending: true })
        ]);
        setTickets(tRes.data || []);
        setClients(cRes.data || []);
      };
      fetchData();
    }
  }, [open]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="custom-scrollbar">
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => navigate("/tickets"))}>
            <PlusCircle className="mr-2 h-4 w-4 text-primary" />
            <span>Create New Ticket</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/clients"))}>
            <UserPlus className="mr-2 h-4 w-4 text-primary" />
            <span>Add New Client</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/tickets"))}>
            <Ticket className="mr-2 h-4 w-4" />
            <span>All Tickets</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/clients"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Client Directory</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Recent Tickets">
          {tickets.map((ticket) => (
            <CommandItem 
              key={ticket.id} 
              onSelect={() => runCommand(() => navigate(`/tickets/${ticket.id}`))}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">#{ticket.ticket_number}</span>
                  <span className="truncate max-w-[200px]">{ticket.title}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Clients">
          {clients.map((client) => (
            <CommandItem 
              key={client.id} 
              onSelect={() => runCommand(() => navigate(`/clients/${client.id}`))}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{client.display_name}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem onSelect={() => runCommand(() => signOut())}>
            <LogOut className="mr-2 h-4 w-4 text-red-400" />
            <span className="text-red-400">Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;