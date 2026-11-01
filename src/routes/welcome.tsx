import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Globe2, Lock, ScrollText, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo, ShieldMark } from "@/components/layout/Logo";
import { LanguagePills } from "@/components/layout/LanguageSelector";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/welcome")({
  staticData: { sitemap: true },
  head: () => seo("Welcome", "Log in, sign up or continue as a guest to verify suspicious content with FACTSHIELD AI."),
  component: Welcome,
});

function Welcome() {
  const { t, lang, setLang } = useTranslation();
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const trustIcons = [Globe2, ScrollText, Lock];

  const guest = () => {
    continueAsGuest(lang);
    toast(t.auth.guestStarted);
    navigate({ to: "/home" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative overflow-hidden bg-brand px-6 pb-10 pt-6 text-navy-foreground sm:px-10 lg:flex lg:flex-col lg:p-14">
        <div className="bg-network absolute inset-0" aria-hidden />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-cyan/25 blur-3xl" aria-hidden />
        <div className="relative flex items-center justify-between">
          <Logo onDark />
          <div className="lg:hidden">
            <LanguagePills value={lang} onChange={setLang} label={t.common.language} onDark />
          </div>
        </div>
        <div className="relative mt-10 lg:my-auto">
          <div className="relative mb-8 hidden h-44 w-44 lg:block" aria-hidden>
            <div className="absolute inset-0 rounded-full border border-navy-foreground/15" />
            <div className="absolute inset-5 rounded-full border border-navy-foreground/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldMark className="h-24 w-24 drop-shadow-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl xl:text-5xl">{t.common.tagline}</h1>
          <div className="mt-4 space-y-1 text-base text-navy-foreground/80">
            {lang !== "hi" && <p lang="hi" className="font-deva">विश्वास करने से पहले सच्चाई की जाँच करें।</p>}
            {lang !== "pa" && <p lang="pa" className="font-guru">ਵਿਸ਼ਵਾਸ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸੱਚਾਈ ਦੀ ਜਾਂਚ ਕਰੋ।</p>}
            {lang !== "en" && <p lang="en">Verify the Truth Before You Believe It.</p>}
          </div>
          <p className="mt-6 max-w-lg text-base text-navy-foreground/85 sm:text-lg">{t.welcome.intro}</p>
          <ul className="mt-8 hidden space-y-3 lg:block">
            {t.welcome.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-navy-foreground/90">
                <CheckCircle2 className="h-5 w-5 text-cyan" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative mt-8 hidden text-sm text-navy-foreground/60 lg:block">{t.footer.madeBy}</p>
      </section>

      {/* Actions */}
      <section className="flex flex-col bg-background px-6 py-8 sm:px-10 lg:p-14">
        <div className="hidden items-center justify-between lg:flex">
          <LanguagePills value={lang} onChange={setLang} label={t.common.language} />
        </div>
        <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center animate-fade-up">
          <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{t.welcome.choose}</h2>
          <p className="mt-2 text-muted-foreground">{t.welcome.noForce}</p>

          <div className="mt-8 grid gap-3">
            <Button asChild size="xl">
              <Link to="/login">{t.common.login} <ArrowRight /></Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/signup">{t.common.signup}</Link>
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> {t.common.or} <span className="h-px flex-1 bg-border" />
          </div>

          <Button size="xl" variant="guest" className="h-auto min-h-16 w-full justify-start gap-4 py-3 text-left" onClick={guest}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-card">
              <UserRound className="!size-5" />
            </span>
            <span className="flex flex-col whitespace-normal">
              <span className="text-base font-bold">{t.common.continueGuest}</span>
              <span className="text-sm font-medium text-muted-foreground">{t.common.guestHelper}</span>
            </span>
            <ArrowRight className="ml-auto" />
          </Button>

          <ul className="mt-10 grid grid-cols-3 gap-2">
            {t.welcome.trust.map((label, i) => {
              const Icon = trustIcons[i]!;
              return (
                <li key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center text-xs font-semibold text-navy">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  {label}
                </li>
              );
            })}
          </ul>
        </main>
      </section>
    </div>
  );
}
