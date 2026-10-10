import type { Metadata } from "next";
import { CatalogListing } from "@/components/catalog-listing";
import type { SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Laptop prices in Pakistan",
  description: "Compare laptop prices across major Pakistani retailers, filter by budget, processor, RAM and use case, and see worldwide prices in PKR.",
  alternates: { canonical: "/laptops" },
};

export default async function LaptopsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <CatalogListing category="laptop" searchParams={await searchParams} />;
}
