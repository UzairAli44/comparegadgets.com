import type { Metadata } from "next";
import Link from "next/link";
import { CircleDollarSign, Search, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { countries, DATA_STATUS, getStats, retailers } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "How we compare prices",
  description: "Where our prices come from, how often they update, how currency conversion works and what worldwide prices include.",
  alternates: { canonical: "/how-we-compare" },
};

export default function HowWeComparePage() {
  const stats = getStats();
  const steps = [
    { icon: Search, title: "Search your gadget", text: "Type any phone or laptop model." },
    { icon: CircleDollarSign, title: "Compare every option", text: "Check Pakistan shops or official stores worldwide." },
    { icon: ShoppingBag, title: "Choose the best deal", text: "Buy from the cheapest trusted shop." },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: "How we compare" }]} eyebrow="Methodology" title="How we compare prices" lead="Clear rules for where prices come from, how fresh they are and what they include, so you can trust what you see." />
      <section className="how-band">
        <div className="page-section py-12 text-center lg:py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => <div key={title} className="step"><span className="step-number">{i + 1}</span><span className="step-icon"><Icon size={25} /></span><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </div>
      </section>
      <div className="page-body">
        <article className="prose-page">
          {DATA_STATUS.isSample && (
            <p className="rounded-lg border border-border bg-card p-4 text-sm"><strong>Preview status:</strong> the site is currently showing sample prices while we connect live feeds. The rules below describe how live prices will work.</p>
          )}
          <h2>In Pakistan</h2>
          <p>We check prices from {stats.retailers} major Pakistani retailers and official brand stores: {retailers.map((r) => r.name).join(", ")}. Prices include all local taxes, exactly as the shop shows them.</p>
          <ul>
            <li><strong>PTA status:</strong> phones are marked PTA-approved or non-PTA. Non-PTA phones are often cheaper but can be blocked on Pakistani networks, so they never count as the “lowest price”.</li>
            <li><strong>Warranty:</strong> we show whether the price comes with an official brand warranty or only a shop warranty.</li>
            <li><strong>Stock:</strong> out-of-stock offers are shown last and never count as the lowest price.</li>
          </ul>
          <h2>Worldwide</h2>
          <p>For brands that sell through official online stores abroad, we check the store price in {countries.length} countries, including the UAE, Saudi Arabia, the UK, the USA, Japan and Malaysia, and convert it to PKR.</p>
          <ul>
            <li><strong>Shelf price</strong> is what the store charges. Most countries include VAT or GST; the USA and Canada add sales tax at checkout, which we label clearly.</li>
            <li><strong>Without foreign tax</strong> removes VAT/GST so you can compare like-for-like. Tourists can sometimes reclaim part of it.</li>
            <li>Worldwide prices do <strong>not</strong> include PTA registration tax, customs duty, shipping or card fees. For phones, PTA tax can cancel out the saving, so check it before you buy.</li>
          </ul>
          <h2>Freshness</h2>
          <p>Popular models are checked several times a day and everything else at least daily. Every price shows when it was last checked. Prices older than 7 days are hidden.</p>
          <h2>Currency conversion</h2>
          <p>We convert at current exchange rates and show the date of the rates used{DATA_STATUS.isSample ? ` (currently ${DATA_STATUS.fxAsOf})` : ""}. Your bank or card may use a different rate and add a 2–4% fee.</p>
          <h2>Community prices</h2>
          <p>Visitors can <Link href="/report-price">report prices</Link> they saw in shops. Every report needs a photo and is checked by our team before it appears. Verified reports expire after 14 days.</p>
          <h2>Independence</h2>
          <p>Shops can’t pay to change their position. Results are always ordered by the sort you choose. If we add affiliate links in the future, they will be labelled and won’t affect the order.</p>
        </article>
      </div>
    </>
  );
}
