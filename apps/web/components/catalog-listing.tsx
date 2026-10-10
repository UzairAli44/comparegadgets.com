import Link from "next/link";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { PageHero } from "./page-hero";
import { ProductCard } from "./product-card";
import { StateBox } from "./state-box";
import { getBrands, getProducts, listProducts, type Category, type LaptopUse, type SortKey } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { getAll, getNumber, getOne, withParams, type SearchParams } from "@/lib/params";
import { budgetHref, laptopBudgets, phoneBudgets } from "@/lib/site";
import { cn } from "@/lib/utils";

const sorts: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Popular" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "newest", label: "Newest" },
];

const useLabels: Record<LaptopUse, string> = { student: "Student", office: "Office", gaming: "Gaming", creator: "Creator" };

const copy = {
  phone: { title: "Mobile phones", path: "/phones", lead: "Compare prices from major Pakistani retailers and see how much the same phone costs abroad.", budgets: phoneBudgets },
  laptop: { title: "Laptops", path: "/laptops", lead: "Find the cheapest trusted shop in Pakistan for laptops for study, office work and gaming.", budgets: laptopBudgets },
};

const unique = <T,>(values: T[]) => [...new Set(values)].sort((a, b) => (a > b ? 1 : -1));

export function CatalogListing({ category, searchParams: sp }: { category: Category; searchParams: SearchParams }) {
  const c = copy[category];
  const all = getProducts(category);
  const brands = getAll(sp, "brand");
  const ram = getAll(sp, "ram").map(Number).filter(Boolean);
  const storage = getAll(sp, "storage").map(Number).filter(Boolean);
  const cpu = getAll(sp, "cpu");
  const uses = getAll(sp, "use") as LaptopUse[];
  const fiveG = getOne(sp, "5g") === "1";
  const min = getNumber(sp, "min");
  const max = getNumber(sp, "max");
  const sortParam = getOne(sp, "sort") as SortKey | undefined;
  const sort = sorts.some((s) => s.key === sortParam) ? sortParam! : "popular";

  const results = listProducts({ category, brands, ram, storage, cpu, uses, fiveG, min, max, sort });

  const options = {
    brands: getBrands(category),
    ram: unique(all.flatMap((p) => p.variants.map((v) => v.ramGb))),
    storage: unique(all.flatMap((p) => p.variants.map((v) => v.storageGb))),
    cpu: unique(all.map((p) => p.chipFamily)),
    uses: Object.keys(useLabels) as LaptopUse[],
  };

  const active: { label: string; href: string }[] = [
    ...brands.map((b) => ({ label: b, href: withParams(sp, { brand: brands.filter((x) => x !== b) }) })),
    ...ram.map((r) => ({ label: `${r} GB RAM`, href: withParams(sp, { ram: ram.filter((x) => x !== r).map(String) }) })),
    ...storage.map((s) => ({ label: `${s} GB storage`, href: withParams(sp, { storage: storage.filter((x) => x !== s).map(String) }) })),
    ...cpu.map((x) => ({ label: x, href: withParams(sp, { cpu: cpu.filter((y) => y !== x) }) })),
    ...uses.map((u) => ({ label: useLabels[u] ?? u, href: withParams(sp, { use: uses.filter((y) => y !== u) }) })),
    ...(fiveG ? [{ label: "5G", href: withParams(sp, { "5g": null }) }] : []),
    ...(min || max ? [{ label: `${min ? formatPKR(min) : "PKR 0"} – ${max ? formatPKR(max) : "any"}`, href: withParams(sp, { min: null, max: null }) }] : []),
  ];

  const filters = (
    <form method="get" action={c.path} className="panel p-4">
      <input type="hidden" name="sort" value={sort} />
      <div className="filter-group">
        <p className="filter-heading">Price (PKR)</p>
        <div className="grid grid-cols-2 gap-2">
          <label><span className="sr-only">Minimum price</span><input className="field-input" type="number" name="min" min={0} step={1000} placeholder="Min" defaultValue={min} inputMode="numeric" /></label>
          <label><span className="sr-only">Maximum price</span><input className="field-input" type="number" name="max" min={0} step={1000} placeholder="Max" defaultValue={max} inputMode="numeric" /></label>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.budgets.map((b) => <Link key={b.label} href={budgetHref(c.path, b)} className={cn("budget-chip", min === b.min && max === b.max && "chip-active")}>{b.label}</Link>)}
        </div>
      </div>
      <fieldset className="filter-group">
        <legend className="filter-heading">Brand</legend>
        <div className="grid grid-cols-2 gap-2">
          {options.brands.map((b) => <label key={b} className="check-row"><input type="checkbox" name="brand" value={b} defaultChecked={brands.some((x) => x.toLowerCase() === b.toLowerCase())} />{b}</label>)}
        </div>
      </fieldset>
      {category === "laptop" && (
        <>
          <fieldset className="filter-group">
            <legend className="filter-heading">Best for</legend>
            <div className="grid grid-cols-2 gap-2">
              {options.uses.map((u) => <label key={u} className="check-row"><input type="checkbox" name="use" value={u} defaultChecked={uses.includes(u)} />{useLabels[u]}</label>)}
            </div>
          </fieldset>
          <fieldset className="filter-group">
            <legend className="filter-heading">Processor</legend>
            <div className="grid gap-2">
              {options.cpu.map((x) => <label key={x} className="check-row"><input type="checkbox" name="cpu" value={x} defaultChecked={cpu.includes(x)} />{x}</label>)}
            </div>
          </fieldset>
        </>
      )}
      <fieldset className="filter-group">
        <legend className="filter-heading">RAM</legend>
        <div className="grid grid-cols-3 gap-2">
          {options.ram.map((r) => <label key={r} className="check-row"><input type="checkbox" name="ram" value={r} defaultChecked={ram.includes(r)} />{r} GB</label>)}
        </div>
      </fieldset>
      <fieldset className="filter-group">
        <legend className="filter-heading">Storage</legend>
        <div className="grid grid-cols-3 gap-2">
          {options.storage.map((s) => <label key={s} className="check-row"><input type="checkbox" name="storage" value={s} defaultChecked={storage.includes(s)} />{s >= 1024 ? `${s / 1024} TB` : `${s} GB`}</label>)}
        </div>
      </fieldset>
      {category === "phone" && (
        <div className="filter-group">
          <label className="check-row"><input type="checkbox" name="5g" value="1" defaultChecked={fiveG} />5G only</label>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <button type="submit" className="primary-button flex-1">Apply filters</button>
        <Link href={c.path} className="secondary-button">Reset</Link>
      </div>
    </form>
  );

  return (
    <>
      <PageHero crumbs={[{ label: c.title }]} title={c.title} lead={c.lead} />
      <div className="page-body">
        <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
          <aside aria-label="Filters" className="lg:sticky lg:top-24">
            <details className="group lg:hidden">
              <summary className="secondary-button w-full cursor-pointer list-none"><SlidersHorizontal size={16} />Filters{active.length ? ` (${active.length})` : ""}</summary>
              <div className="mt-3">{filters}</div>
            </details>
            <div className="hidden lg:block">{filters}</div>
          </aside>

          <section aria-labelledby="results-heading" className="min-w-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="results-heading" className="text-sm font-bold text-muted-foreground">
                <span className="text-foreground">{results.length}</span> of {all.length} {category === "phone" ? "phones" : "laptops"}
              </h2>
              <nav aria-label="Sort" className="hide-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
                {sorts.map((s) => (
                  <Link key={s.key} href={withParams(sp, { sort: s.key === "popular" ? null : s.key })} className={cn("filter-chip whitespace-nowrap", sort === s.key && "chip-active")} aria-current={sort === s.key ? "true" : undefined}>
                    {s.label}
                  </Link>
                ))}
              </nav>
            </div>

            {active.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {active.map((a) => (
                  <Link key={a.label} href={`${c.path}${a.href}`} className="tag py-1.5 hover:text-primary" aria-label={`Remove filter ${a.label}`}>{a.label}<X size={12} /></Link>
                ))}
                <Link href={c.path} className="text-xs font-bold text-primary hover:underline">Clear all</Link>
              </div>
            )}

            {results.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((s) => <ProductCard key={s.product.slug} summary={s} className="!min-w-0" />)}
              </div>
            ) : (
              <StateBox icon={SearchX} title="No matches for these filters" text="Try widening the price range or removing a filter.">
                <Link href={c.path} className="primary-button">Clear filters</Link>
              </StateBox>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
