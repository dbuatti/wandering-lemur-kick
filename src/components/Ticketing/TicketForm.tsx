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
import { Loader2, PlusCircle } from "lucide-react";

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
  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, display_name, email, phone')
          .order('display_name', { ascending: true });

        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

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

      showSuccess("Ticket created successfully!");
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
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Client / Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                    <SelectValue placeholder={isLoadingClients ? "Loading clients..." : "Choose a client"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border-white/10">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.display_name}
                    </SelectItem>
                  ))}
                  {clients.length === 0 && !isLoadingClients && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No clients found. Please add one first.
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the issue or service required..." 
                  className="bg-white/5 border-white/10 min-h-[120px] rounded-xl resize-none" 
                  {...field} 
                />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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