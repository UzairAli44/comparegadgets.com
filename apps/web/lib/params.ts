export type SearchParams = Record<string, string | string[] | undefined>;

/** All values for a key, accepting repeated keys (?brand=a&brand=b) and comma lists. */
export function getAll(sp: SearchParams, key: string): string[] {
  const raw = sp[key];
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean);
}

export function getOne(sp: SearchParams, key: string): string | undefined {
  return getAll(sp, key)[0];
}

export function getNumber(sp: SearchParams, key: string): number | undefined {
  const n = Number(getOne(sp, key));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Rebuild a query string from params with some keys replaced or removed. */
export function withParams(sp: SearchParams, changes: Record<string, string | string[] | null>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k in changes || v === undefined) continue;
    for (const item of Array.isArray(v) ? v : [v]) q.append(k, item);
  }
  for (const [k, v] of Object.entries(changes)) {
    if (v === null) continue;
    for (const item of Array.isArray(v) ? v : [v]) q.append(k, item);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}
