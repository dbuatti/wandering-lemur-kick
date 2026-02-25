"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, BrainCircuit, Lightbulb, CheckCircle2, RefreshCw, Save, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TicketAIAnalysisProps {
  ticket: any;
  comments: any[];
}

const TicketAIAnalysis = ({ ticket, comments }: TicketAIAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSavedAnalysis, setHasSavedAnalysis] = useState(false);

  const fetchSavedAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_ai_analyses')
        .select('*')
        .eq('ticket_id', ticket.id)
        .single();

      if (data) {
        setAnalysis(data);
        setHasSavedAnalysis(true);
      }
    } catch (error) {
      // Silent fail if no analysis exists
    }
  };

  useEffect(() => {
    if (ticket.id) {
      fetchSavedAnalysis();
    }
  }, [ticket.id]);

  const runAnalysis = async (force = false) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-ticket', {
        body: {
          ticket_id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          comments: comments,
          force_refresh: force
        }
      });

      if (error) throw error;
      setAnalysis(data);
      setHasSavedAnalysis(true);
      if (force) showSuccess("AI Insights updated and saved");
    } catch (error) {
      console.error("AI Analysis error:", error);
      showError("Failed to generate AI insights");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open && !analysis) runAnalysis();
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full h-12 rounded-xl border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold group ${hasSavedAnalysis ? 'border-green-500/30 bg-green-500/5 text-green-400' : ''}`}
        >
          {hasSavedAnalysis ? (
            <><FileText className="mr-2 h-4 w-4" /> View Saved Insights</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" /> AI Insights</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-card border-white/10 text-white rounded-[2.5rem] p-8 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="mb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">AI Diagnostic</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Persistent generative analysis for this ticket.
                </DialogDescription>
              </div>
            </div>
            {hasSavedAnalysis && (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Saved to Ticket
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 flex-grow">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground font-medium animate-pulse">Processing ticket context...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <CheckCircle2 className="h-4 w-4" /> Problem Summary
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-lg font-light leading-relaxed">
                {analysis.summary}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Lightbulb className="h-4 w-4" /> Suggested Solution
              </div>
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-muted-foreground leading-relaxed prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysis.solution}
                </ReactMarkdown>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-widest py-1">
                  Confidence: {Math.round(analysis.confidence * 100)}%
                </Badge>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Last updated: {new Date(analysis.updated_at || analysis.timestamp).toLocaleDateString()}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => runAnalysis(true)}
                className="text-muted-foreground hover:text-primary h-8 group"
              >
                <RefreshCw className="mr-2 h-3 w-3 group-hover:rotate-180 transition-transform duration-500" /> Re-analyze & Update
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TicketAIAnalysis;