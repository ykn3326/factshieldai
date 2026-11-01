import { AlertTriangle, CircleHelp, ScanEye, ShieldCheck, type LucideIcon } from "lucide-react";
import type { VerificationStatus } from "@/types";
import { cn } from "@/lib/utils";

export const STATUS_META: Record<VerificationStatus, { icon: LucideIcon; text: string; soft: string; border: string; solid: string }> = {
  verified: { icon: ShieldCheck, text: "text-verified", soft: "bg-verified-soft", border: "border-verified/40", solid: "bg-verified" },
  misleading: { icon: AlertTriangle, text: "text-misleading", soft: "bg-misleading-soft", border: "border-misleading/40", solid: "bg-misleading" },
  unverified: { icon: CircleHelp, text: "text-unverified", soft: "bg-unverified-soft", border: "border-unverified/40", solid: "bg-unverified" },
  review: { icon: ScanEye, text: "text-review", soft: "bg-review-soft", border: "border-review/40", solid: "bg-review" },
};

export const STATUSES: VerificationStatus[] = ["verified", "misleading", "unverified", "review"];

export function StatusBadge({ status, label, className }: { status: VerificationStatus; label: string; className?: string }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold", m.text, m.soft, m.border, className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}
