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
import { Loader2, Building2, User } from "lucide-react";

const formSchema = z.object({
  display_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  phone: z.string().optional(),
  type: z.enum(['Individual', 'Company']),
  job_title: z.string().optional(),
  address: z.string().optional(),
  tax_id: z.string().optional(),
});

interface ClientFormProps {
  client?: any;
  onClientCreated?: () => void;
}

const ClientForm = ({ client, onClientCreated }: ClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: client?.display_name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      type: client?.type || "Individual",
      job_title: client?.job_title || "",
      address: client?.address ? JSON.stringify(client.address, null, 2) : "",
      tax_id: client?.tax_id || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const clientData = {
        display_name: values.display_name,
        email: values.email || null,
        phone: values.phone || null,
        type: values.type,
        job_title: values.job_title || null,
        address: values.address ? JSON.parse(values.address || "{}") : null,
        tax_id: values.tax_id || null,
      };

      if (client) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', client.id);

        if (error) throw error;
        showSuccess("Client updated successfully!");
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert([clientData]);

        if (error) throw error;
        showSuccess("Client added successfully!");
      }

      form.reset();
      onClientCreated?.();
    } catch (error) {
      console.error("Error saving client:", error);
      showError(client ? "Failed to update client" : "Failed to add client");
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {watchType === 'Company' ? 'Company Name' : 'Full Name'}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={watchType === 'Company' ? "Acme Corp" : "John Doe"} 
                    {...field} 
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="Individual">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Individual
                      </div>
                    </SelectItem>
                    <SelectItem value="Company">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company
                      </div>
                    </SelectItem>
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
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    {...field} 
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
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
                  <Input 
                    placeholder="+61 4XX XXX XXX" 
                    {...field} 
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchType === 'Individual' && (
          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Job Title / Role</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Marketing Director" 
                    {...field} 
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {watchType === 'Company' ? 'ABN / Business Number' : 'Tax ID (Optional)'}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={watchType === 'Company' ? "12 345 678 901" : "Optional"} 
                    {...field} 
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Address (JSON format)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='{"street": "123 Main St", "city": "Melbourne", "state": "VIC", "postcode": "3000", "country": "Australia"}' 
                  className="bg-white/5 border-white/10 min-h-[100px] rounded-xl font-mono text-sm"
                  {...field} 
                />
              </FormControl>
              <p className="text-[10px] text-muted-foreground mt-2">
                Enter address as JSON. Leave empty if not needed.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.history.back()}
            className="h-12 rounded-xl border-white/10"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-12 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] transition-all"
          >
            {isSubmitting ? (
              <>Saving... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
            ) : (
              client ? 'Update Client' : 'Add Client'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;