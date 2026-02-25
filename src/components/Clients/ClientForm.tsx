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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";

const formSchema = z.object({
  display_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  phone: z.string().optional(),
  is_company: z.boolean().default(false),
  type: z.enum(['Individual', 'Company']).default('Individual'),
  job_title: z.string().optional(),
  tax_id: z.string().optional(),
});

interface ClientFormProps {
  onSuccess?: () => void;
  initialData?: any;
}

const ClientForm = ({ onSuccess, initialData }: ClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: initialData?.display_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      is_company: initialData?.is_company || false,
      type: initialData?.type || "Individual",
      job_title: initialData?.job_title || "",
      tax_id: initialData?.tax_id || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const clientData = {
        ...values,
        owner_user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('clients')
          .insert([clientData]);
        error = insertError;
      }

      if (error) throw error;

      showSuccess(initialData?.id ? "Client updated successfully" : "Client created successfully");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving client:", error);
      showError("Failed to save client details");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name / Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp or Jane Doe" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</FormLabel>
                <Select onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue('is_company', val === 'Company');
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="client@example.com" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+61 400 000 000" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Job Title / Role</FormLabel>
                <FormControl>
                  <Input placeholder="Director, Manager, etc." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tax ID / ABN</FormLabel>
                <FormControl>
                  <Input placeholder="ABN or Tax ID" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
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
            <>Saving... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
          ) : (
            <>Save Client <Save className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;