/** Run: npm run demo -- PK   (buyer country as first arg; defaults to PK) */
import { compareGlobally } from "./index.ts";
import { sampleFx, sampleOffers, sampleTaxRules } from "./sample-data.ts";

const country = (process.argv[2] ?? "PK").toUpperCase();
const home = sampleTaxRules[country];
if (!home) {
  console.error(`Unknown country ${country}. Try one of: ${Object.keys(sampleTaxRules).join(", ")}`);
  process.exit(1);
}

const results = compareGlobally(
  sampleOffers,
  { country, currency: home.currency, cardFxFee: 0.03, modes: ["local", "ship", "travel"] },
  sampleFx,
  (c) => sampleTaxRules[c],
);

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
console.log(`iPhone 17 Pro 256GB — cheapest for a buyer in ${country} (ILLUSTRATIVE DATA)\n`);
for (const r of results) {
  const saving = r.savingsVsLocal === null ? "" : `  (${r.savingsVsLocal >= 0 ? "saves" : "costs"} ${fmt(Math.abs(r.savingsVsLocal))} vs local)`;
  console.log(`${r.currency} ${fmt(r.total).padStart(10)}  ${r.mode.padEnd(6)} ${r.offer.country}  ${r.offer.retailer}${saving}`);
  for (const line of r.breakdown) console.log(`${" ".repeat(20)}${line.label}: ${fmt(line.amount)}`);
  for (const w of r.warnings) console.log(`${" ".repeat(20)}! ${w}`);
}
