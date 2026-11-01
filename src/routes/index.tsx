import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldMark } from "@/components/layout/Logo";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  staticData: { sitemap: false },
  head: () => seo("Evidence-based Content Verification", "FACTSHIELD AI by Team IGNITE checks submitted messages, screenshots and public links against retrieved web evidence, with reports in English, Hindi and Punjabi."),
  component: Index,
});

/** First visit → /welcome; returning session → /home. */
function Index() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready) navigate({ to: user ? "/home" : "/welcome", replace: true });
  }, [ready, user, navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand">
      <ShieldMark className="h-16 w-16 animate-pulse" />
      <span className="sr-only">Loading FACTSHIELD AI</span>
    </div>
  );
}
