import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Disclaimer", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Disclaimer" }]} title="Disclaimer" />
      <div className="page-body">
        <article className="prose-page">
          <h2>Prices can change</h2>
          <p>We check prices regularly, but shops can change them at any time. The price on the shop’s own website or in the shop is the one that applies. Always confirm before you pay.</p>
          <h2>We are not a seller</h2>
          <p>CompareGadgetsHub doesn’t sell products, take orders or handle payments. Any purchase is between you and the shop, including returns and warranty claims.</p>
          <h2>Worldwide prices and taxes</h2>
          <p>Worldwide prices are converted to PKR for comparison only. They don’t include PTA registration tax, customs duty, shipping, or card and exchange fees unless clearly stated. Any tax figures we show are estimates; check current PTA and FBR rules before buying abroad.</p>
          <h2>Regional models</h2>
          <p>Phones and laptops sold in other countries can differ from Pakistani models, for example in SIM support, network bands, keyboard layout or warranty coverage. We highlight known differences but can’t list every one.</p>
          <h2>Community prices</h2>
          <p>Community-reported prices are checked before listing, but we can’t guarantee a shop will still offer the same price.</p>
        </article>
      </div>
    </>
  );
}
