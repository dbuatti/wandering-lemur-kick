import { Loader2 } from "lucide-react";

const PageLoader = ({ label = "Loading..." }: { label?: string }) => (
  <div
    className="min-h-screen bg-background flex items-center justify-center gap-3 text-muted-foreground"
    role="status"
    aria-live="polite"
  >
    <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
    <span className="text-sm">{label}</span>
  </div>
);

export default PageLoader;
