import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        <li><Link href="/">Home</Link></li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight size={13} aria-hidden />
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page" className="text-foreground">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
