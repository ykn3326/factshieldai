import type { VerificationReport } from "@/types";
import { REPORT_TEMPLATES } from "./mockReports";
import { SAMPLE_INPUTS } from "./sampleInputs";

/** Demo history seeded for a new registered demo account (labelled demo data). */
export function seedHistory(): VerificationReport[] {
  const day = 86400000;
  const now = Date.now();
  const items: [keyof typeof SAMPLE_INPUTS, keyof typeof REPORT_TEMPLATES, "en" | "hi" | "pa", number][] = [
    ["en", "misleading", "en", 1],
    ["hi", "verified", "hi", 4],
    ["pa", "review", "pa", 12],
    ["en2", "unverified", "en", 40],
  ];
  return items.map(([sample, status, lang, ago], i) => {
    const tpl = REPORT_TEMPLATES[status];
    return {
      id: `FS-DEMO-${1001 + i}`,
      status,
      request: { type: "text", text: SAMPLE_INPUTS[sample], reportLang: "en" },
      explanation: tpl.explanation,
      evidence: tpl.evidence,
      sources: tpl.sources,
      contentLanguage: lang,
      reportLanguage: "en",
      createdAt: new Date(now - ago * day).toISOString(),
      isDemo: true,
    };
  });
}
