import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/context/LanguageContext";
import { dictionaries } from "@/i18n";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useTranslation();
  const links = [
    { to: "/home", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/how-it-works", label: t.nav.how },
    { to: "/contact", label: t.nav.contact },
    { to: "/privacy", label: t.legal.privacyTitle },
    { to: "/terms", label: t.legal.termsTitle },
  ] as const;
  return (
    <footer className="no-print relative overflow-hidden bg-navy-deep text-navy-foreground">
      <div className="bg-network absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo onDark />
          <p className="mt-4 max-w-md text-sm text-navy-foreground/75">{t.footer.desc}</p>
          <p className="mt-4 text-sm font-semibold text-cyan">{t.common.brandMessage}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-foreground/60">{t.footer.links}</h2>
          <ul className="mt-4 grid gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="inline-flex min-h-10 items-center text-sm text-navy-foreground/85 hover:text-navy-foreground hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-foreground/60">{t.footer.taglines}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li lang="en">{dictionaries.en.common.tagline}</li>
            <li lang="hi" className="font-deva">{dictionaries.hi.common.tagline}</li>
            <li lang="pa" className="font-guru">{dictionaries.pa.common.tagline}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-navy-foreground/65 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FACTSHIELD AI · {t.footer.madeBy}. {t.footer.rights}</p>
          <p className="max-w-xl md:text-right">{t.common.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
