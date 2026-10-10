import { getProduct } from "@/lib/catalog";
import { forward, json } from "@/lib/forward";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ message: "Invalid form submission." }, 400);
  }
  // Honeypot: real visitors never fill this hidden field.
  if (str(form.get("website"))) return json({ ok: true });

  const errors: Record<string, string> = {};
  const product = getProduct(str(form.get("product")));
  const variant = product?.variants.find((v) => v.id === str(form.get("variant")));
  const shop = str(form.get("shop"));
  const city = str(form.get("city"));
  const price = Number(str(form.get("price")));
  const seenOn = str(form.get("seenOn"));
  const pta = str(form.get("pta"));
  const warranty = str(form.get("warranty"));
  const contact = str(form.get("contact"));
  const photo = form.get("photo");

  if (!product) errors.product = "Choose a product.";
  else if (!variant) errors.variant = "Choose a variant.";
  if (!shop || shop.length > 100) errors.shop = "Enter the shop name.";
  if (!city || city.length > 60) errors.city = "Enter the city or market.";
  if (!Number.isFinite(price) || price < 1000 || price > 5_000_000) errors.price = "Enter the price in PKR.";
  const seen = new Date(seenOn);
  const ageDays = (Date.now() - seen.getTime()) / 86_400_000;
  if (!seenOn || Number.isNaN(seen.getTime()) || ageDays < -1 || ageDays > 30) errors.seenOn = "Choose a date within the last 30 days.";
  if (product?.category === "phone" && !["approved", "non_pta", "unknown"].includes(pta)) errors.pta = "Choose the PTA status.";
  if (!["official", "shop", "none", "unknown"].includes(warranty)) errors.warranty = "Choose the warranty type.";
  if (contact.length > 100) errors.contact = "Keep this under 100 characters.";
  if (!(photo instanceof File) || photo.size === 0) errors.photo = "Add a photo of the price tag or receipt.";
  else if (photo.size > MAX_PHOTO_BYTES) errors.photo = "Photo must be 5 MB or smaller.";
  else if (!PHOTO_TYPES.includes(photo.type)) errors.photo = "Use a JPG, PNG, WebP or HEIC photo.";

  if (Object.keys(errors).length) return json({ message: "Please fix the highlighted fields.", errors }, 422);

  const payload = new FormData();
  payload.set("type", "price_report");
  payload.set("status", "submitted");
  payload.set("product", product!.slug);
  payload.set("productName", product!.name);
  payload.set("variant", variant!.label);
  payload.set("shop", shop);
  payload.set("city", city);
  payload.set("pricePkr", String(Math.round(price)));
  payload.set("seenOn", seenOn);
  payload.set("pta", product!.category === "phone" ? pta : "not_applicable");
  payload.set("warranty", warranty);
  if (contact) payload.set("contact", contact);
  payload.set("submittedAt", new Date().toISOString());
  payload.set("photo", photo as File);

  const result = await forward("REPORTS_WEBHOOK_URL", payload);
  return result.ok ? json({ ok: true }) : json({ message: result.message }, result.status);
}
