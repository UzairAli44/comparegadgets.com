# CompareGadgetsHub

Find where in the world a gadget is cheapest **for you**, in your own currency, with taxes, tourist
refunds, import duty, shipping and card fees included.

- [`docs/PRODUCT-SPEC.md`](docs/PRODUCT-SPEC.md): MVP v1 product spec (Pakistan launch, phones + laptops, local and global modes)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): system design, tech stack, data model and roadmap
- [`docs/BUSINESS-POTENTIAL.md`](docs/BUSINESS-POTENTIAL.md): market, competition, monetisation and risks
- [`packages/pricing-engine`](packages/pricing-engine): working prototype of the landed-cost engine

## Try the engine

Requires Node.js 22.18+ (runs TypeScript directly, no dependencies).

```bash
cd packages/pricing-engine
npm test           # unit tests
npm run demo -- PK # cheapest iPhone for a buyer in Pakistan (illustrative data)
```
