import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/phones", "/laptops", "/deals", "/how-we-compare", "/report-price", "/about", "/contact", "/disclaimer", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.6 })),
    ...getProducts().map((p) => ({ url: `${SITE_URL}/${p.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
