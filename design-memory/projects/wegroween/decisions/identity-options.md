# WeGroween Identity-System Options

Date: 2026-10-02  
Status: proposed  
Selected territory: Cultivated Editorial  
Knowledge class: GENERATED

Nothing in this document is canonical until the Design Decision Leader approves it. Required contrast values are measured against WCAG 2.2 thresholds.

## Tone of voice

### V1 — Cultivated Authority (Recommended)

Precise, sensory, warm and transparent. Uses specific nouns and verbs, short confident headings, and plain operational language.

- **Sounds like:** “Harvested this morning. Best within five days.”
- **CTA style:** Shop this harvest; See cultivation notes; Order for your kitchen.
- **Preferred vocabulary:** cultivated, harvested, seasonal, variety, flavour, source, ready, growing, kitchen, fresh.
- **Avoid:** miracle, detox, supercharge, guilt-free, purest, world-class, revolutionary, chemical-free unless legally substantiated.
- **Benefit:** Balances household warmth, premium restraint, and restaurant credibility.
- **Risk:** Requires real operational detail; vague copy will expose the gap quickly.

### V2 — Warm Abundance

More conversational, generous and meal-led. Uses inclusive language, cooking moments and family routine.

- **Sounds like:** “A fresh box for the meals you already love.”
- **CTA style:** Fill your basket; Cook with what is fresh; Bring home the harvest.
- **Benefit:** Most approachable for new household shoppers.
- **Risk:** Can reduce specialist authority or drift toward mainstream grocery language.

### V3 — Exacting Grower

More technical and process-led. Uses cultivation, batch, harvest and handling facts prominently.

- **Sounds like:** “Blue oyster batch 104. Harvest window: 4–5 October.”
- **CTA style:** View ready stock; Check harvest schedule; Open cultivation record.
- **Benefit:** Strongest restaurant and specialty-product credibility.
- **Risk:** Can feel clinical and less emotionally appetizing.

## Color strategy C1 — Orchard Ink (Recommended)

**Thesis:** A stable botanical-ink foundation with blackberry and harvest-gold accents. Premium comes from depth, restraint and produce-led seasonality rather than pale green minimalism.

### Core brand colors
- Primary: `#223225` Botanical Ink
- Secondary: `#7D3F54` Blackberry
- Accent: `#C89538` Harvest Gold

### Semantic roles

| Role | Value | Intended use |
|---|---:|---|
| brand-primary | `#223225` | Primary actions, dark brand fields, key headings |
| brand-secondary | `#7D3F54` | Editorial emphasis, seasonal feature accents |
| accent | `#C89538` | Highlights, price/harvest emphasis with dark text |
| background | `#F5F0E6` | Main warm mineral canvas |
| surface | `#FFFCF5` | Cards, forms, table bodies |
| surface-elevated | `#FFFFFF` | Overlays and raised navigation |
| text-primary | `#1E251D` | Primary copy |
| text-secondary | `#53604F` | Supporting copy |
| text-inverse | `#FFF9EE` | Text on primary and secondary fields |
| border | `#CED2C8` | Dividers and passive control borders |
| border-strong | `#7C8978` | Active grouping and strong boundaries |
| focus | `#006C5B` | Focus rings and keyboard affordances |
| success | `#226348` | Success text/icons on light surfaces |
| warning | `#995300` | Warning text/icons on light surfaces |
| error | `#A52A3B` | Error text/icons on light surfaces |
| information | `#245B78` | Informational text/icons on light surfaces |
| disabled-background | `#E5E3DB` | Disabled controls |
| disabled-content | `#6F746D` | Disabled content only; never used for active text |

### Required contrast evidence

| Pair | Ratio | Result |
|---|---:|---|
| text-primary / background | 13.82:1 | AAA |
| text-primary / surface | 15.32:1 | AAA |
| text-secondary / background | 5.86:1 | AA |
| text-inverse / brand-primary | 12.92:1 | AAA |
| text-inverse / brand-secondary | 7.39:1 | AAA |
| text-primary / accent | 5.84:1 | AA |
| focus / background | 5.61:1 | AA for text; exceeds 3:1 UI requirement |
| success / surface | 6.96:1 | AA |
| warning / surface | 5.71:1 | AA |
| error / surface | 6.84:1 | AA |
| information / surface | 7.21:1 | AAA |
| disabled-content / disabled-background | 3.72:1 | Deliberately subdued; not used for required active content |

### Usage and risk
- Keep Blackberry below roughly 15% of a typical page; it is an editorial signature, not the default button color.
- Use Harvest Gold behind dark text or for non-text accents; never use it for small white text.
- Category accents may rotate only within an approved seasonal extension scale.
- **Emotional effect:** discerning, cultivated, calm, sensory.
- **Brand risk:** without fresh imagery, the blackberry accent can feel like wine or cosmetics.

## Color strategy C2 — Soil & Saffron

**Thesis:** Warm soil, terracotta and saffron make premium feel grounded, Indian and appetizing without relying on leaf green.

### Core brand colors
- Primary: `#402B24` Deep Soil
- Secondary: `#98513D` Terracotta
- Accent: `#D49A25` Saffron

### Semantic roles

| Role | Value | Intended use |
|---|---:|---|
| brand-primary | `#402B24` | Primary actions and dark anchors |
| brand-secondary | `#98513D` | Editorial emphasis and category accents |
| accent | `#D49A25` | Highlights with dark text |
| background | `#FBF4E8` | Main warm canvas |
| surface | `#FFFDF7` | Cards and controls |
| surface-elevated | `#FFFFFF` | Overlays |
| text-primary | `#2B211D` | Primary copy |
| text-secondary | `#66544B` | Supporting copy |
| text-inverse | `#FFF8EC` | Text on primary/secondary |
| border | `#DDD1C2` | Passive dividers |
| border-strong | `#92796C` | Strong boundaries |
| focus | `#006C5B` | Focus rings |
| success | `#2E654A` | Success text/icons |
| warning | `#925100` | Warning text/icons |
| error | `#A42C3B` | Error text/icons |
| information | `#285C78` | Informational text/icons |
| disabled-background | `#E9E2D7` | Disabled controls |
| disabled-content | `#74706A` | Disabled content |

### Required contrast evidence

| Pair | Ratio | Result |
|---|---:|---|
| text-primary / background | 14.36:1 | AAA |
| text-primary / surface | 15.43:1 | AAA |
| text-secondary / background | 6.54:1 | AA |
| text-inverse / brand-primary | 12.52:1 | AAA |
| text-inverse / brand-secondary | 5.56:1 | AA |
| text-primary / accent | 6.31:1 | AA |
| focus / background | 5.83:1 | AA for text; exceeds 3:1 UI requirement |
| success / surface | 6.71:1 | AA |
| warning / surface | 6.07:1 | AA |
| error / surface | 6.88:1 | AA |
| information / surface | 7.14:1 | AAA |
| disabled-content / disabled-background | 3.82:1 | Disabled content only |

### Usage and risk
- Best for kitchen, recipe, gifting and produce imagery with cool green content.
- Avoid pairing terracotta and saffron at equal visual weight; the result becomes rustic or festive.
- **Emotional effect:** warm, honest, abundant, grounded.
- **Brand risk:** less distinctive for mushrooms and may feel artisanal rather than precision-grown.

## Color strategy C3 — Plum & Leaf

**Thesis:** A boutique plum anchor with cultivated olive and a ripe red accent. The most fashion-forward and giftable expression.

### Core brand colors
- Primary: `#402238` Deep Plum
- Secondary: `#50633B` Cultivated Leaf
- Accent: `#B54836` Ripe Red

### Semantic roles

| Role | Value | Intended use |
|---|---:|---|
| brand-primary | `#402238` | Primary actions and premium fields |
| brand-secondary | `#50633B` | Secondary actions and cultivation cues |
| accent | `#B54836` | High-emphasis accents with inverse text |
| background | `#F6F1E9` | Main canvas |
| surface | `#FFFDF9` | Cards and controls |
| surface-elevated | `#FFFFFF` | Overlays |
| text-primary | `#251D23` | Primary copy |
| text-secondary | `#62545D` | Supporting copy |
| text-inverse | `#FFF9F2` | Text on brand colors and accent |
| border | `#D8CED3` | Passive dividers |
| border-strong | `#8A737D` | Strong boundaries |
| focus | `#006B65` | Focus rings |
| success | `#35633C` | Success text/icons |
| warning | `#8D5600` | Warning text/icons |
| error | `#A3283D` | Error text/icons |
| information | `#2E5D78` | Informational text/icons |
| disabled-background | `#E7E1DE` | Disabled controls |
| disabled-content | `#706B6E` | Disabled content |

### Required contrast evidence

| Pair | Ratio | Result |
|---|---:|---|
| text-primary / background | 14.61:1 | AAA |
| text-primary / surface | 16.17:1 | AAA |
| text-secondary / background | 6.34:1 | AA |
| text-inverse / brand-primary | 13.35:1 | AAA |
| text-inverse / brand-secondary | 6.30:1 | AA |
| text-inverse / accent | 5.09:1 | AA |
| focus / background | 5.68:1 | AA for text; exceeds 3:1 UI requirement |
| success / surface | 6.89:1 | AA |
| warning / surface | 5.97:1 | AA |
| error / surface | 7.06:1 | AAA |
| information / surface | 7.00:1 | AAA |
| disabled-content / disabled-background | 4.04:1 | Disabled content only |

### Usage and risk
- Use Ripe Red only with inverse text or as a non-text accent; dark text on this accent does not meet normal-text AA.
- Works well for premium gifting and editorial campaigns.
- **Emotional effect:** curated, rare, confident, sensorial.
- **Brand risk:** highest chance of feeling like beauty, wine or hospitality rather than farming.

## Typography T1 — Newsreader + Manrope (Recommended)

### Character
Newsreader brings cultured editorial authority while remaining designed for screens. Manrope keeps shopping, forms and the admin dashboard neutral, open and contemporary.

### Families and licensing
- Display/headings: Newsreader variable, normal and italic; SIL Open Font License 1.1.
- Body/UI: Manrope variable, weights 400–800; SIL Open Font License 1.1.
- Code/data: `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace.
- Serif fallbacks: Georgia, `Times New Roman`, serif.
- Sans fallbacks: `Segoe UI`, Arial, sans-serif.
- Sources: https://github.com/productiontype/NewsReader and https://github.com/google/fonts/tree/main/ofl/manrope

### Loading strategy
Self-host Latin and Latin-ext WOFF2 variable files, preload Newsreader roman and Manrope roman, load Newsreader italic without preload, use `font-display: swap`, preserve OFL files beside bundled fonts, and use metric-compatible fallbacks to reduce layout shift.

### Type roles

| Role | Family | Size | Line height | Weight | Tracking |
|---|---|---:|---:|---:|---:|
| display | Newsreader | clamp(3.5rem, 7vw, 6rem) | 0.92 | 500 | -0.055em |
| h1 | Newsreader | clamp(2.75rem, 5vw, 4.5rem) | 0.98 | 500 | -0.045em |
| h2 | Newsreader | clamp(2.25rem, 4vw, 3.5rem) | 1.02 | 500 | -0.035em |
| h3 | Newsreader | clamp(1.75rem, 3vw, 2.5rem) | 1.08 | 550 | -0.025em |
| h4 | Manrope | 1.75rem | 1.20 | 650 | -0.02em |
| h5 | Manrope | 1.375rem | 1.28 | 700 | -0.012em |
| h6 | Manrope | 1.125rem | 1.35 | 750 | 0 |
| lead | Manrope | 1.25rem | 1.60 | 450 | -0.01em |
| body | Manrope | 1rem | 1.62 | 450 | -0.006em |
| label | Manrope | 0.8125rem | 1.30 | 750 | 0.075em |
| caption | Manrope | 0.75rem | 1.45 | 550 | 0.015em |
| code/data | ui-monospace | 0.8125rem | 1.50 | 500 | 0 |

- Paragraph maximum: 68ch for reading content; 56ch for hero and product narratives.
- Mobile: display and H1 clamp down automatically; body never drops below 16px.
- Use italics for one phrase or sensory emphasis, never whole paragraphs.

### Risks
Newsreader can feel literary if used for too many operational headings. Use Manrope for product names in dense grids, controls, tables and admin surfaces.

## Typography T2 — Fraunces + DM Sans

### Character
Fraunces is more expressive, tactile and contemporary, with organic curves and variable optical behavior. DM Sans is friendly and compact, producing a more fashion-forward premium system.

### Families and licensing
- Display/headings: Fraunces variable with optical-size, weight, softness and wonk axes; SIL Open Font License 1.1.
- Body/UI: DM Sans variable, weights 300–900; SIL Open Font License 1.1.
- Code/data: `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace.
- Serif fallbacks: Georgia, `Times New Roman`, serif.
- Sans fallbacks: `Segoe UI`, Arial, sans-serif.
- Sources: https://github.com/undercasetype/Fraunces and https://github.com/googlefonts/dm-fonts

### Loading strategy
Self-host variable WOFF2 files and OFL notices, preload the primary roman files, use `font-display: swap`, subset to Latin/Latin-ext for v1, and keep decorative axes fixed by token rather than allowing arbitrary component-level settings.

### Type roles

| Role | Family | Size | Line height | Weight | Tracking |
|---|---|---:|---:|---:|---:|
| display | Fraunces | clamp(3.4rem, 6.8vw, 5.75rem) | 0.94 | 600 | -0.05em |
| h1 | Fraunces | clamp(2.7rem, 5vw, 4.25rem) | 0.99 | 600 | -0.04em |
| h2 | Fraunces | clamp(2.2rem, 4vw, 3.375rem) | 1.04 | 600 | -0.032em |
| h3 | Fraunces | clamp(1.75rem, 3vw, 2.375rem) | 1.10 | 600 | -0.022em |
| h4 | DM Sans | 1.75rem | 1.20 | 650 | -0.025em |
| h5 | DM Sans | 1.375rem | 1.28 | 700 | -0.016em |
| h6 | DM Sans | 1.125rem | 1.35 | 700 | -0.005em |
| lead | DM Sans | 1.25rem | 1.58 | 450 | -0.012em |
| body | DM Sans | 1rem | 1.60 | 450 | -0.008em |
| label | DM Sans | 0.8125rem | 1.30 | 700 | 0.07em |
| caption | DM Sans | 0.75rem | 1.45 | 550 | 0.012em |
| code/data | ui-monospace | 0.8125rem | 1.50 | 500 | 0 |

- Paragraph maximum: 66ch; 54ch for hero narratives.
- Use a moderate Fraunces softness setting and disable exaggerated wonk in transactional UI.
- Mobile display remains at least 48px where space permits.

### Risks
Fraunces is more recognizable and expressive. Overuse of its axes or heavy weight can become trendy and reduce long-term authority.

## Grid and density

### G1 — Dual Rhythm (Recommended)
- Brand/editorial container: 1280px maximum, 12 columns, 24px gap.
- Commerce container: 1240px maximum, responsive 2–4 product columns.
- Reading width: 680px maximum.
- Gutters: 20px compact, 32px medium, 48–64px wide.
- Section spacing: 72px compact, 96px medium, 128px wide.
- Catalogue uses efficient 24px card gaps; editorial modules use 48–72px internal breathing room.
- Admin uses a denser 8px-derived rhythm while sharing typography, color and control tokens.
- **Benefit:** Premium storytelling and fast shopping coexist.
- **Risk:** Requires explicit density contexts in components.

### G2 — Gallery Spacious
- 1440px maximum, 12 columns, 32px gap, larger media, 144–176px wide-screen sections.
- **Benefit:** Highest luxury and photography impact.
- **Risk:** Slower catalogue scanning and higher content/photography burden.

### G3 — Curated Market
- 1200px maximum, 12 columns, 16–20px gap, compact section spacing and more products above the fold.
- **Benefit:** Fast, practical commerce.
- **Risk:** Weakens the editorial premium feeling and can resemble grocery marketplaces.

## Motion and component character

### M1 — Restrained Editorial (Recommended)
- Micro 140ms, standard 220ms, emphasized 360ms.
- Ease-out for entry, ease-in for exit, smooth standard easing for position changes.
- 10px controls, 14px cards, 18px editorial panels, pills only for filters/statuses.
- Hierarchy comes from surface shifts, rules and spacing; shadows reserved for overlays.
- Reduced motion removes translation and parallax while retaining immediate state changes.

### M2 — Expressive Narrative
- Micro 160ms, standard 280ms, emphasized 520ms with more image reveals and section transitions.
- 14px controls, 20px cards and editorial cutouts.
- **Risk:** higher motion and front-end performance burden.

### M3 — Near Static
- Only 100–160ms control feedback and no narrative movement.
- **Benefit:** simplest and most conservative.
- **Risk:** the editorial direction may feel inert and less crafted.

## Recommendation bundle

**V1 Cultivated Authority + C1 Orchard Ink + T1 Newsreader/Manrope + G1 Dual Rhythm + M1 Restrained Editorial.**

This bundle best converts the selected territory into a scalable commerce and admin system. It is premium without being ornamental, distinctive without overusing green, and operationally legible for both household and restaurant users.
