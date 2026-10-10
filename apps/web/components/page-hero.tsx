import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

export function PageHero({ eyebrow, title, lead, crumbs, children }: { eyebrow?: string; title: string; lead?: ReactNode; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="page-hero-inner">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow mt-4">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
