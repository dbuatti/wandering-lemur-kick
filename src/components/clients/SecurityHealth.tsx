"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ShieldCheck, AlertTriangle, Lock, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface SecurityHealthProps {
  clientId: string;
}

const MILESTONES = [
  { id: 'mfa', label: 'Multi-Factor Authentication', description: 'Enabled on all primary accounts (Email, iCloud, Banking).' },
  { id: 'passwords', label: 'Password Management', description: '1Password or iCloud Keychain setup with unique, strong passwords.' },
  { id: 'backups', label: 'Encrypted Backups', description: '3-2-1 backup strategy implemented (Local + Cloud).' },
  { id: 'encryption', label: 'Device Encryption', description: 'FileVault (Mac) or BitLocker (Windows) active on all hardware.' },
  { id: 'updates', label: 'Automated Updates', description: 'OS and critical software set to auto-update.' },
  { id: 'recovery', label: 'Account Recovery Plan', description: 'Recovery keys stored securely; no single point of failure.' },
];

const SecurityHealth = ({ clientId }: SecurityHealthProps) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const { data, error } = await supabase
          .from('client_assets')
          .select('details')
          .eq('client_id', clientId)
          .eq('asset_type', 'security_audit')
          .maybeSingle();

        if (data?.details?.completedIds) {
          setCompletedIds(data.details.completedIds);
        }
      } catch (e) {
        console.error("Error fetching security audit:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudit();
  }, [clientId]);

  const toggleMilestone = async (id: string) => {
    const newIds = completedIds.includes(id)
      ? completedIds.filter(i => i !== id)
      : [...completedIds, id];
    
    setCompletedIds(newIds);
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('client_assets')
        .upsert({
          client_id: clientId,
          owner_user_id: user?.id,
          asset_type: 'security_audit',
          name: 'Core Security Audit',
          details: { completedIds: newIds },
          updated_at: new Date().toISOString()
        }, { onConflict: 'client_id,asset_type' });

      if (error) throw error;
    } catch (e) {
      showError("Failed to save security status");
    } finally {
      setIsSaving(false);
    }
  };

  const score = Math.round((completedIds.length / MILESTONES.length) * 100);

  if (isLoading) return <div className="h-48 flex items-center justify-center"><RefreshCw className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">
            <ShieldCheck className="h-4 w-4" /> Security Architecture
          </div>
          <h2 className="text-4xl font-bold tracking-tighter mb-2">Health Score</h2>
          <p className="text-muted-foreground font-light">Milestones for a resilient digital environment.</p>
        </div>
        
        <div className="text-right">
          <div className="text-6xl font-bold tracking-tighter text-white mb-2">{score}%</div>
          <Badge className={cn(
            "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
            score === 100 ? "bg-green-500" : score > 50 ? "bg-primary" : "bg-orange-500"
          )}>
            {score === 100 ? 'Fully Resilient' : score > 50 ? 'Protected' : 'At Risk'}
          </Badge>
        </div>
      </div>

      <Progress value={score} className="h-3 bg-white/5" />

      <div className="grid md:grid-cols-2 gap-4">
        {MILESTONES.map((m) => {
          const isDone = completedIds.includes(m.id);
          return (
            <Card 
              key={m.id}
              className={cn(
                "bg-white/5 border-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                isDone ? "border-primary/30 bg-primary/5" : "hover:border-white/20"
              )}
              onClick={() => toggleMilestone(m.id)}
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className={cn(
                  "mt-1 transition-colors",
                  isDone ? "text-primary" : "text-muted-foreground"
                )}>
                  {isDone ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </div>
                <div>
                  <h4 className={cn("font-bold mb-1", isDone ? "text-white" : "text-muted-foreground")}>{m.label}</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">{m.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {score < 100 && (
        <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-4">
          <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0" />
          <p className="text-sm text-orange-200/80 font-light">
            This client has <span className="font-bold text-orange-400">{MILESTONES.length - completedIds.length} critical vulnerabilities</span> remaining.
          </p>
        </div>
      )}
    </div>
  );
};

export default SecurityHealth;