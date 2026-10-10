import type { Metadata } from "next";
import { BadgeCheck, Camera, Clock } from "lucide-react";
import { ReportPriceForm } from "@/components/forms/report-price-form";
import { PageHero } from "@/components/page-hero";
import { getProducts } from "@/lib/catalog";
import { getOne, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Report a price",
  description: "Seen a better phone or laptop price in a Pakistani shop? Report it with a photo and we’ll verify it before listing.",
  alternates: { canonical: "/report-price" },
};

const steps = [
  { icon: Camera, title: "Add a clear photo", text: "Price tag or receipt showing the product, the price and the shop." },
  { icon: BadgeCheck, title: "We verify it", text: "Our team checks the photo and compares it with other prices before listing." },
  { icon: Clock, title: "Listed for 14 days", text: "Verified prices show a “Community verified” badge and expire after 14 days." },
];

export default async function ReportPricePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const products = getProducts().map((p) => ({ slug: p.slug, name: p.name, category: p.category, variants: p.variants.map((v) => ({ id: v.id, label: v.label })) }));

  return (
    <>
      <PageHero crumbs={[{ label: "Report a price" }]} eyebrow="Help the community" title="Seen a better price in a shop?" lead="Markets like Hafeez Centre and Saddar often beat online prices. Share what you saw and help other buyers in Pakistan." />
      <div className="page-body grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ReportPriceForm products={products} initialProduct={getOne(sp, "product")} initialVariant={getOne(sp, "variant")} />
        <aside className="space-y-3" aria-label="How reports work">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="panel flex gap-3 p-4">
              <span className="category-icon h-10 w-10 shrink-0"><Icon size={20} /></span>
              <div><h2 className="text-sm font-extrabold">{title}</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p></div>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
