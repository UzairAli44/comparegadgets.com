import { forward, json } from "@/lib/forward";

const topics = ["general", "price-error", "retailer", "partnership", "press"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ message: "Invalid request." }, 400);
  }
  const s = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  if (s("website")) return json({ ok: true }); // honeypot

  const errors: Record<string, string> = {};
  const name = s("name"), email = s("email"), topic = s("topic"), message = s("message");
  if (!name || name.length > 80) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) errors.email = "Enter a valid email address.";
  if (!topics.includes(topic)) errors.topic = "Choose a topic.";
  if (message.length < 10 || message.length > 2000) errors.message = "Write a message between 10 and 2,000 characters.";
  if (Object.keys(errors).length) return json({ message: "Please fix the highlighted fields.", errors }, 422);

  const result = await forward("CONTACT_WEBHOOK_URL", { type: "contact", name, email, topic, message, submittedAt: new Date().toISOString() });
  return result.ok ? json({ ok: true }) : json({ message: result.message }, result.status);
}
