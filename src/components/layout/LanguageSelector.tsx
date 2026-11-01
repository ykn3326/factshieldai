import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/context/LanguageContext";
import { LANGS } from "@/i18n";
import { cn } from "@/lib/utils";

export function LanguageSelector({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  const { lang, setLang, t } = useTranslation();
  const current = LANGS.find((l) => l.code === lang)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.common.language}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors",
          onDark ? "text-navy-foreground hover:bg-navy-foreground/10" : "text-navy hover:bg-surface",
          className,
        )}
      >
        <Globe className="h-4 w-4" />
        {current.native}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 rounded-xl">
        {LANGS.map((l) => (
          <DropdownMenuItem key={l.code} onSelect={() => setLang(l.code)} className="h-11 justify-between rounded-lg text-base">
            <span lang={l.code}>{l.native}</span>
            {l.code === lang && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Inline segmented switcher (used on auth screens, forms and the report). */
export function LanguagePills({
  value,
  onChange,
  label,
  onDark = false,
}: {
  value: string;
  onChange: (l: "en" | "hi" | "pa") => void;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-xl p-1", onDark ? "bg-navy-foreground/10" : "bg-surface")}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          role="radio"
          aria-checked={value === l.code}
          onClick={() => onChange(l.code)}
          lang={l.code}
          className={cn(
            "min-h-10 rounded-lg px-3 text-sm font-semibold transition-all",
            value === l.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : onDark
                ? "text-navy-foreground/80 hover:text-navy-foreground"
                : "text-muted-foreground hover:text-navy",
          )}
        >
          {l.native}
        </button>
      ))}
    </div>
  );
}
