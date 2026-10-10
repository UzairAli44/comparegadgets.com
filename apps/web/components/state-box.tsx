import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Shared empty / error / not-available state. */
export function StateBox({ icon: Icon, title, text, children }: { icon: LucideIcon; title: string; text?: ReactNode; children?: ReactNode }) {
  return (
    <div className="state-box">
      <span className="category-icon"><Icon size={24} /></span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
