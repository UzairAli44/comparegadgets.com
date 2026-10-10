import Link from "next/link";
import { Info } from "lucide-react";
import { DATA_STATUS } from "@/lib/catalog";

/** Shown while the catalogue is sample data, so no visitor mistakes it for live prices. */
export function SampleDataNotice() {
  if (!DATA_STATUS.isSample) return null;
  return (
    <div className="sample-strip">
      <p className="mx-auto flex max-w-7xl items-start gap-2 px-4 py-2 sm:items-center sm:px-6 lg:px-8">
        <Info size={14} className="mt-0.5 shrink-0 sm:mt-0" aria-hidden />
        <span>
          Preview: prices shown are sample data while we connect live retailer and official-store feeds.{" "}
          <Link href="/how-we-compare" className="underline underline-offset-2">How it will work</Link>
        </span>
      </p>
    </div>
  );
}
