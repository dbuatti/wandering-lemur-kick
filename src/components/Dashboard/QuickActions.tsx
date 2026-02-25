"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserPlus, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "New Ticket", icon: <Plus className="h-4 w-4" />, onClick: () => navigate('/tickets?action=new'), color: "bg-primary" },
    { label: "Add Client", icon: <UserPlus className="h-4 w-4" />, onClick: () => navigate('/clients?action=new'), color: "bg-blue-500" },
    { label: "Security Audit", icon: <Shield className="h-4 w-4" />, onClick: () => navigate('/tickets?category=security'), color: "bg-green-500" },
    { label: "Optimization", icon: <Zap className="h-4 w-4" />, onClick: () => navigate('/tickets?category=optimization'), color: "bg-purple-500" },
  ];

  return (
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
      <CardHeader className="border-b border-white/5 px-8 py-6">
        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-3 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-primary/30 transition-all group"
              onClick={action.onClick}
            >
              <div className={cn("p-2 rounded-lg text-white group-hover:scale-110 transition-transform", action.color)}>
                {action.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;