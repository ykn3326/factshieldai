import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHeader, SiteLayout } from "@/components/layout/SiteLayout";
import { HowItWorksSteps, SectionTitle } from "@/components/landing/Sections";
import { useTranslation } from "@/context/LanguageContext";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
  head: () => seo("How It Works", "Four simple steps: upload content, extract text and detect language, compare evidence, get a clear report."),
  component: HowPage,
});

function HowPage() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <PageHeader title={t.how.title} sub={t.how.sub} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        <HowItWorksSteps />
      </section>
      <section id="faq" className="scroll-mt-20 bg-surface/60 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionTitle title={t.how.faqTitle} />
          <Accordion type="single" collapsible className="mt-8 space-y-3">
            {t.how.faq.map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="rounded-2xl border border-border bg-card px-5 shadow-card">
                <AccordionTrigger className="min-h-14 text-left text-base font-bold text-navy hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </SiteLayout>
  );
}
