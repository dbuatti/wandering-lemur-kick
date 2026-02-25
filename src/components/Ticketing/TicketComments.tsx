"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface TicketCommentsProps {
  ticketId: string;
}

const TicketComments = ({ ticketId }: TicketCommentsProps) => {
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
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      showError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-ticket-comment', {
        body: {
          ticket_id: ticketId,
          content,
          is_internal: isInternal
        }
      });

      if (error) throw error;

      const newComment = {
        id: data,
        content,
        user: {
          email: "me@domain.com" // This would be replaced with actual user info
        },
        created_at: new Date().toISOString(),
        is_internal: isInternal
      };

      setComments([newComment, ...comments]);
      setIsInternal(false);
      setCommentText('');
      showSuccess("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      showError("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    fetchComments();
  }, [ticketId]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No comments yet. Add one to get started!</div>
        ) : (
          <div className="space-y-6 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {comment.user?.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.user?.email || 'Unknown User'}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{comment.content}</p>
                  {comment.is_internal && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                      Internal Note
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-6">
          <div className="flex items-center mb-4">
            <Checkbox
              id="internal"
              checked={isInternal}
              onCheckedChange={(checked) => setIsInternal(checked as boolean)}
              className="mr-2"
            />
            <label htmlFor="internal" className="text-sm font-medium">
              Internal Note (not visible to client)
            </label>
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              className="bg-white/5 border-white/10 resize-none flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addComment(commentText);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (commentText.trim()) {
                  addComment(commentText);
                }
              }}
              disabled={isSubmitting || !commentText.trim()}
              className="h-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketComments;