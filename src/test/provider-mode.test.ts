import { describe, expect, it } from "vitest";
import { resolveProviderConfig } from "@/lib/verification-config";

describe("verification provider mode", () => {
  it("defaults to lovable mode", () => {
    expect(resolveProviderConfig({ LOVABLE_API_KEY: "x", FIRECRAWL_API_KEY: "y" })).toEqual({ mode: "lovable", missing: [], blockStore: true });
  });
  it("lovable mode reports missing Lovable keys", () => {
    expect(resolveProviderConfig({}).missing).toEqual(["LOVABLE_API_KEY", "FIRECRAWL_API_KEY"]);
  });
  it("direct mode needs Gemini and a real Firecrawl key", () => {
    expect(resolveProviderConfig({ VERIFY_PROVIDER_MODE: "direct" }).missing).toEqual(["GEMINI_API_KEY", "FIRECRAWL_API_KEY"]);
  });
  it("direct mode rejects a Lovable connection key", () => {
    expect(resolveProviderConfig({ VERIFY_PROVIDER_MODE: "direct", GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "lovc_abc" }).missing).toEqual(["FIRECRAWL_API_KEY"]);
  });
  it("direct mode does not need LOVABLE_API_KEY", () => {
    expect(resolveProviderConfig({ VERIFY_PROVIDER_MODE: "direct", GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "fc-1" })).toEqual({ mode: "direct", missing: [], blockStore: false });
  });
  it("direct mode uses own database only when both settings exist", () => {
    const base = { VERIFY_PROVIDER_MODE: "direct", GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "fc-1" };
    expect(resolveProviderConfig({ ...base, SUPABASE_URL: "u", SUPABASE_SERVICE_ROLE_KEY: "k" }).blockStore).toBe(true);
    expect(resolveProviderConfig({ ...base, SUPABASE_URL: "u" }).missing).toEqual(["SUPABASE_SERVICE_ROLE_KEY"]);
  });
});
