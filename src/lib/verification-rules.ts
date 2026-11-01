import { z } from "zod";
import type { SourceLink, VerificationStatus } from "@/types";

export const localizedSchema = z.object({ en: z.string(), hi: z.string(), pa: z.string() }).strict();
export const extractionSchema = z.object({
  text: z.string(),
  contentLanguage: z.enum(["en", "hi", "pa", "other"]),
  claims: z.array(z.string()),
  queries: z.array(z.string()),
  authoritativeQueries: z.array(z.string()),
}).strict();
export const comparisonSchema = z.object({
  status: z.enum(["verified", "misleading", "unverified", "review"]),
  explanation: localizedSchema,
  limitations: localizedSchema,
  evidence: z.array(z.object({
    title: localizedSchema,
    description: localizedSchema,
    claimIndex: z.number(),
    sourceIds: z.array(z.string()),
    relation: z.enum(["supports", "contradicts", "context", "insufficient"]),
    quotes: z.array(z.object({ sourceId: z.string(), text: z.string() }).strict()),
  }).strict()),
  sources: z.array(z.object({ id: z.string(), summary: localizedSchema }).strict()),
}).strict();
export type Comparison = z.infer<typeof comparisonSchema>;
export interface RetrievedDocument {
  id: string;
  url: string;
  title: string;
  text: string;
  snippet: string;
  publishedAt?: string | undefined;
  retrievedAt: string;
  cachedAt?: string | undefined;
  type: SourceLink["type"];
}

export function isPublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const h = url.hostname.toLowerCase().replace(/\.$/, "");
    // Reject all literal IPs, local domains and credentials; retrieval is delegated to Firecrawl.
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password &&
      (!url.port || ["80", "443"].includes(url.port)) && h.includes(".") &&
      !/^[\d.]+$/.test(h) && !h.includes(":") && !h.includes("[") &&
      !/(^|\.)(localhost|local|internal|test|invalid|example|lan|home|onion)$/.test(h);
  } catch { return false; }
}

const FACTCHECK = ["factcheck.org", "fullfact.org", "snopes.com", "altnews.in", "boomlive.in", "factly.in", "afp.com", "politifact.com"];
const HEALTH = ["who.int", "cdc.gov", "nih.gov", "nhs.uk"];
const RESEARCH = ["nature.com", "science.org", "pubmed.ncbi.nlm.nih.gov", "nasa.gov", "isro.gov.in"];
const NEWS = ["reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", "thehindu.com", "indianexpress.com"];
const matches = (h: string, domains: string[]) => domains.some((d) => h === d || h.endsWith(`.${d}`));
export function sourceType(url: string): SourceLink["type"] {
  const h = new URL(url).hostname.toLowerCase();
  if (matches(h, FACTCHECK)) return "factcheck";
  if (matches(h, HEALTH)) return "health";
  if (matches(h, RESEARCH) || /\.(edu|ac\.in|ac\.uk)$/.test(h)) return "research";
  if (/\.gov(\.[a-z]{2})?$/.test(h) || h.endsWith(".nic.in") || h === "pib.gov.in") return "official";
  if (matches(h, NEWS)) return "news";
  return "other";
}
export function rankDocuments(documents: RetrievedDocument[]): RetrievedDocument[] {
  const weights = { official: 4, health: 4, research: 4, factcheck: 3, news: 2, other: 1 };
  return [...documents].sort((a, b) => weights[b.type] - weights[a.type]);
}

const normal = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
/** A decisive verdict needs claim-bound quotes from the actual retrieved page, not search snippets. */
export function validateComparison(result: Comparison, documents: RetrievedDocument[], claimCount: number): VerificationStatus {
  const byId = new Map(documents.map((s) => [s.id, s]));
  const shown = new Set(result.sources.map((s) => s.id));
  for (const source of result.sources) {
    if (!byId.has(source.id)) throw new Error("invalidEvidence");
  }
  for (const evidence of result.evidence) {
    if (!Number.isInteger(evidence.claimIndex) || evidence.claimIndex < 0 || evidence.claimIndex >= claimCount) throw new Error("invalidEvidence");
    for (const id of evidence.sourceIds) if (!byId.has(id) || !shown.has(id)) throw new Error("invalidEvidence");
    for (const quote of evidence.quotes) {
      const source = byId.get(quote.sourceId);
      if (!source || !evidence.sourceIds.includes(quote.sourceId) || normal(quote.text).length < 20 || !normal(source.text).includes(normal(quote.text))) throw new Error("invalidEvidence");
    }
    if (["supports", "contradicts"].includes(evidence.relation) && !evidence.quotes.length) throw new Error("invalidEvidence");
  }
  const has = (index: number, relation: string) => result.evidence.some((e) => e.claimIndex === index && e.relation === relation && e.quotes.length > 0 && e.sourceIds.length > 0);
  if (!documents.some((s) => s.text.trim())) {
    if (result.status !== "review") throw new Error("invalidEvidence");
  }
  if (result.status === "verified" && (claimCount === 0 || !Array.from({ length: claimCount }, (_, i) => i).every((i) => has(i, "supports") && !has(i, "contradicts")))) throw new Error("invalidEvidence");
  if (result.status === "misleading" && !result.evidence.some((e) => e.relation === "contradicts" && e.quotes.length > 0)) throw new Error("invalidEvidence");
  if (["unverified", "review"].includes(result.status) && Object.values(result.limitations).some((s) => s.trim().length < 20)) throw new Error("invalidEvidence");
  return result.status;
}

export const verificationRequestSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string().trim().min(20).max(5000), reportLang: z.enum(["en", "hi", "pa"]) }).strict(),
  z.object({ type: z.literal("link"), url: z.string().max(2048).refine(isPublicUrl), reportLang: z.enum(["en", "hi", "pa"]) }).strict(),
  z.object({ type: z.literal("image"), imageDataUrl: z.string().max(14_000_000).regex(/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/), fileName: z.string().max(255).optional(), fileSize: z.number().max(10 * 1024 * 1024).optional(), reportLang: z.enum(["en", "hi", "pa"]) }).strict(),
]);