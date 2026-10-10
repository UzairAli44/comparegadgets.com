"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import type { Suggestion } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { quickFilters } from "@/lib/site";

export type PriceMode = "pk" | "world";

export function SearchBox({ suggestions }: { suggestions: Suggestion[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<PriceMode>("pk");
  const listId = useId();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestions.slice(0, 4);
    const tokens = q.split(/\s+/);
    return suggestions.filter((s) => tokens.every((t) => `${s.name} ${s.brand} ${s.variant}`.toLowerCase().includes(t))).slice(0, 5);
  }, [query, suggestions]);

  const productHref = (s: Suggestion) => `/${s.slug}${mode === "world" && s.globalStores ? "?mode=global" : ""}`;
  const goToResults = () => {
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}${mode === "world" ? "&mode=global" : ""}`);
    else inputRef.current?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        role="search"
        className="relative z-20"
        onSubmit={(e) => {
          e.preventDefault();
          goToResults();
        }}
      >
        <div className={`search-shell ${focused ? "search-shell-active" : ""}`}>
          <Search className="shrink-0 text-primary" size={23} aria-hidden />
          <input
            id="hero-search-input"
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((v) => Math.min(v + 1, matches.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((v) => Math.max(v - 1, 0)); }
              if (e.key === "Enter" && query.trim() && matches[active]) { e.preventDefault(); router.push(productHref(matches[active])); }
              if (e.key === "Escape") setFocused(false);
            }}
            className="min-w-0 flex-1 bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground sm:text-lg"
            placeholder="Search any phone or laptop…"
            aria-label="Search phones and laptops"
            role="combobox"
            aria-expanded={focused}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={focused && matches[active] ? `${listId}-${active}` : undefined}
          />
          {query && <button type="button" onClick={() => setQuery("")} className="icon-button h-9 w-9" aria-label="Clear search"><X size={17} /></button>}
          <button type="submit" className="search-submit" aria-label="Search"><span className="hidden sm:inline">Search</span><ArrowRight size={18} /></button>
        </div>
        {focused && (
          <div className="search-results" role="listbox" id={listId}>
            <div className="flex items-center justify-between px-4 pb-2 pt-3 text-xs font-bold uppercase text-muted-foreground">
              <span>{query ? "Best matches" : "Popular searches"}</span>
              <span>{mode === "pk" ? "Pakistan prices" : "Worldwide prices"}</span>
            </div>
            {matches.length ? (
              matches.map((s, index) => (
                <Link
                  key={s.slug}
                  id={`${listId}-${index}`}
                  href={productHref(s)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`search-result ${active === index ? "bg-accent" : ""}`}
                  role="option"
                  aria-selected={active === index}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-product"><Image src={s.image} alt="" width={44} height={44} className="h-11 w-11 object-contain" /></span>
                  <span className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-bold">{s.name}</span><span className="text-xs text-muted-foreground">{s.variant}</span></span>
                  <span className="shrink-0 text-right"><span className="block text-xs text-muted-foreground">from</span><span className="text-sm font-extrabold text-primary">{s.lowestPkr ? formatPKR(s.lowestPkr) : "—"}</span></span>
                </Link>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No exact match yet. Try a brand or model name.</div>
            )}
          </div>
        )}
      </form>
      <div className="mt-4 flex justify-center">
        <div className="mode-toggle" role="group" aria-label="Price region">
          <button type="button" onClick={() => { setMode("pk"); setFocused(false); }} className={mode === "pk" ? "mode-active" : ""} aria-pressed={mode === "pk"}>🇵🇰 <span>In Pakistan</span></button>
          <button type="button" onClick={() => { setMode("world"); setFocused(false); }} className={mode === "world" ? "mode-active" : ""} aria-pressed={mode === "world"}>🌍 <span>Worldwide</span></button>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {quickFilters.map((f) => <Link key={f.label} href={f.href} className="filter-chip">{f.label}</Link>)}
      </div>
    </div>
  );
}
