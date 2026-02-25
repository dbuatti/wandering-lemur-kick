"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Loader2, ShieldAlert, User, Clock, History } from "lucide-react";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

interface TicketCommentsProps {
  ticketId: string;
}

const TicketComments = ({ ticketId }: TicketCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInternal, setIsInternal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-ticket-comments', {
        body: {
          ticket_id: ticketId,
          limit: 50,
          offset: 0
        }
      });

      if (error) throw error;
      setComments(data.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      showError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async () => {
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-ticket-comment', {
        body: {
          ticket_id: ticketId,
          content: commentText,
          is_internal: isInternal
        }
      });

      if (error) throw error;

      const newComment = {
        id: data.comment_id,
        content: commentText,
        user: {
          email: user.email
        },
        created_at: new Date().toISOString(),
        is_internal: isInternal
      };

      setComments(prev => [newComment, ...prev]);
      setIsInternal(false);
      setCommentText('');
      showSuccess("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      showError("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Activity Log</h3>
            <p className="text-sm text-muted-foreground">Timeline of updates and communications.</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/10 px-3 py-1 rounded-full">
          {comments.length} Events
        </Badge>
      </div>

      {/* Comment Input */}
      <Card className="bg-white/[0.02] border-white/10 rounded-[2rem] overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="internal"
                checked={isInternal}
                onCheckedChange={(checked) => setIsInternal(checked as boolean)}
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="internal" className="text-xs font-bold uppercase tracking-widest text-muted-foreground cursor-pointer flex items-center gap-2">
                Internal Note <ShieldAlert className="h-3 w-3" />
              </label>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Markdown supported</span>
          </div>
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Add a comment or internal note..."
              className="bg-black/20 border-white/10 rounded-2xl resize-none min-h-[120px] focus:ring-primary p-6 text-lg font-light"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={addComment}
                disabled={isSubmitting || !commentText.trim()}
                className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Post Update <Send className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative pl-8 space-y-12 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
            No activity recorded yet.
          </div>
        ) : (
          comments.map((comment, idx) => (
            <div key={comment.id} className="relative">
              <div className={cn(
                "absolute -left-[25px] top-0 h-5 w-5 rounded-full border-4 border-background z-10",
                comment.is_internal ? "bg-blue-500" : "bg-primary"
              )} />
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">{comment.user?.email?.split('@')[0] || 'System'}</span>
                    {comment.is_internal && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] uppercase tracking-widest font-bold px-2 py-0">
                        Internal
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest">
                    <Clock className="h-3 w-3" />
                    {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                  </div>
                </div>
                
                <div className={cn(
                  "p-6 rounded-2xl text-sm leading-relaxed border transition-all",
                  comment.is_internal 
                    ? "bg-blue-500/[0.03] border-blue-500/10 text-blue-100/80" 
                    : "bg-white/[0.02] border-white/5 text-muted-foreground"
                )}>
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketComments;