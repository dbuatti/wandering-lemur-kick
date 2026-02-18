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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import EnquiryForm from "./EnquiryForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactDialogProps {
  children: React.ReactNode;
}

const ContactDialog = ({ children }: ContactDialogProps) => {
  const isMobile = useIsMobile();

  const FormContent = () => (
    <div className="space-y-6">
      <EnquiryForm />
      <div className="pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Based in Melbourne, Australia • Available for On-site & Remote
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent className="bg-card border-white/10 text-white p-6 max-h-[95vh] overflow-y-auto">
          <DrawerHeader className="text-left px-0 mb-6">
            <DrawerTitle className="text-2xl font-bold">Start a Conversation</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              I typically respond within 24 hours.
            </DrawerDescription>
          </DrawerHeader>
          <FormContent />
        </DrawerContent>
      </Drawer>
    );
  }

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
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;