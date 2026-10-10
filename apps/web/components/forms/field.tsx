import type { ReactNode } from "react";

/** Label + control + hint/error, wired up for screen readers via ids. */
export function Field({ id, label, hint, error, optional, children }: { id: string; label: string; hint?: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="font-semibold text-muted-foreground"> (optional)</span>}
      </label>
      {children}
      {error ? <p id={`${id}-error`} className="field-error" role="alert">{error}</p> : hint ? <p id={`${id}-hint`} className="field-hint">{hint}</p> : null}
    </div>
  );
}

/** Props that connect a control to its Field's hint/error text. */
export const describedBy = (id: string, error?: string, hint?: boolean) => ({
  id,
  name: id,
  "aria-invalid": error ? (true as const) : undefined,
  "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
});
