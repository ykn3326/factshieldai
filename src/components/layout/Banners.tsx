import { FlaskConical, Info, ShieldAlert } from "lucide-react";
import { USE_MOCK_DATA } from "@/lib/config";
import { useTranslation } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function PrototypeBadge({ className, short = false }: { className?: string; short?: boolean }) {
  const { t } = useTranslation();
  if (!USE_MOCK_DATA) return null;
  return (
    <span
      title={t.common.prototype}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-unverified/30 bg-unverified-soft px-2.5 py-1 text-xs font-semibold text-unverified",
        className,
      )}
    >
      <FlaskConical className="h-3.5 w-3.5" aria-hidden />
      {short ? t.common.prototypeShort : t.common.prototype}
    </span>
  );
}

export function DemoBanner({ text, className }: { text: string; className?: string }) {
  if (!USE_MOCK_DATA) return null;
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
