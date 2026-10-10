import type { Metadata } from "next";
import Link from "next/link";
import { Globe2 } from "lucide-react";
import { Freshness } from "@/components/freshness";
import { PageHero } from "@/components/page-hero";
import { StateBox } from "@/components/state-box";
import { getStats, getWorldwideDeals } from "@/lib/catalog";
import { formatPKR, percent } from "@/lib/format";

export const metadata: Metadata = {
  title: "Biggest worldwide savings",
  description: "Phones and laptops that cost less at official stores abroad than at the cheapest shop in Pakistan, converted to PKR.",
  alternates: { canonical: "/deals" },
};

export default function DealsPage() {
  const deals = getWorldwideDeals();
  const { countries } = getStats();

  return (
    <>
      <PageHero
        crumbs={[{ label: "Worldwide deals" }]}
        eyebrow="Global price radar"
        title="Biggest worldwide savings"
        lead={`Models that cost less at an official store in one of ${countries} countries than at the cheapest shop in Pakistan. Savings are before PTA tax, customs and travel costs.`}
      />
      <div className="page-body">
        {deals.length ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((deal, index) => {
              const abroad = deal.bestAbroad!;
              const variantQuery = deal.variant.id !== deal.product.variants[0].id ? `&variant=${deal.variant.id}` : "";
              return (
                <Link key={`${deal.product.slug}-${deal.variant.id}`} href={`/${deal.product.slug}?mode=global${variantQuery}`} className={`deal-card block transition hover:-translate-y-0.5 hover:border-primary ${index === 0 ? "deal-featured" : ""}`}>
                  <div className="flex items-start justify-between gap-3"><span className="deal-rank">{String(index + 1).padStart(2, "0")}</span><Freshness hours={abroad.checkedHoursAgo} /></div>
                  <h2 className="mt-5 text-lg font-extrabold leading-snug">{deal.product.name} {deal.variant.label}</h2>
                  <div className="mt-5 space-y-2 border-y border-border/70 py-4 text-sm">
                    <div className="flex justify-between gap-2"><span className="text-muted-foreground">🇵🇰 Pakistan</span><strong>{formatPKR(deal.lowestPkr!)}</strong></div>
                    <div className="flex justify-between gap-2"><span className="text-muted-foreground">{abroad.country.flag} {abroad.country.name}</span><strong>{formatPKR(abroad.pricePkr)}</strong></div>
                  </div>
                  <p className="mt-4 text-2xl font-black text-savings">−{formatPKR(deal.savingAbroad)} <span className="text-base">(−{percent(deal.savingAbroad, deal.lowestPkr!)}%)</span></p>
                  <p className="mt-1 text-xs text-muted-foreground">Before PTA tax / import costs</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <StateBox icon={Globe2} title="No worldwide savings right now" text="Pakistani shops currently match or beat official stores abroad for every model we track." />
        )}
      </div>
    </>
  );
}
