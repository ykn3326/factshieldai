import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, ScanSearch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { VerificationBox } from "@/components/verify/VerificationBox";
import { FeaturesGrid, HowItWorksSteps, SectionTitle } from "@/components/landing/Sections";
import { StatusBadge } from "@/components/report/StatusBadge";
import { useTranslation } from "@/context/LanguageContext";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/home")({
  staticData: { sitemap: true },
  head: () => seo("Fact-check Messages, Screenshots and Links", "Check suspicious WhatsApp messages, screenshots and public links against web evidence with FACTSHIELD AI, in English, Hindi or Punjabi."),
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  const scrollToVerify = () => document.getElementById("verify")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand text-navy-foreground">
        <div className="bg-network absolute inset-0" aria-hidden />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/20 bg-navy-foreground/10 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-cyan" aria-hidden /> {t.common.brandMessage}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
              {t.home.heroA}
              <span className="mt-2 block bg-gradient-to-r from-cyan to-primary-foreground bg-clip-text text-transparent">{t.home.heroB}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-navy-foreground/85">{t.home.heroSub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="xl" onClick={scrollToVerify}>
                <ScanSearch /> {t.home.ctaVerify}
              </Button>
              <Button asChild size="xl" variant="ghostDark">
                <Link to="/how-it-works">{t.home.ctaHow} <ArrowRight /></Link>
              </Button>
            </div>
          </div>
          {/* Sample card */}
          <div className="relative mx-auto w-full max-w-md" aria-label={t.home.sample}>
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/30 blur-2xl" aria-hidden />
            <div className="relative rounded-3xl border border-navy-foreground/15 bg-card p-6 text-card-foreground shadow-elevated">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.home.sample}</span>
                <StatusBadge status="misleading" label={t.status.misleading.label} />
              </div>
              <p className="mt-5 rounded-2xl bg-surface p-4 text-sm font-medium italic text-navy">{t.home.sampleClaim}</p>
              <p className="mt-4 text-sm text-muted-foreground">{t.home.sampleNote}</p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-muted-foreground">{t.report.detectedLang}</p>
                  <p className="mt-0.5 font-bold text-navy">{t.langNames.en}</p>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-muted-foreground">{t.report.reportLang}</p>
                  <p className="mt-0.5 font-bold text-navy">{t.langNames.pa}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section id="verify" className="scroll-mt-20 bg-soft py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionTitle title={t.home.verifyTitle} sub={t.home.verifySub} />
          <VerificationBox className="mt-10" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={t.how.title} sub={t.how.sub} />
          <div className="mt-12"><HowItWorksSteps /></div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface/60 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle title={t.home.featuresTitle} sub={t.home.featuresSub} />
          <div className="mt-12"><FeaturesGrid /></div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle title={t.home.aboutTitle} center={false} />
            <p className="mt-4 text-lg text-muted-foreground">{t.about.description}</p>
            <p className="mt-3 text-muted-foreground">{t.about.goal}</p>
            <Button asChild variant="outline" size="lg" className="mt-6">
              <Link to="/about">{t.home.aboutMore} <ArrowRight /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand p-6 text-navy-foreground shadow-elevated">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-foreground/60">{t.about.project}</p>
              <p className="mt-2 text-2xl font-extrabold">FACTSHIELD AI</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.about.team}</p>
              <p className="mt-2 text-2xl font-extrabold text-navy">IGNITE</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:col-span-2">
              <p className="font-semibold text-navy">{t.common.brandMessage}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 rounded-3xl bg-navy p-8 text-navy-foreground md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-2xl font-extrabold">{t.home.contactTitle}</h2>
            <p className="mt-1 text-navy-foreground/75">{t.home.contactSub}</p>
          </div>
          <Button asChild size="lg" variant="onDark">
            <Link to="/contact"><Mail /> {t.home.contactBtn}</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
