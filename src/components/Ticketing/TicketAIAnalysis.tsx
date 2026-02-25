"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, BrainCircuit, Lightbulb, CheckCircle2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { Badge } from "@/components/ui/badge";

interface TicketAIAnalysisProps {
  ticket: any;
  comments: any[];
}

const TicketAIAnalysis = ({ ticket, comments }: TicketAIAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-ticket', {
        body: {
          title: ticket.title,
          description: ticket.description,
          comments: comments
        }
      });

      if (error) throw error;
      setAnalysis(data);
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
          className="w-full h-12 rounded-xl border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold group"
        >
          <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" /> AI Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8 overflow-hidden">
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">AI Diagnostic</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Generative analysis of the current ticket context.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground font-medium animate-pulse">Processing ticket context...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {analysis.solution}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
              <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-widest py-1">
                Confidence: {Math.round(analysis.confidence * 100)}%
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={runAnalysis}
                className="text-muted-foreground hover:text-primary h-8"
              >
                <RefreshCw className="mr-2 h-3 w-3" /> Re-analyze
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TicketAIAnalysis;