import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Menu, Settings, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/LanguageContext";
import { Logo } from "./Logo";
import { LanguagePills, LanguageSelector } from "./LanguageSelector";

export function useNavLinks() {
  const { t } = useTranslation();
  return [
    { to: "/home", label: t.nav.home },
    { to: "/verify", label: t.nav.verify },
    { to: "/how-it-works", label: t.nav.how },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ] as const;
}

export function Navbar() {
  const { t, lang, setLang } = useTranslation();
  const { user, isRegistered, logout } = useAuth();
  const navigate = useNavigate();
  const links = useNavLinks();
  const [open, setOpen] = useState(false);

  const doLogout = () => {
    logout();
    toast.success(t.auth.loggedOut);
    setOpen(false);
    navigate({ to: "/welcome" });
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-card/85 backdrop-blur-lg">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {t.common.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/home" aria-label="FACTSHIELD AI — Home" className="shrink-0 rounded-lg">
          <Logo />
        </Link>
        <nav aria-label="Main" className="ml-2 hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-navy"
              activeProps={{ className: "bg-surface text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSelector className="hidden sm:inline-flex" />
          {isRegistered && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={user.name}
                className="hidden h-11 w-11 items-center justify-center rounded-full bg-primary-gradient text-sm font-bold text-primary-foreground sm:inline-flex"
              >
                {user.name.slice(0, 1).toUpperCase()}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="h-10" onSelect={() => navigate({ to: "/dashboard" })}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> {t.common.dashboard}
                </DropdownMenuItem>
                <DropdownMenuItem className="h-10" onSelect={() => navigate({ to: "/dashboard", search: { tab: "profile" } })}>
                  <Settings className="mr-2 h-4 w-4" /> {t.common.settings}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="h-10 text-destructive" onSelect={doLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> {t.common.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              {user?.mode === "guest" && (
                <span className="hidden xl:inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" aria-hidden /> {t.common.guest}
                </span>
              )}
              <Button asChild variant="ghost" size="sm" className="h-11">
                <Link to="/login">{t.common.login}</Link>
              </Button>
              <Button asChild size="sm" className="h-11 px-4">
                <Link to="/signup">{t.common.signup}</Link>
              </Button>
            </div>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden" aria-label={t.nav.openMenu}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[88vw] max-w-sm flex-col gap-0 overflow-y-auto p-0">
              <SheetHeader className="border-b border-border p-5 text-left">
                <SheetTitle><Logo /></SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-navy hover:bg-surface"
                    activeProps={{ className: "bg-surface text-primary" }}
                  >
                    {l.label}
                  </Link>
                ))}
                {isRegistered && (
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-navy hover:bg-surface" activeProps={{ className: "bg-surface text-primary" }}>
                    {t.common.dashboard}
                  </Link>
                )}
              </nav>
              <div className="border-t border-border p-4">
                <p className="mb-2 text-sm font-semibold text-muted-foreground">{t.common.language}</p>
                <LanguagePills value={lang} onChange={setLang} label={t.common.language} />
              </div>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                {isRegistered ? (
                  <Button variant="outline" size="lg" onClick={doLogout}>
                    <LogOut /> {t.common.logout}
                  </Button>
                ) : (
                  <>
                    {user?.mode === "guest" && <p className="text-center text-sm text-muted-foreground">{t.auth.guestStarted}</p>}
                    <Button asChild size="lg"><Link to="/login" onClick={() => setOpen(false)}>{t.common.login}</Link></Button>
                    <Button asChild variant="outline" size="lg"><Link to="/signup" onClick={() => setOpen(false)}>{t.common.signup}</Link></Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
