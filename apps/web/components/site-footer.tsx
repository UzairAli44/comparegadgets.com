import Link from "next/link";
import { Logo } from "./logo";
import { footerNav } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-footer">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-border pb-8 md:grid-cols-[1fr_auto]">
          <div>
            <Logo />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">Clear, current gadget prices for smarter buying decisions in Pakistan.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-muted-foreground">
            {footerNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary">{item.label}</Link>
            ))}
          </nav>
        </div>
        <p className="pt-6 text-xs leading-relaxed text-muted-foreground">
          Prices change often. Worldwide prices are converted to PKR at current rates. Import/PTA taxes are not included unless stated.
        </p>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">© {new Date().getFullYear()} CompareGadgetsHub</p>
      </div>
    </footer>
  );
}
