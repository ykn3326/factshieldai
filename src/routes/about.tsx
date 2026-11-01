import { createFileRoute } from "@tanstack/react-router";
import { Compass, Flame, HeartHandshake, Target, UserRound } from "lucide-react";
import { PageHeader, SiteLayout } from "@/components/layout/SiteLayout";
import { ShieldMark } from "@/components/layout/Logo";
import { useTranslation } from "@/context/LanguageContext";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("About Us", "FACTSHIELD AI by Team IGNITE — making digital information safer, smarter and accessible for everyone."),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <PageHeader title={t.about.title} sub={t.about.sub} />
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 md:py-20">
        <section className="grid gap-8 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
            <dl className="mb-6 flex flex-wrap gap-3">
              <div className="rounded-xl bg-surface px-4 py-2"><dt className="text-xs font-semibold text-muted-foreground">{t.about.project}</dt><dd className="font-extrabold text-navy">FACTSHIELD AI</dd></div>
              <div className="rounded-xl bg-surface px-4 py-2"><dt className="text-xs font-semibold text-muted-foreground">{t.about.team}</dt><dd className="font-extrabold text-navy">IGNITE</dd></div>
            </dl>
            <p className="text-xl font-semibold leading-relaxed text-navy">{t.about.description}</p>
            <p className="mt-4 text-lg text-muted-foreground">{t.about.goal}</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-brand p-8 text-navy-foreground shadow-elevated lg:col-span-2">
            <div className="bg-network absolute inset-0" aria-hidden />
            <ShieldMark className="relative h-14 w-14" />
            <p className="relative mt-6 text-2xl font-extrabold leading-snug">{t.common.brandMessage}</p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {[
            { icon: Target, title: t.about.missionTitle, body: t.about.mission },
            { icon: Compass, title: t.about.visionTitle, body: t.about.vision },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-7 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary"><Icon className="h-6 w-6" /></span>
              <h2 className="mt-4 text-xl font-bold text-navy">{title}</h2>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-surface p-7 md:p-10">
          <div className="flex items-center gap-3">
            <HeartHandshake className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-extrabold text-navy">{t.about.whyTitle}</h2>
          </div>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-navy">{t.about.why}</p>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-primary-foreground"><Flame className="h-6 w-6" /></span>
            <div>
              <h2 className="text-2xl font-extrabold text-navy">{t.about.teamTitle}</h2>
              <p className="text-muted-foreground">{t.about.teamSub}</p>
            </div>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="rounded-3xl border border-dashed border-border bg-card p-6 text-center">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface text-muted-foreground"><UserRound className="h-9 w-9" /></span>
                <p className="mt-4 font-bold text-navy">{t.about.member} {n}</p>
                <p className="text-sm text-muted-foreground">{t.about.role}</p>
                <p className="mt-3 rounded-full bg-unverified-soft px-2 py-1 text-xs font-semibold text-unverified">{t.about.placeholder}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteLayout>
  );
}
