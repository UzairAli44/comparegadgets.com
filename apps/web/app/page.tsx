const features = [
  { icon: "🇵🇰", title: "In Pakistan", text: "Prices from major Pakistani retailers, cheapest first." },
  { icon: "🌍", title: "Worldwide", text: "Official store prices in 25 countries, converted to PKR." },
  { icon: "🔄", title: "Updated daily", text: "Every price shows when it was last checked." },
];

export default function Home() {
  return (
    <main className="wrap">
      <header className="brand">CompareGadgetsHub</header>

      <section className="hero">
        <span className="badge">Coming soon</span>
        <h1>Find the lowest price for any phone or laptop, in Pakistan and worldwide.</h1>
        <p className="lead">
          We compare major Pakistani shops and official stores in 25 countries, all in PKR, so you always know
          where it&apos;s cheapest.
        </p>
      </section>

      <section className="grid">
        {features.map((f) => (
          <div className="card" key={f.title}>
            <div className="icon" aria-hidden>
              {f.icon}
            </div>
            <h2>{f.title}</h2>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="foot">© {new Date().getFullYear()} CompareGadgetsHub · comparegadgetshub.com</footer>
    </main>
  );
}
