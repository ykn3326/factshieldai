import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, HelpCircle, Loader2, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, SiteLayout } from "@/components/layout/SiteLayout";
import { FieldError } from "@/components/auth/AuthShell";
import { useTranslation } from "@/context/LanguageContext";
import { contactSchema } from "@/lib/validation";
import { errText } from "@/lib/errText";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact Us", "Send Team IGNITE a question, feedback or partnership idea about FACTSHIELD AI."),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof contactSchema>>({ resolver: zodResolver(contactSchema), mode: "onTouched", defaultValues: { name: "", email: "", subject: "", message: "" } });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    form.reset();
  });

  const fields = [
    { name: "name" as const, label: t.contact.name, type: "text", auto: "name" },
    { name: "email" as const, label: t.contact.email, type: "email", auto: "email" },
    { name: "subject" as const, label: t.contact.subject, type: "text", auto: "off" },
  ];

  return (
    <SiteLayout>
      <PageHeader title={t.contact.title} sub={t.contact.sub} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8 lg:col-span-2">
          {sent ? (
            <div role="status" className="flex flex-col items-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-verified-soft text-verified"><CheckCircle2 className="h-8 w-8" /></span>
              <h2 className="mt-4 text-2xl font-bold text-navy">{t.contact.success}</h2>
              <p className="mt-1 text-muted-foreground">{t.contact.successDesc}</p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>{t.contact.another}</Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.name === "subject" ? "sm:col-span-2" : ""}>
                  <Label htmlFor={f.name} className="mb-1.5 block font-semibold text-navy">{f.label}</Label>
                  <Input id={f.name} type={f.type} autoComplete={f.auto} className="h-12 rounded-xl text-base" aria-invalid={!!errors[f.name]} {...form.register(f.name)} />
                  <FieldError id={`${f.name}-err`} message={errText(t, errors[f.name]?.message)} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <Label htmlFor="message" className="mb-1.5 block font-semibold text-navy">{t.contact.message}</Label>
                <Textarea id="message" rows={6} className="rounded-xl text-base" aria-invalid={!!errors.message} {...form.register("message")} />
                <FieldError id="message-err" message={errText(t, errors.message?.message)} />
              </div>
              <Button type="submit" size="lg" className="sm:col-span-2 sm:w-fit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />} {t.contact.send}
              </Button>
            </form>
          )}
        </section>
        <aside className="space-y-4">
          <div className="rounded-3xl bg-navy p-6 text-navy-foreground">
            <h2 className="text-lg font-bold">{t.contact.details}</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3"><Mail className="h-5 w-5 text-cyan" /><div><p className="text-navy-foreground/60">{t.contact.emailLabel}</p><p className="font-semibold">team.ignite@example.com</p></div></li>
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-cyan" /><div><p className="text-navy-foreground/60">{t.contact.location}</p><p className="font-semibold">{t.contact.locationValue}</p></div></li>
            </ul>
            <p className="mt-5 text-xs text-navy-foreground/60">{t.contact.placeholder}</p>
          </div>
          <Link to="/how-it-works" hash="faq" className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card p-4 font-semibold text-navy shadow-card hover:border-primary">
            <HelpCircle className="h-5 w-5 text-primary" /> {t.contact.faqLink}
          </Link>
        </aside>
      </div>
    </SiteLayout>
  );
}
