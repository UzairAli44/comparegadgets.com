import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label="CompareGadgetsHub home">
      <span className="logo-mark"><BarChart3 size={20} strokeWidth={2.6} /></span>
      <span className="truncate text-[17px] font-extrabold tracking-normal text-foreground sm:text-lg">
        Compare<span className="text-primary">Gadgets</span>Hub
      </span>
    </Link>
  );
}
