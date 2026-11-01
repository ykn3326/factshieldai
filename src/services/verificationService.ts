import { API_BASE_URL, USE_MOCK_DATA } from "@/lib/config";
import { pickTemplate } from "@/data/mockReports";
import { languageDetectionService } from "./languageDetectionService";
import { ocrService } from "./ocrService";
import type { ContentLang, StepKey, StepState, VerificationJob, VerificationReport, VerificationRequest } from "@/types";

export const STEP_KEYS: StepKey[] = ["received", "ocr", "language", "claims", "sources", "compare", "report"];

export interface PipelineCallbacks {
  onStep: (key: StepKey, state: StepState) => void;
  onLanguage: (lang: ContentLang) => void;
  signal: AbortSignal;
}

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export function newId(prefix = "FS") {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1296).toString(36).toUpperCase().padStart(2, "0")}`;
}

async function submit(request: VerificationRequest): Promise<VerificationJob> {
  if (USE_MOCK_DATA) return { id: newId("JOB"), request, createdAt: new Date().toISOString() };
  const res = await fetch(`${API_BASE_URL}/api/verify/${request.type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Submit failed");
  return res.json();
}

/**
 * Runs the pipeline. Mock mode simulates each step (clearly labelled in the UI);
 * real mode polls `${API_BASE_URL}/api/jobs/:id` and maps its step statuses.
 */
async function run(job: VerificationJob, cb: PipelineCallbacks): Promise<VerificationReport> {
  const { request } = job;
  if (!USE_MOCK_DATA) {
    for (;;) {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${job.id}`, { signal: cb.signal });
      if (!res.ok) throw new Error("Status failed");
      const data = await res.json();
      (data.steps as { key: StepKey; state: StepState }[]).forEach((s) => cb.onStep(s.key, s.state));
      if (data.contentLanguage) cb.onLanguage(data.contentLanguage);
      if (data.report) return data.report;
      await wait(1500, cb.signal);
    }
  }
  const step = async (key: StepKey, ms: number) => {
    cb.onStep(key, "progress");
    await wait(ms, cb.signal);
    cb.onStep(key, "done");
  };
  await step("received", 700);
  let text = request.text ?? request.url ?? "";
  if (request.type === "image") {
    cb.onStep("ocr", "progress");
    text = await ocrService.extract(request.imageDataUrl ?? "");
    await wait(1600, cb.signal);
    cb.onStep("ocr", "done");
  } else cb.onStep("ocr", "skipped");
  cb.onStep("language", "progress");
  await wait(1000, cb.signal);
  const lang = request.type === "link" ? "en" : languageDetectionService.detect(text);
  cb.onLanguage(lang);
  cb.onStep("language", "done");
  await step("claims", 1300);
  await step("sources", 1800);
  await step("compare", 1400);
  await step("report", 1000);
  const tpl = pickTemplate(text);
  return {
    id: newId(),
    status: tpl.status,
    request,
    extractedText: request.type === "image" ? text : undefined,
    explanation: tpl.explanation,
    evidence: tpl.evidence,
    sources: tpl.sources,
    contentLanguage: lang,
    reportLanguage: request.reportLang,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
}

export const verificationService = {
  submitText: (text: string, reportLang: VerificationRequest["reportLang"]) => submit({ type: "text", text, reportLang }),
  submitImage: (req: Omit<VerificationRequest, "type">) => submit({ ...req, type: "image" }),
  submitLink: (url: string, reportLang: VerificationRequest["reportLang"]) => submit({ type: "link", url, reportLang }),
  run,
};
