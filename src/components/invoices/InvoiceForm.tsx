"use client";

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
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
import { Loader2, Plus, Trash2, Save } from "lucide-react";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be > 0"),
  unit_price: z.coerce.number().min(0, "Price must be >= 0"),
  tax_rate: z.coerce.number().default(0),
});

const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  invoice_date: z.string().min(1, "Date is required"),
  due_date: z.string().min(1, "Due date is required"),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
  line_items: z.array(lineItemSchema).min(1, "At least one line item is required"),
  company_currency: z.string().default('AUD'),
});

interface InvoiceFormProps {
  initialData?: any;
  onSuccess: (invoiceId: string) => void;
}

const InvoiceForm = ({ initialData, onSuccess }: InvoiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [taxStatus, setTaxStatus] = useState<string>("GST Registered");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      invoice_date: initialData.invoice_date || new Date().toISOString().split('T')[0],
      due_date: initialData.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      company_currency: initialData.company_currency || initialData.currency || "AUD",
    } : {
      client_id: "",
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "draft",
      line_items: [{ description: "IT Support Services", quantity: 1, unit_price: 0, tax_rate: 10 }],
      company_currency: "AUD",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "line_items",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const [clientsRes, settingsRes] = await Promise.all([
        supabase.from('clients').select('id, display_name').eq('is_it_client', true).order('display_name'),
        supabase.from('settings').select('company_tax_status').eq('owner_user_id', user?.id).maybeSingle()
      ]);
      
      setClients(clientsRes.data || []);
      setIsLoadingClients(false);

      if (settingsRes.data) {
        const status = settingsRes.data.company_tax_status;
        setTaxStatus(status);
        
        if (status === 'Not Registered' && !initialData) {
          const currentItems = form.getValues("line_items");
          form.setValue("line_items", currentItems.map(item => ({ ...item, tax_rate: 0 })));
        }
      }
    };
    fetchData();
  }, [form, initialData]);

  const watchLineItems = form.watch("line_items");
  const totals = watchLineItems.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unit_price) || 0;
    const taxRate = Number(item.tax_rate) || 0;
    
    const subtotal = qty * price;
    const tax = subtotal * (taxRate / 100);
    return {
      untaxed: acc.untaxed + subtotal,
      tax: acc.tax + tax,
      total: acc.total + subtotal + tax
    };
  }, { untaxed: 0, tax: 0, total: 0 });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const selectedClient = clients.find(c => c.id === values.client_id);
      
      const payload = {
        ...values,
        client_display_name: selectedClient?.display_name,
        untaxed_amount: totals.untaxed,
        tax_amount: totals.tax,
        total_amount: totals.total,
        type: 'IT Support',
        owner_user_id: user?.id,
        updated_at: new Date().toISOString()
      };

      let result;
      if (initialData?.id) {
        result = await supabase.from('invoices').update(payload).eq('id', initialData.id).select().single();
      } else {
        const { count } = await supabase.from('invoices').select('*', { count: 'exact', head: true });
        const invoiceNumber = `INV-${String((count || 0) + 1).padStart(4, '0')}`;
        result = await supabase.from('invoices').insert([{ ...payload, number: invoiceNumber }]).select().single();
      }

      if (result.error) throw result.error;

      showSuccess(`Invoice ${initialData ? 'updated' : 'created'} successfully`);
      onSuccess(result.data.id);
    } catch (error) {
      console.error(error);
      showError("Failed to save invoice.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Client</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                      <SelectValue placeholder={isLoadingClients ? "Loading..." : "Select client"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-white/10">
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.display_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
            name="invoice_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invoice Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Line Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unit_price: 0, tax_rate: taxStatus === 'GST Registered' ? 10 : 0 })} className="rounded-lg border-white/10 h-8">
              <Plus className="h-3 w-3 mr-2" /> Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-4 items-start p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="col-span-12 md:col-span-6">
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Description" {...field} className="bg-transparent border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any" 
                            placeholder="Qty" 
                            {...field} 
                            className="bg-transparent border-white/10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.unit_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any" 
                            placeholder="Price" 
                            {...field} 
                            className="bg-transparent border-white/10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center gap-2">
                  <div className="text-right flex-1 font-bold text-sm">
                    ${((Number(watchLineItems[index]?.quantity) || 0) * (Number(watchLineItems[index]?.unit_price) || 0)).toFixed(2)}
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-red-400 hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-64 space-y-3 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${totals.untaxed.toFixed(2)}</span>
            </div>
            {taxStatus === 'GST Registered' && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST (10%)</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-lg text-white">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl bg-primary text-white font-bold">
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> {initialData ? 'Update Invoice' : 'Create Invoice'}</>}
        </Button>
      </form>
    </Form>
  );
};

export default InvoiceForm;