"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer,
  Mail,
  Building2,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchInvoice = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      setInvoice(data);
    } catch (e) {
      console.error(e);
      showError("Failed to load invoice");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInvoice();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      showSuccess(`Invoice marked as ${newStatus}`);
      fetchInvoice();
    } catch (e) {
      showError("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      showSuccess("Invoice deleted");
      navigate('/invoices');
    } catch (e) {
      showError("Failed to delete invoice");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Clock className="animate-spin text-primary" /></div>;
  if (!invoice) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Invoice not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => navigate('/invoices')} className="text-muted-foreground hover:text-white -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
              </Button>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold tracking-tighter">{invoice.number}</h1>
                <InvoiceStatusBadge status={invoice.status} className="text-xs px-3 py-1" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-xl border-white/10 bg-white/5" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              {invoice.status !== 'paid' && (
                <Button className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold" onClick={() => handleStatusUpdate('paid')} disabled={isUpdating}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Paid
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="rounded-xl text-red-400 hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-white/10 text-white rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <Card className="bg-white p-12 rounded-[2.5rem] text-black shadow-2xl print:shadow-none print:p-0">
                <CardContent className="p-0 space-y-12">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-black tracking-tighter mb-2">DANIELE BUATTI</div>
                      <div className="text-sm text-slate-500 font-medium">IT Support & Security Specialist</div>
                      <div className="text-xs text-slate-400 mt-4">Melbourne, Australia</div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-slate-200 mb-4">INVOICE</div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold">{invoice.number}</div>
                        <div className="text-xs text-slate-500">Date: {format(new Date(invoice.invoice_date), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-slate-500">Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Bill To</div>
                      <div className="text-lg font-bold">{invoice.client_display_name}</div>
                      <div className="text-sm text-slate-500 mt-2">Client ID: {invoice.client_id?.slice(0, 8)}</div>
                    </div>
                  </div>

                  <div className="pt-12">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-slate-900 text-left">
                          <th className="pb-4 text-[10px] font-bold uppercase tracking-widest">Description</th>
                          <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-center">Qty</th>
                          <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-right">Rate</th>
                          <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoice.line_items?.map((item: any, i: number) => (
                          <tr key={i}>
                            <td className="py-6 font-medium">{item.description}</td>
                            <td className="py-6 text-center">{item.quantity}</td>
                            <td className="py-6 text-right">${item.unit_price?.toFixed(2)}</td>
                            <td className="py-6 text-right font-bold">${(item.quantity * item.unit_price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-12">
                    <div className="w-64 space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium">${invoice.untaxed_amount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">GST (10%)</span>
                        <span className="font-medium">${invoice.tax_amount?.toFixed(2)}</span>
                      </div>
                      <div className="pt-4 border-t-2 border-slate-900 flex justify-between text-xl font-black">
                        <span>Total</span>
                        <span>${invoice.total_amount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-24 text-[10px] text-slate-400 uppercase tracking-[0.2em] text-center">
                    Thank you for your business.
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="bg-white/5 border-white/10 rounded-[2.5rem]">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6">Payment Details</h3>
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Bank Transfer</p>
                      <p className="text-sm font-medium text-white">BSB: 000-000</p>
                      <p className="text-sm font-medium text-white">Account: 00000000</p>
                    </div>
                    <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold">
                      <Mail className="mr-2 h-4 w-4" /> Email to Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InvoiceDetail;