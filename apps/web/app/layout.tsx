import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { SampleDataNotice } from "@/components/sample-data-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "CompareGadgetsHub — Compare Phone & Laptop Prices in Pakistan", template: "%s · CompareGadgetsHub" },
  description: "Compare mobile phone and laptop prices across Pakistani retailers and official stores in 25 countries. All prices in PKR, updated daily.",
  authors: [{ name: SITE_NAME }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "CompareGadgetsHub — Find the lowest gadget price",
    description: "Compare trusted Pakistan shops and worldwide official stores in one fast search.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1520" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:font-bold">Skip to content</a>
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
          <SiteHeader />
          <SampleDataNotice />
          <main id="main" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
