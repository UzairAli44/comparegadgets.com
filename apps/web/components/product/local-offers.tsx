"use client";

import { ExternalLink, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Freshness } from "../freshness";
import { StateBox } from "../state-box";
import type { LocalOffer } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/utils";

type Sort = "price-asc" | "price-desc" | "updated";

const ptaTag: Record<LocalOffer["pta"], { label: string; cls: string } | null> = {
  approved: { label: "PTA-approved", cls: "tag-good" },
  non_pta: { label: "Non-PTA", cls: "tag-bad" },
  not_applicable: null,
};
const warrantyLabel: Record<LocalOffer["warranty"], string> = { official: "Official warranty", shop: "Shop warranty", none: "No warranty" };

export function LocalOffers({ offers, isPhone }: { offers: LocalOffer[]; isPhone: boolean }) {
  const [inStockOnly, setInStockOnly] = useState(true);
  const [ptaOnly, setPtaOnly] = useState(false);
  const [officialOnly, setOfficialOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("price-asc");

  const { rows, hiddenOutOfStock } = useMemo(() => {
    const filtered = offers
      .filter((o) => !ptaOnly || o.pta === "approved")
      .filter((o) => !officialOnly || o.warranty === "official");
    const visible = filtered.filter((o) => !inStockOnly || o.inStock);
    const sorted = [...visible].sort((a, b) => {
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1; // out of stock always last
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "updated") return a.checkedHoursAgo - b.checkedHoursAgo;
      return a.price - b.price;
    });
    return { rows: sorted, hiddenOutOfStock: filtered.length - visible.length };
  }, [offers, inStockOnly, ptaOnly, officialOnly, sort]);

  // Same rule as the headline price: only in-stock, PTA-safe offers can be "Lowest price".
  const cheapest = rows.filter((o) => o.inStock && o.pta !== "non_pta").reduce<LocalOffer | null>((m, o) => (!m || o.price < m.price ? o : m), null);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="panel-title">Prices in Pakistan</h2>
          <p className="text-xs text-muted-foreground">{offers.length} retailers checked · prices include all local taxes</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field-input min-h-9 w-auto py-1 text-sm">
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="updated">Recently checked</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border px-4 py-3 sm:px-5" role="group" aria-label="Filter offers">
        <label className="check-row"><input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />In stock only</label>
        {isPhone && <label className="check-row"><input type="checkbox" checked={ptaOnly} onChange={(e) => setPtaOnly(e.target.checked)} />PTA-approved only</label>}
        <label className="check-row"><input type="checkbox" checked={officialOnly} onChange={(e) => setOfficialOnly(e.target.checked)} />Official warranty only</label>
      </div>

      {rows.length ? (
        <ul>
          {rows.map((o) => {
            const pta = ptaTag[o.pta];
            const best = o.id === cheapest?.id;
            return (
              <li key={o.id} className={cn("offer-row", best && "offer-best", !o.inStock && "offer-faded")}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="retailer-mark" aria-hidden>{o.retailer.short}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{o.retailer.name}</p>
                    <p className="text-xs text-muted-foreground"><Freshness hours={o.checkedHoursAgo} /></p>
                  </div>
                </div>
                <div>
                  {best && <span className="tag tag-good mb-1">Lowest price</span>}
                  {!best && o.inStock && o.pta === "non_pta" && cheapest && o.price < cheapest.price && <span className="tag tag-bad mb-1">Cheaper, but non-PTA</span>}
                  <p className="text-xl font-black">{formatPKR(o.price)}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className={cn("tag", o.inStock ? "tag-good" : "tag-bad")}>{o.inStock ? "In stock" : "Out of stock"}</span>
                  {pta && <span className={cn("tag", pta.cls)}>{pta.label}</span>}
                  <span className={cn("tag", o.warranty === "official" ? "" : "tag-warn")}>{warrantyLabel[o.warranty]}</span>
                </div>
                <a href={o.url} target="_blank" rel="nofollow noopener noreferrer" className="shop-button">
                  Go to shop<ExternalLink size={14} aria-hidden /><span className="sr-only"> {o.retailer.name} (opens in a new tab)</span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border-t border-border p-4">
          <StateBox icon={SearchX} title="No offers match these filters" text="Turn off a filter to see more shops." />
        </div>
      )}
      {hiddenOutOfStock > 0 && (
        <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
          {hiddenOutOfStock} out-of-stock {hiddenOutOfStock === 1 ? "offer" : "offers"} hidden.{" "}
          <button type="button" onClick={() => setInStockOnly(false)} className="font-bold text-primary hover:underline">Show</button>
        </p>
      )}
    </div>
  );
}
