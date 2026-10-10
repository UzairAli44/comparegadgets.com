import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Freshness } from "./freshness";
import type { ProductSummary } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";

export function ProductCard({ summary, mode = "pk", priority = false, className = "" }: { summary: ProductSummary; mode?: "pk" | "world"; priority?: boolean; className?: string }) {
  const { product, variant, lowestPkr, shopCount, savingAbroad, checkedHoursAgo } = summary;
  const params = new URLSearchParams();
  if (variant.id !== product.variants[0].id) params.set("variant", variant.id);
  if (mode === "world") params.set("mode", "global");
  const href = `/${product.slug}${params.size ? `?${params}` : ""}`;

  return (
    <article className={`product-card ${className}`}>
      <Link href={href} className={`product-visual product-${product.tint}`} tabIndex={-1} aria-hidden>
        <Image src={product.image} alt="" width={408} height={408} sizes="(min-width: 1024px) 20vw, (min-width: 768px) 45vw, 78vw" priority={priority} />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold text-muted-foreground">{variant.label}</p>
        <h3 className="mt-1 min-h-12 text-base font-extrabold leading-snug">
          <Link href={href} className="hover:text-primary">{product.name}</Link>
        </h3>
        <div className="mt-3">
          <span className="text-xs text-muted-foreground">Lowest price</span>
          <p className="text-xl font-black text-foreground">{lowestPkr ? formatPKR(lowestPkr) : "Out of stock"}</p>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>at {shopCount} {shopCount === 1 ? "shop" : "shops"}</span>
          <Freshness hours={checkedHoursAgo} />
        </div>
        {savingAbroad > 0 ? <div className="saving-badge">🌍 Save up to {formatPKR(savingAbroad)} abroad</div> : <div className="h-9" />}
        <Link href={href} className="compare-button">Compare prices<ChevronRight size={16} /></Link>
      </div>
    </article>
  );
}
