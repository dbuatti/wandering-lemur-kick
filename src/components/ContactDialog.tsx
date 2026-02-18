"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Copy, Check } from "lucide-react";
import { useState } from "react";
import { showSuccess } from "@/utils/toast";

interface ContactDialogProps {
  children: React.ReactNode;
}

const ContactDialog = ({ children }: ContactDialogProps) => {
  const [copied, setCopied] = useState(false);
  const email = "Daniele.buatti@gmail.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    showSuccess("Email copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-white rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Start a Conversation</DialogTitle>
          <DialogDescription className="text-muted-foreground font-serif">
            I typically respond to new enquiries within 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          <div className="flex flex-col gap-4">
            <a 
              href={`mailto:${email}?subject=Enquiry: Private IT Support`}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold">Send an Email</div>
                  <div className="text-xs text-muted-foreground">{email}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full group-hover:text-primary">
                <Mail size={18} />
              </Button>
            </a>

            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                </div>
                <div>
                  <div className="text-sm font-bold">Copy Email Address</div>
                  <div className="text-xs text-muted-foreground">Save for later</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Based in Melbourne, Australia
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;