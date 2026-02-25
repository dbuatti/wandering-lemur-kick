"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import SystemHealth from "@/components/dashboard/SystemHealth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, ArrowRight, UserCheck, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeTickets: 0,
    totalHours: 0,
    resolvedTickets: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const [clientsRes, ticketsRes, resolvedRes] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('tickets').select('id, actual_hours', { count: 'exact' }).neq('status', 'closed'),
        supabase.from('tickets').select('id', { count: 'exact' }).eq('status', 'resolved')
      ]);

      const totalHours = ticketsRes.data?.reduce((acc, t) => acc + (t.actual_hours || 0), 0) || 0;

      setStats({
        totalClients: clientsRes.count || 0,
        activeTickets: ticketsRes.count || 0,
        totalHours: Math.round(totalHours),
        resolvedTickets: resolvedRes.count || 0
      });

      if (user) {
        const { data: assignedTickets } = await supabase
          .from('tickets')
          .select('*')
          .eq('assigned_to', user.id)
          .neq('status', 'closed')
          .neq('status', 'resolved')
          .order('priority', { ascending: false })
          .limit(3);
        
        setMyTickets(assignedTickets || []);
      }

      const { data: recentTickets } = await supabase
        .from('tickets')
        .select('id, title, client_display_name, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      const formattedActivities = recentTickets?.map(t => ({
        id: t.id,
        type: 'ticket',
        title: 'New Ticket Created',
        description: `${t.title} for ${t.client_display_name}`,
        timestamp: t.created_at,
        user: 'System'
      })) || [];

      setActivities(formattedActivities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  Admin Control Center
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                    Business <span className="text-primary">Overview.</span>
                  </h1>
                  <p className="text-lg text-muted-foreground font-light max-w-2xl">
                    Welcome back, Daniele. Here's what's happening with your IT support services today.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/clients')}
                    className="rounded-full px-8 h-12 font-bold border-white/10"
                  >
                    Clients
                  </Button>
                  <Button 
                    onClick={() => navigate('/tickets')}
                    className="rounded-full px-8 h-12 font-bold group"
                  >
                    All Tickets <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <DashboardStats stats={stats} />
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
                  <CardHeader className="border-b border-white/5 px-8 py-6 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl font-bold">My Workload</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {myTickets.length} Active
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    {myTickets.length === 0 ? (
                      <div className="p-12 text-center text-muted-foreground">
                        No tickets currently assigned to you.
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {myTickets.map((ticket) => (
                          <Link 
                            key={ticket.id} 
                            to={`/tickets/${ticket.id}`}
                            className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                ticket.priority === 'urgent' ? "bg-red-500/10 text-red-500" : "bg-white/5 text-muted-foreground"
                              )}>
                                <Ticket className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{ticket.title}</h4>
                                <p className="text-xs text-muted-foreground truncate">{ticket.client_display_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 ml-4">
                              <Badge className={cn(
                                "text-[10px] uppercase tracking-widest font-bold",
                                ticket.priority === 'urgent' ? "bg-red-500" : "bg-slate-700"
                              )}>
                                {ticket.priority}
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <RecentActivity activities={activities} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <QuickActions />
                <SystemHealth />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;