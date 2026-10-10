import type { Metadata } from "next";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { StateBox } from "@/components/state-box";
import { searchProducts } from "@/lib/catalog";
import { getOne, type SearchParams } from "@/lib/params";
import { quickFilters } from "@/lib/site";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = (getOne(sp, "q") ?? "").slice(0, 100);
  const mode = getOne(sp, "mode") === "global" ? "world" : "pk";
  const results = q ? searchProducts(q) : [];

  return (
    <>
      <PageHero crumbs={[{ label: "Search" }]} title={q ? `Results for “${q}”` : "Search phones and laptops"}>
        <form method="get" action="/search" role="search" className="mt-6 max-w-3xl">
          {mode === "world" && <input type="hidden" name="mode" value="global" />}
          <div className="search-shell">
            <Search className="shrink-0 text-primary" size={22} aria-hidden />
            <input name="q" defaultValue={q} className="min-w-0 flex-1 bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground sm:text-lg" placeholder="Search any phone or laptop…" aria-label="Search phones and laptops" />
            <button type="submit" className="search-submit">Search</button>
          </div>
        </form>
      </PageHero>
      <div className="page-body">
        {q && results.length > 0 && (
          <>
            <p className="mb-4 text-sm font-bold text-muted-foreground"><span className="text-foreground">{results.length}</span> {results.length === 1 ? "match" : "matches"}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((s) => <ProductCard key={s.product.slug} summary={s} mode={mode} className="!min-w-0" />)}
            </div>
          </>
        )}
        {q && results.length === 0 && (
          <StateBox icon={SearchX} title="No exact match yet" text="Try a brand or model name, such as “Galaxy”, “iPhone 16” or “MacBook”.">
            <Link href="/phones" className="primary-button">Browse phones</Link>
            <Link href="/laptops" className="secondary-button">Browse laptops</Link>
          </StateBox>
        )}
        {!q && (
          <div>
            <p className="eyebrow">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-2">{quickFilters.map((f) => <Link key={f.label} href={f.href} className="filter-chip">{f.label}</Link>)}</div>
          </div>
        )}
      </div>
    </>
  );
}
