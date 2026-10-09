# WeGroween Brand Identity Blueprint

## 1. Administration

- Version: 1.2.0-proposed
- Status: Identity, component system and Phase 7 delivery complete; package remains proposed pending finalization
- Decision owner: Design Decision Leader (user)
- Date: 2026-10-02
- Mode: REFRESH
- Creative territory: Cultivated Editorial
- Voice: V1 Cultivated Authority
- Palette: C2 Soil & Saffron
- Typography: T2 Fraunces + DM Sans
- Grid: G3 Curated Market
- Motion: M1 Restrained Editorial

`design-tokens.json` is the value source of truth. Correct this document if it ever conflicts with the tokens.

## 2. Business and audience context

WeGroween combines “we grow green.” It sells microgreens, mushrooms, organic vegetables and fruits, and exotic farming-related products for households, with restaurant supply as a deliberate secondary pathway. The current engagement defines the brand and design system; it does not implement the commerce application.

### Primary audience

Quality-conscious Indian households and home cooks who value freshness, flavour, credible cultivation and convenient delivery.

### Secondary audience

Chefs, restaurants, caterers and hospitality buyers who need dependable availability, fast repeat ordering, clear product specifications, GST-ready records and relationship support.

### Primary conversion

Complete a household purchase online. Secondary conversions are restaurant account/enquiry submission, repeat ordering and WhatsApp support.

## 3. Approved creative direction

### Theme

Every harvest is an edition worth collecting: specific, seasonal, sensory and quietly confident.

### Vibe

Warm editorial precision. Premium without ornament, authentic without rustic nostalgia, knowledgeable without clinical language.

### Emotional objective

Make a shopper feel that they have found a discerning grower with the eye of a food editor and the operational clarity of a dependable supplier.

### Visual keywords

Cultivated, seasonal, mineral, tactile, sensory, precise, generous, traceable, restrained, appetizing.

## 4. Brand principles and anti-principles

### Principles

1. **Specificity is luxury.** Name the variety, growing method, harvest state, taste and best use.
2. **Evidence stays close to the claim.** Provenance, certifications and operational detail appear where trust is needed.
3. **Produce leads.** Typography, rules and color frame food rather than competing with it.
4. **Seasonality creates movement.** Collections and content change with harvest reality, not decorative campaign churn.
5. **Households come first.** Restaurant expertise supports consumer confidence; it does not dominate the storefront.
6. **Constraints become service design.** Availability, lead time and substitutions are explained early and plainly.

### Anti-principles

- No generic leaf-logo, beige-wellness or all-green shorthand.
- No unsubstantiated medical, detox or nutritional-superiority claims.
- No glassmorphism, oversized pill controls or arbitrary corner radii.
- No stock imagery presented as WeGroween cultivation evidence.
- No technical data used as visual theatre.
- No hidden delivery, substitution, refund or availability constraints.

## 5. Tone of voice

### Traits

- **Precise:** concrete dates, quantities, varieties and handling guidance.
- **Sensory:** flavour, texture, aroma and cooking behavior.
- **Warm:** inviting, direct and useful.
- **Transparent:** candid about availability, delivery and variation.
- **Calm:** confident without exclamation-heavy promotion.

### Sentence behavior

- Use short headings and complete, plain sentences.
- Prefer active verbs: grown, harvested, packed, delivered, cooked.
- Lead product copy with taste and use, then cultivation detail.
- Explain limits without apology or jargon.
- Use title case only for proper names; interface labels use sentence case.

### Preferred vocabulary

Cultivated, harvested, seasonal, variety, flavour, source, ready, growing, kitchen, fresh, batch, dispatch, store, pair.

### Prohibited or controlled vocabulary

Avoid miracle, detox, supercharge, guilt-free, purest, world-class and revolutionary. Use organic, pesticide-free, chemical-free, certified, health or nutrition claims only when documented and label-aligned.

### Applied examples

- Hero: **Grown with quiet precision.**
- Product lead: “Silken texture, savoury depth and delicate edges.”
- Availability: “Harvesting Friday. Delivery begins Saturday.”
- Out of stock: “This bed is resting. Join the next harvest list.”
- Household CTA: “Shop this harvest.”
- Restaurant CTA: “Supply your kitchen.”
- Error: “We could not confirm that payment. Your basket is safe; try again or choose another method.”

## 6. Typography

### Approved pairing: Fraunces + DM Sans

- Display/headings: Fraunces variable; weights 300–800; use moderate optical size and softness. Do not vary axes per component.
- Body/UI: DM Sans variable; weights 400–800.
- Data/code: system monospace stack.
- License: SIL Open Font License 1.1 for both families.
- Sources: `https://github.com/undercasetype/Fraunces` and `https://github.com/googlefonts/dm-fonts`.
- Fallbacks: Fraunces → Georgia → serif; DM Sans → Segoe UI → Arial → sans-serif.
- Loading: self-host WOFF2 variable fonts; preload roman display and body files; `font-display: swap`; preserve OFL notices. Subset Latin/Latin-ext for v1.

### Alternative retained, not approved

Newsreader + Manrope remains a documented alternative. Do not mix it into production without a new leader decision and token update.

### Modular type scale

| Role | Family | Size | Line height | Weight | Letter spacing |
|---|---|---:|---:|---:|---:|
| display | Fraunces | clamp(3.4rem, 6.8vw, 5.75rem) | 0.94 | 600 | -0.05em |
| H1 | Fraunces | clamp(2.7rem, 5vw, 4.25rem) | 0.99 | 600 | -0.04em |
| H2 | Fraunces | clamp(2.2rem, 4vw, 3.375rem) | 1.04 | 600 | -0.032em |
| H3 | Fraunces | clamp(1.75rem, 3vw, 2.375rem) | 1.10 | 600 | -0.022em |
| H4 | DM Sans | 1.75rem | 1.20 | 600 | -0.025em |
| H5 | DM Sans | 1.375rem | 1.28 | 700 | -0.016em |
| H6 | DM Sans | 1.125rem | 1.35 | 700 | -0.005em |
| Lead | DM Sans | 1.25rem | 1.58 | 400 | -0.012em |
| Body | DM Sans | 1rem | 1.60 | 400 | -0.008em |
| Label | DM Sans | 0.8125rem | 1.30 | 700 | 0.07em |
| Caption | DM Sans | 0.75rem | 1.45 | 500 | 0.012em |
| Code/data | system mono | 0.8125rem | 1.50 | 500 | 0 |

Maximum paragraph measure is 66ch; hero/product narrative measure is 54ch. Body text never drops below 16px. Use Fraunces for editorial headings, not table headers, form labels, dense product names or admin navigation.

## 7. Grid and containers

### G3 Curated Market

- Content container: 1200px maximum.
- Wide container: 1360px maximum for admin tables and controlled media.
- Reading container: 660px maximum.
- Form container: 560px maximum.
- Grid: 12 columns.
- Standard gutter: 20px.
- Page margins: 20px compact, 32px medium, 48px wide.
- Product grids: 1 column compact; 2 columns when cards retain at least 260px; 3–4 columns when cards retain at least 250px.
- Editorial grids: reflow by available space; media and copy stack below approximately 800–900px.
- Admin: wide container, sticky local tools only when they do not obscure focus or headings.

Alignment favors strong left edges. Full-bleed media is exceptional, not default. UI should use container queries where a reusable component can appear in both storefront and admin contexts.

## 8. Spacing

### Primitive rhythm

0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 and 96px.

### Semantic aliases

| Token | Value | Typical use |
|---|---:|---|
| none | 0 | Reset |
| 2xs | 4px | Icon micro-gap |
| xs | 8px | Inline gap, compact metadata |
| sm | 12px | Label/control gap |
| md | 20px | Card padding, grid gap |
| lg | 32px | Panel padding, section sub-group |
| xl | 48px | Major component separation |
| 2xl | 72px | Compact/medium section spacing |
| 3xl | 96px | Wide section spacing |

Controls use 12–14px vertical and 14–20px horizontal padding. Standard cards use 20px; feature panels use 32px. Do not create untracked spacing values.

## 9. Imagery and iconography

### Photography

- Show macro texture, scale, hands, growing beds, harvest, packing and finished-food context.
- Keep white balance natural; preserve soil, substrate and imperfect organic forms.
- Avoid heavy green color grading, fake dew, hyper-saturated stock produce and anonymous laboratory imagery.
- Product listing image ratio: 4:3 preferred; square allowed for pack shots. Hero media: 4:5 or 5:4 depending composition.
- Record photographer/source, permission and crop guidance.

### Illustration

Use sparse original line annotations derived from WeGroween crops and cultivation. Do not use the locally collected watermarked stock pattern in production. Watercolor or block-print influence may appear only in original commissioned assets.

### Icons

**I1 Field Notes is approved as the canonical icon family.** Use a 24px coordinate grid, 1.75px optical stroke, square terminals, rounded joins, open counters and slight crop-informed asymmetry. Universal actions remain conventional; living subjects may carry controlled irregularity. Icons inherit `currentColor` and reinforce labels. Icon-only controls require accessible names, a 44×44px minimum target and tooltips when meaning is not universal. Wordmark and logo direction remain explicitly deferred and outside this extension.

The core library lives in `icons/`: individual SVGs for asset pipelines, `icons.svg` for symbol-sprite use, `manifest.json` for tooling and `README.md` for implementation and extension rules. I2 Cultivation Geometry and I3 Harvest Cut remain rejected alternatives in the decision record; do not mix their rounded or bevelled construction into Field Notes.

### Media placeholders

Prototypes label empty media regions with intended subject and aspect ratio. Do not imply stock or generated media is approved production photography.

## 10. Accessibility, localization and governance

- Target WCAG 2.2 AA.
- C2 required text pairs meet at least 4.5:1; focus color exceeds 3:1 against the main background.
- Touch targets prefer 44×44px minimum.
- Status never relies on color alone.
- Keyboard focus is visible and never hidden behind sticky UI.
- Motion is functional and collapses to zero-duration state updates under `prefers-reduced-motion`.
- English-first v1; components allow 35% text expansion and do not encode meaning in fixed text widths.
- Currency and dates use locale-aware formatters; store timestamps in UTC and display service-local time.
- `design-tokens.json` is canonical. New visual values require a token and documented decision.

## 11. Open operational decisions

- Service city/region, pincode rules and delivery-slot capacity.
- Final product catalogue, pack sizes, pricing, shelf-life and claim evidence.
- FSSAI/GST/business information and invoice configuration.
- Restaurant pricing, minimum order, credit terms and approval workflow.
- Production domain, hosting, email/SMS/WhatsApp providers, Supabase project and Razorpay merchant credentials.

## 12. Change history

- 2026-10-02 — v1.2.0-proposed: V1 and M1 approved; state-complete core component reference added and Phase 6 review passed with disclosed limitations.
- 2026-10-02 — Phase 7: H1 Harvest to Home approved; homepage prototype and Design Direction Manual PDFs rendered and inspected.
- 2026-10-02 — v1.1.0: I1 Field Notes iconography approved; canonical SVG library and icon tokens added; wordmark/logo remains deferred.
- 2026-10-02 — v1.0.0: Cultivated Editorial selected; Soil & Saffron, Fraunces/DM Sans and Curated Market approved; initial blueprint created.
