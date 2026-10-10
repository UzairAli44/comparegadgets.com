import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe2, LineChart, Zap } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlobalOffers } from "@/components/product/global-offers";
import { LocalOffers } from "@/components/product/local-offers";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { StateBox } from "@/components/state-box";
import { DATA_STATUS, getGlobalOffers, getLocalOffers, getProduct, getProducts, getSimilar, getSummary, getVariant } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { getOne, type SearchParams } from "@/lib/params";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: `${product.name} price in Pakistan and worldwide`,
    description: `Compare ${product.name} prices across Pakistani retailers and official stores in other countries, all in PKR.`,
    alternates: { canonical: `/${product.slug}` },
  };
}

export default async function ProductPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const sp = await searchParams;
  const variant = getVariant(product, getOne(sp, "variant"));
  const mode = getOne(sp, "mode") === "global" ? "global" : "local";

  const summary = getSummary(product, variant.id);
  const localOffers = getLocalOffers(product, variant);
  const globalOffers = getGlobalOffers(product, variant);
  const cheapestLocal = localOffers.find((o) => o.inStock && o.price === summary.lowestPkr);
  const href = (changes: { variant?: string; mode?: string }) => {
    const q = new URLSearchParams();
    const v = changes.variant ?? variant.id;
    const m = changes.mode ?? mode;
    if (v !== product.variants[0].id) q.set("variant", v);
    if (m === "global") q.set("mode", "global");
    return `/${product.slug}${q.size ? `?${q}` : ""}`;
  };

  const specs: [string, string | undefined][] = [
    ["Brand", product.brand],
    [product.category === "phone" ? "Chipset" : "Processor", product.chip],
    ["Graphics", product.gpu],
    ["Display", product.display],
    ["Memory / storage", `${variant.ramGb} GB RAM · ${variant.storageGb} GB`],
    ["Battery", product.battery],
    ["5G", product.category === "phone" ? (product.has5g ? "Yes" : "No") : undefined],
    ["Weight", product.weight],
    ["Released", String(product.releaseYear)],
  ];

  return (
    <>
      <section className="page-hero">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="page-hero-inner">
          <Breadcrumbs items={[{ label: product.category === "phone" ? "Phones" : "Laptops", href: product.category === "phone" ? "/phones" : "/laptops" }, { label: product.name }]} />
          <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
            <div className={`product-visual product-${product.tint} h-64 rounded-2xl border border-border sm:h-80`}>
              <Image src={product.image} alt={`${product.name}`} width={600} height={600} priority sizes="(min-width: 768px) 24rem, 90vw" />
            </div>
            <div className="min-w-0">
              <p className="eyebrow">{product.brand} · {product.category === "phone" ? "Mobile phone" : "Laptop"}</p>
              <h1 className="page-title">{product.name}</h1>
              <p className="page-lead">{product.summary}</p>

              {product.variants.length > 1 && (
                <div className="mt-5">
                  <p className="field-label">Variant</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <Link key={v.id} href={href({ variant: v.id })} scroll={false} className={cn("filter-chip", v.id === variant.id && "chip-active")} aria-current={v.id === variant.id ? "true" : undefined}>{v.label}</Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                <p className="text-xs font-bold uppercase text-muted-foreground">Lowest in Pakistan</p>
                <p className="mt-1 text-3xl font-black">{summary.lowestPkr ? formatPKR(summary.lowestPkr) : "Currently out of stock"}</p>
                {cheapestLocal && <p className="text-sm text-muted-foreground">at <strong className="text-foreground">{cheapestLocal.retailer.name}</strong> · {summary.shopCount} shops in stock</p>}
                {summary.savingAbroad > 0 && summary.bestAbroad && mode === "local" && (
                  <Link href={href({ mode: "global" })} scroll={false} className="saving-badge hover:underline">
                    🌍 Up to {formatPKR(summary.savingAbroad)} cheaper in {summary.bestAbroad.country.name} → see Worldwide
                  </Link>
                )}
              </div>

              <div className="mt-5 inline-flex">
                <nav className="mode-toggle" aria-label="Price region">
                  <Link href={href({ mode: "local" })} scroll={false} className={mode === "local" ? "mode-active" : ""} aria-current={mode === "local" ? "page" : undefined}>🇵🇰 <span>In Pakistan</span></Link>
                  <Link href={href({ mode: "global" })} scroll={false} className={mode === "global" ? "mode-active" : ""} aria-current={mode === "global" ? "page" : undefined}>🌍 <span>Worldwide</span></Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-body space-y-10">
        <section aria-label={mode === "local" ? "Prices in Pakistan" : "Prices worldwide"}>
          {mode === "local" ? (
            <LocalOffers key={variant.id} offers={localOffers} isPhone={product.category === "phone"} />
          ) : globalOffers.length ? (
            <>
              <GlobalOffers key={variant.id} offers={globalOffers} pakistanLowest={summary.lowestPkr} isPhone={product.category === "phone"} />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Worldwide prices are official-store shelf prices converted at rates as of {DATA_STATUS.fxAsOf}. They exclude PTA registration tax, customs duty, shipping and card fees.
                An estimated &ldquo;cost in Pakistan&rdquo; view will be added once verified PTA/FBR rates are connected.
              </p>
            </>
          ) : (
            <StateBox icon={Globe2} title="Worldwide comparison isn’t available for this model" text={`${product.brand} doesn’t sell this model through official online stores in the countries we compare, so there is nothing reliable to show.`}>
              <Link href={href({ mode: "local" })} className="primary-button">See Pakistan prices</Link>
            </StateBox>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="panel overflow-hidden" aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="panel-title p-4 sm:p-5">Key specifications</h2>
            <table className="spec-table border-t border-border">
              <tbody>
                {specs.filter(([, v]) => v).map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}
              </tbody>
            </table>
          </section>
          <section className="panel p-4 sm:p-5" aria-labelledby="history-heading">
            <h2 id="history-heading" className="panel-title">Price history</h2>
            <div className="mt-4">
              <StateBox icon={LineChart} title="Tracking has started" text="The price chart appears once we have 14 days of verified prices for this model." />
            </div>
          </section>
        </div>

        <section>
          <SectionHeading eyebrow="Similar budget" title="You might also compare" action={{ label: "Browse all", href: product.category === "phone" ? "/phones" : "/laptops" }} />
          <div className="product-grid hide-scrollbar lg:!grid-cols-4">
            {getSimilar(product).map((s) => <ProductCard key={s.product.slug} summary={s} />)}
          </div>
        </section>

        <div className="report-banner">
          <div className="report-icon"><Zap size={25} /></div>
          <div className="min-w-0 flex-1"><p className="eyebrow">Help the community</p><h2>Seen a better price for the {product.name}?</h2><p>Tell us the shop and price. We verify every report before it’s listed.</p></div>
          <Link href={`/report-price?product=${product.slug}&variant=${variant.id}`} className="primary-button">Report a price<ArrowRight size={17} /></Link>
        </div>
      </div>
    </>
  );
}
