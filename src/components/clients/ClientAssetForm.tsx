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
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { Loader2, Save, Laptop, Key, AppWindow, FileText, Link as LinkIcon } from "lucide-react";

const formSchema = z.object({
  asset_type: z.enum(['device', 'login', 'software', 'link', 'other']),
  name: z.string().min(2, "Name is required"),
  // Flexible fields based on type
  serial_number: z.string().optional(),
  model: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  url: z.string().optional(),
  license_key: z.string().optional(),
  notes: z.string().optional(),
});

interface ClientAssetFormProps {
  clientId: string;
  onSuccess: () => void;
  initialData?: any;
}

const ClientAssetForm = ({ clientId, onSuccess, initialData }: ClientAssetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      asset_type: initialData.asset_type,
      name: initialData.name,
      ...initialData.details
    } : {
      asset_type: "device",
      name: "",
      serial_number: "",
      model: "",
      username: "",
      password: "",
      url: "",
      license_key: "",
      notes: "",
    },
  });

  const assetType = form.watch("asset_type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { asset_type, name, ...details } = values;
      
      const payload = {
        client_id: clientId,
        owner_user_id: user?.id,
        asset_type,
        name,
        details,
        updated_at: new Date().toISOString()
      };

      let error;
      if (initialData) {
        const { error: updateError } = await supabase
          .from('client_assets')
          .update(payload)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('client_assets')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      showSuccess(`Asset ${initialData ? 'updated' : 'added'} successfully`);
      onSuccess();
    } catch (error) {
      console.error(error);
      showError("Failed to save asset");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="asset_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Asset Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="device">
                    <div className="flex items-center gap-2"><Laptop className="h-4 w-4" /> Device</div>
                  </SelectItem>
                  <SelectItem value="login">
                    <div className="flex items-center gap-2"><Key className="h-4 w-4" /> Login / Account</div>
                  </SelectItem>
                  <SelectItem value="software">
                    <div className="flex items-center gap-2"><AppWindow className="h-4 w-4" /> Software / App</div>
                  </SelectItem>
                  <SelectItem value="link">
                    <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Link / Document</div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2"><FileText className="h-4 w-4" /> Other Detail</div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {assetType === 'device' ? 'Device Name (e.g. MacBook Pro)' : 
                 assetType === 'login' ? 'Service Name (e.g. iCloud)' :
                 assetType === 'software' ? 'Application Name' : 
                 assetType === 'link' ? 'Document Title (e.g. Problem Reference)' : 'Title'}
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter name..." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {assetType === 'device' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Model / Specs</FormLabel>
                  <FormControl>
                    <Input placeholder="M2 Max, 32GB" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="C02..." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {assetType === 'login' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Username / Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password Hint / Key</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Stored in 1Password" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Login URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {assetType === 'link' && (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Document URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://docs.google.com/..." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {assetType === 'software' && (
          <FormField
            control={form.control}
            name="license_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">License Key / Subscription ID</FormLabel>
                <FormControl>
                  <Input placeholder="XXXX-XXXX-XXXX" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Additional Notes</FormLabel>
              <FormControl>
                <Input placeholder="Any other details..." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl bg-primary text-white font-bold">
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> {initialData ? 'Update Asset' : 'Save Asset'}</>}
        </Button>
      </form>
    </Form>
  );
};

export default ClientAssetForm;