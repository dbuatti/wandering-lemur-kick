"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TicketList from "@/components/Ticketing/TicketList";
import ClientAssetList from "@/components/clients/ClientAssetList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Briefcase,
  Ticket,
  Database
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClient = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setClient(data);
    } catch (error) {
      console.error("Error fetching client:", error);
      showError("Failed to load client details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
            <Button onClick={() => navigate('/clients')}>Back to Directory</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <div className="w-full">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/clients')}
              className="text-muted-foreground hover:text-white -ml-4 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
            </Button>

            <div className="grid lg:grid-cols-12 gap-12 mb-16">
              <div className="lg:col-span-4">
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden sticky top-32">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center mb-8">
                      <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-6">
                        {client.is_company ? <Building2 className="h-12 w-12" /> : <User className="h-12 w-12" />}
                      </div>
                      <h1 className="text-3xl font-bold mb-2">{client.display_name}</h1>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {client.type || (client.is_company ? 'Company' : 'Individual')}
                      </Badge>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email</p>
                          <p className="font-medium truncate">{client.email || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
                          <p className="font-medium">{client.phone || 'N/A'}</p>
                        </div>
                      </div>

                      {client.job_title && (
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Position</p>
                            <p className="font-medium">{client.job_title}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Client Since</p>
                          <p className="font-medium">{new Date(client.created_at).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                        <Shield className="h-3 w-3" /> Security Status
                      </div>
                      <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                        All systems verified and secure.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8">
                    <TabsTrigger value="history" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Ticket className="h-4 w-4 mr-2" /> Service History
                    </TabsTrigger>
                    <TabsTrigger value="assets" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Database className="h-4 w-4 mr-2" /> Technical Assets
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="history" className="mt-0">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold tracking-tight mb-2">Service History</h2>
                      <p className="text-muted-foreground">All tickets and projects associated with {client.display_name}.</p>
                    </div>
                    <TicketList initialFilter={{ client_id: client.id }} />
                  </TabsContent>
                  
                  <TabsContent value="assets" className="mt-0">
                    <ClientAssetList clientId={client.id} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDetail;