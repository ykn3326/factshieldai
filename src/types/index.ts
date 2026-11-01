export type Lang = "en" | "hi" | "pa";
export type ContentLang = Lang | "other";
export type Localized = Record<Lang, string>;

export type VerificationStatus = "verified" | "misleading" | "unverified" | "review";
export type InputType = "text" | "image" | "link";

export interface VerificationRequest {
  type: InputType;
  text?: string;
  imageDataUrl?: string;
  fileName?: string;
  fileSize?: number;
  url?: string;
  reportLang: Lang;
}

export interface VerificationJob {
  id: string;
  request: VerificationRequest;
  createdAt: string;
}

export type StepState = "pending" | "progress" | "done" | "error" | "skipped";
export type StepKey = "received" | "ocr" | "language" | "claims" | "sources" | "compare" | "report";

export interface EvidenceItem {
  title: Localized;
  description: Localized;
}

export interface SourceLink {
  name: string;
  title: Localized;
  type: "factcheck" | "official" | "news" | "health";
  url: string;
}

export interface VerificationReport {
  id: string;
  status: VerificationStatus;
  request: VerificationRequest;
  extractedText?: string | undefined;
  explanation: Localized;
  evidence: EvidenceItem[];
  sources: SourceLink[];
  contentLanguage: ContentLang;
  reportLanguage: Lang;
  createdAt: string;
  isDemo: boolean;
}

export interface User {
  id: string;
  name: string;
  contact: string;
  prefLang: Lang;
  mode: "guest" | "registered";
}
