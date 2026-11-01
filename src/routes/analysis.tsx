import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CircleDashed,
  FileCheck,
  FileSearch,
  Inbox,
  Languages,
  Link2,
  Loader2,
  MinusCircle,
  Scale,
  ScanText,
  SearchCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useTranslation } from "@/context/LanguageContext";
import { useVerification } from "@/context/VerificationContext";
import { STEP_KEYS, verificationService } from "@/services/verificationService";
import { dictionaries } from "@/i18n";
import { fmt } from "@/i18n";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { ContentLang, StepKey, StepState } from "@/types";

export const Route = createFileRoute("/analysis")({
  staticData: { sitemap: false },
  head: () => seo("Analysing", "Follow each step while FACTSHIELD AI prepares your verification report."),
  component: AnalysisPage,
});

const ICONS = [Inbox, ScanText, Languages, FileSearch, SearchCheck, Scale, FileCheck];
const initSteps = () => Object.fromEntries(STEP_KEYS.map((k) => [k, "pending"])) as Record<StepKey, StepState>;

function AnalysisPage() {
  const { t } = useTranslation();
  const { job, ready, addReport } = useVerification();
  const navigate = useNavigate();
  const [steps, setSteps] = useState(initSteps);
  const [contentLang, setContentLang] = useState<ContentLang | null>(null);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState<keyof typeof dictionaries.en.liveErrors>("analysisFailed");
  const [errorDetail, setErrorDetail] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | undefined>();
  const [attempt, setAttempt] = useState(0);
  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!ready || !job) return;
    const ac = new AbortController();
    ctrl.current = ac;
    setSteps(initSteps());
    setError(false);
    setErrorDetail("");
    setErrorStatus(undefined);
    setContentLang(null);
    verificationService
      .run(job, {
        signal: ac.signal,
        onStep: (k, s) => setSteps((prev) => ({ ...prev, [k]: s })),
        onLanguage: setContentLang,
      })
      .then((report) => {
        if (ac.signal.aborted) return;
        addReport(report);
        navigate({ to: "/results/$id", params: { id: report.id }, replace: true });
      })
      .catch((e) => {
        if ((e as Error).name === "AbortError") return;
        setSteps((prev) => {
          const k = STEP_KEYS.find((x) => prev[x] === "progress");
          return k ? { ...prev, [k]: "error" } : prev;
        });
        setError(true);
        setErrorCode(e.code && e.code in dictionaries.en.liveErrors ? e.code : "interrupted");
        setErrorDetail(e.detail ?? "");
        setErrorStatus(e.status);
      });
    return () => ac.abort();
  }, [ready, job, attempt, addReport, navigate]);

  if (!ready) return <SiteLayout><div className="h-96" /></SiteLayout>;

  if (!job) {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface text-primary"><Inbox className="h-9 w-9" /></span>
          <h1 className="mt-6 text-2xl font-bold text-navy">{t.analysis.noJob}</h1>
          <p className="mt-2 text-muted-foreground">{t.analysis.noJobDesc}</p>
          <Button asChild size="lg" className="mt-6"><Link to="/verify">{t.analysis.startNew} <ArrowRight /></Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const req = job.request;
  const visible = STEP_KEYS;
  const finished = visible.filter((k) => steps[k] === "done" || steps[k] === "skipped").length;
  const pct = Math.round((finished / visible.length) * 100);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        <div className="mt-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-4xl">{t.analysis.title}</h1>
            <p className="mt-1 text-muted-foreground">{t.analysis.sub}</p>
          </div>
          {!error && (
            <Button variant="outline" onClick={() => { ctrl.current?.abort(); navigate({ to: "/verify" }); }}>
              <X /> {t.common.cancel}
            </Button>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7" aria-live="polite">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-navy">{t.analysis.progress}</span>
              <span className="tabular-nums text-primary">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-3 h-2.5" />
            <ol className="mt-7 space-y-1">
              {visible.map((k, i) => {
                const s = steps[k];
                const Icon = ICONS[i];
                const info = t.analysis.steps[i];
                if (!Icon || !info) return null;
                return (
                  <li key={k} className={cn("relative flex gap-4 rounded-2xl p-3 transition-colors duration-300", s === "progress" && "bg-surface")}>
                    {i < visible.length - 1 && <span className={cn("absolute left-[2.15rem] top-14 h-[calc(100%-2.5rem)] w-0.5", s === "done" ? "bg-verified/40" : "bg-border")} aria-hidden />}
                    <span
                      className={cn(
                        "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300",
                        s === "done" && "border-verified bg-verified text-primary-foreground",
                        s === "progress" && "border-primary bg-card text-primary shadow-glow",
                        s === "pending" && "border-border bg-card text-muted-foreground",
                        s === "skipped" && "border-dashed border-border bg-muted text-muted-foreground",
                        s === "error" && "border-misleading bg-misleading-soft text-misleading",
                      )}
                    >
                      {s === "done" ? <Check className="h-5 w-5" /> : s === "progress" ? <Loader2 className="h-5 w-5 animate-spin" /> : s === "skipped" ? <MinusCircle className="h-5 w-5" /> : s === "error" ? <TriangleAlert className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={cn("font-bold", s === "pending" || s === "skipped" ? "text-muted-foreground" : "text-navy")}>{info.title}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", s === "done" ? "bg-verified-soft text-verified" : s === "progress" ? "bg-surface-strong text-primary" : s === "error" ? "bg-misleading-soft text-misleading" : "bg-muted text-muted-foreground")}>
                          {t.analysis.state[s]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{info.desc}</p>
                      {k === "language" && contentLang && (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-surface px-2.5 py-1 text-sm font-semibold text-navy">
                          <Languages className="h-4 w-4 text-primary" /> {t.analysis.detected}: {t.langNames[contentLang]}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {error && (
              <div role="alert" className="mt-6 rounded-2xl border border-misleading/30 bg-misleading-soft p-5">
                <p className="flex items-center gap-2 font-bold text-misleading"><TriangleAlert className="h-5 w-5" /> {t.analysis.errorTitle}</p>
                <p className="mt-1 text-sm text-navy">{dictionaries[req.reportLang].liveErrors[errorCode]}</p>
                {errorDetail && <p className="mt-2 break-words text-sm text-navy">{errorDetail}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {![402, 403, 404].includes(errorStatus ?? 0) && <Button onClick={() => setAttempt((a) => a + 1)}>{t.common.tryAgain}</Button>}
                  <Button variant="outline" asChild><Link to="/verify">{t.common.goBack}</Link></Button>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.analysis.submitted}</p>
              {req.type === "text" && <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-sm text-navy">{req.text}</p>}
              {req.type === "image" && (
                <div className="mt-3">
                  {req.imageDataUrl ? <img src={req.imageDataUrl} alt={req.fileName ?? ""} className="max-h-48 w-full rounded-xl object-cover" /> : <BrainCircuit className="h-8 w-8 text-muted-foreground" />}
                  <p className="mt-2 truncate text-sm text-muted-foreground">{req.fileName}</p>
                </div>
              )}
              {req.type === "link" && (
                <p className="mt-3 flex items-start gap-2 break-all text-sm text-primary"><Link2 className="mt-0.5 h-4 w-4 shrink-0" /> {req.url}</p>
              )}
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.analysis.reportLang}</p>
              <p className="mt-2 font-bold text-navy">{t.langNames[req.reportLang]}</p>
              {contentLang && contentLang !== req.reportLang && (
                <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-surface p-3 text-sm text-navy">
                  <CircleDashed className="h-4 w-4 shrink-0 text-primary" />
                  {fmt(t.analysis.langNote, { a: t.langNames[contentLang], b: t.langNames[req.reportLang] })}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
