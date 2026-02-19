"use client";

import React, { useEffect } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingDialogProps {
  children: React.ReactNode;
}

const BookingDialog = ({ children }: BookingDialogProps) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "it-services" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#00022D" },
          dark: { "cal-brand": "#fafafa" }
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  const Content = () => (
    <div className="flex-grow overflow-hidden h-full min-h-[500px]">
      <Cal
        namespace="it-services"
        calLink="danielebuatti/it-services"
        style={{ width: "100%", height: "100%" }}
        config={{ 
          layout: "month_view", 
          theme: "dark",
          useSlotsViewOnSmallScreen: true as any
        }}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent className="bg-card border-white/10 text-white h-[90vh]">
          <DrawerHeader className="text-left px-6">
            <DrawerTitle className="text-xl font-bold">Schedule a Consultation</DrawerTitle>
          </DrawerHeader>
          <div className="px-2 pb-8 h-full">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] w-[95vw] bg-card border-white/10 text-white rounded-[2.5rem] p-0 overflow-hidden h-[85vh] flex flex-col">
        <div className="p-8 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Schedule a Consultation</DialogTitle>
          </DialogHeader>
        </div>
        <Content />
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;