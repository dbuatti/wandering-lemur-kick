"use client";

import React, { useEffect, useState, type ComponentProps } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats, { type DashboardStatsData } from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import SystemHealth from "@/components/dashboard/SystemHealth";
import CategoryChart from "@/components/dashboard/CategoryChart";
import Scratchpad from "@/components/dashboard/Scratchpad";
import CommandMenu from "@/components/CommandMenu";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, ArrowRight, UserCheck, Ticket, Users, Building2, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Client, Ticket as TicketRow } from "@/integrations/supabase/types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const ACTIVE_STATUSES = ['open', 'in_progress', 'pending'];
const DONE_STATUSES = ['resolved', 'closed'];
const PRIORITY_RANK: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState<DashboardStatsData>({
    totalClients: 0,
    newClients30d: 0,
    activeTickets: 0,
    urgentTickets: 0,
    newTickets30d: 0,
    totalHours: 0,
    ticketsWithHours: 0,
    resolvedTickets: 0,
    resolved30d: 0,
  });
  const [activities, setActivities] = useState<ComponentProps<typeof RecentActivity>["activities"]>([]);
  const [myTickets, setMyTickets] = useState<TicketRow[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const since = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();

      const [clientsRes, newClientsRes, recentClientsRes, ticketsRes, commentsRes] = await Promise.all([
        // Match the Clients page, which only lists IT clients
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('is_it_client', true),
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('is_it_client', true).gte('created_at', since),
        supabase.from('clients').select('*').eq('is_it_client', true).order('created_at', { ascending: false }).limit(3),
        supabase
          .from('tickets')
          .select('id, title, status, priority, category, actual_hours, client_display_name, owner_user_id, assigned_to, created_at, updated_at'),
        supabase
          .from('ticket_comments')
          .select('id, ticket_id, user_id, is_internal, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const tickets = ticketsRes.data || [];
      const active = tickets.filter(t => ACTIVE_STATUSES.includes(t.status ?? ''));
      const done = tickets.filter(t => DONE_STATUSES.includes(t.status ?? ''));
      const withHours = tickets.filter(t => (t.actual_hours || 0) > 0);

      const categories: Record<string, number> = {};
      active.forEach(t => {
        const cat = t.category || 'other';
        categories[cat] = (categories[cat] || 0) + 1;
      });

      setCategoryData(Object.entries(categories).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      })));
      setRecentClients(recentClientsRes.data || []);
      setStats({
        totalClients: clientsRes.count || 0,
        newClients30d: newClientsRes.count || 0,
        activeTickets: active.length,
        urgentTickets: active.filter(t => t.priority === 'urgent' || t.priority === 'high').length,
        newTickets30d: tickets.filter(t => t.created_at && t.created_at >= since).length,
        totalHours: Math.round(withHours.reduce((acc, t) => acc + (t.actual_hours || 0), 0) * 10) / 10,
        ticketsWithHours: withHours.length,
        resolvedTickets: done.length,
        // No resolved_at column, so last update time stands in for when it was resolved
        resolved30d: done.filter(t => t.updated_at && t.updated_at >= since).length,
      });

      // Tickets aren't always assigned, so include open tickets you own too
      const mine = active
        .filter(t => user && (t.assigned_to === user.id || (!t.assigned_to && t.owner_user_id === user.id)))
        .sort((a, b) =>
          (PRIORITY_RANK[a.priority ?? ''] ?? 9) - (PRIORITY_RANK[b.priority ?? ''] ?? 9) ||
          (a.created_at ?? '').localeCompare(b.created_at ?? ''));
      setMyTickets(mine as TicketRow[]);

      const ticketTitles = new Map(tickets.map(t => [t.id, t.title]));
      const feed: ComponentProps<typeof RecentActivity>["activities"] = [
        ...[...tickets]
          .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
          .slice(0, 5)
          .map(t => ({
            id: `ticket-${t.id}`,
            type: 'ticket' as const,
            title: 'New Ticket Created',
            description: t.client_display_name ? `${t.title} for ${t.client_display_name}` : t.title,
            timestamp: t.created_at ?? '',
            user: 'System'
          })),
        ...(recentClientsRes.data || []).map(c => ({
          id: `client-${c.id}`,
          type: 'client' as const,
          title: 'Client Added',
          description: c.display_name,
          timestamp: c.created_at ?? '',
          user: 'You'
        })),
        ...(commentsRes.data || []).map(c => ({
          id: `comment-${c.id}`,
          type: 'comment' as const,
          title: c.is_internal ? 'Internal Note Added' : 'Comment Added',
          description: ticketTitles.get(c.ticket_id ?? '') ?? 'Ticket',
          timestamp: c.created_at ?? '',
          user: c.user_id === user?.id ? 'You' : 'Client'
        })),
      ];

      setActivities(
        feed
          .filter(a => a.timestamp)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
          .slice(0, 6)
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    updateGreeting();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse font-medium">Syncing your workspace...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CommandMenu />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  {greeting}, Daniele
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                    Business <span className="text-primary">Overview.</span>
                  </h1>
                  <p className="text-lg text-muted-foreground font-light max-w-2xl">
                    {stats.activeTickets === 0
                      ? "No open tickets right now."
                      : `${stats.activeTickets} open ticket${stats.activeTickets === 1 ? '' : 's'}${stats.urgentTickets ? `, ${stats.urgentTickets} high priority` : ''}.`}{' '}
                    Press <kbd className="px-2 py-1 rounded bg-white/10 text-xs font-mono">⌘K</kbd> to search anything.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/clients')}
                    className="rounded-full px-8 h-12 font-bold border-white/10 hover:bg-white/5 transition-all"
                  >
                    Clients
                  </Button>
                  <Button 
                    onClick={() => navigate('/tickets')}
                    className="rounded-full px-8 h-12 font-bold group shadow-lg shadow-primary/20 hover:scale-105 transition-all"
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
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden hover:border-primary/20 transition-colors">
                    <CardHeader className="border-b border-white/5 px-8 py-6 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-bold">My Workload</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {myTickets.length} Open
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                      {myTickets.length === 0 ? (
                        <div className="p-12 text-center">
                          <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Ticket className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground text-sm">No open tickets assigned to you.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {myTickets.slice(0, 5).map((ticket) => (
                            <Link 
                              key={ticket.id} 
                              to={`/tickets/${ticket.id}`}
                              className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                                  ticket.priority === 'urgent' ? "bg-red-500/10 text-red-500" : "bg-white/5 text-muted-foreground"
                                )}>
                                  <Ticket className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{ticket.title}</h4>
                                  <p className="text-xs text-muted-foreground truncate">{ticket.client_display_name}</p>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden hover:border-primary/20 transition-colors">
                    <CardHeader className="border-b border-white/5 px-8 py-6 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-bold">Recent Clients</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      {recentClients.length === 0 ? (
                        <div className="p-12 text-center">
                          <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground text-sm">No clients added yet.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {recentClients.map((client) => (
                            <Link 
                              key={client.id} 
                              to={`/clients/${client.id}`}
                              className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110">
                                  {client.is_company ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{client.display_name}</h4>
                                  <p className="text-xs text-muted-foreground truncate">{client.email || 'No email'}</p>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <RecentActivity activities={activities} />
                  <CategoryChart data={categoryData} />
                </div>
              </div>
              <div className="lg:col-span-4 space-y-8">
                <QuickActions />
                <Scratchpad />
                <SystemHealth />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;