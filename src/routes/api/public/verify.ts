import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/verify")({
  server: { handlers: { POST: async ({ request }) => {
    const { handleVerification } = await import("@/lib/verification.server");
    return handleVerification(request);
  } } },
});