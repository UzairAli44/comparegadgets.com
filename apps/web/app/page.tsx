import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, ChevronRight, CircleDollarSign, Globe2, Laptop, Search, ShieldCheck, ShoppingBag, Smartphone, Store, Zap } from "lucide-react";
import { Freshness } from "@/components/freshness";
import { ProductCard } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { SectionHeading } from "@/components/section-heading";
import { getBrands, getStats, getSuggestionIndex, getTrending, getWorldwideDeals } from "@/lib/catalog";
import { formatPKR, percent } from "@/lib/format";
import { budgetHref, laptopBudgets, phoneBudgets } from "@/lib/site";

export default function HomePage() {
  const stats = getStats();
  const trending = getTrending();
  const deals = getWorldwideDeals(4, true);
  const phoneBrands = getBrands("phone");
  const laptopBrands = getBrands("laptop");

  const trust = [
    { icon: Store, value: `${stats.retailers}`, label: "Pakistani retailers" },
    { icon: Globe2, value: `${stats.countries}`, label: "countries compared" },
    { icon: CalendarClock, value: "Daily", label: "price updates" },
    { icon: ShieldCheck, value: "Zero", label: "sign-up needed" },
  ];
  const steps = [
    { icon: Search, title: "Search your gadget", text: "Type any phone or laptop model." },
    { icon: CircleDollarSign, title: "Compare every option", text: "Check Pakistan shops or official stores worldwide." },
    { icon: ShoppingBag, title: "Choose the best deal", text: "Buy from the cheapest trusted shop." },
  ];

  return (
    <>
      <section className="hero-section">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 text-center sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="hero-kicker"><span className="live-dot" />Pakistan’s smarter gadget price finder</div>
          <h1 className="mx-auto mt-5 max-w-5xl text-4xl font-black leading-[1.08] tracking-normal sm:text-6xl lg:text-7xl">
            Find the lowest price for any <span className="hero-accent">phone or laptop</span>, in Pakistan and worldwide.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We compare major Pakistani shops and official stores in {stats.countries} countries. Updated daily.
          </p>
          <div id="search" className="scroll-mt-28 pt-8"><SearchBox suggestions={getSuggestionIndex()} /></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Why shoppers trust us">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {trust.map(({ icon: Icon, value, label }) => (
            <div key={label} className="stat-item"><Icon size={20} aria-hidden /><div><strong>{value}</strong><span>{label}</span></div></div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading eyebrow="Live market snapshot" title="Trending in Pakistan" action={{ label: "Browse all", href: "/phones" }} />
        <div className="product-grid hide-scrollbar">
          {trending.map((s, i) => <ProductCard key={s.product.slug} summary={s} priority={i < 2} />)}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground md:hidden"><ArrowRight size={14} /> Swipe to see more</div>
      </section>

      <section className="savings-band">
        <div className="page-section">
          <SectionHeading eyebrow="Global price radar" title="Biggest worldwide savings this week" action={{ label: "See all worldwide deals", href: "/deals" }} />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {deals.map((deal, index) => (
              <Link key={`${deal.product.slug}-${deal.variant.id}`} href={`/${deal.product.slug}?mode=global${deal.variant.id !== deal.product.variants[0].id ? `&variant=${deal.variant.id}` : ""}`} className={`deal-card block transition hover:-translate-y-0.5 hover:border-primary ${index === 0 ? "deal-featured" : ""}`}>
                <div className="flex items-start justify-between gap-3"><span className="deal-rank">0{index + 1}</span><Freshness hours={deal.bestAbroad!.checkedHoursAgo} /></div>
                <h3 className="mt-5 text-lg font-extrabold leading-snug">{deal.product.name} {deal.variant.label}</h3>
                <div className="mt-5 space-y-2 border-y border-border/70 py-4 text-sm">
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">🇵🇰 Pakistan</span><strong>{formatPKR(deal.lowestPkr!)}</strong></div>
                  <div className="flex justify-between gap-2"><span className="text-muted-foreground">{deal.bestAbroad!.country.flag} {deal.bestAbroad!.country.name}</span><strong>{formatPKR(deal.bestAbroad!.pricePkr)}</strong></div>
                </div>
                <p className="mt-4 text-2xl font-black text-savings">−{formatPKR(deal.savingAbroad)} <span className="text-base">(−{percent(deal.savingAbroad, deal.lowestPkr!)}%)</span></p>
                <p className="mt-1 text-xs text-muted-foreground">Before PTA tax / import costs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading eyebrow={`Explore ${stats.phones + stats.laptops} devices`} title="Browse by category" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Link href="/phones" className="category-card group">
            <div><span className="category-icon"><Smartphone size={24} /></span><h3>Mobile Phones</h3><p>{stats.phones} models compared across trusted shops</p><span className="category-link">Explore phones <ArrowRight size={17} /></span></div>
            <Image src="/images/phone-graphite.png" alt="Modern mobile phones" width={408} height={408} sizes="(min-width: 1024px) 20vw, 40vw" />
          </Link>
          <Link href="/laptops" className="category-card group">
            <div><span className="category-icon"><Laptop size={24} /></span><h3>Laptops</h3><p>{stats.laptops} laptops for work, study and gaming</p><span className="category-link">Explore laptops <ArrowRight size={17} /></span></div>
            <Image src="/images/laptop-silver.png" alt="Modern laptop computer" width={408} height={408} sizes="(min-width: 1024px) 20vw, 40vw" />
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {phoneBrands.map((b) => <Link key={`p-${b}`} href={`/phones?brand=${encodeURIComponent(b)}`} className="brand-chip">{b}</Link>)}
          {laptopBrands.filter((b) => !phoneBrands.includes(b)).map((b) => <Link key={`l-${b}`} href={`/laptops?brand=${encodeURIComponent(b)}`} className="brand-chip">{b}</Link>)}
        </div>
      </section>

      <section className="page-section pt-2">
        <SectionHeading eyebrow="Stay on budget" title="Shop by price" />
        <div className="grid gap-4 lg:grid-cols-2">
          {[{ icon: Smartphone, name: "Phones", base: "/phones", items: phoneBudgets }, { icon: Laptop, name: "Laptops", base: "/laptops", items: laptopBudgets }].map(({ icon: Icon, name, base, items }) => (
            <div key={name} className="budget-panel">
              <div className="flex items-center gap-2 font-extrabold"><Icon size={19} className="text-primary" />{name}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => <Link key={item.label} href={budgetHref(base, item)} className="budget-chip">{item.label}<ChevronRight size={14} /></Link>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="how-band scroll-mt-16">
        <div className="page-section text-center">
          <p className="eyebrow">Three simple steps</p><h2 className="section-title">From search to the best price</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="step"><span className="step-number">{index + 1}</span><span className="step-icon"><Icon size={25} /></span><h3>{title}</h3><p>{text}</p></div>
            ))}
          </div>
          <Link href="/how-we-compare" className="section-action mt-8">Read our methodology<ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="page-section">
        <div className="report-banner">
          <div className="report-icon"><Zap size={25} /></div>
          <div className="min-w-0 flex-1"><p className="eyebrow">Help the community</p><h2>Seen a better price in a shop?</h2><p>Report a price you saw in a market, like Hafeez Centre. We verify every report before it’s listed.</p></div>
          <Link href="/report-price" className="primary-button">Report a price<ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
