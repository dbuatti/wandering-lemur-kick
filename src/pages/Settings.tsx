"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InvoiceSettingsForm from "../components/settings/InvoiceSettingsForm";
import { Settings as SettingsIcon, Shield, Info } from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <SettingsIcon className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  System Configuration
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                Business <span className="text-primary">Settings.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light max-w-2xl">
                Configure your business identity, tax status, and invoicing defaults to ensure compliance and professional branding.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <InvoiceSettingsForm />
              </div>
              
              <div className="lg:col-span-4 space-y-8">
                <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Compliance Note</h3>
                  </div>
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-light">
                    <p>
                      If you are registered for GST, your invoices must be titled <span className="text-white font-bold">"Tax Invoice"</span> and display your ABN.
                    </p>
                    <p>
                      If not registered, use <span className="text-white font-bold">"Invoice"</span> and do not include a GST component.
                    </p>
                    <p>
                      The system will automatically adjust your invoice headers based on the "Tax Status" selected.
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-xl font-bold">Record Keeping</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    Australian law requires you to keep business records for at least 5 years. All invoices generated here are stored securely in your private database.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;