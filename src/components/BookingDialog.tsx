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

interface BookingDialogProps {
  children: React.ReactNode;
}

const BookingDialog = ({ children }: BookingDialogProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#3b82f6" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] w-[95vw] bg-card border-white/10 text-white rounded-[2.5rem] p-0 overflow-hidden h-[85vh]">
        <div className="p-8 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Schedule a Consultation</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="flex-grow h-full overflow-y-auto">
          <Cal
            calLink="daniele-buatti/15min"
            style={{ width: "100%", height: "100%", minHeight: "600px" }}
            config={{ layout: "month_view", theme: "dark" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;