export const formatPKR = (value: number) => `PKR ${Math.round(value).toLocaleString("en-PK")}`;

export const formatMoney = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "code", maximumFractionDigits: 0 })
    .format(value)
    .replace(/ /g, " ");

export const formatAgo = (hours: number) => (hours < 1 ? "Updated just now" : hours < 24 ? `Updated ${hours}h ago` : `Updated ${Math.floor(hours / 24)}d ago`);

export const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);
