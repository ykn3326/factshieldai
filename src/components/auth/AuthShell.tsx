import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { PrototypeBadge } from "@/components/layout/Banners";
import { useTranslation } from "@/context/LanguageContext";

export function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen overflow-hidden bg-soft">
      <div className="bg-network-light absolute inset-0" aria-hidden />
      <div className="absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/welcome" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-navy hover:bg-surface">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">{t.auth.backWelcome}</span>
        </Link>
        <LanguageSelector />
      </header>
      <main id="main" className="relative mx-auto flex max-w-md flex-col px-4 pb-16 pt-4 animate-fade-up">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <PrototypeBadge />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-destructive">
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" strokeLinecap="round" /></svg>
      {message}
    </p>
  );
}
