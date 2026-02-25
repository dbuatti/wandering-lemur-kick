"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Building2, ExternalLink, ArrowRight, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TicketForm from "@/components/ticketing/TicketForm";

interface ClientCardProps {
  client: any;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const navigate = useNavigate();
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);

  return (
    <>
      <Card 
        className="bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-300 group cursor-pointer relative overflow-hidden"
        onClick={() => navigate(`/clients/${client.id}`)}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              {client.is_company ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 text-[10px] uppercase tracking-widest">
                {client.type || (client.is_company ? 'Company' : 'Individual')}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTicketDialogOpen(true);
                }}
                title="Quick Ticket"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors truncate">
            {client.display_name}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 truncate">
            {client.job_title || (client.is_company ? 'Organization' : 'Private Client')}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-3 text-primary/60" />
              <span className="truncate">{client.email || 'No email'}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-3 text-primary/60" />
              <span>{client.phone || 'No phone'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Added {new Date(client.created_at).toLocaleDateString()}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80 h-8 px-2 group/btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/clients/${client.id}`);
              }}
            >
              View Profile <ArrowRight className="ml-1.5 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">New Ticket for {client.display_name}</DialogTitle>
          </DialogHeader>
          <TicketForm 
            initialClientId={client.id}
            onTicketCreated={() => {
              setIsTicketDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientCard;