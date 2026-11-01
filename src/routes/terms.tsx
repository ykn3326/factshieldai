import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";
import { useTranslation } from "@/context/LanguageContext";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => seo("Terms and Conditions", "Terms for using FACTSHIELD AI, including that results are AI-assisted and may contain errors."),
  component: () => {
    const { t } = useTranslation();
    return <LegalPage title={t.legal.termsTitle} intro={t.legal.termsIntro} note={t.legal.note} sections={t.legal.terms} />;
  },
});
