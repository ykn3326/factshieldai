import { Info, ShieldAlert } from "lucide-react";
import { USE_MOCK_DATA } from "@/lib/config";
import { cn } from "@/lib/utils";


export function DemoBanner({ text, className, show = USE_MOCK_DATA }: { text: string; className?: string; show?: boolean }) {
  if (!show) return null;
  return (
    <div role="note" className={cn("flex items-start gap-3 rounded-2xl border border-unverified/30 bg-unverified-soft p-4 text-sm font-medium text-unverified", className)}>
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p>{text}</p>
    </div>
  );
}

export function Disclaimer({ text, className }: { text: string; className?: string }) {
  return (
    <div role="note" className={cn("flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm text-navy", className)}>
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
      <p>{text}</p>
    </div>
  );
}
