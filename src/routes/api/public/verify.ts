import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/verify")({
  staticData: { sitemap: false },
  server: { handlers: { POST: async ({ request }) => {
    const { handleVerification } = await import("@/lib/verification.server");
    return handleVerification(request);
  } } },
});