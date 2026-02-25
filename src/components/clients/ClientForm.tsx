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
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, UserPlus } from "lucide-react";

const formSchema = z.object({
  display_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  is_company: z.boolean().default(false),
  job_title: z.string().optional(),
});

interface ClientFormProps {
  onSuccess: () => void;
}

const ClientForm = ({ onSuccess }: ClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: "",
      email: "",
      phone: "",
      is_company: false,
      job_title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('clients')
        .insert([{ ...values, owner_user_id: user?.id }]);

      if (error) throw error;

      showSuccess("Client added successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      showError("Failed to add client");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name / Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Acme Corp" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</FormLabel>
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
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+61..." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_company"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 bg-white/5 rounded-xl border border-white/10">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-bold">This is a company</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl bg-primary text-white font-bold">
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UserPlus className="mr-2 h-4 w-4" /> Add Client</>}
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;