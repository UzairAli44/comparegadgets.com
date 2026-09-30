import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://comparegadgetshub.com"),
  title: "CompareGadgetsHub — Lowest phone & laptop prices in Pakistan and worldwide",
  description:
    "Compare mobile phone and laptop prices across major Pakistani shops and official stores in 25 countries, in PKR.",
  openGraph: {
    title: "CompareGadgetsHub",
    description: "Lowest phone & laptop prices in Pakistan and worldwide, in PKR.",
    url: "https://comparegadgetshub.com",
    siteName: "CompareGadgetsHub",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
