"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  FileText, 
  ArrowRight, 
  Filter, 
  Download, 
  MoreVertical,
  Loader2,
  Calendar,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoiceStatusBadge from "@/components/invoices/InvoiceStatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('type', 'IT Support') // Filtering by existing 'type' column
        .order('created_at', { ascending: false });
      if (error) throw error;
      setInvoices(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.client_display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                Billing <span className="text-primary">Portal.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light max-w-2xl">
                Manage your professional invoices, track payments, and monitor revenue.
              </p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] bg-card border-white/10 text-white rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold">New Invoice</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Generate a professional invoice for your IT support services.
                  </DialogDescription>
                </DialogHeader>
                <InvoiceForm onSuccess={(id) => {
                  setIsCreateOpen(false);
                  fetchInvoices();
                  navigate(`/invoices/${id}`);
                }} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice # or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-8">Start billing your clients by creating your first invoice.</p>
              <Button onClick={() => setIsCreateOpen(true)} className="rounded-full px-8">
                Create First Invoice
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredInvoices.map((inv) => (
                <Card 
                  key={inv.id} 
                  className="bg-white/5 border-white/10 hover:border-primary/30 transition-all group cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                          <span className="font-bold text-lg">{inv.number}</span>
                          <InvoiceStatusBadge status={inv.status} />
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {inv.client_display_name}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(new Date(inv.invoice_date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>

                      <div className="text-center md:text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-white">${inv.total_amount?.toFixed(2)}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Amount</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Invoices;