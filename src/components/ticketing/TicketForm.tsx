"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  PlusCircle, 
  UserPlus, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  UploadCloud,
  ScanText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClientForm from "@/components/clients/ClientForm";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  client_id: z.string().min(1, { message: "Please select a client." }),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['security', 'setup', 'optimization', 'recovery', 'other']).default('other'),
  estimated_hours: z.number().min(0).max(100).optional(),
  tags: z.string().optional(),
});

interface TicketFormProps {
  onTicketCreated?: (ticketId: string) => void;
  initialClientId?: string;
}

const TicketForm = ({ onTicketCreated, initialClientId }: TicketFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [ocrProcessingId, setOcrProcessingId] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [attachments, setAttachments] = useState<{file: File, id: string}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, display_name, email, phone, type')
        .eq('is_it_client', true)
        .order('display_name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "other",
      client_id: initialClientId || "",
      tags: "",
    },
  });

  useEffect(() => {
    if (initialClientId) {
      form.setValue("client_id", initialClientId);
    }
  }, [initialClientId, form]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (newFiles.length > 0) {
      const filesWithIds = newFiles.map(file => ({
        file,
        id: Math.random().toString(36).substring(7)
      }));
      setAttachments(prev => [...prev, ...filesWithIds]);
    }
  }, []);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];
    let hasImage = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
          hasImage = true;
        }
      }
    }

    if (hasImage) {
      e.preventDefault();
      addFiles(files);
    }
  };

  const handleManualOCR = async (attachmentId: string) => {
    const attachment = attachments.find(a => a.id === attachmentId);
    if (!attachment) return;

    setOcrProcessingId(attachmentId);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(attachment.file);
      });

      const base64Image = await base64Promise;
      
      const { data, error } = await supabase.functions.invoke('ocr-image', {
        body: { image_base64: base64Image }
      });

      if (error) throw error;

      if (data.text) {
        const currentDesc = form.getValues("description");
        const newDesc = currentDesc 
          ? `${currentDesc}\n\n[Extracted from ${attachment.file.name}]:\n${data.text}`
          : `[Extracted from ${attachment.file.name}]:\n${data.text}`;
        
        form.setValue("description", newDesc);
        showSuccess("Text extracted and added to description");
      }
    } catch (error) {
      console.error("OCR error:", error);
      showError("Failed to extract text from image");
    } finally {
      setOcrProcessingId(null);
    }
  };

  const handleAIClassify = async () => {
    const description = form.getValues("description");
    if (!description || description.length < 10) {
      showError("Please enter a longer description first.");
      return;
    }

    setIsClassifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('classify-ticket', {
        body: { description }
      });

      if (error) throw error;

      form.setValue("title", data.suggested_title);
      form.setValue("category", data.suggested_category);
      form.setValue("priority", data.suggested_priority);
      form.setValue("tags", data.suggested_tags.join(", "));
      form.setValue("description", data.formatted_description);

      showSuccess("AI has organized your ticket details!");
    } catch (error) {
      console.error("AI Classification error:", error);
      showError("Failed to classify ticket with AI.");
    } finally {
      setIsClassifying(false);
    }
  };

  const uploadAttachments = async (ticketId: string): Promise<string[]> => {
    if (attachments.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    try {
      for (const { file } of attachments) {
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
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.id === values.client_id);
      const tempId = Math.random().toString(36).substring(7);
      const uploadedUrls = await uploadAttachments(tempId);
      
      const { data, error } = await supabase.functions.invoke('create-ticket', {
        body: {
          client_id: values.client_id,
          client_display_name: selectedClient?.display_name,
          client_email: selectedClient?.email,
          client_phone: selectedClient?.phone,
          title: values.title,
          description: values.description,
          priority: values.priority,
          category: values.category,
          estimated_hours: values.estimated_hours,
          tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
          attachments: uploadedUrls
        }
      });

      if (error) throw error;

      showSuccess(`Ticket #${data.ticket_number || data.id.slice(0, 8)} created successfully!`);
      form.reset();
      setAttachments([]);
      onTicketCreated?.(data.id);
    } catch (error) {
      console.error("Error creating ticket:", error);
      showError("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select IT Client</FormLabel>
              <div className="flex gap-2">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl flex-1">
                      <SelectValue placeholder={isLoadingClients ? "Loading clients..." : "Choose a client"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-white/10">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center gap-2">
                          <span>{client.display_name}</span>
                          <span className="text-[10px] text-primary font-bold uppercase tracking-tighter bg-primary/10 px-1.5 rounded">IT</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Dialog open={isCreateClientOpen} onOpenChange={setIsCreateClientOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="h-12 px-4 rounded-xl border-white/10">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-bold">Add New Client</DialogTitle>
                    </DialogHeader>
                    <ClientForm onSuccess={() => {
                      fetchClients();
                      setIsCreateClientOpen(false);
                    }} />
                  </DialogContent>
                </Dialog>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col gap-1">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Raw Description</FormLabel>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">Paste or drag images to attach</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAIClassify}
                    disabled={isClassifying || !field.value || field.value.length < 10}
                    className={cn(
                      "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                      field.value && field.value.length >= 10 
                        ? "text-primary bg-primary/10 hover:bg-primary/20" 
                        : "text-muted-foreground opacity-50"
                    )}
                  >
                    {isClassifying ? (
                      <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Sparkles className="h-3 w-3 mr-2" /> AI Enhance</>
                    )}
                  </Button>
                </div>
                <FormControl>
                  <div 
                    className={cn(
                      "relative transition-all duration-300",
                      isDragging && "ring-2 ring-primary ring-offset-4 ring-offset-background"
                    )}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}
                  >
                    <Textarea 
                      placeholder="Type the issue here..." 
                      className="bg-white/5 border-white/10 min-h-[120px] rounded-xl resize-none focus:ring-primary p-6 text-lg font-light"
                      onPaste={handlePaste}
                      {...field} 
                    />
                    {isDragging && (
                      <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl pointer-events-none">
                        <UploadCloud className="h-8 w-8 text-primary animate-bounce mb-2" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Drop to attach</span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {attachments.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              {attachments.map((item, index) => (
                <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/20">
                  <img 
                    src={URL.createObjectURL(item.file)} 
                    alt="preview" 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-full text-[10px] font-bold uppercase tracking-widest rounded-lg"
                      onClick={() => handleManualOCR(item.id)}
                      disabled={ocrProcessingId === item.id}
                    >
                      {ocrProcessingId === item.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <><ScanText className="h-3 w-3 mr-1.5" /> Extract Text</>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-8 w-full text-[10px] font-bold uppercase tracking-widest rounded-lg"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3 mr-1.5" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-start">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-primary h-10 px-4 rounded-xl border border-white/5"
            >
              <ImageIcon className="h-4 w-4 mr-2" /> Attach Images
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ticket Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MacBook Security Audit" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="setup">Setup</SelectItem>
                    <SelectItem value="optimization">Optimization</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-14 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] transition-all"
        >
          {isSubmitting ? (
            <>Creating... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
          ) : (
            <>Create Ticket <PlusCircle className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TicketForm;