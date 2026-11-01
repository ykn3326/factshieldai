import { API_BASE_URL, USE_MOCK_DATA } from "@/lib/config";
import type { SourceLink } from "@/types";

/** Trusted-source search lives on the backend (search API keys never in the browser). */
export const sourceSearchService = {
  async search(claims: string[]): Promise<SourceLink[]> {
    if (USE_MOCK_DATA) return [];
    const res = await fetch(`${API_BASE_URL}/api/sources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claims }),
    });
    if (!res.ok) throw new Error("Source search failed");
    return res.json();
  },
};
