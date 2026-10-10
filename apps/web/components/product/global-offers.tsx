"use client";

import { AlertTriangle, ExternalLink, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Freshness } from "../freshness";
import { StateBox } from "../state-box";
import type { GlobalOffer, Region } from "@/lib/catalog";
import { formatMoney, formatPKR, percent } from "@/lib/format";
import { cn } from "@/lib/utils";

type Sort = "cheapest" | "expensive" | "name";
type Basis = "shelf" | "ex-tax";
const regions: Region[] = ["Middle East", "Asia", "Europe", "Americas", "Oceania"];

export function GlobalOffers({ offers, pakistanLowest, isPhone }: { offers: GlobalOffer[]; pakistanLowest: number | null; isPhone: boolean }) {
  const [region, setRegion] = useState<Region | "all">("all");
  const [cheaperOnly, setCheaperOnly] = useState(false);
  const [basis, setBasis] = useState<Basis>("shelf");
  const [sort, setSort] = useState<Sort>("cheapest");

  const priceOf = (o: GlobalOffer) => (basis === "shelf" ? o.pricePkr : o.pricePkrExTax);

  const rows = useMemo(() => {
    const price = (o: GlobalOffer) => (basis === "shelf" ? o.pricePkr : o.pricePkrExTax);
    return offers
      .filter((o) => region === "all" || o.country.region === region)
      .filter((o) => !cheaperOnly || (pakistanLowest !== null && price(o) < pakistanLowest))
      .sort((a, b) => (sort === "name" ? a.country.name.localeCompare(b.country.name) : sort === "expensive" ? price(b) - price(a) : price(a) - price(b)));
  }, [offers, region, cheaperOnly, basis, sort, pakistanLowest]);

  const byPrice = [...offers].sort((a, b) => priceOf(a) - priceOf(b));
  const cheapest = byPrice[0];
  const priciest = byPrice[byPrice.length - 1];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="summary-tile"><span>Cheapest</span><strong className="text-savings">{cheapest.country.flag} {cheapest.country.name}</strong><small>{formatPKR(priceOf(cheapest))}</small></div>
        <div className="summary-tile"><span>Pakistan (lowest shop)</span><strong>🇵🇰 Pakistan</strong><small>{pakistanLowest ? formatPKR(pakistanLowest) : "Out of stock"}</small></div>
        <div className="summary-tile"><span>Most expensive</span><strong className="text-premium">{priciest.country.flag} {priciest.country.name}</strong><small>{formatPKR(priceOf(priciest))}</small></div>
      </div>

      <div className="panel overflow-hidden">
        <div className="flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="panel-title">Official store prices worldwide</h2>
            <p className="text-xs text-muted-foreground">{offers.length} countries · converted to PKR at current rates</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="mode-toggle" role="group" aria-label="Price basis">
              <button type="button" onClick={() => setBasis("shelf")} className={basis === "shelf" ? "mode-active" : ""} aria-pressed={basis === "shelf"}>Shelf price</button>
              <button type="button" onClick={() => setBasis("ex-tax")} className={basis === "ex-tax" ? "mode-active" : ""} aria-pressed={basis === "ex-tax"}>Without foreign tax</button>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field-input min-h-9 w-auto py-1 text-sm">
                <option value="cheapest">Cheapest first</option>
                <option value="expensive">Most expensive first</option>
                <option value="name">Country A–Z</option>
              </select>
            </label>
          </div>
        </div>
        {isPhone && (
          <p className="flex items-start gap-2 border-t border-border bg-chart-4/10 px-4 py-3 text-xs font-semibold sm:px-5">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-chart-4" aria-hidden />
            Phones bought abroad need PTA registration (and its tax) to work on Pakistani networks. That tax is not included in these prices and can cancel out the saving.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3 sm:px-5">
          {(["all", ...regions] as const).map((r) => (
            <button key={r} type="button" onClick={() => setRegion(r)} className={cn("filter-chip", region === r && "chip-active")} aria-pressed={region === r}>
              {r === "all" ? "All regions" : r}
            </button>
          ))}
          <label className="check-row ml-1"><input type="checkbox" checked={cheaperOnly} onChange={(e) => setCheaperOnly(e.target.checked)} />Only cheaper than Pakistan</label>
        </div>

        {rows.length ? (
          <ul>
            {rows.map((o) => {
              const price = priceOf(o);
              const diff = pakistanLowest !== null ? price - pakistanLowest : null;
              return (
                <li key={o.id} className="offer-row">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-xl" aria-hidden>{o.country.flag}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold">{o.country.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{o.storeName}</p>
                      <p className="text-xs text-muted-foreground"><Freshness hours={o.checkedHoursAgo} /></p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-black">{formatPKR(price)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatMoney(o.localPrice, o.currency)} · {basis === "ex-tax" ? (o.taxIncluded ? `excl. ${Math.round(o.country.taxRate * 100)}% tax` : "excl. sales tax") : o.taxIncluded ? "incl. local tax" : "excl. sales tax"}
                    </p>
                  </div>
                  <div>
                    {diff !== null && (
                      <p className={cn("text-sm font-black", diff < 0 ? "text-savings" : "text-premium")}>
                        {diff < 0 ? "−" : "+"}{formatPKR(Math.abs(diff))} ({diff < 0 ? "−" : "+"}{percent(Math.abs(diff), pakistanLowest!)}%)
                        <span className="block text-xs font-semibold text-muted-foreground">vs cheapest in Pakistan</span>
                      </p>
                    )}
                    {o.notes.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {o.notes.map((n) => <li key={n} className="flex gap-1.5 text-xs text-muted-foreground"><AlertTriangle size={12} className="mt-0.5 shrink-0 text-chart-4" aria-hidden />{n}</li>)}
                      </ul>
                    )}
                  </div>
                  <a href={o.url} target="_blank" rel="nofollow noopener noreferrer" className="shop-button">
                    Visit store<ExternalLink size={14} aria-hidden /><span className="sr-only"> {o.storeName} (opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="border-t border-border p-4">
            <StateBox icon={SearchX} title="No countries match" text="Try another region or turn off “Only cheaper than Pakistan”." />
          </div>
        )}
      </div>
    </div>
  );
}
