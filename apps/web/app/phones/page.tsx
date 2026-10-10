import type { Metadata } from "next";
import { CatalogListing } from "@/components/catalog-listing";
import type { SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Mobile phone prices in Pakistan",
  description: "Compare mobile phone prices across major Pakistani retailers, filter by brand, budget, RAM and storage, and see worldwide prices in PKR.",
  alternates: { canonical: "/phones" },
};

export default async function PhonesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <CatalogListing category="phone" searchParams={await searchParams} />;
}
