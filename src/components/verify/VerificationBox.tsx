import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ClipboardPaste,
  FileText,
  ImageUp,
  Link2,
  Loader2,
  Lock,
  RefreshCw,
  ScanSearch,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { useVerification } from "@/context/VerificationContext";
import { SAMPLE_INPUTS } from "@/data/sampleInputs";
import { verificationService } from "@/services/verificationService";
import { LanguagePills } from "@/components/layout/LanguageSelector";
import { cn } from "@/lib/utils";
import type { InputType, Lang } from "@/types";

const MAX_CHARS = 5000;
const MIN_CHARS = 20;
const MAX_BYTES = 10 * 1024 * 1024;
const MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXT = ["jpg", "jpeg", "png", "webp", "gif"];

export function validateImageFile(file: { name: string; type: string; size: number }): "fileType" | "fileSize" | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!EXT.includes(ext) || (file.type && !MIME.includes(file.type))) return "fileType";
  if (file.size > MAX_BYTES) return "fileSize";
  return null;
}
export function isValidUrl(v: string) {
  try {
    const u = new URL(v.trim());
    return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}
const fmtSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);

export function VerificationBox({ className }: { className?: string }) {
  const { t, lang } = useTranslation();
  const { user } = useAuth();
  const { setJob } = useVerification();
  const navigate = useNavigate();

  const [tab, setTab] = useState<InputType>("text");
  const [reportLang, setReportLang] = useState<Lang>(lang);
  const [text, setText] = useState("");
  const [textTouched, setTextTouched] = useState(false);
  const [file, setFile] = useState<{ name: string; size: number; dataUrl: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [urlTouched, setUrlTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setReportLang(user?.mode === "registered" ? user.prefLang : lang);
  }, [lang, user]);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 520) + "px";
    }
  }, [text, tab]);

  const textLen = text.trim().length;
  const textError = textLen > MAX_CHARS ? t.errors.textMax : textLen < MIN_CHARS ? t.errors.textMin : null;
  const urlError = !url.trim() ? t.errors.required : !isValidUrl(url) ? t.errors.urlInvalid : null;

  const handleFile = (f: File | undefined | null) => {
    if (!f) return;
    const err = validateImageFile(f);
    if (err) {
      setFileError(t.errors[err]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFile({ name: f.name, size: f.size, dataUrl: String(reader.result) });
      setFileError(null);
    };
    reader.onerror = () => setFileError(t.errors.fileRead);
    reader.readAsDataURL(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };
  const onPasteImage = (e: ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    if (item) handleFile(item.getAsFile());
  };

  const pasteText = async (setter: (v: string) => void) => {
    try {
      const v = await navigator.clipboard.readText();
      setter(v);
    } catch {
      toast.error(t.errors.clipboard);
    }
  };

  const submit = async () => {
    try {
      setSubmitting(true);
      let job;
      if (tab === "text") {
        setTextTouched(true);
        if (textError) return;
        job = await verificationService.submitText(text.trim(), reportLang);
      } else if (tab === "image") {
        if (!file) return;
        job = await verificationService.submitImage({ imageDataUrl: file.dataUrl, fileName: file.name, fileSize: file.size, reportLang });
      } else {
        setUrlTouched(true);
        if (urlError) return;
        job = await verificationService.submitLink(url.trim(), reportLang);
      }
      setJob(job);
      navigate({ to: "/analysis" });
    } catch {
      toast.error(t.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { key: InputType; label: string; icon: typeof FileText }[] = [
    { key: "text", label: t.verify.tabText, icon: FileText },
    { key: "image", label: t.verify.tabImage, icon: ImageUp },
    { key: "link", label: t.verify.tabLink, icon: Link2 },
  ];

  return (
    <div className={cn("rounded-3xl border border-border bg-card shadow-elevated", className)}>
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-navy">{t.verify.reportLang}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ScanSearch className="h-3.5 w-3.5" aria-hidden /> {t.verify.detectInfo}
          </p>
        </div>
        <LanguagePills value={reportLang} onChange={setReportLang} label={t.verify.reportLang} />
      </div>

      <div className="p-4 sm:p-6">
        <div role="tablist" aria-label={t.verify.title} className="grid grid-cols-3 gap-1.5 rounded-2xl bg-surface p-1.5">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="tab"
              id={`tab-${key}`}
              aria-selected={tab === key}
              aria-controls={`panel-${key}`}
              onClick={() => setTab(key)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-xs font-bold transition-all sm:flex-row sm:gap-2 sm:text-sm",
                tab === key ? "bg-card text-primary shadow-card" : "text-muted-foreground hover:text-navy",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={tab} className="mt-5 animate-fade-up">
          {tab === "text" && (
            <div>
              <label htmlFor="verify-text" className="sr-only">{t.verify.textLabel}</label>
              <textarea
                id="verify-text"
                ref={textRef}
                rows={8}
                value={text}
                maxLength={MAX_CHARS + 200}
                onChange={(e) => setText(e.target.value)}
                onBlur={() => setTextTouched(true)}
                placeholder={t.verify.textPh}
                aria-invalid={textTouched && !!textError}
                aria-describedby="text-hint"
                className="min-h-48 w-full resize-none rounded-2xl border-2 border-input bg-background p-4 text-base text-navy placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p id="text-hint" className={cn("flex items-center gap-1.5 text-sm", textTouched && textError ? "text-destructive" : "text-muted-foreground")}>
                  {textTouched && textError && <AlertCircle className="h-4 w-4" aria-hidden />}
                  {textTouched && textError ? textError : textLen < MIN_CHARS ? t.verify.minHint : ""}
                </p>
                <div className="flex items-center gap-1">
                  <span className={cn("mr-2 text-xs tabular-nums", textLen > MAX_CHARS ? "text-destructive" : "text-muted-foreground")}>
                    {text.length}/{MAX_CHARS}
                  </span>
                  <Button type="button" variant="ghost" size="sm" className="h-10" onClick={() => pasteText(setText)}>
                    <ClipboardPaste /> {t.verify.paste}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-10" onClick={() => { setText(""); setTextTouched(false); }} disabled={!text}>
                    <X /> {t.verify.clear}
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">{t.verify.trySample}</span>
                {(Object.keys(SAMPLE_INPUTS) as (keyof typeof SAMPLE_INPUTS)[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => { setText(SAMPLE_INPUTS[k]); setTextTouched(false); }}
                    className="min-h-10 rounded-full border border-primary/25 bg-surface px-3.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-surface-strong"
                  >
                    {t.verify.samples[k]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "image" && (
            <div onPaste={onPasteImage}>
              <input
                ref={fileInput}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                className="sr-only"
                aria-label={t.verify.browse}
                onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
              />
              {!file ? (
                <div
                  tabIndex={0}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInput.current?.click(); }}
                  className={cn(
                    "flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all",
                    dragging ? "border-primary bg-surface-strong" : "border-input bg-surface/50 hover:border-primary/60",
                  )}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-primary shadow-card">
                    <Upload className="h-7 w-7" aria-hidden />
                  </span>
                  <p className="mt-4 text-base font-bold text-navy">{t.verify.dropTitle}</p>
                  <p className="text-sm text-muted-foreground">{t.common.or}</p>
                  <Button type="button" variant="outline" className="mt-2" onClick={() => fileInput.current?.click()}>
                    {t.verify.browse}
                  </Button>
                  <p className="mt-4 text-xs text-muted-foreground">{t.verify.accepted}</p>
                  <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{t.verify.pasteImage}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/50 p-4 sm:flex-row sm:items-center">
                  <img src={file.dataUrl} alt={file.name} className="h-40 w-full rounded-xl object-cover sm:h-28 sm:w-28" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-navy">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{fmtSize(file.size)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" className="h-11" onClick={() => fileInput.current?.click()}>
                      <RefreshCw /> {t.verify.replace}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-11 text-destructive" onClick={() => setFile(null)}>
                      <Trash2 /> {t.verify.remove}
                    </Button>
                  </div>
                </div>
              )}
              {fileError && (
                <p role="alert" className="mt-3 flex items-center gap-1.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" aria-hidden /> {fileError}
                </p>
              )}
              <p className="mt-3 text-sm text-muted-foreground">{t.verify.ocrHelper}</p>
            </div>
          )}

          {tab === "link" && (
            <div>
              <label htmlFor="verify-url" className="mb-2 block text-sm font-bold text-navy">{t.verify.urlLabel}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="verify-url"
                    type="url"
                    inputMode="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={() => setUrlTouched(true)}
                    placeholder={t.verify.urlPh}
                    aria-invalid={urlTouched && !!urlError}
                    className="h-14 rounded-2xl border-2 pl-12 text-base"
                  />
                </div>
                <Button type="button" variant="outline" className="h-14" onClick={() => pasteText(setUrl)}>
                  <ClipboardPaste /> <span className="hidden sm:inline">{t.verify.paste}</span>
                </Button>
              </div>
              {urlTouched && urlError && (
                <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" aria-hidden /> {urlError}
                </p>
              )}
              <p className="mt-3 text-sm text-muted-foreground">{t.verify.linkHelper}</p>
            </div>
          )}
        </div>

        <Button
          size="xl"
          className="mt-6 w-full"
          onClick={submit}
          disabled={submitting || (tab === "text" && !!textError) || (tab === "image" && !file) || (tab === "link" && !url.trim())}
        >
          {submitting ? <Loader2 className="animate-spin" /> : <ScanSearch />}
          {tab === "link" ? t.verify.verifyLink : t.verify.verifyBtn}
        </Button>
      </div>

      <div className="flex items-start gap-3 rounded-b-3xl border-t border-border bg-surface p-4 sm:px-6">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-verified" aria-hidden />
        <p className="text-sm text-navy">{t.verify.privacy}</p>
      </div>
    </div>
  );
}
