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
- Status: DERIVED documentation of approved H1; new presentation mapping awaits confirmation

### Pattern: h1-hero

- Id: h1-hero
- User Need: Understand offer and find household shopping
- Purpose: Lead with grown food and useful purchase path
- Placement: H1 sequence position 1
- Prominence: Primary promise and household CTA
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-trust

- Id: h1-trust
- User Need: Assess what the existing catalogue can support
- Purpose: Keep factual catalogue/support context near discovery
- Placement: H1 sequence position 2
- Prominence: Supporting reassurance
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-harvest

- Id: h1-harvest
- User Need: Compare varieties, packs, price and availability
- Purpose: Make produce comparison the main next task
- Placement: H1 sequence position 3
- Prominence: Primary shopping collection
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-categories

- Id: h1-categories
- User Need: Find the relevant food family
- Purpose: Expose named category routes without vague labels
- Placement: H1 sequence position 4
- Prominence: Equal-priority category peers
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-cultivation

- Id: h1-cultivation
- User Need: Understand growing and handling credibility
- Purpose: Place provenance close to product interest
- Placement: H1 sequence position 5
- Prominence: Supporting evidence
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-delivery

- Id: h1-delivery
- User Need: Understand whether and when an order can arrive
- Purpose: Explain service constraints before payment
- Placement: H1 sequence position 6
- Prominence: Decision-relevant clarity
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-home-box

- Id: h1-home-box
- User Need: Explore compatible household pairings
- Purpose: Offer practical combinations and repeat-use context
- Placement: H1 sequence position 7
- Prominence: Secondary household path
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-restaurant

- Id: h1-restaurant
- User Need: Find kitchen supply without displacing households
- Purpose: Provide a separate professional enquiry path
- Placement: H1 sequence position 8
- Prominence: Secondary B2B path
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-journal

- Id: h1-journal
- User Need: Use and store unfamiliar ingredients
- Purpose: Reduce uncertainty and avoid food waste
- Placement: H1 sequence position 9
- Prominence: Supporting education
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

### Pattern: h1-closing

- Id: h1-closing
- User Need: Return to shopping or choose a harvest note
- Purpose: Offer next steps after the narrative
- Placement: H1 sequence position 10
- Prominence: Primary shopping plus optional follow-up
- Removal Cost: Loss of this approved narrative step and its useful meaning
- Responsive: Preserve anatomy/content order; stack by task priority without hiding prices, units, states or actions
- Evidence Ids: ev-approved-h1
- Knowledge Class: DERIVED
- Source: Legacy H1 section; rationale documents existing intent, not a new user study

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
- Review Status: Specification only; rendered state/stress checks pending

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
- Review Status: Specification only; rendered state/stress checks pending

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
- Review Status: Specification only; rendered state/stress checks pending

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
- Review Status: Specification only; rendered state/stress checks pending

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
- Review Status: Specification only; rendered state/stress checks pending

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

- Summary: Reuse 2026-10-02 research: premium should come from variety, provenance, harvest, handling, delivery and remedy specificity; households remain primary and restaurant supply secondary.
- Sources: id: ev-current-site; title: Current WeGroween static catalogue; source url: None; date: 2026-10-02; observation: Four-page static catalogue with earthy tokens embedded separately in each page, a script wordmark, bento cards, CDN-delivered Tailwind and AOS, placeholder links, and no functional cart, checkout, account, API, database, or admin.; interpretation: The existing visual vocabulary can inform continuity, but the implementation must be replaced by a governed application architecture.; confidence: high; limitations: No production analytics or user research available; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-sanesa-provenance; title: Sanesa Yourganic; source url: https://www.sanesa.in/; date: 2026-10-02; observation: Uses source verification, same-day cut-offs, refunds, fulfilment detail, sourcing policy, and a named integrity-check process as trust mechanisms.; interpretation: Operational transparency is a stronger premium cue than decorative luxury language.; confidence: high; limitations: Claims were not independently audited; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-bhoomi-membership; title: Bhoomi Farms; source url: https://bhoomi.farm/web/; date: 2026-10-02; observation: Pairs source traceability with a membership model, next-day delivery, pause controls, broad category navigation, and explicit certification links.; interpretation: WeGroween should support one-off buying first while leaving room for repeat boxes or subscriptions after operational validation.; confidence: high; limitations: Subscription economics are business-specific; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-gourmet-mushroom-dual-audience; title: Gourmet Mushroom Company; source url: https://gourmetmushroomco.com/; date: 2026-10-02; observation: Builds specialty credibility through an award, locally grown sourcing, chemical-use clarity, freshness, product education, and restaurant relationships while remaining approachable to home cooks.; interpretation: Restaurant proof can strengthen the household proposition when it is supporting evidence rather than the dominant navigation.; confidence: high; limitations: Contact-led rather than full commerce flow; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-microgreen-store-harvest; title: Microgreen Store Gurgaon; source url: https://www.microgreenstore.in/; date: 2026-10-02; observation: Frames ordering around harvest windows, box entitlements, upcoming availability, delivery status, storage guidance, and familiar Indian meal usage.; interpretation: Harvest-state communication can make operational constraints feel like premium freshness rather than stock failure.; confidence: medium; limitations: Prelaunch or early-stage operating evidence; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-riverford-repeat; title: Riverford Organic Farmers; source url: https://www.riverford.co.uk/; date: 2026-10-02; observation: Connects seasonality, grower traceability, repeat boxes, add-ons, easy pause/skip controls, delivery windows, and recipe education.; interpretation: WeGroween can treat seasonality and repeat purchase as service design, not only brand copy.; confidence: high; limitations: UK logistics and subscription habits differ from India; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-oishii-premium; title: Oishii Farms; source url: https://oishii.com/pages/our-farms; date: 2026-10-02; observation: Premium value is expressed through varietal specificity, sensory language, controlled-environment craft, named farms, human expertise, and precise product photography rather than generic luxury motifs.; interpretation: WeGroween should make cultivation and sensory distinctions concrete, while avoiding imitation of Oishii's Japanese cultural expression.; confidence: high; limitations: Luxury berry category and US distribution differ; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-natoora-transparency; title: Natoora; source url: https://natoora.com/en-GB/; date: 2026-10-02; observation: Uses radical seasonality, grower stories, culinary content, diversity of varieties, and an editorial visual system to connect chefs and home cooks.; interpretation: A strong editorial layer can unify broad categories without turning WeGroween into a generic supermarket.; confidence: high; limitations: Distinctive identity must not be reproduced; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-eztrolley-b2b; title: EZTrolley; source url: https://www.eztrolley.com/; date: 2026-10-02; observation: Restaurant value centers on real-time stock, fast ordering, repeat orders, delivery tracking, automated GST invoices, account support, and broad procurement coverage.; interpretation: WeGroween should separate restaurant onboarding and account workflows while reusing the core catalogue.; confidence: medium; limitations: Claims and scale were not independently verified; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-baymard-grocery; title: Baymard 2026 Grocery Ecommerce UX Research; source url: https://baymard.com/research-articles/online-grocery-ecommerce-ux-2026; date: 2026-10-02; observation: Grocery-specific friction clusters around fulfilment availability, substitutions, large repeat baskets, past purchases, and finding critical product attributes.; interpretation: WeGroween should expose serviceability and delivery before checkout, support buy-again, and keep substitution control global with exceptions.; confidence: high; limitations: Many detailed guidelines are behind a paid research library; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-wcag22; title: Web Content Accessibility Guidelines 2.2; source url: https://www.w3.org/TR/WCAG22/; date: 2026-10-02; observation: Interactive components need programmatic name, role, state, and value; dynamic status messages must be exposed to assistive technology without requiring focus changes.; interpretation: Accessibility must be embedded in component contracts and tested states, not added after visual design.; confidence: high; limitations: Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-fssai-ecommerce; title: FSSAI Advisory for E-commerce Food Business Operators; source url: https://fssai.gov.in/upload/advisories/2024/12/674efa161d756Adobe%20Scan%203%20Dec%202024.pdf; date: 2026-10-02; observation: Food-commerce listings and operations require valid FSSAI identification, alignment between online and physical-label claims, safe last-mile handling, and adequate remaining shelf life.; interpretation: Compliance fields must be supported in product/admin data and surfaced where legally required; claims cannot be invented for design effect.; confidence: high; limitations: Legal configuration requires qualified review before launch; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-local-visuals; title: WeGroween local visual resources; source url: None; date: 2026-10-02; observation: References favor isolated produce photography, microgreen line drawings, watercolor seedlings, and AI-generated botanical material.; interpretation: A restrained botanical mark-making layer could add authenticity, but visible stock watermarks, uncertain licenses, and generic AI imagery make most files unsuitable for direct production use.; confidence: high; limitations: Ownership and reuse rights are undocumented; Historical source; not live reverified during schema migration; rights: Reference only; no identity, copy or asset reuse inferred; id: ev-approved-h1; title: Leader-approved H1 continuous R3 homepage; date: 2026-10-03; observation: H1 household-first narrative and three-page continuous presentation with selected project photographs.; interpretation: Preserve source order, copy, media geometry and original authorization.; confidence: high; rights: Prototype use authorized; production/public rights unconfirmed; id: ev-legacy-decisions; title: WeGroween leader decision log; date: 2026-10-05; observation: Recorded historic identity approvals and scope corrections.; confidence: high; rights: Project-private
- Gaps: Service area and delivery rules; Final catalogue, pack sizes, prices and claims; Production asset rights; New imagery-guide rules and migrated presentation mapping need acceptance
- Budget: questions: Legacy schema equivalence; Existing H1 copy/media preservation; New mandatory field provenance; max sources: 6; max minutes: 30; used web sources this migration: 0
- Stop Condition: Resolve preservation/mapping questions locally; new material design choices remain proposed until accepted

| Decision | Choice / status | Approval reference |
| --- | --- | --- |
| brief | approved-brief / approved | A1 |
| territory | cultivated-editorial / approved | A2 |
| voice | v1 / approved | A3 |
| color | palette-2 / approved | A4 |
| typography | type-2 / approved | A5 |
| density | g3 / approved | A6 |
| structure | h1 / approved | A7 |
| coverage | all-three / approved | A8 |
| reuse | b2 / approved | A9 |
| research | carried-synthesis / approved | A10 |
| imagery | r3-documentary / approved | A10 |

### Approval evidence

- A1: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original evidence: Legacy approved-brief.md dated 2026-10-02: Status approved; existing design-system-only brief reused
- A2: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original evidence: Legacy decisions.md 2026-10-02 Creative territory: selected Cultivated Editorial after comparable previews
- A3: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original evidence: Legacy decisions.md 2026-10-02 Tone of voice: user explicitly instructed recommended V1 Cultivated Authority
- A4: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original evidence: Legacy decisions.md 2026-10-02 Canonical palette: user response c2 t2 g3 selected C2 Soil & Saffron
- A5: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original evidence: Legacy decisions.md 2026-10-02 Canonical typography: user response c2 t2 g3 selected T2 Fraunces + DM Sans
- A6: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original evidence: Legacy decisions.md 2026-10-02 Canonical grid/density: user response c2 t2 g3 selected G3 Curated Market
- A7: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings. Original evidence: Legacy decisions.md H1 + PDFs on 2026-10-02; three-page continuous presentation on 2026-10-03. Source copy/order retained; renderer mapping not approved
- A8: User / User 2026-10-05: All three palettes. User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings.
- A9: User / Legacy decisions.md 2026-10-03: B2 reviewed-redacted structural reuse; no client identity/copy/images/contacts/catalogue promotion
- A10: User / User in current conversation on 2026-10-05: Accept mapping and additions (Recommended). Accepted MIGRATION_REVIEW.md including preserved identity/H1/R3, carried research, purpose/component additions, fuller imagery treatment and proposed alternative mappings.

## Application and governance

Use semantic aliases, not invented color literals. Preserve shared card anatomy and aligned actions; verify variable-length and missing optional content, keyboard focus, narrow screens and zoom. Approve material changes before editing source inputs, then rebuild affected views. Read quality-review.json for observed QA, not inferred quality. Archive verified byte hashes; reuse requires separate permission. No source application edits, scaffolding, backend, checkout, dependencies or deployment are part of this skill.

- Change History: 2026-10-05: Versioned schema-2 candidate; legacy package retained active; original approvals carried with scope evidence; 2026-10-05: Mapping and proposed additions accepted; all-three coverage retained; project-specific R3 renderer authorized by that acceptance
- Exceptions: R3 imagery prototype-use authorization overrides the skill empty-media default for the approved R3 presentation; Logo deferred; No release approval inferred; Legacy alternate preview/order mappings accepted as proposed comparative hypotheses, not new canonical selections
- Source Authority: Tokens: values; design-language.json: narrative/composition; language-state.json: progress/approvals
- Confidentiality: Project-private; B2 permits only reviewed-redacted structural reuse
- Migration: source version: 1.2.0-proposed; status: mapping-approved-rendering-in-progress; source hashes: BRAND IDENTITY BLUEPRINT.md: dc7103397255675f1a1026ba825b2f2a6f534b46780bb492226ebd8ca0852b60; decisions.md: 3bd92a93eb13d40e54ffd3c7f206a271c35b7fbdc263144efdb20f13a148f001; DELIVERY VALIDATION.json: 75d7d13b7706e1372ab4417f799c795cb5b00f82874da77804636201b78c1280; design-tokens.json: fdc24832a4d5f9c1e53be77ab5b9d6c09178e4a22769c617ff3855c06fef7d4d; DESIGN SYSTEM.md: fcef1e7a3d13ea66070101cb98091f67aff5bb7cf3dd4e11a613d54bd888a38a; ICONOGRAPHY OPTIONS.md: d0fb0d4fbdf746602c454e84a82225fbbfdf28d881366d59efa88876986b7937; PROJECT STATUS.md: b2cbfac10de086b2fce056a209272a40dfe9beb990e9a8be883ffdfa8a8d6c95; QUALITY REVIEW.md: 4e8dc014b583f50593d4a5636a08f9a04cb1b4e60721e47401b2558e2d7a7cc1; README.md: 53ec65ac5201d4b07ce5548823d440ea5fa178f02dd85239118ad45ce0901a4a; research-summary.md: fd142727fcbdd6649f54c66f5066c9202387b15ee7d0a6d5f6a9f6a7e5f67a37; tokens.css: 0c2bb5442a0c52e49d8c767e23886ceeaa35493d72d5a4554afeee79d8a4b5c5; archive/archive-log.jsonl: 0774ca9c4dc58249b8db9144ebe9e1ec7be54953abd03ed7fced775c1a63a6e7; artifact/comparison.html: a4a4a58c0652509c6f4ee76007c9c9f2c2907a2d8e6d36d67bb43206fcca94ee; artifact/components.html: a1bb6b3972e796676815cb877ecab21bba998dc287efa787ab5faced80f7c0f7; artifact/iconography-options.html: a04885ecb8bfc01937dd93c14c6e16e20250a464a55ff85f721421007563370f; artifact/iconography.html: d801e3e573788226afb1a0432792b33e7a4496e5426a0771a88d61f6ccbde711; artifact/index.html: 4f66adb88ad61965770c12c4006b5d322bf568edd720b34327a362bef6e21acd; artifact/specimen.css: 162318e852b20764a57564668f6d7254a588c35f71d51d342846b71d75274fc3; artifact/specimen.js: a8a2bd1d1c9ac5fef4107f379753daaa413c4beef778aa33eabb19ba3cd1a028; assets/blue-oyster.webp: 31d7256aba77659a195c92ca66cac9f7a94bd23277d8ebf27e91eba1f6dbd4ee; assets/broccoli-microgreens.webp: d2f21e064fe4195a14551e08c87ffc9b75cdbe77b0e87c456321f7aeab338269; assets/button-mushrooms.webp: 326dfd28cb9f5d24e42872a620e31f6447f569c29e1c9f3903c0dc759624b0e1; assets/cultivation-microgreens.webp: 49f4cde0ec73c303d46470174cde4ec83ba09715e163b6f3b07d681936e2dd98; assets/dm-sans-latin-variable.woff2: ca72d2bcea8f4daa783dbdfa2d9b46068c3ce38168e05918fb867aa453b4f890; assets/fraunces-latin-italic-variable.woff2: 7026a01ad498bfe76964ab92227aea0f4b7c9dc0d2ca153e962e3eef13257192; assets/fraunces-latin-variable.woff2: e79165432c3e1e01aff1ea4d394dec633c13ec70f09e92432ae77aa6e1aa7328; assets/golden-oyster.webp: f18210253503ad28767b9f150bd28035f7bb89f950c2cedf634dc6bd54dab165; assets/hero-mushrooms.webp: 8ed9a0809d407c407a00a2e390ec8f863c5e71e615e9773d9a64cdf6e3bb89ec; assets/manrope-latin-variable.woff2: a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972; assets/mustard-microgreens.webp: 2513e1ad09e7e008370ffa755b07a605f0740ecdd006b79dfd381f363d941ced; assets/newsreader-latin-italic-variable.woff2: 5dfcd10d24af8c82927ba57f7983dd997f7b200594c09c35a1b1ed9fc4597506; assets/newsreader-latin-variable.woff2: 6e4f2958c3a7c4a80acde4e5a679abe7e01bc1e30b92be3c7a8b696ef401d101; assets/OFL-DM-Sans.txt: 9af36190332437f5ecd09974de43c1f7c77a310a996cdd8ceb25628b458840e1; assets/OFL-Fraunces.txt: bdf4c22802eaf804f998195871c6b8938aac2ac14b2d78a8bd66a6f1eced833b; assets/OFL-Manrope.txt: 58172e0c0fac2cda8a37b348164bb55e44b0e69051e557e92b1d3f6910141f7b; assets/OFL-Newsreader.txt: fdfad38143ec470553cae82a1e45320bdd1b9ec70415d37bd0171051d8a4ded8; assets/radish-microgreens.webp: 0a086db8ec713416e75cc649001ff356bd4d5172d7953166aa4844fb002c15ad; assets/README.md: a593b3a287f1f9248fe116ab309158123efd47d8b8c0342392471e3710d5d538; assets/sunflower-shoots.webp: 32aa2c1ed710fa918f81f0a679e9d9ea8d8b0208bc55a6ff9f25727261694cde; assets/yellow-oyster.webp: 58fd0bc105baa4ff61c3f88c9a3c2ad06627e9965f985f25645902b881f33ff8; components/components.css: c8cbbcc832aaf6b7a121c38620ae2f771f0e3b9b7715933e514a10b1cae1c658; components/README.md: ef8c82219c61d73782818f1ad77076ef7ee7743a52630f289478dbf43f556498; icons/generate-icons.mjs: cdc3ac61a14cd6998de21301291cc981f501204033f8d2e1c946bdf45504f31f; icons/icons.svg: 24eb8d2e45bcf37019544de8ed7ca1569663bb89faddfe5848c8d4d7cc288f96; icons/manifest.json: 0188691569c252259951821a2b7e06922d55d1b77df7c43b5b242ee453eea524; icons/README.md: 069423031f16bf7a43e90fd4ef433cc71181f6c25db5e766e3ada6db6920c8dc; pdf/README.md: 02473b596c9437baf8306b6854bc5dc3ac4491da48affae07555c55ac836783d; pdf/wegroween-design-direction-manual.pdf: 94479b38e2ea647cf202c606b92ed34a0da9fe903605af49f4a2f1a902b85f14; pdf/wegroween-homepage-prototype.pdf: f4bb07569932d2d608f50ccd4b30829f95ba15bf8c60006f73a8718cdfb60d0d; archive/snapshots/snapshot-1-2-0-proposed-005e59745393.json: 06112ce953ac0711126eb62dbffdd4402e8ec9934cabde451e84292843a84f5b; archive/snapshots/snapshot-1-2-0-proposed-055c4a30eca4.json: aa8f6b75942117c3b15ad457455c74426b485cdf2714dc59466e101466d8dee5; archive/snapshots/snapshot-1-2-0-proposed-8fd28a216b8a.json: 9e5e5b8bee20dd723bf1655ba33f41cef4e9c3d83921ca348ee9142caedb0397; archive/snapshots/snapshot-1-2-0-proposed-b415e36c409b.json: 0f776cd2fb9c5c91a4d2d1ab50f8b2b7f76e366d13471631474afee587890aac; archive/snapshots/snapshot-1-2-0-proposed-fba0e7dfa476.json: e1929275ea6fccfc1998703933039067892120a52ffb353f8da7710ee1c098c5; icons/svg/account.svg: 5143362af2d94f1077b92bde4461089af0881b6cae22935c0a2ccdd3ab2ad236; icons/svg/arrow-right.svg: ddb42526183381b5564136238fa9760481ba778a3dd37d6a15d6866c26f329a3; icons/svg/basket.svg: 80fbf1ed0a2af790989159486ec93b1b9fe7f864aca2bbd3396d81fb9e54603b; icons/svg/calendar.svg: d63cd83f6b62b21e78aac179f41333f75c3aa2e6d9062da91ff8f65f50da78b9; icons/svg/check.svg: 591494890dc4a5065bd4bd46558c410b30ae792b97cc45e00131131b0436c665; icons/svg/chevron-down.svg: 664b577c86be107e55ca983b20adb2e23f327d8e7252729e4c0d2936f1f1166e; icons/svg/cloche.svg: fac28df6db709fcc5ac6c2c1e0962c8b1e41ed511bac5a0b140684684130f474; icons/svg/clock.svg: 92862b0d32f096cae6eff388bcffd6a6ff28d3d91cd32357eeed0bbd0184c28c; icons/svg/close.svg: a4db4190ecdde79e440772d65746922b240573397b4aec5621fcfaec6bba9c42; icons/svg/delivery.svg: 2e5c09b68a93f80c16750093d0ee2eb6072b05ab9764eec1706359d9bf3f342b; icons/svg/error.svg: 3f58204b4aac1adeb7991e2f0126b7ddce223a1d114359e12c4e0a1cb439c25f; icons/svg/exotic.svg: 4f89e9cd103f050b2668414838fc172a4394b0d3b38fd5b74c0d85b1cb28c476; icons/svg/filter.svg: 97420f9a21afeb9cd05a7f15db4e9e5c069f4b3beceeec6654b5ba12027960f6; icons/svg/fruit.svg: 0ad75654d1da9f1a0e30ee13528884c20c53851398f75eddbbce0d59904d123e; icons/svg/information.svg: 245a44979d4190ec64a742f923fd01ff752b85508d103e712483cc82729f7775; icons/svg/location.svg: 14656c57b554321b14f70912911aa35428ca313cb13261df9f7b97c294a61508; icons/svg/menu.svg: 4d0d34dbee59ed0ac50016827f6e7277ec84f6e74b14cf5296d1bf335ca0c61b; icons/svg/microgreens.svg: 09fbb55cc96892bbccc7a207ec8c6e9b09e8ea5cceb2ab0eccfcd9b0b94f8d06; icons/svg/minus.svg: a89a9b87ffe418506f3a7f9e3c2c5c59a633ddf0100fd1958cb7731b24198fe0; icons/svg/mushroom.svg: df38aae36ad022b7be756ea1057d4fe7663ad6cb0ef45921fb970064178f59c8; icons/svg/package.svg: 8279fa52c882acadac348036be14197b095f6a56555b6f412da0951c5e4f285b; icons/svg/plus.svg: d3b7ea36dbee3d45a6631f6e17695f91b1d5a4b64e16c0b8dc66aaad7eea8ae3; icons/svg/produce.svg: 23aa36e8de965a38ae4ee17458eeeb905b4ecab2101422428fc98fa1503d6d5a; icons/svg/receipt.svg: 823468e4d63d45cd0f7682873634b394554abe7678e19ac1ef20ebd05a547d89; icons/svg/repeat.svg: 43d23c319740ee4cfdce78c1f585b71c2725f586ff263a02933e26b037709fb2; icons/svg/search.svg: 356a943c56fbfc15a90fb8f475f251da07c13c402318424fae5bfdb0aac938e2; icons/svg/warning.svg: 68de7f2560c357b99ac7a672638af9c39899530baf911640d6dcaddf5b7e2903; icons/svg/water.svg: 575ee92cf63415f28ab1460caa9b071bc6c3c77781e4cb32db749d6a5430a801; pdf/source/design-direction-manual.html: 665eb32f133265af372b9ca9feba6c112dc385af4aa4a5a5c31026fc58683499; pdf/source/homepage-prototype.html: d143b6b44e9eaf90e8bfc0b058bf8c34962e6cd3f228f63d347b1774afefa524; pdf/source/manual.css: 18160156a3cb100e0135c091b1524ad8b78ce838188111e8a61871ac7feae332; pdf/source/prototype.css: 8803916181780e55f3d0fefef5784bc97942c6e971ce54bcd8a947897ef58bcc; pdf/archive/r1-screen-deck/homepage-prototype-r1.html: 52616936e29bf49d748fcbdd490ea958609f356781e50fa15b974342efcd1551; pdf/archive/r1-screen-deck/prototype-r1.css: 689653f96212fb76138cc21dd87d6a37cca8c790199cae7139e013bcde7217d2; pdf/archive/r1-screen-deck/wegroween-homepage-prototype-r1.pdf: 18dfea05d97c30f958d97cc3ae34223287c0da9486738f0985d4dbe0085e2af9; pdf/archive/r2-continuous-placeholders/homepage-prototype-r2.html: 3333c0af672123b4e832d33c3fdc829d20f93146eeb1424fe56ab6b529b9820f; pdf/archive/r2-continuous-placeholders/prototype-r2.css: e85208667c97959b8f41075379212380db35c9e95bb1ab2285e72cfc51fb21d5; pdf/archive/r2-continuous-placeholders/wegroween-homepage-prototype-r2.pdf: c9500b38ecc017fa9798af9c9f38408c9bab271359b2bac49255b2d0dd35fe58; legacy section order: hero; trust; harvest; categories; cultivation; delivery; home-box; restaurant; journal; closing; legacy media manifest: path: ../../assets/hero-mushrooms.webp; alt: Button mushrooms growing in a tray; path: ../../assets/blue-oyster.webp; alt: Blue Oyster mushroom; path: ../../assets/yellow-oyster.webp; alt: Yellow Oyster mushroom; path: ../../assets/radish-microgreens.webp; alt: Radish microgreens; path: ../../assets/sunflower-shoots.webp; alt: Sunflower shoots; path: ../../assets/cultivation-microgreens.webp; alt: Microgreens growing on indoor racks; path: ../../assets/yellow-oyster.webp; alt: Yellow Oyster mushrooms; path: ../../assets/mustard-microgreens.webp; alt: Mustard microgreens; path: ../../assets/golden-oyster.webp; alt: Golden Oyster mushrooms; path: ../../assets/broccoli-microgreens.webp; alt: Broccoli microgreens


## Project presentation adapter

The bundled schematic renderer cannot retain R3 photographs/forms and the approved three-page format. The project adapter preserves H1 copy, image geometry and presentation, changing mapped palette values only. All three coverage variants are rendered. The full legacy package remains in a hash-verified rollback. Project validation retains standard specification, approval, coverage, hash, QA and scope checks, and checks adapter freshness rather than comparing to the incompatible schematic renderer.
