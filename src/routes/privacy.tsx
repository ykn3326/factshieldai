import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/landing/LegalPage";
import { useTranslation } from "@/context/LanguageContext";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => seo("Privacy Policy", "How FACTSHIELD AI handles your data: no access to private chats, guest sessions aren't saved, and you can delete history."),
  component: () => {
    const { t } = useTranslation();
    return <LegalPage title={t.legal.privacyTitle} intro={t.legal.privacyIntro} note={t.legal.note} sections={t.legal.privacy} />;
  },
});
