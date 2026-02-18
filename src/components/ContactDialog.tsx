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
import EnquiryForm from "./EnquiryForm";

interface ContactDialogProps {
  children: React.ReactNode;
}

const ContactDialog = ({ children }: ContactDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-card border-white/10 text-white rounded-[2.5rem] p-8 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-bold tracking-tight">Start a Conversation</DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg">
            I typically respond to new enquiries within 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        <EnquiryForm />

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Based in Melbourne, Australia • Available for On-site & Remote
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;