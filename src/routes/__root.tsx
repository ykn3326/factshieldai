import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider, useTranslation } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { VerificationProvider } from "@/context/VerificationContext";
import { Toaster } from "@/components/ui/sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShieldQuestion, TriangleAlert } from "lucide-react";

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface text-primary">
          <ShieldQuestion className="h-10 w-10" aria-hidden />
        </span>
        <p className="mt-6 text-6xl font-extrabold text-navy">404</p>
        <h1 className="mt-2 text-xl font-bold text-navy">{t.notFound.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.notFound.desc}</p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/home">{t.notFound.home}</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <TriangleAlert className="mx-auto h-10 w-10 text-misleading" aria-hidden />
        <h1 className="mt-4 text-xl font-bold text-navy">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. You can try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button asChild variant="outline">
            <a href="/home">Go home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FACTSHIELD AI — Verify the Truth Before You Believe It" },
      { name: "description", content: "AI-powered digital content verification in English, Hindi and Punjabi, by Team IGNITE." },
      { name: "author", content: "Team IGNITE" },
      { name: "google-site-verification", content: "da6aNWETs7Yvh02GiyyDLzyKvZVHZHiz_yFXlTONHjs" },
      { name: "theme-color", content: "#0A1F44" },
      { property: "og:title", content: "FACTSHIELD AI" },
      { property: "og:description", content: "Verify suspicious messages, screenshots and links before you share them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Noto+Sans+Gurmukhi:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <VerificationProvider>
            <Outlet />
            <Toaster position="top-center" richColors />
          </VerificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
