import { Info } from "lucide-react";
import { PageHeader, SiteLayout } from "@/components/layout/SiteLayout";

export function LegalPage({ title, intro, note, sections }: { title: string; intro: string; note: string; sections: { h: string; p: string }[] }) {
  return (
    <SiteLayout>
      <PageHeader title={title} sub={intro} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="mb-8 flex gap-2.5 rounded-2xl border border-unverified/30 bg-unverified-soft p-4 text-sm text-unverified">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> {note}
        </p>
        <ol className="space-y-8">
          {sections.map((s, i) => (
            <li key={i}>
              <h2 className="text-xl font-bold text-navy">{i + 1}. {s.h}</h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.p}</p>
            </li>
          ))}
        </ol>
      </article>
    </SiteLayout>
  );
}
