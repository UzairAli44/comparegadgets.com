export const SITE_URL = "https://comparegadgetshub.com";
export const SITE_NAME = "CompareGadgetsHub";

export const mainNav = [
  { label: "Phones", href: "/phones" },
  { label: "Laptops", href: "/laptops" },
  { label: "Worldwide deals", href: "/deals" },
  { label: "How we compare", href: "/how-we-compare" },
];

export const footerNav = [
  { label: "About", href: "/about" },
  { label: "How we compare", href: "/how-we-compare" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Contact", href: "/contact" },
  { label: "Report a price", href: "/report-price" },
  { label: "Privacy", href: "/privacy" },
];

export const quickFilters = [
  { label: "Phones under 50k", href: "/phones?max=50000" },
  { label: "Phones under 100k", href: "/phones?max=100000" },
  { label: "Laptops under 150k", href: "/laptops?max=150000" },
  { label: "Gaming laptops", href: "/laptops?use=gaming" },
  { label: "iPhones", href: "/phones?brand=Apple" },
  { label: "Samsung", href: "/phones?brand=Samsung" },
];

export const phoneBudgets = [
  { label: "Under 30k", max: 30000 },
  { label: "30–60k", min: 30000, max: 60000 },
  { label: "60–100k", min: 60000, max: 100000 },
  { label: "100–200k", min: 100000, max: 200000 },
  { label: "200k+", min: 200000 },
];

export const laptopBudgets = [
  { label: "Under 100k", max: 100000 },
  { label: "100–150k", min: 100000, max: 150000 },
  { label: "150–250k", min: 150000, max: 250000 },
  { label: "250k+", min: 250000 },
];

export const budgetHref = (base: string, b: { min?: number; max?: number }) => {
  const q = new URLSearchParams();
  if (b.min) q.set("min", String(b.min));
  if (b.max) q.set("max", String(b.max));
  return `${base}?${q}`;
};
