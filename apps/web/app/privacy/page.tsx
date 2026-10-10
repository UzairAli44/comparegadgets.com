import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Privacy" }]} title="Privacy" lead="We collect as little as possible. There are no accounts and no sign-up." />
      <div className="page-body">
        <article className="prose-page">
          <h2>Browsing</h2>
          <p>You can use the whole site without an account. We don’t sell personal data or use advertising trackers.</p>
          <h2>Price reports</h2>
          <p>When you <Link href="/report-price">report a price</Link>, we store the product, shop, price, date and photo you send. The photo is used only to verify the report. If you give an email or phone number, we use it only to contact you about that report and delete it after 30 days.</p>
          <h2>Contact messages</h2>
          <p>Messages sent through the <Link href="/contact">contact form</Link> are used only to reply to you.</p>
          <h2>Leaving our site</h2>
          <p>When you click through to a shop, that shop’s own privacy policy applies.</p>
          <h2>Questions</h2>
          <p>Ask us anything about your data through the <Link href="/contact">contact form</Link>.</p>
        </article>
      </div>
    </>
  );
}
