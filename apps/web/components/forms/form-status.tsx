import { AlertCircle, CheckCircle2 } from "lucide-react";

export type FormState = { status: "idle" | "submitting" } | { status: "success" } | { status: "error"; message: string; errors?: Record<string, string> };

export function FormError({ state }: { state: FormState }) {
  if (state.status !== "error") return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
      {state.message}
    </div>
  );
}

export function FormSuccess({ title, text, onReset, resetLabel }: { title: string; text: string; onReset: () => void; resetLabel: string }) {
  return (
    <div role="status" className="state-box border-solid">
      <span className="category-icon text-savings"><CheckCircle2 size={24} /></span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button type="button" onClick={onReset} className="secondary-button mt-5">{resetLabel}</button>
    </div>
  );
}

/** POST helper that maps API responses to form state. */
export async function submitForm(url: string, body: FormData | object): Promise<FormState> {
  try {
    const res = await fetch(url, body instanceof FormData ? { method: "POST", body } : { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { status: "success" };
    return { status: "error", message: data.message ?? "Something went wrong. Please try again.", errors: data.errors };
  } catch {
    return { status: "error", message: "You seem to be offline. Check your connection and try again." };
  }
}
