"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Ticket, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color: string;
}

const StatCard = ({ label, value, icon, trend, color }: StatCardProps) => (
  <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
    <div className={cn("absolute top-0 left-0 w-1 h-full", color)} />
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <div className={cn("p-2 rounded-lg bg-white/5 text-white/80 group-hover:scale-110 transition-transform", color.replace('bg-', 'text-'))}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {trend && (
          <div className={cn(
            "flex items-center text-[10px] font-bold px-2 py-1 rounded-full",
            trend.isUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            {trend.isUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {trend.value}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  stats: {
    totalClients: number;
    activeTickets: number;
    totalHours: number;
    resolvedTickets: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label="Total Clients" 
        value={stats.totalClients} 
        icon={<Users className="h-5 w-5" />} 
        trend={{ value: "+12%", isUp: true }}
        color="bg-blue-500"
      />
      <StatCard 
        label="Active Tickets" 
        value={stats.activeTickets} 
        icon={<Ticket className="h-5 w-5" />} 
        trend={{ value: "-5%", isUp: false }}
        color="bg-purple-500"
      />
      <StatCard 
        label="Hours Logged" 
        value={`${stats.totalHours}h`} 
        icon={<Clock className="h-5 w-5" />} 
        trend={{ value: "+18%", isUp: true }}
        color="bg-primary"
      />
      <StatCard 
        label="Resolved" 
        value={stats.resolvedTickets} 
        icon={<CheckCircle2 className="h-5 w-5" />} 
        trend={{ value: "+24%", isUp: true }}
        color="bg-green-500"
      />
    </div>
  );
};

export default DashboardStats;