import { resolveProviderConfig } from "./verification-config";

/**
 * Deployment health check. Never returns credential values or provider response bodies,
 * only component states and HTTP status codes. Reachability probes (outbound calls) run
 * only with a valid HEALTH_CHECK_TOKEN bearer, so the public URL cannot be used to burn quota.
 */
type State = "ok" | "missing" | "unreachable" | "denied" | "skipped";
interface Check { state: State; httpStatus?: number }

const TIMEOUT = 6000;

async function probe(url: string, init: RequestInit): Promise<Check> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT) });
    await res.body?.cancel();
    if (res.ok) return { state: "ok", httpStatus: res.status };
    return { state: res.status === 401 || res.status === 403 ? "denied" : "unreachable", httpStatus: res.status };
  } catch {
    return { state: "unreachable" };
  }
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const x = enc.encode(a), y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function handleHealth(request: Request): Promise<Response> {
  const env = process.env;
  const config = resolveProviderConfig(env);
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  const token = env["HEALTH_CHECK_TOKEN"];
  const supplied = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const authorized = !!token && token.length >= 16 && safeEqual(supplied, token);

  const summary = { mode: config.mode, configured: config.missing.length === 0 };
  if (!authorized) {
    // Public view: no setting names, no outbound calls.
    return Response.json({ ...summary, detail: "Provide the health check token for provider and database checks." }, { status: summary.configured ? 200 : 503, headers });
  }

  const direct = config.mode === "direct";
  const firecrawlKey = env["FIRECRAWL_API_KEY"];
  const ai: Promise<Check> = direct
    ? env["GEMINI_API_KEY"]
      ? probe("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1", { headers: { "x-goog-api-key": env["GEMINI_API_KEY"] } })
      : Promise.resolve({ state: "missing" })
    : env["LOVABLE_API_KEY"]
      ? probe("https://ai.gateway.lovable.dev/v1/models", { headers: { Authorization: `Bearer ${env["LOVABLE_API_KEY"]}` } })
      : Promise.resolve({ state: "missing" });
  const search: Promise<Check> = !firecrawlKey || (direct && firecrawlKey.startsWith("lovc_"))
    ? Promise.resolve({ state: "missing" })
    : direct
      ? probe("https://api.firecrawl.dev/v2/team/credit-usage", { headers: { Authorization: `Bearer ${firecrawlKey}` } })
      : env["LOVABLE_API_KEY"]
        ? probe("https://connector-gateway.lovable.dev/api/v1/verify_credentials", { method: "POST", headers: { Authorization: `Bearer ${env["LOVABLE_API_KEY"]}`, "X-Connection-Api-Key": firecrawlKey } })
        : Promise.resolve({ state: "missing" });
  const database: Promise<Check> = !config.blockStore
    ? Promise.resolve({ state: "skipped" })
    : (async () => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("verification_service_blocks").select("service", { head: true, count: "exact" });
          return error ? { state: "unreachable" as const } : { state: "ok" as const };
        } catch { return { state: "missing" as const }; }
      })();

  const [aiCheck, searchCheck, dbCheck] = await Promise.all([ai, search, database]);
  const healthy = config.missing.length === 0 && [aiCheck, searchCheck, dbCheck].every((c) => c.state === "ok" || c.state === "skipped");
  return Response.json({
    ...summary, healthy, missingSettings: config.missing,
    checks: { ai: aiCheck, search: searchCheck, database: dbCheck },
    checkedAt: new Date().toISOString(),
  }, { status: healthy ? 200 : 503, headers });
}
