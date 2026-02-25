"use client";

import React, { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  client_id: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['security', 'setup', 'optimization', 'recovery', 'other']).default('other'),
  estimated_hours: z.number().min(0).max(100).optional(),
  tags: z.string().optional(),
  related_invoice_id: z.string().optional(),
  related_quote_id: z.string().optional(),
});

interface TicketFormProps {
  clientId?: string;
  clientDisplayName?: string;
  clientEmail?: string;
  clientPhone?: string;
  onTicketCreated?: (ticketId: string) => void;
}

const TicketForm = ({ clientId, clientDisplayName, clientEmail, clientPhone, onTicketCreated }: TicketFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      category: "other",
      estimated_hours: undefined,
      tags: "",
      client_id: clientId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-ticket', {
        body: {
          client_id: values.client_id,
          client_display_name: clientDisplayName,
          client_email: clientEmail,
          client_phone: clientPhone,
          title: values.title,
          description: values.description,
          priority: values.priority,
          category: values.category,
          estimated_hours: values.estimated_hours,
          tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
          related_invoice_id: values.related_invoice_id || undefined,
          related_quote_id: values.related_quote_id || undefined,
        }
      });

      if (error) throw error;

      showSuccess("Ticket created successfully!");
      form.reset();
      onTicketCreated?.(data);
    } catch (error) {
      console.error("Error creating ticket:", error);
      showError("Failed to create ticket. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Brief description of the issue" {...field} className="bg-white/5 border-white/10" />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed description of the problem, steps to reproduce, and any error messages..." 
                    className="bg-white/5 border-white/10 min-h-[120px] resize-none" 
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
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
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
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10">
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

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </Button>
          </div>

          {showAdvanced && (
            <div className="grid gap-6 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="estimated_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Hours</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.5" 
                          placeholder="e.g. 2.5" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="bg-white/5 border-white/10"
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
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. apple, macbook, wifi" 
                          {...field} 
                          className="bg-white/5 border-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="related_invoice_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Invoice ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. inv_12345" 
                          {...field} 
                          className="bg-white/5 border-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="related_quote_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Quote ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. quo_12345" 
                          {...field} 
                          className="bg-white/5 border-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>Creating Ticket... <span className="ml-2">⏳</span></>
          ) : (
            <>Create Ticket</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TicketForm;