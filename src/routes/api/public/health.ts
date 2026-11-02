import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  staticData: { sitemap: false },
  server: { handlers: { GET: async ({ request }) => {
    const { handleHealth } = await import("@/lib/health.server");
    return handleHealth(request);
  } } },
});
