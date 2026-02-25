"use client";

import React, { useState, useEffect } from 'react';
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
import { Loader2, PlusCircle, UserPlus, Sparkles, Wand2, ShieldCheck } from "lucide-react";
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
}

const TicketForm = ({ onTicketCreated }: TicketFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, display_name, email, phone, type')
        .eq('is_it_client', true) // Only show IT clients for tickets
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

  const handleClientCreated = () => {
    fetchClients();
    setIsCreateClientOpen(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "other",
      client_id: "",
      tags: "",
    },
  });

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

      // Update form fields with AI suggestions
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.id === values.client_id);
      
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
        }
      });

      if (error) throw error;

      showSuccess(`Ticket #${data.ticket_number || data.id.slice(0, 8)} created successfully!`);
      form.reset();
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    {clients.length === 0 && !isLoadingClients && (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No IT clients found. Please add one first.
                      </div>
                    )}
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
                    <ClientForm onSuccess={handleClientCreated} />
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
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Raw Description</FormLabel>
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
                      <><Sparkles className="h-3 w-3 mr-2" /> AI Enhance & Classify</>
                    )}
                  </Button>
                </div>
                <FormControl>
                  <Textarea 
                    placeholder="Type the issue here... (e.g. 'My MacBook is running slow and I think I have a virus')" 
                    className="bg-white/5 border-white/10 min-h-[120px] rounded-xl resize-none focus:ring-primary" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="estimated_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Hours (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.5"
                    min="0"
                    placeholder="e.g. 2.5" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tags (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. urgent, mac, backup" 
                    {...field} 
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </FormControl>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Comma-separated tags
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-14 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 transition-all"
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