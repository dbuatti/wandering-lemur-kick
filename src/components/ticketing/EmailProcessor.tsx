"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Loader2, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Ticket, 
  UserPlus,
  MessageSquare,
  X,
  BrainCircuit,
  ShieldCheck,
  PlusCircle,
  Check,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EmailProcessorProps {
  onComplete: () => void;
}

const EmailProcessor = ({ onComplete }: EmailProcessorProps) => {
  const [emailText, setEmailText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [applyingIds, setApplyingIds] = useState<Set<number>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!emailText || emailText.length < 20) {
      showError("Please paste a full email chain for analysis.");
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-email-chain', {
        body: { email_text: emailText }
      });

      if (error) throw error;
      setAnalysis(data);
      showSuccess(`AI identified ${data.suggestions?.length || 0} potential actions.`);
    } catch (error) {
      console.error(error);
      showError("Failed to analyze email chain.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySuggestion = async (suggestion: any, index: number) => {
    setApplyingIds(prev => new Set(prev).add(index));

    try {
      if (suggestion.action === 'update' || suggestion.action === 'status_change') {
        // 1. Add comment if content exists
        if (suggestion.content) {
          await supabase.functions.invoke('add-ticket-comment', {
            body: {
              ticket_id: suggestion.ticket_id,
              content: suggestion.content,
              is_internal: false
            }
          });
        }

        // 2. Update status if requested
        if (suggestion.new_status) {
          await supabase.functions.invoke('update-ticket-status', {
            body: {
              ticket_id: suggestion.ticket_id,
              status: suggestion.new_status
            }
          });
        }
        
        showSuccess(`Ticket #${suggestion.ticket_number || 'updated'} processed.`);
      } else if (suggestion.action === 'create') {
        const { data, error } = await supabase.functions.invoke('create-ticket', {
          body: {
            ...suggestion.suggested_ticket,
            client_display_name: suggestion.suggested_ticket.client_name
          }
        });

        if (error) throw error;
        showSuccess(`New ticket #${data.ticket_number || data.id.slice(0, 8)} created.`);
      }

      setCompletedIds(prev => new Set(prev).add(index));
    } catch (error) {
      console.error(error);
      showError("Failed to apply suggestion.");
    } finally {
      setApplyingIds(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const allDone = analysis?.suggestions?.length > 0 && completedIds.size === analysis.suggestions.length;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!analysis ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste a full email chain below. The AI will identify multiple updates, status changes, and new requests across all your active tickets.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Chain Content</label>
                <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">Include headers for better client matching</span>
              </div>
              <Textarea 
                placeholder="Paste the entire email thread here..."
                className="bg-white/5 border-white/10 min-h-[300px] rounded-2xl text-sm p-6 focus:ring-primary font-light leading-relaxed custom-scrollbar"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              onClick={handleAnalyze}
              disabled={isProcessing || !emailText.trim()}
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Context...</>
              ) : (
                <><BrainCircuit className="mr-2 h-5 w-5" /> Process with AI</>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {analysis.suggestions?.length || 0} Actions Identified
                </Badge>
                {allDone && (
                  <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    All Applied
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setAnalysis(null); setCompletedIds(new Set()); }} className="h-8 text-muted-foreground">
                <X className="h-4 w-4 mr-2" /> Start Over
              </Button>
            </div>

            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">AI Reasoning</h4>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{analysis.reasoning}</p>
                </div>
              </div>

              <div className="space-y-4">
                {analysis.suggestions?.map((suggestion: any, index: number) => {
                  const isApplying = applyingIds.has(index);
                  const isDone = completedIds.has(index);

                  return (
                    <div 
                      key={index} 
                      className={cn(
                        "p-6 rounded-2xl border transition-all duration-300",
                        isDone ? "bg-green-500/5 border-green-500/20 opacity-60" : 
                        suggestion.action === 'create' ? "bg-blue-500/5 border-blue-500/10" : "bg-purple-500/5 border-purple-500/10"
                      )}
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          {suggestion.action === 'create' ? (
                            <Badge className="bg-blue-500 text-white text-[9px] uppercase tracking-widest">New Ticket</Badge>
                          ) : suggestion.new_status ? (
                            <Badge className="bg-orange-500 text-white text-[9px] uppercase tracking-widest">Status: {suggestion.new_status}</Badge>
                          ) : (
                            <Badge className="bg-purple-500 text-white text-[9px] uppercase tracking-widest">Update</Badge>
                          )}
                          
                          {suggestion.ticket_number && (
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              #{suggestion.ticket_number}
                            </span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant={isDone ? "ghost" : "outline"}
                          className={cn(
                            "h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest",
                            isDone ? "text-green-400" : "border-white/10 hover:bg-white/5"
                          )}
                          onClick={() => handleApplySuggestion(suggestion, index)}
                          disabled={isApplying || isDone}
                        >
                          {isApplying ? <Loader2 className="h-3 w-3 animate-spin" /> : 
                           isDone ? <><Check className="h-3 w-3 mr-1" /> Applied</> : 
                           "Apply Action"}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {suggestion.action === 'create' ? (
                          <>
                            <h5 className="font-bold text-white text-sm">{suggestion.suggested_ticket.title}</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{suggestion.suggested_ticket.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="bg-white/5 text-[8px] py-0">Client: {suggestion.suggested_ticket.client_name}</Badge>
                              <Badge variant="outline" className="bg-white/5 text-[8px] py-0">Priority: {suggestion.suggested_ticket.priority}</Badge>
                            </div>
                          </>
                        ) : (
                          <>
                            {suggestion.ticket_title && <h5 className="font-bold text-white/70 text-xs mb-1">{suggestion.ticket_title}</h5>}
                            <p className="text-xs text-white/80 leading-relaxed italic">"{suggestion.content}"</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {allDone && (
              <Button 
                className="w-full h-14 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-all"
                onClick={onComplete}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" /> Finish & Close
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailProcessor;