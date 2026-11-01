import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookmarkCheck,
  BookmarkPlus,
  CalendarClock,
  ChevronDown,
  Download,
  ExternalLink,
  FileQuestion,
  Fingerprint,
  Languages,
  Link2,
  ListChecks,
  MessageSquareText,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { DemoBanner, Disclaimer } from "@/components/layout/Banners";
import { LanguagePills } from "@/components/layout/LanguageSelector";
import { STATUS_META } from "@/components/report/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { useVerification } from "@/context/VerificationContext";
import { reportService } from "@/services/reportService";
import { dictionaries, LOCALES } from "@/i18n";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Lang, VerificationReport } from "@/types";

export const Route = createFileRoute("/results/$id")({
  head: () => ({ ...seo("Verification Report", "Your FACTSHIELD AI verification report with status, explanation, evidence and sources."), }),
  component: ResultsPage,
});

function ResultsPage() {
  const { id } = Route.useParams();
  const { t, lang } = useTranslation();
  const { user, isRegistered, ready: authReady } = useAuth();
  const { reports, ready, setJob } = useVerification();
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savePrompt, setSavePrompt] = useState(false);

  const report: VerificationReport | undefined = useMemo(() => {
    if (reports[id]) return reports[id];
    if (authReady && isRegistered && user && typeof window !== "undefined") return reportService.get(user.id, id);
    return undefined;
  }, [reports, id, isRegistered, user, authReady]);

  const [reportLang, setReportLang] = useState<Lang>(lang);
  useEffect(() => {
    if (report) setReportLang(report.reportLanguage);
  }, [report?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isRegistered && user) setSavedIds(reportService.list(user.id).map((r) => r.id));
  }, [isRegistered, user]);

  if (!ready || !authReady) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-12 sm:px-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-40 rounded-3xl" /><Skeleton className="h-40 rounded-3xl" /></div>
        </div>
      </SiteLayout>
    );
  }

  if (!report) {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface text-primary"><FileQuestion className="h-9 w-9" /></span>
          <h1 className="mt-6 text-2xl font-bold text-navy">{t.report.notFound}</h1>
          <p className="mt-2 text-muted-foreground">{t.report.notFoundDesc}</p>
          <Button asChild size="lg" className="mt-6"><Link to="/verify">{t.report.another}</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const rt = dictionaries[reportLang];
  const meta = STATUS_META[report.status];
  const StatusIcon = meta.icon;
  const status = rt.status[report.status];
  const isSaved = savedIds.includes(report.id);
  const dateStr = new Intl.DateTimeFormat(LOCALES[reportLang], { dateStyle: "long", timeStyle: "short" }).format(new Date(report.createdAt));

  const save = () => {
    if (!isRegistered || !user) return setSavePrompt(true);
    reportService.save(user.id, { ...report, reportLanguage: reportLang });
    setSavedIds((s) => [...s, report.id]);
    toast.success(rt.report.saved);
  };

  const share = async () => {
    const content = report.request.text ?? report.request.url ?? report.request.fileName ?? "";
    const summary = [
      `FACTSHIELD AI — ${rt.report.title}${report.isDemo ? ` (${rt.report.demoResult})` : ""}`,
      `${rt.report.statusTitle}: ${status.label} — ${status.def}`,
      `"${content.slice(0, 160)}${content.length > 160 ? "…" : ""}"`,
      report.explanation[reportLang],
      ...(report.sources.length ? report.sources.map((s) => `${s.title[reportLang]} — ${s.url}`) : []),
      ...(report.limitations ? [report.limitations[reportLang]] : []),
      `${rt.report.reportId}: ${report.id}`,
      rt.common.disclaimer,
      rt.report.shareReminder,
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(summary);
      toast.success(rt.report.copied, { description: rt.report.shareReminder });
    } catch {
      toast.error(t.errors.clipboard);
    }
  };

  const another = () => {
    setJob(null);
    navigate({ to: "/verify" });
  };

  return (
    <SiteLayout>
      <div lang={reportLang} className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        <DemoBanner text={rt.common.demoBanner} className="no-print" show={report.isDemo} />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">{rt.report.reportId}: <span className="font-mono text-navy">{report.id}</span></p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-navy md:text-4xl">{rt.report.title}</h1>
          </div>
          <div className="no-print">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{rt.report.reportLang}</p>
            <LanguagePills value={reportLang} onChange={setReportLang} label={rt.report.reportLang} />
          </div>
        </div>

        {/* Status hero */}
        <section className={cn("print-card relative mt-6 overflow-hidden rounded-3xl border-2 p-6 shadow-elevated sm:p-8", meta.border, meta.soft)} aria-labelledby="status-h">
          {report.isDemo && (
            <span className="absolute right-4 top-4 rounded-full border border-unverified/30 bg-card px-2.5 py-1 text-xs font-bold text-unverified">{rt.report.demoResult}</span>
          )}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-primary-foreground shadow-card", meta.solid)}>
              <StatusIcon className="h-10 w-10" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{rt.report.statusTitle}</p>
              <h2 id="status-h" className={cn("text-3xl font-extrabold sm:text-4xl", meta.text)}>{status.label}</h2>
              <p className="mt-1 text-base text-navy">{status.def}</p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="no-print mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button variant="outline" onClick={() => window.print()}><Download /> {rt.report.download}</Button>
          <Button variant={isSaved ? "secondary" : "outline"} onClick={save} disabled={isSaved}>
            {isSaved ? <BookmarkCheck /> : <BookmarkPlus />} {isSaved ? rt.report.saved : rt.report.save}
          </Button>
          <Button variant="outline" onClick={share}><Share2 /> {rt.report.share}</Button>
          <Button onClick={another} className="col-span-2 sm:ml-auto"><RotateCcw /> {rt.report.another}</Button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card icon={MessageSquareText} title={rt.report.submitted}>
              <SubmittedContent report={report} rt={rt} />
            </Card>
            <Card icon={FileQuestion} title={rt.report.explanation}>
              <p className="text-base leading-relaxed text-navy">{report.explanation[reportLang]}</p>
            </Card>
            <Card icon={ListChecks} title={rt.report.evidence}>
              <ul className="space-y-3">
                {report.evidence.map((e, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl bg-surface p-4">
                    <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", meta.solid)} aria-hidden />
                    <div>
                      <p className="font-bold text-navy">{e.title[reportLang]}</p>
                      <p className="text-sm text-muted-foreground">{e.description[reportLang]}</p>
                       {e.quotes?.map((q, qi) => <blockquote key={qi} className="mt-2 border-l-2 border-primary pl-3 text-sm text-navy">“{q.text}” <span className="font-mono text-primary">[{q.sourceId}]</span></blockquote>)}
                       <div className="mt-2 flex flex-wrap gap-3">{e.sourceIds?.map((sid) => {
                         const source = report.sources.find((s) => s.id === sid);
                         return source ? <a key={sid} href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">[{sid}] {source.name}</a> : null;
                       })}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card icon={Link2} title={rt.report.sources} badge={report.isDemo ? rt.report.demoSources : undefined}>
              {!report.sources.length && <p className="text-sm text-muted-foreground">{rt.report.noSources}</p>}
              <ul className="grid gap-3 sm:grid-cols-2">
                {report.sources.map((s) => (
                  <li key={s.url} id={s.id}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col rounded-2xl border border-border p-4 transition-all hover:border-primary hover:shadow-card">
                      <span className="w-fit rounded-full bg-verified-soft px-2 py-0.5 text-xs font-bold text-verified">{rt.report.sourceTypes[s.type]}</span>
                      <span className="mt-2 font-bold text-navy">{s.id && `[${s.id}] `}{s.name}</span>
                      <span className="text-sm text-muted-foreground">{s.title[reportLang]}</span>
                      {s.summary && <span className="mt-2 text-sm text-navy">{s.summary[reportLang]}</span>}
                      <span className="mt-2 break-all text-xs text-primary">{s.url}</span>
                      {!report.isDemo && <span className="mt-2 text-xs text-muted-foreground">{s.publishedAt ? `${rt.report.publishedAt}: ${new Intl.DateTimeFormat(LOCALES[reportLang], { dateStyle: "medium" }).format(new Date(s.publishedAt))}` : rt.report.dateUnknown}</span>}
                      {s.retrievedAt && <span className="mt-1 text-xs text-muted-foreground">{rt.report.retrievedAt}: {new Intl.DateTimeFormat(LOCALES[reportLang], { dateStyle: "medium" }).format(new Date(s.retrievedAt))}</span>}
                      {s.cachedAt && <span className="mt-1 text-xs text-muted-foreground">{rt.report.cachedAt}: {new Intl.DateTimeFormat(LOCALES[reportLang], { dateStyle: "medium" }).format(new Date(s.cachedAt))}</span>}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        {rt.report.open} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only">{rt.report.newTab}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
            {report.limitations && <Card icon={FileQuestion} title={rt.report.limitations}>
              <p className="text-sm leading-relaxed text-navy">{report.limitations[reportLang]}</p>
              {report.searchQueries && <><h3 className="mt-4 text-sm font-bold text-navy">{rt.report.queries}</h3><ul className="mt-2 space-y-2">{report.searchQueries.map((q) => <li key={q} className="break-words text-sm text-muted-foreground">{q}</li>)}</ul></>}
            </Card>}
          </div>

          <aside className="space-y-6">
            <Card title={rt.report.details}>
              <dl className="space-y-4">
                <Detail icon={Languages} label={rt.report.detectedLang}>
                  <span className="rounded-full border border-primary/25 bg-surface px-2.5 py-1 text-sm font-bold text-navy">{rt.langNames[report.contentLanguage]}</span>
                </Detail>
                <Detail icon={Languages} label={rt.report.reportLang}>
                  <span className="rounded-full bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">{rt.langNames[reportLang]}</span>
                </Detail>
                <Detail icon={CalendarClock} label={rt.report.analysedAt}><span className="text-sm font-semibold text-navy">{dateStr}</span></Detail>
                <Detail icon={Fingerprint} label={rt.report.reportId}><span className="font-mono text-sm text-navy">{report.id}</span></Detail>
              </dl>
            </Card>
            <Disclaimer text={rt.common.disclaimer} />
            <p className="no-print text-xs text-muted-foreground">{rt.report.accountDemo}</p>
          </aside>
        </div>
      </div>

      <Dialog open={savePrompt} onOpenChange={setSavePrompt}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.report.saveTitle}</DialogTitle>
            <DialogDescription>{t.report.saveDesc}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button asChild size="lg"><Link to="/signup">{t.common.signup}</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">{t.common.login}</Link></Button>
          </div>
          <p className="text-sm text-muted-foreground">{rt.report.accountDemo}</p>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}

function Card({ title, icon: Icon, badge, children }: { title: string; icon?: typeof Link2; badge?: string | undefined; children: React.ReactNode }) {
  return (
    <section className="print-card rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        {Icon && <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-primary"><Icon className="h-5 w-5" aria-hidden /></span>}
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {badge && <span className="ml-auto rounded-full bg-unverified-soft px-2.5 py-1 text-xs font-bold text-unverified">{badge}</span>}
      </div>
      {children}
    </section>
  );
}

function Detail({ icon: Icon, label, children }: { icon: typeof Link2; label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Icon className="h-3.5 w-3.5" aria-hidden /> {label}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

function SubmittedContent({ report, rt }: { report: VerificationReport; rt: (typeof dictionaries)["en"] }) {
  const [open, setOpen] = useState(false);
  const r = report.request;
  if (r.type === "link") {
    return (
      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 break-all font-semibold text-primary hover:underline">
        <ExternalLink className="mt-1 h-4 w-4 shrink-0" /> {r.url}
      </a>
    );
  }
  if (r.type === "image") {
    return (
      <div className="space-y-4">
          {r.imageDataUrl && <img src={r.imageDataUrl} alt={r.fileName ?? rt.report.submitted} className="max-h-80 rounded-2xl border border-border object-contain" />}
        <p className="text-sm text-muted-foreground">{r.fileName}</p>
        {report.extractedText && (
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{rt.report.extracted}</p>
            <p lang={report.contentLanguage === "other" ? undefined : report.contentLanguage} className="mt-1 text-navy">{report.extractedText}</p>
          </div>
        )}
      </div>
    );
  }
  const text = r.text ?? "";
  const long = text.length > 280;
  return (
    <div>
      <blockquote
        lang={report.contentLanguage === "other" ? undefined : report.contentLanguage}
        className={cn("whitespace-pre-wrap rounded-2xl border-l-4 border-primary bg-surface p-4 text-navy", long && !open && "line-clamp-4")}
      >
        {text}
      </blockquote>
      {long && (
        <Button variant="ghost" onClick={() => setOpen((o) => !o)} className="mt-2 inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary" aria-expanded={open}>
          {open ? rt.report.showLess : rt.report.showMore}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </Button>
      )}
    </div>
  );
}
