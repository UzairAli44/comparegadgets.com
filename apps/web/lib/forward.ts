/**
 * Delivers form submissions to an operator-configured webhook (e.g. a Zapier/Make hook,
 * Google Apps Script, or a future admin API). There is no database yet, so without a
 * webhook URL submissions are refused honestly instead of being silently dropped.
 */
export type ForwardResult = { ok: true } | { ok: false; status: number; message: string };

export async function forward(envVar: "REPORTS_WEBHOOK_URL" | "CONTACT_WEBHOOK_URL", body: FormData | Record<string, unknown>): Promise<ForwardResult> {
  const url = process.env[envVar];
  if (!url) {
    return { ok: false, status: 503, message: "Submissions aren’t switched on yet. Please try again soon." };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      ...(body instanceof FormData ? { body } : { body: JSON.stringify(body), headers: { "content-type": "application/json" } }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: false, status: 502, message: "We couldn’t save your submission. Please try again in a few minutes." };
    return { ok: true };
  } catch {
    return { ok: false, status: 502, message: "We couldn’t save your submission. Please try again in a few minutes." };
  }
}

export const json = (data: unknown, status = 200) => Response.json(data, { status });
