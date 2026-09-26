"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, KeyRound, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type CheckState = 'checking' | 'ok' | 'slow' | 'down';

interface CheckResult {
  state: CheckState;
  detail: string;
}

const SLOW_MS = 1500;

const checkDatabase = async (): Promise<CheckResult> => {
  const started = performance.now();
  const { error } = await supabase.from('clients').select('id', { head: true, count: 'exact' }).limit(1);
  const ms = Math.round(performance.now() - started);
  if (error) return { state: 'down', detail: 'Error' };
  return { state: ms > SLOW_MS ? 'slow' : 'ok', detail: `${ms} ms` };
};

const checkSession = async (): Promise<CheckResult> => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return { state: 'down', detail: 'Signed out' };
  const expiresAt = data.session.expires_at ? data.session.expires_at * 1000 : null;
  if (expiresAt && expiresAt < Date.now()) return { state: 'slow', detail: 'Expired' };
  return { state: 'ok', detail: 'Active' };
};

const stateColor: Record<CheckState, string> = {
  checking: "text-muted-foreground",
  ok: "text-green-400",
  slow: "text-yellow-400",
  down: "text-red-400",
};

const SystemHealth = () => {
  const [results, setResults] = useState<Record<string, CheckResult>>({
    database: { state: 'checking', detail: 'Checking' },
    session: { state: 'checking', detail: 'Checking' },
  });
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  const runChecks = useCallback(async () => {
    setResults({
      database: { state: 'checking', detail: 'Checking' },
      session: { state: 'checking', detail: 'Checking' },
    });
    const safe = (check: () => Promise<CheckResult>) =>
      check().catch((): CheckResult => ({ state: 'down', detail: 'Unreachable' }));
    const [database, session] = await Promise.all([safe(checkDatabase), safe(checkSession)]);
    setResults({ database, session });
    setCheckedAt(new Date());
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const services = [
    { key: 'database', name: "Database", icon: <Database className="h-3 w-3" /> },
    { key: 'session', name: "Sign-in Session", icon: <KeyRound className="h-3 w-3" /> },
  ];

  const states = Object.values(results).map(r => r.state);
  const overall: CheckState = states.includes('checking') ? 'checking'
    : states.includes('down') ? 'down'
    : states.includes('slow') ? 'slow'
    : 'ok';

  return (
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">System Health</h3>
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              overall === 'ok' && "bg-green-400",
              overall === 'slow' && "bg-yellow-400",
              overall === 'down' && "bg-red-400",
              overall === 'checking' && "bg-muted-foreground animate-pulse",
            )}
            aria-label={`Overall status: ${overall}`}
          />
        </div>

        <div className="space-y-4">
          {services.map((service) => {
            const result = results[service.key];
            return (
              <div key={service.key} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={cn("p-1.5 rounded-lg bg-white/5", stateColor[result.state])}>
                    {service.icon}
                  </div>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{service.name}</span>
                </div>
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", stateColor[result.state])}>
                  {result.detail}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>{checkedAt ? `Checked ${checkedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Checking…'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={runChecks}
            disabled={overall === 'checking'}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", overall === 'checking' && "animate-spin")} />
            Re-check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
