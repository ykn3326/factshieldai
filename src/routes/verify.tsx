import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/layout/SiteLayout";
import { VerificationBox } from "@/components/verify/VerificationBox";
import { useTranslation } from "@/context/LanguageContext";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/verify")({
  staticData: { sitemap: true },
  head: () => seo("Verify Content", "Paste text, upload a screenshot or share a public link to check it with FACTSHIELD AI."),
  component: VerifyPage,
});

function VerifyPage() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <PageHeader title={t.verify.title} sub={t.verify.sub} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
        <VerificationBox />
      </div>
    </SiteLayout>
  );
}
