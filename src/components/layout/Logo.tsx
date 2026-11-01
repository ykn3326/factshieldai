import { cn } from "@/lib/utils";

export function ShieldMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-9 w-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id="fs-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary-glow)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <path d="M20 3 6 8.5v10.2c0 8.6 5.9 15.6 14 18.3 8.1-2.7 14-9.7 14-18.3V8.5L20 3Z" fill="url(#fs-g)" />
      <path d="M20 6.4 9 10.7v8c0 6.9 4.6 12.6 11 15 6.4-2.4 11-8.1 11-15v-8L20 6.4Z" fill="none" stroke="var(--navy-foreground)" strokeOpacity=".35" />
      <path d="m13.5 20.2 4.3 4.3 8.7-9" fill="none" stroke="var(--navy-foreground)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ShieldMark />
      <span className={cn("font-extrabold tracking-tight text-lg leading-none", onDark ? "text-navy-foreground" : "text-navy")}>
        FACTSHIELD <span className="text-primary">AI</span>
      </span>
    </span>
  );
}
