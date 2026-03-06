"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InvoiceStatusBadgeProps {
  status: string;
  className?: string;
}

const InvoiceStatusBadge = ({ status, className }: InvoiceStatusBadgeProps) => {
  const statusMap: Record<string, { label: string; class: string }> = {
    draft: { label: "Draft", class: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    sent: { label: "Sent", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    paid: { label: "Paid", class: "bg-green-500/10 text-green-400 border-green-500/20" },
    overdue: { label: "Overdue", class: "bg-red-500/10 text-red-400 border-red-500/20" },
    cancelled: { label: "Cancelled", class: "bg-slate-700/10 text-slate-500 border-slate-700/20" },
  };

  const config = statusMap[status.toLowerCase()] || statusMap.draft;

  return (
    <Badge variant="outline" className={cn("text-[10px] uppercase tracking-widest font-bold px-2 py-0.5", config.class, className)}>
      {config.label}
    </Badge>
  );
};

export default InvoiceStatusBadge;