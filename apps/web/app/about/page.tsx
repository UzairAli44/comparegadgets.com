import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getStats } from "@/lib/catalog";

export const metadata: Metadata = { title: "About", description: "Why we built CompareGadgetsHub and who it’s for.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  const stats = getStats();
  return (
    <>
      <PageHero crumbs={[{ label: "About" }]} eyebrow="About us" title="Clear gadget prices for Pakistan" lead="CompareGadgetsHub helps everyday buyers in Pakistan find the lowest trusted price for a phone or laptop, at home and around the world." />
      <div className="page-body">
        <article className="prose-page">
          <h2>Why we built it</h2>
          <p>The same phone can cost very different amounts from one shop to the next, and very different again in Dubai, London or Tokyo. Checking every shop and every country by hand takes hours. We do it for you and show the result in PKR.</p>
          <h2>What we compare</h2>
          <ul>
            <li>Prices from {stats.retailers} major Pakistani retailers and official brand stores.</li>
            <li>Official-store prices in {stats.countries} countries, converted to PKR.</li>
            <li>PTA status, warranty type and stock, so the cheapest price is also a safe one.</li>
          </ul>
          <h2>What we don’t do</h2>
          <p>We don’t sell anything and we don’t ask you to sign up. When you choose a shop, you buy directly from them.</p>
          <p>Read <Link href="/how-we-compare">how we compare prices</Link>, or <Link href="/contact">get in touch</Link>.</p>
        </article>
      </div>
    </>
  );
}
