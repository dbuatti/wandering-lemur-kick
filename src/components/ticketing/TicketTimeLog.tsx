"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Plus, Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

interface TicketTimeLogProps {
  ticketId: string;
  currentActualHours: number;
  estimatedHours: number;
  onUpdate: () => void;
}

const TicketTimeLog = ({ ticketId, currentActualHours, estimatedHours, onUpdate }: TicketTimeLogProps) => {
  const [hoursToAdd, setHoursToAdd] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogTime = async () => {
    const hours = parseFloat(hoursToAdd);
    if (isNaN(hours) || hours <= 0) {
      showError("Please enter a valid number of hours");
      return;
    }

    setIsSubmitting(true);
    try {
      const newTotal = (currentActualHours || 0) + hours;
      
      const { error } = await supabase.functions.invoke('update-ticket-status', {
        body: {
          ticket_id: ticketId,
          actual_hours: newTotal
        }
      });

      if (error) throw error;

      showSuccess(`Logged ${hours} hours successfully`);
      setHoursToAdd('');
      onUpdate();
    } catch (error) {
      console.error("Error logging time:", error);
      showError("Failed to log time");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = estimatedHours > 0 ? Math.min((currentActualHours / estimatedHours) * 100, 100) : 0;

  return (
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">Time Tracking</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Actual</p>
              <p className="text-2xl font-bold text-white">{currentActualHours || 0}h</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Estimated</p>
              <p className="text-2xl font-bold text-muted-foreground">{estimatedHours || 0}h</p>
            </div>
          </div>

          {estimatedHours > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Progress</span>
                <span className={progress >= 100 ? "text-red-400" : "text-primary"}>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${progress >= 100 ? "bg-red-500" : "bg-primary"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/5">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Log New Hours</Label>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="0.0"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(e.target.value)}
                className="bg-black/20 border-white/10 h-12 rounded-xl focus:ring-primary"
              />
              <Button 
                onClick={handleLogTime}
                disabled={isSubmitting || !hoursToAdd}
                className="h-12 px-6 rounded-xl bg-primary text-white font-bold"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketTimeLog;