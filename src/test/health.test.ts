import { afterEach, describe, expect, it, vi } from "vitest";
import { handleHealth } from "@/lib/health.server";

const TOKEN = "health-token-0123456789";
const KEYS = { GEMINI_API_KEY: "gem-secret-value", FIRECRAWL_API_KEY: "fc-secret-value" };
const req = (auth?: string) => new Request("http://x/api/public/health", { headers: auth ? { Authorization: `Bearer ${auth}` } : {} });

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
function direct() {
  vi.stubEnv("VERIFY_PROVIDER_MODE", "direct");
  vi.stubEnv("GEMINI_API_KEY", KEYS.GEMINI_API_KEY);
  vi.stubEnv("FIRECRAWL_API_KEY", KEYS.FIRECRAWL_API_KEY);
  vi.stubEnv("SUPABASE_URL", ""); vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
  vi.stubEnv("HEALTH_CHECK_TOKEN", TOKEN);
}

describe("deployment health check", () => {
  it("makes no outbound calls without the token", async () => {
    direct();
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const body = await (await handleHealth(req("wrong-token-wrong-token"))).json();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(body.checks).toBeUndefined();
  });
  it("reports reachable providers with a valid token and never echoes keys", async () => {
    direct();
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    const res = await handleHealth(req(TOKEN));
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(JSON.parse(text).checks).toEqual({ ai: { state: "ok", httpStatus: 200 }, search: { state: "ok", httpStatus: 200 }, database: { state: "skipped" } });
    expect(text).not.toContain(KEYS.GEMINI_API_KEY);
    expect(text).not.toContain(KEYS.FIRECRAWL_API_KEY);
  });
  it("reports a rejected key as denied with 503", async () => {
    direct();
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad key details", { status: 401 })));
    const res = await handleHealth(req(TOKEN));
    const body = await res.json();
    expect(res.status).toBe(503);
    expect(body.checks.ai.state).toBe("denied");
    expect(JSON.stringify(body)).not.toContain("bad key details");
  });
  it("ignores tokens shorter than 16 characters", async () => {
    direct(); vi.stubEnv("HEALTH_CHECK_TOKEN", "short");
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    await handleHealth(req("short"));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
