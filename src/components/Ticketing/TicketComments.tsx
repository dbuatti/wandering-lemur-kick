"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Loader2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/AuthProvider";

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

      // Optimistically add the comment to the list
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
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-6">
        <CardTitle className="flex items-center text-xl font-bold">
          <MessageSquare className="h-5 w-5 mr-3 text-primary" />
          Activity Log
          <Badge variant="secondary" className="ml-3 bg-white/10 text-white rounded-full">
            {comments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="space-y-8 mb-10">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-2xl">
              No comments yet. Start the conversation below.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={`flex gap-4 ${comment.is_internal ? 'opacity-80' : ''}`}>
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${comment.is_internal ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'}`}>
                    {comment.user?.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{comment.user?.email || 'Unknown User'}</span>
                      {comment.is_internal && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] uppercase tracking-widest font-bold px-2 py-0">
                          Internal
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${comment.is_internal ? 'bg-blue-500/5 border border-blue-500/10 text-blue-100' : 'bg-white/5 border border-white/5'}`}>
                    {comment.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
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
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Press Enter to send</span>
          </div>
          <div className="flex gap-3">
            <Textarea
              placeholder="Add a comment or internal note..."
              className="bg-black/20 border-white/10 rounded-xl resize-none flex-1 min-h-[80px] focus:ring-primary"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addComment();
                }
              }}
            />
            <Button
              type="button"
              onClick={addComment}
              disabled={isSubmitting || !commentText.trim()}
              className="h-auto px-6 rounded-xl bg-primary text-white hover:bg-primary/90"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketComments;