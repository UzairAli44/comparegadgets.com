import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, action, as: Tag = "h2" }: { eyebrow?: string; title: string; action?: { label: string; href: string }; as?: "h1" | "h2" }) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Tag className="section-title">{title}</Tag>
      </div>
      {action && (
        <Link className="section-action" href={action.href}>
          {action.label}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
