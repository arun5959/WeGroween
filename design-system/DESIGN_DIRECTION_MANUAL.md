# Design Direction Manual

WeGroween | 1.3.0-proposed | PROPOSED

## Start here

This is a design-language handoff and non-production review package, not an application. This project preserves the leader-authorized R3 photographs and three-page H1 presentation. Canonical values live in design-tokens.json; narrative and composition in design-language.json; approvals in language-state.json.

- Audience: Quality-conscious Indian households and home cooks first; restaurant/chef/hospitality supply secondary
- Objective: Make premium fresh-produce discovery, trust, household shopping and the secondary supply path understandable
- Primary Palette: palette-2
- Fallback Used: False
- Requested Variants: palette-2; palette-1; palette-3
- Leader: User

## Brand intent, direction and voice

- Theme: Every harvest is an edition worth collecting: specific, seasonal, sensory and quietly confident.
- Vibe: Warm editorial precision. Premium without ornament, authentic without rustic nostalgia, knowledgeable without clinical language.
- Emotion: A discerning grower with the eye of a food editor and the operational clarity of a dependable supplier.
- Keywords: cultivated; seasonal; mineral; tactile; sensory; precise; traceable; restrained; appetizing
- Principles: Specificity is luxury; Evidence stays close to the claim; Produce leads; Seasonality creates movement; Households come first; Constraints become service design
- Anti Principles: No generic leaf-logo/beige-wellness/all-green shorthand; No unsupported health claims; No glassmorphism or arbitrary radii; No stock imagery as cultivation evidence; No hidden service constraints
- Tone: V1 Cultivated Authority: precise, sensory, warm, transparent and calm. Concrete nouns/verbs; short headings and plain full sentences.
- Copy Examples: Grown with quiet precision.; Shop this harvest.; Supply your kitchen.; Harvesting Friday. Delivery begins Saturday.; This bed is resting. Join the next harvest list.; We could not confirm that payment. Your basket is safe; try again or choose another method.
- Iconography: I1 Field Notes: 24px grid, 1.75px optical stroke, square terminals, rounded joins, open counters and crop-specific asymmetry. Icons inherit currentColor; icon-only targets require names and 44px targets.
- Motion Purpose: M1 continuity and immediate state feedback: 140/220/360ms. Reduced motion removes translation and decorative reveals; no critical information depends on animation.

### Brief and constraints

- Offer: Microgreens, mushrooms, organic vegetables and fruits, and specialty farming products
- Constraints: Design system and review prototypes only; English-first, single brand, no dark mode v1; Existing approved C2/T2/G3/V1/M1/I1/H1 preserved; Wordmark/logo deferred
- Assumptions: India initial market from approved brief; Catalogue expansion, prices, pack sizes and delivery terms remain illustrative/unconfirmed
- Exclusions: Application/backend/database/auth/checkout/CMS implementation; Dependencies and deployment; New logo production; Unsubstantiated health/organic/certification claims; Public-use image rights clearance
- Success Criteria: Household-first task clarity; Discoverable restaurant pathway; Exact preservation of approved values; Synchronized sources and truthful review status
- Approval Source: approved-brief.md dated 2026-10-02

### Creative territories

| Approach | Thesis / audience fit | Trade-offs |
| --- | --- | --- |
| Cultivated Editorial | Treat every harvest as a precise, seasonal, sensory edition.; Household premium with restaurant credibility | Photography/copy discipline; excessive serif or space can slow shopping |
| Living Laboratory | Visible cultivation intelligence, state clarity and quality control.; Specialty and restaurant authority | Can become clinical or synthetic |
| Harvest House | Generous modern pantry built around human cultivation and shared meals.; Household warmth and broad-category adaptability | Rustic/mass-market drift; rounded illustration can reduce precision |

## Composition and purposeful empty space

- Attention: Household offer and shopping first, evidence near action, restaurant supply secondary; preserve honest alternate routes
- Negative Space: Macro: separate H1 narrative chapters with approved section rhythm. Meso: distinguish copy/media and peer groups. Micro: token gaps within labels, icons, controls and card anatomy. Space clarifies relationships, not a generic premium claim.
- Density: G3 Curated Market: 1200px content, 12 columns, 20px canonical gutter; preserve efficient catalogue and restrained editorial headings
- Responsive Priorities: Preserve essential price, pack, status, navigation and next action; reflow into readable stacked regions; do not clip meaningful text; 35% text expansion and 200% reflow checks pending
- Conflict Resolution: Safety/accessibility/truthfulness, task comprehension, approved brand/business intent, then decoration; material compromises need leader choice
- Exceptions: Preserve approved R3 imagery authorization despite empty-media default; H1 three-page continuous presentation retained; No logo production
- Status: DERIVED documentation of approved H1; migration additions accepted 2026-10-05

| Pattern | User need and purpose | Placement / responsive priority |
|---|---|---|
| h1-hero | Understand offer and find household shopping. Lead with grown food and useful purchase path | H1 sequence position 1; Primary promise and household CTA; preserve anatomy on reflow |
| h1-trust | Assess what the existing catalogue can support. Keep factual catalogue/support context near discovery | H1 sequence position 2; Supporting reassurance; preserve anatomy on reflow |
| h1-harvest | Compare varieties, packs, price and availability. Make produce comparison the main next task | H1 sequence position 3; Primary shopping collection; preserve anatomy on reflow |
| h1-categories | Find the relevant food family. Expose named category routes without vague labels | H1 sequence position 4; Equal-priority category peers; preserve anatomy on reflow |
| h1-cultivation | Understand growing and handling credibility. Place provenance close to product interest | H1 sequence position 5; Supporting evidence; preserve anatomy on reflow |
| h1-delivery | Understand whether and when an order can arrive. Explain service constraints before payment | H1 sequence position 6; Decision-relevant clarity; preserve anatomy on reflow |
| h1-home-box | Explore compatible household pairings. Offer practical combinations and repeat-use context | H1 sequence position 7; Secondary household path; preserve anatomy on reflow |
| h1-restaurant | Find kitchen supply without displacing households. Provide a separate professional enquiry path | H1 sequence position 8; Secondary B2B path; preserve anatomy on reflow |
| h1-journal | Use and store unfamiliar ingredients. Reduce uncertainty and avoid food waste | H1 sequence position 9; Supporting education; preserve anatomy on reflow |
| h1-closing | Return to shopping or choose a harvest note. Offer next steps after the narrative | H1 sequence position 10; Primary shopping plus optional follow-up; preserve anatomy on reflow |

## Three color approaches

| Approach | Intent and psychological rationale | Benefits / risks |
| --- | --- | --- |
| Orchard Ink | Botanical ink, blackberry and harvest gold: depth, restraint and produce-led seasonality. | Cultivated, calm and sensory / Can suggest wine/cosmetics without fresh food context |
| Soil & Saffron | Warm soil, terracotta and saffron: grounded, Indian and appetizing. | Warm, honest premium / Equal terracotta/saffron emphasis can become rustic/festive |
| Plum & Leaf | Boutique plum, cultivated olive and ripe red: rare and giftable. | Curated gifting/editorial impact / Can resemble beauty, wine or hospitality |

### Semantic color map

| Role | palette-1 | palette-2 | palette-3 |
| --- | --- | --- | --- |
| brand-primary | #223225 | #402B24 | #402238 |
| brand-secondary | #7D3F54 | #98513D | #50633B |
| accent | #C89538 | #D49A25 | #B54836 |
| background | #F5F0E6 | #FBF4E8 | #F6F1E9 |
| surface | #FFFCF5 | #FFFDF7 | #FFFDF9 |
| surface-elevated | #FFFFFF | #FFFFFF | #FFFFFF |
| text-primary | #1E251D | #2B211D | #251D23 |
| text-secondary | #53604F | #66544B | #62545D |
| text-inverse | #FFF9EE | #FFF8EC | #FFF9F2 |
| border | #CED2C8 | #DDD1C2 | #D8CED3 |
| border-strong | #7C8978 | #92796C | #8A737D |
| focus | #006C5B | #006C5B | #006B65 |
| success | #226348 | #2E654A | #35633C |
| warning | #995300 | #925100 | #8D5600 |
| error | #A52A3B | #A42C3B | #A3283D |
| information | #245B78 | #285C78 | #2E5D78 |
| disabled-background | #E5E3DB | #E9E2D7 | #E7E1DE |
| disabled-content | #6F746D | #74706A | #706B6E |

### Intended pair contrast measurements

Ratios below are computed for declared opaque sRGB colors and intended pairs. Normal text requires 4.5:1; large text only qualifies at the recorded size/weight; essential non-text indicators require 3:1. These checks do not establish whole-product accessibility compliance.

| Pair / purpose | Minimum | palette-1 | palette-2 | palette-3 |
| --- | --- | --- | --- | --- |
| text-primary / background (normal-text) | 4.5 | 13.823:1 | 14.355:1 | 14.607:1 |
| text-primary / surface (normal-text) | 4.5 | 15.322:1 | 15.43:1 | 16.165:1 |
| text-primary / surface-elevated (normal-text) | 4.5 | 15.7:1 | 15.695:1 | 16.423:1 |
| text-secondary / background (normal-text) | 4.5 | 5.862:1 | 6.545:1 | 6.341:1 |
| text-secondary / surface (normal-text) | 4.5 | 6.498:1 | 7.035:1 | 7.017:1 |
| text-secondary / surface-elevated (normal-text) | 4.5 | 6.659:1 | 7.156:1 | 7.129:1 |
| text-inverse / brand-primary (normal-text) | 4.5 | 12.919:1 | 12.517:1 | 13.355:1 |
| text-inverse / brand-secondary (normal-text) | 4.5 | 7.391:1 | 5.557:1 | 6.298:1 |
| surface-elevated / error (normal-text) | 4.5 | 7.014:1 | 6.996:1 | 7.172:1 |
| brand-primary / background (normal-text) | 4.5 | 11.921:1 | 12.088:1 | 12.419:1 |
| brand-primary / surface (normal-text) | 4.5 | 13.214:1 | 12.992:1 | 13.744:1 |
| brand-primary / surface-elevated (normal-text) | 4.5 | 13.54:1 | 13.216:1 | 13.964:1 |
| success / background (normal-text) | 4.5 | 6.275:1 | 6.243:1 | 6.223:1 |
| success / surface (normal-text) | 4.5 | 6.956:1 | 6.711:1 | 6.887:1 |
| success / surface-elevated (normal-text) | 4.5 | 7.128:1 | 6.826:1 | 6.997:1 |
| warning / background (normal-text) | 4.5 | 5.148:1 | 5.651:1 | 5.392:1 |
| warning / surface (normal-text) | 4.5 | 5.706:1 | 6.074:1 | 5.968:1 |
| warning / surface-elevated (normal-text) | 4.5 | 5.847:1 | 6.178:1 | 6.063:1 |
| error / background (normal-text) | 4.5 | 6.175:1 | 6.398:1 | 6.378:1 |
| error / surface (normal-text) | 4.5 | 6.845:1 | 6.877:1 | 7.059:1 |
| error / surface-elevated (normal-text) | 4.5 | 7.014:1 | 6.996:1 | 7.172:1 |
| information / background (normal-text) | 4.5 | 6.504:1 | 6.641:1 | 6.325:1 |
| information / surface (normal-text) | 4.5 | 7.21:1 | 7.138:1 | 6.999:1 |
| information / surface-elevated (normal-text) | 4.5 | 7.387:1 | 7.261:1 | 7.111:1 |
| focus / background (non-text) | 3 | 5.609:1 | 5.827:1 | 5.675:1 |
| focus / surface (non-text) | 3 | 6.218:1 | 6.264:1 | 6.281:1 |
| focus / surface-elevated (non-text) | 3 | 6.371:1 | 6.371:1 | 6.381:1 |
| border-strong / background (non-text) | 3 | 3.24:1 | 3.713:1 | 3.868:1 |
| border-strong / surface (non-text) | 3 | 3.591:1 | 3.99:1 | 4.28:1 |
| border-strong / surface-elevated (non-text) | 3 | 3.68:1 | 4.059:1 | 4.349:1 |
| brand-secondary / background (non-text) | 3 | 6.82:1 | 5.366:1 | 5.857:1 |
| brand-secondary / surface (non-text) | 3 | 7.56:1 | 5.768:1 | 6.482:1 |
| brand-secondary / surface-elevated (non-text) | 3 | 7.746:1 | 5.867:1 | 6.585:1 |
| text-primary / accent (normal-text) | 4.5 | 5.84:1 | 6.314:1 | not checked:1 |
| text-inverse / accent (normal-text) | 4.5 | not checked:1 | not checked:1 | 5.091:1 |

## Typography options and scale

| Approach | Display / body families | License / loading / fallbacks |
| --- | --- | --- |
| Newsreader + Manrope | display: Newsreader; Georgia; Times New Roman; serif; body: Manrope; Segoe UI; Arial; sans-serif; mono: ui-monospace; SFMono-Regular; Consolas; monospace | license: SIL OFL 1.1; bundled notices; loading: Self-host variable WOFF2; preload roman; font-display swap; preserve OFL; fallbacks: Newsreader -> Georgia/Times New Roman/serif; Manrope -> Segoe UI/Arial/sans-serif |
| Fraunces + DM Sans | display: Fraunces; Georgia; serif; body: DM Sans; Segoe UI; Arial; sans-serif; mono: ui-monospace; SFMono-Regular; Consolas; monospace | license: SIL OFL 1.1; bundled notices; loading: Self-host variable WOFF2; preload roman; font-display swap; fixed decorative axes; fallbacks: Fraunces -> Georgia/serif; DM Sans -> Segoe UI/Arial/sans-serif |

### type-1 — alternative

| Role | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| display | clamp(3.5rem, 7vw, 6rem) | 0.92 | 500 | -0.055em |
| h1 | clamp(2.75rem, 5vw, 4.5rem) | 0.98 | 500 | -0.045em |
| h2 | clamp(2.25rem, 4vw, 3.5rem) | 1.02 | 500 | -0.035em |
| h3 | clamp(1.75rem, 3vw, 2.5rem) | 1.08 | 550 | -0.025em |
| h4 | 1.75rem | 1.2 | 650 | -0.02em |
| h5 | 1.375rem | 1.28 | 700 | -0.012em |
| h6 | 1.125rem | 1.35 | 750 | 0 |
| lead | 1.25rem | 1.6 | 450 | -0.01em |
| body | 1rem | 1.62 | 450 | -0.006em |
| label | 0.8125rem | 1.3 | 750 | 0.075em |
| caption | 0.75rem | 1.45 | 550 | 0.015em |
| code | 0.8125rem | 1.5 | 500 | 0 |

### type-2 — selected

| Role | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| display | 92px | 0.94 | 600 | -0.05em |
| h1 | 68px | 0.99 | 600 | -0.04em |
| h2 | 54px | 1.04 | 600 | -0.032em |
| h3 | 38px | 1.1 | 600 | -0.022em |
| h4 | 28px | 1.2 | 600 | -0.025em |
| h5 | 22px | 1.28 | 700 | -0.016em |
| h6 | 18px | 1.35 | 700 | -0.005em |
| lead | 20px | 1.58 | 400 | -0.012em |
| body | 16px | 1.6 | 400 | -0.008em |
| label | 13px | 1.3 | 700 | 0.07em |
| caption | 12px | 1.45 | 500 | 0.012em |
| code | 13px | 1.5 | 500 | 0em |

## Grid, spacing and visual vocabulary

- Grid: container: content: 1200px; wide: 1360px; reading: 660px; form: 560px; grid: columns: 12; gutter: 20px; page-margin-compact: 20px; page-margin-medium: 32px; page-margin-wide: 48px; page-margin: 20px; breakpoint: compact: 640px; medium: 900px; wide: 1200px
- Spacing: primitive: 0: 0px; 1: 2px; 2: 4px; 3: 8px; 4: 12px; 5: 16px; 6: 20px; 7: 24px; 8: 32px; 9: 40px; 10: 48px; 11: 64px; 12: 80px; 13: 96px; semantic: none: 0px; 2xs: 4px; xs: 8px; sm: 12px; md: 20px; lg: 32px; xl: 48px; 2xl: 72px; 3xl: 96px
- Radius: none: 0px; control: 8px; card: 10px; panel: 14px; pill: 999px; round: 50%
- Elevation: flat: color: #402B2400; offsetX: 0px; offsetY: 0px; blur: 0px; spread: 0px; raised: color: #402B2414; offsetX: 0px; offsetY: 2px; blur: 10px; spread: 0px; floating: color: #402B2424; offsetX: 0px; offsetY: 10px; blur: 28px; spread: -8px; overlay: color: #402B2430; offsetX: 0px; offsetY: 16px; blur: 44px; spread: -12px; modal: color: #2B211D42; offsetX: 0px; offsetY: 24px; blur: 72px; spread: -16px
- Motion: duration: micro: 140ms; standard: 220ms; emphasized: 360ms; easing: standard: 0.2; 0; 0; 1; enter: 0; 0; 0.2; 1; exit: 0.4; 0; 1; 1; micro: 140ms; standard: 220ms; emphasized: 360ms; easing-standard: cubic-bezier(0.2, 0, 0, 1); easing-enter: cubic-bezier(0, 0, 0.2, 1); easing-exit: cubic-bezier(0.4, 0, 1, 1)

## Component rules and states

### Navigation

- Purpose: Orient customers and expose primary shopping with discoverable supply
- Anatomy: skip link, brand, primary links, restaurant route, search/account/basket
- Variants: storefront, scrolled, admin reference
- States: default; active; hover; focus; mobile-collapsed; mobile-expanded; scrolled; overflow
- Responsive: Collapse to labelled menu; preserve basket and sensible focus order
- Content: Short concrete category nouns; no ambiguous sole Explore label
- Accessibility: nav landmark, aria-current, skip link, Escape/focus return; trap focus only in modal surface
- Token Mapping: component.navigation
- Legacy Source: DESIGN_SYSTEM.md component contracts
- Review Status: Specification and state reference; consult quality-review.json for actual checks and remaining limits

### Button

- Purpose: Initiate clear immediate actions
- Anatomy: label, optional I1 icon, loading indicator
- Variants: primary, secondary, tertiary, destructive, icon; 44/48/56px
- States: default; hover; active; focus; loading; disabled; secondary; tertiary; destructive
- Responsive: Keep target and label readable when wrapped
- Content: Loading preserves width and explains action; disabled never looks actionable
- Accessibility: Native buttons/links; named icon controls; native Enter/Space; expose busy state
- Token Mapping: component.button
- Legacy Source: DESIGN_SYSTEM.md component contracts
- Review Status: Specification and state reference; consult quality-review.json for actual checks and remaining limits

### Input

- Purpose: Collect data with persistent guidance
- Anatomy: label, required/optional cue, control, helper/error/status
- Variants: text, email, phone, search, quantity, select, textarea, checkbox/radio/switch
- States: empty; filled; focus; error; success; disabled; read-only; validating; hover
- Responsive: Full available width with labels/helper visible
- Content: Placeholder is example only; errors explain recovery
- Accessibility: Persistent labels, described-by links, error summary, sensible validation timing
- Token Mapping: component.input
- Legacy Source: DESIGN_SYSTEM.md component contracts
- Review Status: Specification and state reference; consult quality-review.json for actual checks and remaining limits

### Card

- Purpose: Compare food with variety, pack, price, timing and next action
- Anatomy: shared media/title/copy/metadata/divider/price/action rows
- Variants: product, category, editorial, selected/featured with semantic reason
- States: default; focus; selected; hover; unavailable; loading; error
- Responsive: Shared row geometry; stack predictably; no meaningful clipping at zoom
- Content: Shortest/longest/missing optional content and 35% expansion; preserve price/unit/action
- Accessibility: No nested conflicting links; selection and unavailability have text; focus visible
- Token Mapping: component.card
- Legacy Source: DESIGN_SYSTEM.md component contracts
- Review Status: Specification and state reference; consult quality-review.json for actual checks and remaining limits

### Badge

- Purpose: Communicate compact named category or availability state
- Anatomy: text, optional I1 glyph, optional named remove button
- Variants: neutral, brand, success, warning, error, information
- States: default; success; warning; error; information
- Responsive: Remain readable at 200% zoom; wrap where needed
- Content: Ready now, Harvest Friday, Limited, Resting; no color-only state
- Accessibility: Text carries meaning; removable chip action is separately named
- Token Mapping: component.badge
- Legacy Source: DESIGN_SYSTEM.md component contracts
- Review Status: Specification and state reference; consult quality-review.json for actual checks and remaining limits

Component state values are defined in design-tokens.json and visually sampled in artifact/component-specimen.html. Do not treat static loading/expanded samples as implemented application behavior.

## Imagery direction

| Factor | Rule |
| --- | --- |
| Thesis | Cultivation and ingredient detail support quiet premium confidence; product color remains truthful |
| Warmth | Natural neutral to gently warm; preserve believable daylight and food whites |
| Tint | Avoid green casts and artificial palette tints |
| Saturation | Restrained to moderate; no exaggerated green or fake freshness |
| Exposure | Keep highlight texture and shadow detail; avoid luminous fake dew or crushed substrate |
| Contrast | Readable food texture without harsh global contrast; overlays need their own contrast check |
| Lighting | Soft directional daylight-like light; no clinical glare or stage-lit spectacle |
| Texture | Preserve actual skin, leaf, mushroom, substrate and packing texture; restrained retouching |
| Depth | Subject-led separation; keep cultivation context legible where it acts as evidence |
| Composition | Macro food detail, scale, hands, growing beds, harvest and finished-food context; quiet backgrounds around conversion copy |
| Crop | Product 4:3; square packshot allowed; hero/editorial 4:5 or 5:4. Preserve current R3 media geometry |
| Negative Space | Reserve focal-safe regions for overlays; do not move copy over busy texture |
| Background | Natural low-distraction mineral/paper/kitchen/growing contexts; separate packshot consistency from documentary evidence |
| Palette Compatibility | C2 frames cool greens naturally; C1 blackberry remains restrained; C3 must not make food look like beauty/wine. Never grade merchandise to fit a palette. |
| Archetype Rules | Catalogue: consistent angle/scale/padding for comparable food, no price or unit hidden; Food: appetite through credible texture and clean handling; B2B: show process evidence and labelled quantities; no invented chef testimonials |
| People | Hands and cultivators may explain process; obtain consent/model/property rights; avoid staged stereotypes or implied endorsements |
| Generated Imagery | No new generated images are requested. Generated scenes may not be cultivation/provenance evidence; any future production needs separate authorization and human artifact review. |
| Accessibility | Meaningful alt text identifies variety/context; decorative media uses empty alt; overlays require readable contrast; responsive crops preserve focal subject |
| Performance | Use existing WebP where appropriate; define responsive crops and dimensions; optimize without food-color or texture loss; measure later |
| Rights | R3 project-image prototype use authorized on 2026-10-03; ownership/public/production rights unverified. Exclude visible-watermark candidates. Fonts have bundled OFL. |
| Examples | Do: natural mushroom texture against quiet soil/mineral context; Do: label cultivation evidence only when verified; Do not: tint greens to match the palette; Do not: use stock/generated farms as WeGroween evidence |
| Status | APPROVED project treatment expansion on 2026-10-05; rights limitations retained |
| Provenance | BRAND_IDENTITY_BLUEPRINT.md section 9 and assets/README.md; new qualitative bands are authored proposals, not measured edit settings |

The separate Imagery Direction Guide is the production reference for photography, image selection, grading and authorized generated imagery. This project retains its existing authorized R3 image exception; no new media is sourced.

## Homepage and palette variants

- Selected Structure: h1
- Section Order: hero; trust; harvest; categories; cultivation; delivery; home-box; restaurant; journal; closing
- Coverage: coverage mode: all-three; selected palette: palette-2; primary palette: palette-2; fallback palette: palette-1; fallback used: False; requested palettes: palette-2; palette-1; palette-3; structure lock: True
- Variant Lock: Only mapped palette values change; all layout, copy, typography, spacing and media geometry stay fixed.

## Evidence, decisions and limitations

Reuse 2026-10-02 research: premium should come from variety, provenance, harvest, handling, delivery and remedy specificity; households remain primary and restaurant supply secondary.

| Reference | Source and original review date | Limitation |
|---|---|---|
| ev-current-site | Current WeGroween static catalogue / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-sanesa-provenance | Sanesa Yourganic / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-bhoomi-membership | Bhoomi Farms / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-gourmet-mushroom-dual-audience | Gourmet Mushroom Company / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-microgreen-store-harvest | Microgreen Store Gurgaon / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-riverford-repeat | Riverford Organic Farmers / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-oishii-premium | Oishii Farms / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-natoora-transparency | Natoora / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-eztrolley-b2b | EZTrolley / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-baymard-grocery | Baymard 2026 Grocery Ecommerce UX Research / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-wcag22 | Web Content Accessibility Guidelines 2.2 / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-fssai-ecommerce | FSSAI Advisory for E-commerce Food Business Operators / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-local-visuals | WeGroween local visual resources / 2026-10-02 | Historical reference; no asset reuse or new live claim inferred |
| ev-approved-h1 | Leader-approved H1 continuous R3 homepage / 2026-10-03 | Historical reference; no asset reuse or new live claim inferred |
| ev-legacy-decisions | WeGroween leader decision log / 2026-10-05 | Historical reference; no asset reuse or new live claim inferred |

Unconfirmed service rules, catalogue claims and image rights remain outside this design release. Source observations and direct URLs stay in research-summary.md and the canonical narrative.

| Decision | Choice / status | Approval reference |
| --- | --- | --- |
| brief | approved-brief / approved | A1 |
| territory | cultivated-editorial / approved | A1 |
| voice | v1 / approved | A1 |
| color | palette-2 / approved | A1 |
| typography | type-2 / approved | A1 |
| density | g3 / approved | A1 |
| structure | h1 / approved | A1 |
| coverage | all-three / approved | A2 |
| reuse | b2 / approved | A3 |
| research | carried-synthesis / approved | A1 |
| imagery | r3-documentary / approved | A1 |

### Approval evidence

- A1: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original choice evidence retained in provenance/legacy-decisions.md
- A2: User / User 2026-10-05: All three palettes. User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings.
- A3: User / Legacy decisions.md 2026-10-03: B2 reviewed-redacted structural reuse; no client identity/copy/images/contacts/catalogue promotion

## Application and governance

Use semantic aliases, not invented color literals. Preserve shared card anatomy and aligned actions; verify variable-length and missing optional content, keyboard focus, narrow screens and zoom. Approve material changes before editing source inputs, then rebuild affected views. Read quality-review.json for observed QA, not inferred quality. Archive verified byte hashes; reuse requires separate permission. No source application edits, scaffolding, backend, checkout, dependencies or deployment are part of this skill.

- Change History: 2026-10-05: Versioned schema-2 candidate; legacy package retained active; original approvals carried with scope evidence; 2026-10-05: Mapping and proposed additions accepted; all-three coverage retained; project-specific R3 renderer authorized by that acceptance
- Exceptions: R3 imagery prototype-use authorization overrides the skill empty-media default for the approved R3 presentation; Logo deferred; No release approval inferred; Legacy alternate preview/order mappings accepted as proposed comparative hypotheses, not new canonical selections
- Source Authority: Tokens: values; design-language.json: narrative/composition; language-state.json: progress/approvals
- Confidentiality: Project-private; B2 permits only reviewed-redacted structural reuse
- Migration: source version: 1.2.0-proposed; status: mapping-approved; actual artifact QA recorded separately; legacy section order: hero; trust; harvest; categories; cultivation; delivery; home-box; restaurant; journal; closing; preservation report: migration-equivalence.json; full source hashes in the private rollback manifest


## Project presentation adapter

The bundled schematic renderer cannot retain R3 photographs/forms and the approved three-page format. The project adapter preserves H1 copy, image geometry and presentation, changing mapped palette values only. All three coverage variants are rendered. The full legacy package remains in a hash-verified rollback. Project validation retains standard specification, approval, coverage, hash, QA and scope checks, and checks adapter freshness rather than comparing to the incompatible schematic renderer.
