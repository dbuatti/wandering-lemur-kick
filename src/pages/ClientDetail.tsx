"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TicketList from "@/components/ticketing/TicketList";
import ClientAssetList from "@/components/clients/ClientAssetList";
import SecurityHealth from "@/components/clients/SecurityHealth";
import ClientForm from "@/components/clients/ClientForm";
import EmailProcessor from "@/components/ticketing/EmailProcessor";
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
  Briefcase,
  Ticket,
  Database,
  Activity,
  Edit2,
  Sparkles
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQueryClient } from "@tanstack/react-query";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

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
            {/* Breadcrumbs & Header */}
            <div className="mb-12 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/clients">Clients</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-primary font-bold">
                        {client.display_name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center gap-3">
                  <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-xl border-primary/30 bg-primary/5 h-10 px-6 font-bold text-primary hover:bg-primary/10 group">
                        <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" /> AI Email Processor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] bg-card border-white/10 text-white rounded-[2.5rem] p-8 overflow-hidden flex flex-col max-h-[90vh]">
                      <DialogHeader className="mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Mail className="h-6 w-6" />
                          </div>
                          <div>
                            <DialogTitle className="text-2xl font-bold">AI Email Processor</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Analyze email chains to update or create tickets for {client.display_name}.
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>
                      <div className="overflow-y-auto pr-2 custom-scrollbar">
                        <EmailProcessor onComplete={() => {
                          setIsEmailDialogOpen(false);
                          queryClient.invalidateQueries({ queryKey: ['tickets'] });
                        }} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 h-10 px-6 font-bold">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold">Edit Client Profile</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Update contact information and account details for this client.
                        </DialogDescription>
                      </DialogHeader>
                      <ClientForm 
                        initialData={client}
                        onSuccess={() => {
                          setIsEditDialogOpen(false);
                          fetchClient();
                        }} 
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/clients')}
                  className="text-muted-foreground hover:text-white -ml-4 h-8"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 mb-16">
              <div className="lg:col-span-4">
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden sticky top-32 shadow-2xl">
                  <CardContent className="p-10">
                    <div className="flex flex-col items-center text-center mb-10">
                      <div className="h-28 w-28 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-inner">
                        {client.is_company ? <Building2 className="h-14 w-14" /> : <User className="h-14 w-14" />}
                      </div>
                      <h1 className="text-3xl font-bold mb-3 tracking-tight">{client.display_name}</h1>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {client.type || (client.is_company ? 'Company' : 'Individual')}
                      </Badge>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email Address</p>
                          <p className="font-bold truncate text-lg">{client.email || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Phone className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone Number</p>
                          <p className="font-bold text-lg">{client.phone || 'N/A'}</p>
                        </div>
                      </div>

                      {client.job_title && (
                        <div className="flex items-start gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                            <Briefcase className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Position / Role</p>
                            <p className="font-bold text-lg">{client.job_title}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Client Since</p>
                          <p className="font-bold text-lg">{new Date(client.created_at).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-8">
                <Tabs defaultValue="health" className="w-full">
                  <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-[2rem] mb-12 inline-flex">
                    <TabsTrigger value="health" className="rounded-[1.5rem] px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-sm transition-all">
                      <Activity className="h-4 w-4 mr-2" /> Security Health
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-[1.5rem] px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-sm transition-all">
                      <Ticket className="h-4 w-4 mr-2" /> Service History
                    </TabsTrigger>
                    <TabsTrigger value="assets" className="rounded-[1.5rem] px-8 py-3.5 data-[state=active]:bg-primary data-[state=active]:text-white font-bold text-sm transition-all">
                      <Database className="h-4 w-4 mr-2" /> Technical Assets
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="health" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SecurityHealth clientId={client.id} />
                  </TabsContent>

                  <TabsContent value="history" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10">
                      <h2 className="text-4xl font-bold tracking-tighter mb-3">Service History</h2>
                      <p className="text-lg text-muted-foreground font-light">All tickets and projects associated with {client.display_name}.</p>
                    </div>
                    <TicketList initialFilter={{ client_id: client.id }} />
                  </TabsContent>
                  
                  <TabsContent value="assets" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
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