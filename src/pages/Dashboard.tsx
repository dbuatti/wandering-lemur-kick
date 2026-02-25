"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LayoutDashboard, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

  const fetchData = async () => {
    try {
      // Fetch Stats
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

      // Fetch Recent Activity (Mocking for now based on tickets and comments)
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
        <div className="container px-6 mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
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
                <Button 
                  onClick={() => navigate('/tickets')}
                  className="rounded-full px-8 h-12 font-bold group"
                >
                  View All Tickets <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-12">
              <DashboardStats stats={stats} />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <RecentActivity activities={activities} />
              </div>
              <div className="lg:col-span-4">
                <QuickActions />
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