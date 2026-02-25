"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, UserPlus, Ticket, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'comment' | 'client' | 'ticket' | 'status';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'client': return <UserPlus className="h-4 w-4" />;
      case 'ticket': return <Ticket className="h-4 w-4" />;
      case 'status': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'comment': return "text-blue-400 bg-blue-500/10";
      case 'client': return "text-green-400 bg-green-500/10";
      case 'ticket': return "text-purple-400 bg-purple-500/10";
      case 'status': return "text-primary bg-primary/10";
      default: return "text-muted-foreground bg-white/5";
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
      <CardHeader className="border-b border-white/5 px-8 py-6">
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {activities.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No recent activity to show.
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-white/[0.02] transition-colors flex gap-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", getColor(activity.type))}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold truncate">{activity.title}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{activity.description}</p>
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    By {activity.user}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;