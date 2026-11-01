import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bookmark,
  Eye,
  FileSearch,
  History,
  Languages,
  LockKeyhole,
  LogOut,
  Search,
  Trash2,
  UserCog,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { LanguagePills } from "@/components/layout/LanguageSelector";
import { FieldError } from "@/components/auth/AuthShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { STATUS_META, STATUSES, StatusBadge } from "@/components/report/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { reportService } from "@/services/reportService";
import { fmt, LOCALES } from "@/i18n";
import { isEmailOrMobile } from "@/lib/validation";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { VerificationReport, VerificationStatus } from "@/types";

const TABS = ["overview", "history", "saved", "language", "profile"] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute("/dashboard")({
  validateSearch: z.object({ tab: z.enum(TABS).optional() }),
  head: () => seo("Dashboard", "Your FACTSHIELD AI verification history, saved reports and settings."),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const { user, ready, isRegistered } = useAuth();

  if (!ready) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-12 sm:px-6">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </SiteLayout>
    );
  }

  if (!isRegistered || !user) {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface text-primary"><LockKeyhole className="h-9 w-9" /></span>
          <h1 className="mt-6 text-2xl font-extrabold text-navy">{t.dashboard.guestTitle}</h1>
          <p className="mt-2 text-muted-foreground">{t.dashboard.guestDesc}</p>
          <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
            <Button asChild size="lg"><Link to="/signup">{t.common.signup}</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">{t.common.login}</Link></Button>
          </div>
        </div>
      </SiteLayout>
    );
  }
  return <Dashboard />;
}

function Dashboard() {
  const { t, lang } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tab: tabParam } = Route.useSearch();
  const tab: Tab = tabParam ?? "overview";
  const [history, setHistory] = useState<VerificationReport[] | null>(null);

  useEffect(() => {
    setHistory(reportService.list(user!.id));
  }, [user]);

  const setTab = (tb: Tab) => navigate({ to: "/dashboard", search: { tab: tb }, replace: true });
  const remove = (id: string) => {
    reportService.remove(user!.id, id);
    setHistory(reportService.list(user!.id));
    toast.success(t.dashboard.itemDeleted);
  };
  const clearAll = () => {
    reportService.clear(user!.id);
    setHistory([]);
    toast.success(t.dashboard.deleted);
  };
  const doLogout = () => {
    logout();
    toast.success(t.auth.loggedOut);
    navigate({ to: "/welcome" });
  };

  const nav: { key: Tab; label: string; icon: typeof History }[] = [
    { key: "overview", label: t.dashboard.nav.overview, icon: BarChart3 },
    { key: "history", label: t.dashboard.nav.history, icon: History },
    { key: "saved", label: t.dashboard.nav.saved, icon: Bookmark },
    { key: "language", label: t.dashboard.nav.language, icon: Languages },
    { key: "profile", label: t.dashboard.nav.profile, icon: UserCog },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-navy">{fmt(t.dashboard.welcome, { name: user!.name })}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user!.contact}</p>
          </div>
          <span className="w-fit rounded-full border border-unverified/30 bg-unverified-soft px-3 py-1 text-xs font-semibold text-unverified">{t.dashboard.demoData}</span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav aria-label="Dashboard" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {nav.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                aria-current={tab === key ? "page" : undefined}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl px-4 text-sm font-semibold transition-colors",
                  tab === key ? "bg-primary text-primary-foreground shadow-glow" : "bg-card text-navy hover:bg-surface lg:bg-transparent",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
            <Button variant="ghost" className="hidden justify-start text-destructive lg:mt-4 lg:flex" onClick={doLogout}>
              <LogOut /> {t.common.logout}
            </Button>
          </nav>

          <div className="min-w-0 animate-fade-up" key={tab}>
            {history === null ? (
              <Skeleton className="h-80 rounded-3xl" />
            ) : tab === "overview" ? (
              <div className="space-y-6">
                <Stats history={history} />
                <HistoryList history={history.slice(0, 3)} onDelete={remove} simple />
              </div>
            ) : tab === "history" ? (
              <HistoryList history={history} onDelete={remove} onClear={clearAll} />
            ) : tab === "saved" ? (
              <SavedGrid history={history} />
            ) : tab === "language" ? (
              <LanguageSettings />
            ) : (
              <ProfileSettings onClear={clearAll} onLogout={doLogout} hasHistory={history.length > 0} />
            )}
          </div>
        </div>
      </div>
      <span className="sr-only">{lang}</span>
    </SiteLayout>
  );
}

function Stats({ history }: { history: VerificationReport[] }) {
  const { t } = useTranslation();
  const count = (s: VerificationStatus) => history.filter((r) => r.status === s).length;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <div className="col-span-2 rounded-2xl bg-brand p-5 text-navy-foreground shadow-elevated lg:col-span-1">
        <p className="text-sm text-navy-foreground/75">{t.dashboard.total}</p>
        <p className="mt-2 text-4xl font-extrabold">{history.length}</p>
      </div>
      {STATUSES.map((s) => {
        const m = STATUS_META[s];
        const Icon = m.icon;
        return (
          <div key={s} className={cn("rounded-2xl border p-5", m.border, m.soft)}>
            <p className={cn("flex items-center gap-1.5 text-sm font-semibold", m.text)}><Icon className="h-4 w-4" /> {t.status[s].label}</p>
            <p className="mt-2 text-3xl font-extrabold text-navy">{count(s)}</p>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-primary"><FileSearch className="h-8 w-8" /></span>
      <p className="mt-4 font-bold text-navy">{text}</p>
      <Button asChild className="mt-5"><Link to="/verify">{t.dashboard.emptyCta}</Link></Button>
    </div>
  );
}

function HistoryList({ history, onDelete, onClear, simple }: { history: VerificationReport[]; onDelete: (id: string) => void; onClear?: () => void; simple?: boolean }) {
  const { t, lang } = useTranslation();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | VerificationStatus>("all");
  const [range, setRange] = useState<"any" | "7" | "30">("any");

  const filtered = useMemo(() => {
    const now = Date.now();
    return history.filter((r) => {
      const content = (r.request.text ?? r.request.url ?? r.request.fileName ?? "").toLowerCase();
      if (q && !content.includes(q.toLowerCase()) && !r.id.toLowerCase().includes(q.toLowerCase())) return false;
      if (status !== "all" && r.status !== status) return false;
      if (range !== "any" && now - new Date(r.createdAt).getTime() > Number(range) * 86400000) return false;
      return true;
    });
  }, [history, q, status, range]);

  const df = new Intl.DateTimeFormat(LOCALES[lang], { dateStyle: "medium" });

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-navy">{t.dashboard.history}</h2>
        {onClear && history.length > 0 && <ClearDialog onConfirm={onClear} />}
      </div>
      {!simple && history.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_180px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.dashboard.search} aria-label={t.dashboard.search} className="h-11 rounded-xl pl-10" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="h-11 rounded-xl" aria-label={t.dashboard.colStatus}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.dashboard.allStatus}</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{t.status[s].label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
            <SelectTrigger className="h-11 rounded-xl" aria-label={t.dashboard.colDate}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t.dashboard.anyDate}</SelectItem>
              <SelectItem value="7">{t.dashboard.last7}</SelectItem>
              <SelectItem value="30">{t.dashboard.last30}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="mt-4">
        {history.length === 0 ? (
          <EmptyState text={t.dashboard.empty} />
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">{t.dashboard.noMatch}</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <StatusBadge status={r.status} label={t.status[r.status].label} />
                    <span>{df.format(new Date(r.createdAt))}</span>
                    <span>·</span>
                    <span>{t.langNames[r.contentLanguage]}</span>
                    {r.isDemo && <span className="rounded bg-muted px-1.5 py-0.5 font-semibold">{t.common.sample}</span>}
                  </div>
                  <p className="mt-1.5 truncate text-sm font-medium text-navy">{r.request.text ?? r.request.url ?? r.request.fileName}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="h-10">
                    <Link to="/results/$id" params={{ id: r.id }}><Eye /> {t.dashboard.view}</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-10 text-destructive" onClick={() => onDelete(r.id)} aria-label={`${t.common.delete} ${r.id}`}>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function SavedGrid({ history }: { history: VerificationReport[] }) {
  const { t, lang } = useTranslation();
  if (history.length === 0) return <EmptyState text={t.dashboard.noSaved} />;
  const df = new Intl.DateTimeFormat(LOCALES[lang], { dateStyle: "medium" });
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {history.map((r) => (
        <li key={r.id}>
          <Link to="/results/$id" params={{ id: r.id }} className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary">
            <div className="flex items-center justify-between">
              <StatusBadge status={r.status} label={t.status[r.status].label} />
              <span className="text-xs text-muted-foreground">{df.format(new Date(r.createdAt))}</span>
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-navy">{r.request.text ?? r.request.url ?? r.request.fileName}</p>
            <p className="mt-auto pt-3 font-mono text-xs text-muted-foreground">{r.id}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function LanguageSettings() {
  const { t, setLang } = useTranslation();
  const { user, updateUser } = useAuth();
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <h2 className="text-lg font-bold text-navy">{t.dashboard.langTitle}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t.dashboard.langDesc}</p>
      <div className="mt-5">
        <LanguagePills
          value={user!.prefLang}
          label={t.dashboard.langTitle}
          onChange={(l) => {
            updateUser({ prefLang: l });
            setLang(l);
            toast.success(t.dashboard.prefSaved);
          }}
        />
      </div>
    </section>
  );
}

function ClearDialog({ onConfirm }: { onConfirm: () => void }) {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-destructive/30 text-destructive hover:border-destructive hover:bg-misleading-soft">
          <Trash2 /> {t.dashboard.deleteHistory}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t.dashboard.deleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>{t.dashboard.deleteDesc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11">{t.common.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90">{t.common.delete}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ProfileSettings({ onClear, onLogout, hasHistory }: { onClear: () => void; onLogout: () => void; hasHistory: boolean }) {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user!.name);
  const [contact, setContact] = useState(user!.contact);
  const [errs, setErrs] = useState<{ name?: string; contact?: string }>({});
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [pwErr, setPwErr] = useState<string>();

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const n: typeof errs = {};
    if (name.trim().length < 2) n.name = t.errors.nameMin;
    if (!isEmailOrMobile(contact)) n.contact = t.errors.contactInvalid;
    setErrs(n);
    if (Object.keys(n).length) return;
    updateUser({ name: name.trim(), contact: contact.trim() });
    toast.success(t.dashboard.profileSaved);
  };
  const changePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cur) return setPwErr(t.errors.required);
    if (next.length < 8) return setPwErr(t.errors.pwMin);
    setPwErr(undefined);
    setCur("");
    setNext("");
    toast.success(t.dashboard.pwChanged);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={saveProfile} noValidate className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-bold text-navy">{t.dashboard.profileTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="p-name" className="mb-1.5 block font-semibold">{t.auth.fullName}</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" aria-invalid={!!errs.name} />
            <FieldError id="p-name-err" message={errs.name} />
          </div>
          <div>
            <Label htmlFor="p-contact" className="mb-1.5 block font-semibold">{t.auth.contact}</Label>
            <Input id="p-contact" value={contact} onChange={(e) => setContact(e.target.value)} className="h-12 rounded-xl" aria-invalid={!!errs.contact} />
            <FieldError id="p-contact-err" message={errs.contact} />
          </div>
        </div>
        <Button type="submit" className="mt-5">{t.dashboard.update}</Button>
      </form>

      <form onSubmit={changePw} noValidate className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-bold text-navy">{t.dashboard.changePw}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="cur-pw" className="mb-1.5 block font-semibold">{t.dashboard.currentPw}</Label>
            <PasswordInput id="cur-pw" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="new-pw" className="mb-1.5 block font-semibold">{t.dashboard.newPw}</Label>
            <PasswordInput id="new-pw" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          </div>
        </div>
        <FieldError id="pw-err" message={pwErr} />
        <Button type="submit" variant="outline" className="mt-5">{t.dashboard.updatePw}</Button>
      </form>

      <div className="flex flex-col gap-3 rounded-3xl border border-destructive/25 bg-misleading-soft p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy">{t.dashboard.deleteDesc}</p>
        <div className="flex gap-2">
          {hasHistory && <ClearDialog onConfirm={onClear} />}
          <Button variant="outline" size="sm" className="h-10" onClick={onLogout}><LogOut /> {t.common.logout}</Button>
        </div>
      </div>
    </div>
  );
}
