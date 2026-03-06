"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, Clock, ShieldCheck, Mail, Phone, Globe } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const PublicInvoice = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [invoice, setInvoice] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicInvoice = async () => {
      try {
        // Fetch invoice using ID and token for security
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', id)
          .eq('public_share_token', token)
          .single();

        if (invoiceError || !invoiceData) {
          throw new Error("Invoice not found or link expired.");
        }

        setInvoice(invoiceData);

        // Fetch business settings for the owner of this invoice
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('owner_user_id', invoiceData.owner_user_id)
          .maybeSingle();

        setSettings(settingsData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && token) {
      fetchPublicInvoice();
    } else {
      setError("Invalid invoice link.");
      setIsLoading(false);
    }
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-slate-600 font-medium animate-pulse">Loading secure invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="bg-white border-slate-200 max-w-md w-full p-8 text-center rounded-[2.5rem] shadow-xl">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Access Denied</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <Button asChild className="rounded-full px-8">
            <a href="/">Return Home</a>
          </Button>
        </Card>
      </div>
    );
  }

  const isTaxInvoice = settings?.company_tax_status === 'GST Registered';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Secure Invoice Portal</h1>
              <p className="text-sm text-slate-500 font-medium">Verified by {settings?.company_name || 'Daniele Buatti IT'}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
            </Button>
          </div>
        </div>

        <Card className="bg-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden text-slate-900">
          <CardContent className="p-8 md:p-16 space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <div className="text-2xl font-black tracking-tighter mb-2 uppercase text-slate-900">
                  {settings?.company_name || 'DANIELE BUATTI'}
                </div>
                <div className="text-sm text-slate-600 font-semibold">
                  {settings?.sender_name || 'IT Support & Security Specialist'}
                </div>
                <div className="text-xs text-slate-500 mt-6 space-y-2">
                  {settings?.company_abn && <div className="flex items-center gap-2"><Badge variant="outline" className="text-[9px] py-0 border-slate-200 text-slate-600">ABN</Badge> {settings.company_abn}</div>}
                  {settings?.company_email && <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-slate-400" /> {settings.company_email}</div>}
                  {settings?.company_phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-slate-400" /> {settings.company_phone}</div>}
                </div>
              </div>
              
              <div className="text-left md:text-right">
                <div className="text-4xl md:text-5xl font-black text-slate-200 mb-6 select-none">
                  {isTaxInvoice ? 'TAX INVOICE' : 'INVOICE'}
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-slate-900">{invoice.number}</div>
                  <div className="text-sm text-slate-500 font-medium">Issued: {format(new Date(invoice.invoice_date), 'MMMM d, yyyy')}</div>
                  <div className="text-sm font-bold text-primary">Due: {format(new Date(invoice.due_date), 'MMMM d, yyyy')}</div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Bill To</div>
                <div className="text-xl font-bold text-slate-900">{invoice.client_display_name}</div>
                <div className="text-sm text-slate-500 mt-2 font-medium">Client Reference: {invoice.client_id?.slice(0, 8)}</div>
              </div>
              
              <div className="flex flex-col md:items-end">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Status</div>
                <Badge className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  invoice.status === 'paid' ? 'bg-green-500 text-white' : 'bg-primary text-white'
                }`}>
                  {invoice.status}
                </Badge>
              </div>
            </div>

            {/* Items Table */}
            <div className="pt-12 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-left">
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Qty</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Rate</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.line_items?.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-8 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-8 text-center text-slate-600 font-medium">{item.quantity}</td>
                      <td className="py-8 text-right text-slate-600 font-medium">${item.unit_price?.toFixed(2)}</td>
                      <td className="py-8 text-right font-bold text-slate-900">${(item.quantity * item.unit_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-12">
              <div className="w-full md:w-72 space-y-4 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-900">${invoice.untaxed_amount?.toFixed(2)}</span>
                </div>
                {isTaxInvoice && (
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">GST (10%)</span>
                    <span className="text-slate-900">${invoice.tax_amount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-slate-200 flex justify-between text-2xl font-black text-slate-900">
                  <span>Total</span>
                  <span>${invoice.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-12 border-t border-slate-100">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Payment Instructions</div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Bank Transfer (EFT)</p>
                      <div className="space-y-1 text-sm font-bold text-slate-900">
                        <p>{settings?.company_banking_details?.bank_name || 'Commonwealth Bank'}</p>
                        <p>BSB: {settings?.company_banking_details?.bsb || '000-000'}</p>
                        <p>Account: {settings?.company_banking_details?.account_number || '00000000'}</p>
                        <p className="text-primary mt-2">Reference: {invoice.number}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-end">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Terms</div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Payment is due within {settings?.payment_terms || '14 days'} of the invoice date. 
                    Please include the invoice number as your payment reference.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-24 text-[10px] text-slate-400 uppercase tracking-[0.3em] text-center font-bold">
              Professional IT Support & Security • Melbourne, AU
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-12 text-center print:hidden">
          <p className="text-sm text-slate-500 font-medium">
            This is a secure digital invoice. For any billing enquiries, please contact <a href={`mailto:${settings?.company_email}`} className="text-primary hover:underline font-bold">{settings?.company_email}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicInvoice;