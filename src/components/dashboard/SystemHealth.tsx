"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const SystemHealth = () => {
  const services = [
    { name: "Database", status: "Operational", icon: <ShieldCheck className="h-3 w-3" />, color: "text-green-400" },
    { name: "AI Engine", status: "Ready", icon: <Zap className="h-3 w-3" />, color: "text-primary" },
    { name: "Mail Server", status: "Active", icon: <Activity className="h-3 w-3" />, color: "text-green-400" },
  ];

  return (
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">System Health</h3>
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={cn("p-1.5 rounded-lg bg-white/5", service.color)}>
                  {service.icon}
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{service.name}</span>
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", service.color)}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Uptime</span>
            <span className="text-white">99.9%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;