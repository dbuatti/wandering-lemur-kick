"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Building2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClientCardProps {
  client: any;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            {client.is_company ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
          </div>
          <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 text-[10px] uppercase tracking-widest">
            {client.type || (client.is_company ? 'Company' : 'Individual')}
          </Badge>
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
            className="text-primary hover:text-primary/80 h-8 px-2"
            onClick={() => navigate(`/tickets?client=${client.id}`)}
          >
            View Tickets <ExternalLink className="ml-1.5 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;