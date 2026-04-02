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
  ShieldCheck
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
  const [isApplying, setIsApplying] = useState(false);
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
      showSuccess("AI analysis complete.");
    } catch (error) {
      console.error(error);
      showError("Failed to analyze email chain.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = async () => {
    if (!analysis) return;
    setIsApplying(true);

    try {
      if (analysis.action === 'update' && analysis.ticket_id) {
        // Add comment to existing ticket
        const { error } = await supabase.functions.invoke('add-ticket-comment', {
          body: {
            ticket_id: analysis.ticket_id,
            content: analysis.suggested_update.content,
            is_internal: analysis.suggested_update.is_internal
          }
        });

        if (error) throw error;
        showSuccess("Ticket updated with new information.");
      } else if (analysis.action === 'create') {
        // Create new ticket
        const { data, error } = await supabase.functions.invoke('create-ticket', {
          body: {
            ...analysis.suggested_ticket,
            client_display_name: analysis.suggested_ticket.client_name
          }
        });

        if (error) throw error;
        showSuccess(`New ticket #${data.ticket_number || data.id.slice(0, 8)} created.`);
      }

      onComplete();
    } catch (error) {
      console.error(error);
      showError("Failed to apply AI suggestions.");
    } finally {
      setIsApplying(false);
    }
  };

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
                Paste a full email chain below. The AI will check for existing tickets and suggest the best course of action.
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
                <Badge className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  analysis.action === 'update' ? "bg-purple-500" : "bg-blue-500"
                )}>
                  AI Recommendation: {analysis.action === 'update' ? 'Update Ticket' : 'New Ticket'}
                </Badge>
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] py-1">
                  {Math.round(analysis.confidence * 100)}% Confidence
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setAnalysis(null)} className="h-8 text-muted-foreground">
                <X className="h-4 w-4 mr-2" /> Start Over
              </Button>
            </div>

            <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">AI Reasoning</h4>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{analysis.reasoning}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  {analysis.action === 'update' ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                        <MessageSquare className="h-3 w-3" /> Suggested Update
                      </div>
                      <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                        <p className="text-sm text-white/80 leading-relaxed italic">"{analysis.suggested_update.content}"</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Ticket className="h-3 w-3" /> Target Ticket ID: <span className="font-mono text-primary">{analysis.ticket_id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        <PlusCircle className="h-3 w-3" /> Suggested Ticket
                      </div>
                      <div className="grid gap-4">
                        <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                          <h5 className="font-bold text-white mb-2">{analysis.suggested_ticket.title}</h5>
                          <p className="text-sm text-muted-foreground font-light leading-relaxed">{analysis.suggested_ticket.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] py-1">
                            Priority: {analysis.suggested_ticket.priority}
                          </Badge>
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] py-1">
                            Category: {analysis.suggested_ticket.category}
                          </Badge>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] py-1">
                            Client: {analysis.suggested_ticket.client_name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button 
              className={cn(
                "w-full h-14 rounded-2xl font-bold shadow-lg transition-all hover:scale-[1.02]",
                analysis.action === 'update' ? "bg-purple-600 shadow-purple-600/20" : "bg-blue-600 shadow-blue-600/20"
              )}
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Applying Changes...</>
              ) : (
                <>
                  {analysis.action === 'update' ? <MessageSquare className="mr-2 h-5 w-5" /> : <Ticket className="mr-2 h-5 w-5" />}
                  {analysis.action === 'update' ? 'Update Existing Ticket' : 'Create New Ticket'}
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailProcessor;