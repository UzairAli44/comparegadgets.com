"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { describedBy, Field } from "./field";
import { FormError, FormSuccess, submitForm, type FormState } from "./form-status";

export type ReportProductOption = { slug: string; name: string; category: "phone" | "laptop"; variants: { id: string; label: string }[] };

const today = () => new Date().toISOString().slice(0, 10);

export function ReportPriceForm({ products, initialProduct, initialVariant }: { products: ReportProductOption[]; initialProduct?: string; initialVariant?: string }) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [slug, setSlug] = useState(products.some((p) => p.slug === initialProduct) ? initialProduct! : "");
  const product = products.find((p) => p.slug === slug);
  const [variant, setVariant] = useState(product?.variants.some((v) => v.id === initialVariant) ? initialVariant! : product?.variants[0]?.id ?? "");
  const errors = state.status === "error" ? state.errors ?? {} : {};

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Thanks — report received"
        text="We’ll check the photo and price before it appears on the site. Verified community prices are shown for 14 days."
        resetLabel="Report another price"
        onReset={() => setState({ status: "idle" })}
      />
    );
  }

  return (
    <form
      className="panel space-y-5 p-5 sm:p-6"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setState({ status: "submitting" });
        setState(await submitForm("/api/reports", new FormData(e.currentTarget)));
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="product" label="Product" error={errors.product}>
          <select {...describedBy("product", errors.product)} className="field-input" required value={slug} onChange={(e) => { setSlug(e.target.value); setVariant(products.find((p) => p.slug === e.target.value)?.variants[0]?.id ?? ""); }}>
            <option value="" disabled>Choose a phone or laptop</option>
            <optgroup label="Phones">{products.filter((p) => p.category === "phone").map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</optgroup>
            <optgroup label="Laptops">{products.filter((p) => p.category === "laptop").map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</optgroup>
          </select>
        </Field>
        <Field id="variant" label="Variant" error={errors.variant}>
          <select {...describedBy("variant", errors.variant)} className="field-input" required value={variant} onChange={(e) => setVariant(e.target.value)} disabled={!product}>
            {!product && <option value="">Choose a product first</option>}
            {product?.variants.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
          </select>
        </Field>
        <Field id="shop" label="Shop name" error={errors.shop} hint="e.g. Al-Fatah Electronics">
          <input {...describedBy("shop", errors.shop, true)} className="field-input" required maxLength={100} autoComplete="off" />
        </Field>
        <Field id="city" label="City / market" error={errors.city} hint="e.g. Hafeez Centre, Lahore">
          <input {...describedBy("city", errors.city, true)} className="field-input" required maxLength={60} autoComplete="off" />
        </Field>
        <Field id="price" label="Price (PKR)" error={errors.price}>
          <input {...describedBy("price", errors.price)} className="field-input" type="number" inputMode="numeric" min={1000} max={5000000} step={1} required placeholder="e.g. 289999" />
        </Field>
        <Field id="seenOn" label="Date seen" error={errors.seenOn}>
          <input {...describedBy("seenOn", errors.seenOn)} className="field-input" type="date" required max={today()} defaultValue={today()} />
        </Field>
        {product?.category !== "laptop" && (
          <Field id="pta" label="PTA status" error={errors.pta}>
            <select {...describedBy("pta", errors.pta)} className="field-input" defaultValue="approved">
              <option value="approved">PTA-approved</option>
              <option value="non_pta">Non-PTA</option>
              <option value="unknown">Not sure</option>
            </select>
          </Field>
        )}
        <Field id="warranty" label="Warranty" error={errors.warranty}>
          <select {...describedBy("warranty", errors.warranty)} className="field-input" defaultValue="official">
            <option value="official">Official brand warranty</option>
            <option value="shop">Shop warranty</option>
            <option value="none">No warranty</option>
            <option value="unknown">Not sure</option>
          </select>
        </Field>
      </div>
      <Field id="photo" label="Photo of price tag or receipt" error={errors.photo} hint="JPG, PNG, WebP or HEIC, up to 5 MB. It must show the product, price and shop.">
        <input {...describedBy("photo", errors.photo, true)} className="field-input file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-primary" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" required />
      </Field>
      <Field id="contact" label="Email or phone" optional error={errors.contact} hint="Only used if we need to confirm your report. Deleted after 30 days.">
        <input {...describedBy("contact", errors.contact, true)} className="field-input" maxLength={100} autoComplete="email" />
      </Field>
      <div className="hidden" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <FormError state={state} />
      <button type="submit" className="primary-button w-full sm:w-auto" disabled={state.status === "submitting"}>
        {state.status === "submitting" ? "Sending…" : <>Submit report<ArrowRight size={17} /></>}
      </button>
    </form>
  );
}
