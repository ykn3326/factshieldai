import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  FileCheck,
  Hand,
  ImageIcon,
  Languages,
  Newspaper,
  ScanText,
  ScrollText,
  Upload,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function SectionTitle({ title, sub, center = true }: { title: string; sub?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <h2 className="text-2xl font-extrabold tracking-tight text-navy md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-base text-muted-foreground md:text-lg">{sub}</p>}
    </div>
  );
}

const STEP_ICONS = [Upload, ScanText, BrainCircuit, FileCheck];

export function HowItWorksSteps({ showCta = true }: { showCta?: boolean }) {
  const { t } = useTranslation();
  return (
    <div>
      <ol className="relative grid gap-6 lg:grid-cols-4 lg:gap-5">
        <span className="absolute left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/40 to-primary/5 lg:hidden" aria-hidden />
        <span className="absolute left-[12%] right-[12%] top-[52px] hidden h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 lg:block" aria-hidden />
        {t.how.steps.map((s, i) => {
          const Icon = STEP_ICONS[i]!;
          return (
            <li key={i} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient text-primary-foreground shadow-glow lg:mt-6">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-card lg:w-full">
                <span className="text-xs font-extrabold tracking-widest text-primary">0{i + 1}</span>
                <h3 className="mt-1 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {showCta && (
        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link to="/verify">
              {t.how.cta} <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

const FEATURE_ICONS = [Newspaper, ScanText, ImageIcon, Languages, ScrollText, Hand];

export function FeaturesGrid() {
  const { t } = useTranslation();
  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.features.list.map((f, i) => {
          const Icon = FEATURE_ICONS[i]!;
          const preview = i === 2;
          return (
            <li key={i} className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
              {preview && (
                <span className="absolute right-4 top-4 rounded-full border border-review/30 bg-review-soft px-2.5 py-1 text-xs font-bold text-review">
                  {t.common.preview} · {t.common.comingSoon}
                </span>
              )}
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-muted p-5 sm:flex-row sm:items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.features.upcoming}</span>
        <div className="flex flex-1 items-center gap-3 text-muted-foreground">
          <Video className="h-5 w-5" aria-hidden />
          <div>
            <p className="font-semibold">{t.features.deepfake}</p>
            <p className="text-sm">{t.features.deepfakeDesc}</p>
          </div>
        </div>
        <span className="w-fit rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground">{t.common.comingSoon}</span>
      </div>
    </div>
  );
}
