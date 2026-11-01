import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, Send } from "lucide-react";
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
  const [sendUnavailable, setSendUnavailable] = useState(false);
  const form = useForm<z.infer<typeof contactSchema>>({ resolver: zodResolver(contactSchema), mode: "onTouched", defaultValues: { name: "", email: "", subject: "", message: "" } });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit(() => {
    setSendUnavailable(true);
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
            <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
              <p className="text-sm text-muted-foreground sm:col-span-2">{t.contact.unavailable}</p>
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
              {sendUnavailable && <p role="alert" className="text-sm text-misleading sm:col-span-2">{t.contact.notSent}</p>}
              <Button type="submit" size="lg" className="sm:col-span-2 sm:w-fit" disabled>
                <Send /> {t.contact.send}
              </Button>
            </form>
        </section>
        <aside className="space-y-4">
          <div className="rounded-3xl bg-navy p-6 text-navy-foreground">
            <h2 className="text-lg font-bold">{t.contact.details}</h2>
            <p className="mt-4 text-sm text-navy-foreground/80">{t.contact.detailsPending}</p>
          </div>
          <Link to="/how-it-works" hash="faq" className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card p-4 font-semibold text-navy shadow-card hover:border-primary">
            <HelpCircle className="h-5 w-5 text-primary" /> {t.contact.faqLink}
          </Link>
        </aside>
      </div>
    </SiteLayout>
  );
}
