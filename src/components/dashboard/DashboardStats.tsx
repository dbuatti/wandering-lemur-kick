"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Ticket, 
  Clock, 
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  // Short context line under the figure, e.g. "+3 in last 30 days"
  note?: {
    text: string;
    highlight?: boolean;
  };
  color: string;
}

const StatCard = ({ label, value, icon, note, color }: StatCardProps) => (
  <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
    <div className={cn("absolute top-0 left-0 w-1 h-full", color)} />
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <div className={cn("p-2 rounded-lg bg-white/5 text-white/80 group-hover:scale-110 transition-transform", color.replace('bg-', 'text-'))}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {note && (
          <div className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full text-right",
            note.highlight ? "bg-green-500/10 text-green-400" : "bg-white/5 text-muted-foreground"
          )}>
            {note.text}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export interface DashboardStatsData {
  totalClients: number;
  newClients30d: number;
  activeTickets: number;
  urgentTickets: number;
  newTickets30d: number;
  totalHours: number;
  ticketsWithHours: number;
  resolvedTickets: number;
  resolved30d: number;
}

const last30 = (count: number) => ({
  text: count > 0 ? `+${count} in 30 days` : "None in 30 days",
  highlight: count > 0,
});

const DashboardStats = ({ stats }: { stats: DashboardStatsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Clients"
        value={stats.totalClients}
        icon={<Users className="h-5 w-5" />}
        note={last30(stats.newClients30d)}
        color="bg-blue-500"
      />
      <StatCard
        label="Open Tickets"
        value={stats.activeTickets}
        icon={<Ticket className="h-5 w-5" />}
        note={{ text: `${stats.newTickets30d} new in 30 days` }}
        color="bg-purple-500"
      />
      <StatCard
        label="Hours Logged"
        value={`${stats.totalHours}h`}
        icon={<Clock className="h-5 w-5" />}
        note={{ text: `Across ${stats.ticketsWithHours} ticket${stats.ticketsWithHours === 1 ? '' : 's'}` }}
        color="bg-primary"
      />
      <StatCard
        label="Resolved"
        value={stats.resolvedTickets}
        icon={<CheckCircle2 className="h-5 w-5" />}
        note={last30(stats.resolved30d)}
        color="bg-green-500"
      />
    </div>
  );
};

export default DashboardStats;
