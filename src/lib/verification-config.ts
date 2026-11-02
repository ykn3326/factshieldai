/**
 * Chooses how live verification reaches its AI and search providers.
 * "lovable" (default): Lovable AI Gateway + Lovable connector gateway (Lovable Preview/hosting).
 * "direct": your own Gemini and Firecrawl keys, for independent hosts such as Vercel.
 * Returns only setting NAMES, never values.
 */
export type ProviderMode = "lovable" | "direct";
export interface ProviderConfig { mode: ProviderMode; missing: string[]; blockStore: boolean }

export function resolveProviderConfig(env: Record<string, string | undefined>): ProviderConfig {
  const mode: ProviderMode = env["VERIFY_PROVIDER_MODE"]?.trim().toLowerCase() === "direct" ? "direct" : "lovable";
  const missing: string[] = [];
  const firecrawl = env["FIRECRAWL_API_KEY"];
  if (mode === "direct") {
    if (!env["GEMINI_API_KEY"]) missing.push("GEMINI_API_KEY");
    // A Lovable connection key only works through Lovable's gateway.
    if (!firecrawl || firecrawl.startsWith("lovc_")) missing.push("FIRECRAWL_API_KEY");
  } else {
    if (!env["LOVABLE_API_KEY"]) missing.push("LOVABLE_API_KEY");
    if (!firecrawl) missing.push("FIRECRAWL_API_KEY");
  }
  // Lovable mode always uses Lovable Cloud; direct mode uses your own database only when both settings exist.
  const hasDb = !!env["SUPABASE_URL"] && !!env["SUPABASE_SERVICE_ROLE_KEY"];
  if (mode === "direct" && !!env["SUPABASE_URL"] !== !!env["SUPABASE_SERVICE_ROLE_KEY"]) missing.push(env["SUPABASE_URL"] ? "SUPABASE_SERVICE_ROLE_KEY" : "SUPABASE_URL");
  return { mode, missing, blockStore: mode === "lovable" || hasDb };
}
