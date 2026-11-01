import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main" className="flex-1 animate-fade-up">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({ title, sub, children, className }: { title: string; sub?: string; children?: ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border bg-soft", className)}>
      <div className="bg-network-light absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-5xl">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
