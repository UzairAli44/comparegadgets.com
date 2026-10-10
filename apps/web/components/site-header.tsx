"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  // Panels remember the path they were opened on, so navigating closes them without an effect.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const searchOpen = searchPath === pathname;
  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);
  const setSearchOpen = (open: boolean) => setSearchPath(open ? pathname : null);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const openSearch = () => {
    // On the homepage the hero search is the main search; jump to it instead of opening a second box.
    const hero = document.getElementById("hero-search-input");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth", block: "center" });
      (hero as HTMLInputElement).focus({ preventScroll: true });
      return;
    }
    setMenuOpen(false);
    setSearchOpen(!searchOpen);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[auto_1fr_auto] lg:px-8">
        <Logo />
        <nav className="hidden items-center justify-center gap-7 text-sm font-semibold text-muted-foreground md:flex" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className={cn("nav-link", isActive(item.href) && "text-primary")} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={openSearch} className="icon-button" aria-label="Open search" aria-expanded={searchOpen}>
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          <button type="button" onClick={() => { setSearchOpen(false); setMenuOpen(!menuOpen); }} className="icon-button md:hidden" aria-expanded={menuOpen} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-background px-4 py-3">
          <form
            role="search"
            className="mx-auto max-w-3xl"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            }}
          >
            <div className="search-shell search-shell-active min-h-14">
              <Search className="shrink-0 text-primary" size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search any phone or laptop…"
                aria-label="Search phones and laptops"
                name="q"
              />
              <button type="submit" className="search-submit h-10"><span className="hidden sm:inline">Search</span><ChevronRight size={18} /></button>
            </div>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className={cn("flex items-center justify-between border-b border-border/70 py-3 font-semibold last:border-0", isActive(item.href) && "text-primary")}>
                {item.label}
                <ChevronRight size={17} />
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
