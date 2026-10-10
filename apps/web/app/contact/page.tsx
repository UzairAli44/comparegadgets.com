import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the CompareGadgetsHub team.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Contact" }]} title="Contact us" lead="Questions, a wrong price, or a shop you’d like us to add? Send us a message." />
      <div className="page-body grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ContactForm />
        <aside className="panel p-5 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-base font-extrabold text-foreground">Saw a price in a shop?</h2>
          <p className="mt-2">Use the price report form instead. It lets you attach a photo so we can verify it faster.</p>
          <Link href="/report-price" className="section-action mt-3">Report a price</Link>
        </aside>
      </div>
    </>
  );
}
