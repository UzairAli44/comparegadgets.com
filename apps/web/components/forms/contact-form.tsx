"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { describedBy, Field } from "./field";
import { FormError, FormSuccess, submitForm, type FormState } from "./form-status";

export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const errors = state.status === "error" ? state.errors ?? {} : {};

  if (state.status === "success") {
    return <FormSuccess title="Message sent" text="Thanks for getting in touch. We usually reply within two working days." resetLabel="Send another message" onReset={() => setState({ status: "idle" })} />;
  }

  return (
    <form
      className="panel space-y-5 p-5 sm:p-6"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setState({ status: "submitting" });
        setState(await submitForm("/api/contact", Object.fromEntries(new FormData(e.currentTarget))));
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <input {...describedBy("name", errors.name)} className="field-input" required maxLength={80} autoComplete="name" />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input {...describedBy("email", errors.email)} className="field-input" type="email" required maxLength={120} autoComplete="email" />
        </Field>
      </div>
      <Field id="topic" label="Topic" error={errors.topic}>
        <select {...describedBy("topic", errors.topic)} className="field-input" defaultValue="general">
          <option value="general">General question</option>
          <option value="price-error">Report a wrong price</option>
          <option value="retailer">I’m a retailer</option>
          <option value="partnership">Partnership</option>
          <option value="press">Press</option>
        </select>
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <textarea {...describedBy("message", errors.message)} className="field-input min-h-36" required minLength={10} maxLength={2000} />
      </Field>
      <div className="hidden" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <FormError state={state} />
      <button type="submit" className="primary-button w-full sm:w-auto" disabled={state.status === "submitting"}>
        {state.status === "submitting" ? "Sending…" : <>Send message<ArrowRight size={17} /></>}
      </button>
    </form>
  );
}
