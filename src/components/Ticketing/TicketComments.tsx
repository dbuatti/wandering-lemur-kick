"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Send, 
  Loader2, 
  ShieldAlert, 
  Clock, 
  History, 
  Image as ImageIcon, 
  X,
  Paperclip
} from "lucide-react";
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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAttachments = async (): Promise<string[]> => {
    if (attachments.length === 0) return [];
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${ticketId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ticket-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('ticket-attachments')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      showError("Failed to upload images");
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const addComment = async () => {
    if ((!commentText.trim() && attachments.length === 0) || !user) return;

    setIsSubmitting(true);
    try {
      const uploadedUrls = await uploadAttachments();
      
      const { data, error } = await supabase.functions.invoke('add-ticket-comment', {
        body: {
          ticket_id: ticketId,
          content: commentText,
          is_internal: isInternal,
          attachments: uploadedUrls
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
        is_internal: isInternal,
        attachments: uploadedUrls
      };

      setComments(prev => [newComment, ...prev]);
      setIsInternal(false);
      setCommentText('');
      setAttachments([]);
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
            
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                {attachments.map((file, index) => (
                  <div key={index} className="relative group h-20 w-20 rounded-lg overflow-hidden border border-white/10">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="preview" 
                      className="h-full w-full object-cover"
                    />
                    <button 
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted-foreground hover:text-primary h-10 px-4 rounded-xl border border-white/5"
                >
                  <ImageIcon className="h-4 w-4 mr-2" /> Add Images
                </Button>
              </div>
              
              <Button
                type="button"
                onClick={addComment}
                disabled={isSubmitting || (!commentText.trim() && attachments.length === 0)}
                className="h-12 px-8 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold transition-all"
              >
                {isSubmitting || uploadingImages ? (
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
                  {comment.content && <div className="mb-4">{comment.content}</div>}
                  
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {comment.attachments.map((url: string, i: number) => (
                        <a 
                          key={i} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative h-32 w-32 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all group"
                        >
                          <img 
                            src={url} 
                            alt="attachment" 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Paperclip className="h-5 w-5 text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
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