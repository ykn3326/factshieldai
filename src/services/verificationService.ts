import { dictionaries } from "@/i18n";
import type { ContentLang, StepKey, StepState, VerificationJob, VerificationReport, VerificationRequest } from "@/types";

export const STEP_KEYS: StepKey[] = ["received", "ocr", "language", "claims", "sources", "compare", "report"];
export interface PipelineCallbacks {
  onStep: (key: StepKey, state: StepState) => void;
  onLanguage: (lang: ContentLang) => void;
  signal: AbortSignal;
}
export function newId(prefix = "FS") { return `${prefix}-${crypto.randomUUID()}`; }
export class VerificationServiceError extends Error {
  constructor(public code: string, message: string, public detail?: string, public status?: number) { super(message); }
}
async function submit(request: VerificationRequest): Promise<VerificationJob> {
  return { id: newId("JOB"), request, createdAt: new Date().toISOString() };
}
async function run(job: VerificationJob, cb: PipelineCallbacks): Promise<VerificationReport> {
  const response = await fetch("/api/public/verify", {
    method: "POST", signal: cb.signal,
    headers: { "Content-Type": "application/json", "X-Report-Language": job.request.reportLang },
    body: JSON.stringify(job.request),
  });
  const fail = (e: { code?: string; message?: string; detail?: string; status?: number }) => {
    throw new VerificationServiceError(e.code ?? "interrupted", e.message ?? dictionaries[job.request.reportLang].liveErrors.interrupted, e.detail, e.status);
  };
  if (!response.ok) {
    const e = await response.json().catch(() => ({}));
    fail({ ...e, status: response.status });
  }
  if (!response.body || !response.headers.get("Content-Type")?.includes("application/x-ndjson")) return fail({ code: "interrupted" });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let report: VerificationReport | undefined;
  const consume = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.type === "error") fail(event);
    if (event.type === "step" && STEP_KEYS.includes(event.key)) cb.onStep(event.key, event.state);
    if (event.type === "language") cb.onLanguage(event.lang);
    if (event.type === "report") report = event.report;
  };
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      let newline;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        consume(buffer.slice(0, newline)); buffer = buffer.slice(newline + 1);
      }
    }
    buffer += decoder.decode();
    if (buffer.trim()) consume(buffer);
    if (!report || report.isDemo !== false) return fail({ code: "interrupted" });
    return report;
  } finally { await reader.cancel().catch(() => undefined); }
}
export const verificationService = {
  submitText: (text: string, reportLang: VerificationRequest["reportLang"]) => submit({ type: "text", text, reportLang }),
  submitImage: (req: Omit<VerificationRequest, "type">) => submit({ ...req, type: "image" }),
  submitLink: (url: string, reportLang: VerificationRequest["reportLang"]) => submit({ type: "link", url, reportLang }),
  run,
};