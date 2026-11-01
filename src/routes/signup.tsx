import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell, FieldError } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { LanguagePills } from "@/components/layout/LanguageSelector";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { passwordStrength, signupSchema } from "@/lib/validation";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { errText } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => seo("Sign Up", "Create a free FACTSHIELD AI account to save reports and set your preferred language."),
  component: SignupPage,
});

const BAR = ["bg-misleading", "bg-unverified", "bg-primary", "bg-verified"];

function SignupPage() {
  const { t, lang, setLang } = useTranslation();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { name: "", contact: "", password: "", confirm: "", prefLang: lang, agree: false },
  });
  const { errors, isSubmitting } = form.formState;
  const pw = form.watch("password");
  const strength = passwordStrength(pw);
  const sLabels = [t.auth.strength.weak, t.auth.strength.weak, t.auth.strength.fair, t.auth.strength.good, t.auth.strength.strong];

  const onSubmit = form.handleSubmit(async (v) => {
    try {
      await signup(v.name, v.contact, v.password, v.prefLang);
      setLang(v.prefLang);
      toast.success(t.auth.signupSuccess);
      navigate({ to: "/dashboard" });
    } catch {
      toast.error(t.errors.generic);
    }
  });

  return (
    <AuthShell title={t.auth.signupTitle} sub={t.auth.signupSub}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <Label htmlFor="name" className="mb-1.5 block font-semibold text-navy">{t.auth.fullName}</Label>
          <Input id="name" autoComplete="name" placeholder={t.auth.fullNamePh} className="h-12 rounded-xl text-base" aria-invalid={!!errors.name} {...form.register("name")} />
          <FieldError id="name-err" message={errText(t, errors.name?.message)} />
        </div>
        <div>
          <Label htmlFor="contact" className="mb-1.5 block font-semibold text-navy">{t.auth.contact}</Label>
          <Input id="contact" autoComplete="username" placeholder={t.auth.contactPh} className="h-12 rounded-xl text-base" aria-invalid={!!errors.contact} {...form.register("contact")} />
          <FieldError id="contact-err" message={errText(t, errors.contact?.message)} />
        </div>
        <div>
          <Label htmlFor="password" className="mb-1.5 block font-semibold text-navy">{t.auth.password}</Label>
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby="pw-hint" {...form.register("password")} />
          {pw && (
            <div className="mt-2" aria-live="polite">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= strength ? BAR[strength - 1] : "bg-muted")} />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{sLabels[strength]}</p>
            </div>
          )}
          <p id="pw-hint" className="mt-1 text-xs text-muted-foreground">{t.auth.pwHint}</p>
          <FieldError id="pw-err" message={errText(t, errors.password?.message)} />
        </div>
        <div>
          <Label htmlFor="confirm" className="mb-1.5 block font-semibold text-navy">{t.auth.confirmPassword}</Label>
          <PasswordInput id="confirm" autoComplete="new-password" aria-invalid={!!errors.confirm} {...form.register("confirm")} />
          <FieldError id="confirm-err" message={errText(t, errors.confirm?.message)} />
        </div>
        <div>
          <p className="mb-1.5 font-semibold text-navy">{t.auth.prefLang}</p>
          <Controller control={form.control} name="prefLang" render={({ field }) => <LanguagePills value={field.value} onChange={field.onChange} label={t.auth.prefLang} />} />
          <p className="mt-1 text-xs text-muted-foreground">{t.auth.prefLangHint}</p>
        </div>
        <div>
          <Controller
            control={form.control}
            name="agree"
            render={({ field }) => (
              <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-navy">
                <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} onBlur={field.onBlur} className="mt-0.5 h-5 w-5" aria-invalid={!!errors.agree} />
                <span>
                  {t.auth.agreePre}{" "}
                  <Link to="/terms" target="_blank" className="font-semibold text-primary underline">{t.auth.terms}</Link> {t.auth.and}{" "}
                  <Link to="/privacy" target="_blank" className="font-semibold text-primary underline">{t.auth.privacy}</Link>
                </span>
              </label>
            )}
          />
          <FieldError id="agree-err" message={errText(t, errors.agree?.message)} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />} {t.auth.createAccount}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.auth.haveAccount}{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">{t.common.login}</Link>
      </p>
    </AuthShell>
  );
}
