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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, Save, Building2, ShieldCheck, CreditCard, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  company_name: z.string().min(2, "Business name is required"),
  company_abn: z.string().min(9, "Valid ABN is required"),
  company_email: z.string().email("Invalid email"),
  company_phone: z.string().optional(),
  company_website: z.string().optional(),
  company_tax_status: z.enum(['GST Registered', 'Not Registered']),
  sender_name: z.string().min(2, "Sender name is required"),
  invoice_prefix: z.string().default("INV-"),
  invoice_next_number: z.number().default(1),
  bank_name: z.string().optional(),
  bsb: z.string().optional(),
  account_number: z.string().optional(),
  payment_terms: z.string().default("14 days"),
});

const InvoiceSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      company_abn: "",
      company_email: "",
      company_tax_status: "GST Registered",
      sender_name: "Daniele Buatti",
      invoice_prefix: "INV-",
      invoice_next_number: 1,
      payment_terms: "14 days",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('owner_user_id', user.id)
          .maybeSingle();

        if (data) {
          form.reset({
            company_name: data.company_name || "",
            company_abn: data.company_abn || "",
            company_email: data.company_email || "",
            company_phone: data.company_phone || "",
            company_website: data.company_website || "",
            company_tax_status: (data.company_tax_status as any) || "GST Registered",
            sender_name: data.sender_name || "",
            invoice_prefix: data.invoice_prefix || "INV-",
            invoice_next_number: data.invoice_next_number || 1,
            bank_name: data.company_banking_details?.bank_name || "",
            bsb: data.company_banking_details?.bsb || "",
            account_number: data.company_banking_details?.account_number || "",
            payment_terms: data.payment_terms || "14 days",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { bank_name, bsb, account_number, ...rest } = values;
      
      const payload = {
        ...rest,
        owner_user_id: user.id,
        company_banking_details: { bank_name, bsb, account_number },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('settings')
        .upsert(payload, { onConflict: 'owner_user_id' });

      if (error) throw error;
      showSuccess("Settings updated successfully");
    } catch (error) {
      console.error(error);
      showError("Failed to save settings. Please ensure the database schema is up to date.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10 rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> Business Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legal Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Daniele Buatti IT" {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company_abn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ABN</FormLabel>
                      <FormControl>
                        <Input placeholder="00 000 000 000" {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_tax_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tax Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="GST Registered">GST Registered</SelectItem>
                          <SelectItem value="Not Registered">Not Registered</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="sender_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sender Name (on Invoice)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Contact & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="company_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Business Email</FormLabel>
                    <FormControl>
                      <Input placeholder="hello@danielebuatti.com" {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoice_prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invoice Prefix</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoice_next_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Next Number</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 rounded-[2rem] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment & Banking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CommBank" {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bsb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">BSB</FormLabel>
                      <FormControl>
                        <Input placeholder="000-000" {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000" {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payment_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" /> Payment Terms
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 14 days" {...field} className="bg-black/20 border-white/10 h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="h-14 px-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save All Settings</>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceSettingsForm;