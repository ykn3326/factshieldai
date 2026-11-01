import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthShell, FieldError } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { USE_MOCK_DATA } from "@/lib/config";
import { isEmailOrMobile, loginSchema } from "@/lib/validation";
import { seo } from "@/lib/seo";
import { errText } from "@/lib/errText";

export const Route = createFileRoute("/login")({
  head: () => seo("Login", "Log in to FACTSHIELD AI to save and revisit your verification reports."),
  component: LoginPage,
});


function LoginPage() {
  const { t, lang } = useTranslation();
  const { login, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), mode: "onTouched", defaultValues: { contact: "", password: "" } });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (v) => {
    setFailed(false);
    try {
      await login(v.contact, v.password);
      toast.success(t.auth.loginSuccess);
      navigate({ to: "/home" });
    } catch {
      setFailed(true);
    }
  });

  return (
    <AuthShell title={t.auth.loginTitle} sub={t.auth.loginSub}>
      {USE_MOCK_DATA && (
        <div className="mb-5 flex gap-2.5 rounded-xl border border-unverified/30 bg-unverified-soft p-3 text-sm text-unverified">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {t.auth.demoNote}
        </div>
      )}
      {failed && (
        <div role="alert" className="mb-5 flex gap-2.5 rounded-xl border border-destructive/30 bg-misleading-soft p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {t.auth.loginFailed}
        </div>
      )}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="contact" className="mb-1.5 block font-semibold text-navy">{t.auth.contact}</Label>
          <Input id="contact" autoComplete="username" placeholder={t.auth.contactPh} className="h-12 rounded-xl text-base" aria-invalid={!!errors.contact} aria-describedby="contact-err" {...form.register("contact")} />
          <FieldError id="contact-err" message={errText(t, errors.contact?.message)} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password" className="font-semibold text-navy">{t.auth.password}</Label>
            <button type="button" onClick={() => setForgotOpen(true)} className="min-h-9 text-sm font-semibold text-primary hover:underline">
              {t.auth.forgot}
            </button>
          </div>
          <PasswordInput id="password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby="pw-err" {...form.register("password")} />
          <FieldError id="pw-err" message={errText(t, errors.password?.message)} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />} {t.common.login}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.auth.noAccount}{" "}
        <Link to="/signup" className="font-bold text-primary hover:underline">{t.auth.createOne}</Link>
      </p>
      <Button
        variant="guest"
        size="lg"
        className="mt-4 w-full"
        onClick={() => {
          continueAsGuest(lang);
          navigate({ to: "/home" });
        }}
      >
        {t.common.continueGuest}
      </Button>
      <ForgotDialog open={forgotOpen} onOpenChange={setForgotOpen} />
    </AuthShell>
  );
}

function ForgotDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) { setSent(false); setValue(""); setError(undefined); }
      }}
    >
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t.auth.forgotTitle}</DialogTitle>
          <DialogDescription>{t.auth.forgotDesc}</DialogDescription>
        </DialogHeader>
        {sent ? (
          <div role="status" className="flex gap-2.5 rounded-xl border border-verified/30 bg-verified-soft p-4 text-sm text-verified">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> {t.auth.resetDemo}
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!value.trim()) return setError(t.errors.required);
              if (!isEmailOrMobile(value)) return setError(t.errors.contactInvalid);
              setSent(true);
            }}
            className="space-y-3"
          >
            <Label htmlFor="forgot" className="font-semibold">{t.auth.contact}</Label>
            <Input id="forgot" value={value} onChange={(e) => { setValue(e.target.value); setError(undefined); }} className="h-12 rounded-xl text-base" placeholder={t.auth.contactPh} aria-invalid={!!error} />
            <FieldError id="forgot-err" message={error} />
            <Button type="submit" size="lg" className="w-full">{t.auth.sendReset}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
