# WeGroween Design System

## 1. Status

- Version: 1.2.0-proposed
- Status: Identity, component system and Phase 7 delivery complete; package remains proposed pending finalization
- Last updated: 2026-10-02
- Product context: Household-first premium food commerce with restaurant supply and admin operations
- Current scope: Design system only; application implementation is out of scope
- Source of truth: `design-tokens.json`

## 2. Approved direction

**Cultivated Editorial** makes premium value tangible through seasonal specificity, provenance, sensory product language and restrained editorial composition. The selected foundation is:

- Voice: V1 Cultivated Authority
- Palette: C2 Soil & Saffron
- Typography: T2 Fraunces + DM Sans
- Grid: G3 Curated Market
- Motion/components: M1 Restrained Editorial

## 3. Design principles

1. Specificity is luxury.
2. Evidence stays close to the claim.
3. Produce leads; UI frames it.
4. Household shopping is primary; restaurant operations are distinct but related.
5. Availability and delivery uncertainty are resolved early.
6. Accessibility and operational truth outrank decoration.

Do not introduce glassmorphism, arbitrary green, unsupported claims, untracked spacing/radii, hidden constraints or visual-only status communication.

## 4. Color

### Approved: C2 Soil & Saffron

- Brand primary `#402B24`
- Brand secondary `#98513D`
- Accent `#D49A25`
- Background `#FBF4E8`
- Surface `#FFFDF7`
- Primary text `#2B211D`
- Secondary text `#66544B`
- Inverse text `#FFF8EC`

Key measured ratios: primary text/background 14.36:1; secondary text/background 6.54:1; inverse/primary 12.52:1; inverse/secondary 5.56:1; primary text/accent 6.31:1; focus/background 5.83:1.

Use saffron behind dark text, not white text. Use terracotta selectively for editorial emphasis, not every control. Status colors always include text or an equivalent cue.

### Unapproved alternatives

- C1 Orchard Ink — rejected as canonical; retained for decision history.
- C3 Plum & Leaf — rejected as canonical; retained for decision history.

## 5. Typography

Approved: Fraunces for display/H1–H3; DM Sans for body, UI and H4–H6. Self-host variable WOFF2 files with OFL notices and `font-display: swap`. See `BRAND_IDENTITY_BLUEPRINT.md` and tokens for the complete modular scale.

Newsreader + Manrope is an unapproved alternative. Never mix the pairings.

## 6. Spacing, radius, elevation and motion

### Spacing

Semantic spacing values are 0, 4, 8, 12, 20, 32, 48, 72 and 96px. Standard card padding is 20px; feature-panel padding is 32px. Catalogue gaps use 20px.

### Radius

- none: 0
- control: 8px
- card: 10px
- panel: 14px
- pill: 999px, reserved for filters, chips and status
- round: 50%, reserved for avatars and true circular icon controls

### Elevation

- flat: no shadow; default cards rely on borders/surface shifts.
- raised: subtle navigation or selected card.
- floating: menus and date/slot pickers.
- overlay: drawers and popovers.
- modal: blocking dialogs only.

Hierarchy must remain clear without shadows. Do not use blur as the sole separation cue.

### Motion

- micro: 140ms for hover/focus/pressed feedback.
- standard: 220ms for expansion and local reflow.
- emphasized: 360ms for drawers and major continuity.
- reduced motion: remove translation, scale and decorative reveals; preserve immediate state feedback.

### Iconography

- Canonical family: I1 Field Notes.
- Grid: 24×24; standard rendered sizes: 16, 20, 24 and 32px.
- Construction: 1.75px optical stroke, square caps, rounded joins, open counters and deliberate crop-specific asymmetry.
- Color: `currentColor`; semantic state color must be accompanied by text or another non-color cue.
- Controls: icon-only targets remain at least 44×44px and require an accessible name.
- Mixing: do not combine Field Notes with rounded monoline or bold bevelled icon families. Draw missing glyphs to the documented construction rules.
- Assets: `icons/icons.svg`, `icons/*.svg`, `icons/manifest.json` and `icons/README.md`.

## 7. Component contracts

### Navigation

**Purpose:** orient customers, expose primary shopping categories, provide search/account/basket, and keep restaurant supply discoverable.

- Anatomy: skip link, brand, primary links, optional category menu, restaurant link, search, account, basket.
- Variants: storefront, transparent-over-media only when contrast is guaranteed, scrolled surface, admin sidebar/topbar.
- States: default, hover, active/current, focus, scrolled, mobile collapsed, mobile expanded, overflow.
- Responsive: below available width, collapse into a labelled menu button and drawer; basket remains visible when space permits.
- Keyboard: semantic links/buttons, Escape closes drawers, focus returns to trigger, focus is trapped only in modal navigation.
- Accessibility: `<nav aria-label>`, current page uses `aria-current="page"`; skip link is first focusable element.
- Content: labels are short nouns. Do not use ambiguous “Explore” as the only category label.

### Buttons

**Purpose:** initiate clear, immediate actions.

- Variants: primary, secondary, tertiary/text, destructive and icon-only.
- Sizes: small 44px, medium 48px, large 56px; every interactive target meets the 44px minimum.
- Anatomy: label, optional leading/trailing icon, loading indicator.
- States: default, hover, active, focus-visible, loading, disabled.
- Loading: preserve width, disable repeated submission, use text such as “Adding…” where space allows and expose busy state.
- Keyboard: native `<button>` for actions and `<a>` for navigation; Enter/Space behave natively.
- Accessibility: icon-only buttons require accessible names. Disabled appearance is never used on an actionable element.
- Anti-example: clickable `<div>`, placeholder `href="#"` in production, or white text on saffron.

### Inputs

**Purpose:** collect customer, delivery, restaurant and admin data with visible guidance.

- Anatomy: persistent label, required/optional indicator, control, optional prefix/suffix, helper text, error text.
- Variants: text, email, telephone, password, search, quantity, select, textarea, checkbox, radio, switch and date/slot controls.
- States: empty, filled, hover, focus, error, success, disabled, read-only and loading/validating where required.
- Validation: run on blur or submit unless early feedback prevents loss; link errors using `aria-describedby`; move focus to an error summary after failed multi-field submission.
- Content: placeholder is an example, never the only label.
- Responsive: inputs fill their column; related short fields may share a row only when each remains at least 160px.

### Cards

**Purpose:** summarize products, editorial collections, features and admin data.

- Variants: product, collection, feature, media, data, selectable and disabled/unavailable.
- Product anatomy: media, availability badge, title, category-specific attributes, price/unit, harvest/delivery cue, quantity/add action.
- States: static, hover, focus-within, selected, loading skeleton, unavailable, error.
- Whole-card click: use a stretched primary link without swallowing quantity or add controls; nested actions remain independently focusable.
- Media: 4:3 listing ratio; meaningful images have descriptive alt text; decorative media uses empty alt.
- Content: show pack size/unit and relevant list attributes without forcing product-page visits.
- Anti-example: multiple nested links, hover-only detail, or a card whose only status cue is faded opacity.

### Badges

**Purpose:** communicate compact category, availability and order states.

- Variants: neutral, brand, success, warning, error and information.
- States include explicit text: “Ready now,” “Harvest Friday,” “Limited,” “Out of season,” “Paid,” “Packing,” “Delivered.”
- Removable chips use a separate named remove button.
- Badge text remains readable at 200% zoom and never relies on color alone.

### Cart and quantity control

- Product add changes into a minus/value/plus control without moving the surrounding layout unexpectedly.
- Minimum touch target 44px; announce cart count and subtotal changes through a polite status region.
- Cart exposes fulfilment/serviceability context, pack units, substitutions and stock-risk messages before checkout.
- Prevent negative or impossible quantities and explain upper limits.

### Checkout stepper

- Steps: contact/account, delivery, substitutions if applicable, payment, review/confirmation.
- Show serviceability and available delivery windows before payment.
- Preserve entered data after validation or payment failure.
- The current step is indicated with text and `aria-current="step"`, not color alone.
- Do not create the paid order from browser-only confirmation. Trusted verification is server-side.

### Tables and admin data grids

- Use native table semantics for tabular data.
- Column headers expose sort state. Row actions are keyboard reachable and labelled with the affected record.
- On narrow widths, preserve critical columns and provide a details view; do not convert complex data into unlabeled card fragments.
- Filters, pagination and result counts remain visible and announced after updates.

### Modal, drawer and toast

- Modal is reserved for blocking decisions; drawers support basket, filters and compact editing.
- Focus enters the surface, remains trapped only while modal, Escape closes when safe, and focus returns to the trigger.
- Toasts never contain the only copy of critical information and are exposed as suitable status/alert roles.

## 8. Responsive and content rules

- Layout reflows by available component space; the reference breakpoints are 640, 900 and 1200px.
- Body text wraps naturally; headings avoid orphaned single words where editorially possible without forced `<br>` tags.
- Product names may use two lines in grids; never truncate prices, units, availability or action labels.
- Controls remain at least 44px in both dimensions.
- Text expansion tolerance: 35% minimum.
- Image ratios: product 4:3, square for isolated pack shots, editorial 5:4 or 4:5.
- Every remote-data surface defines loading, empty, error, offline and unauthorized states.

## 9. Accessibility

- WCAG 2.2 AA target.
- Semantic HTML first; ARIA only fills semantic gaps.
- Visible focus uses the focus token and at least 3:1 adjacent contrast.
- Required text/background pairs meet 4.5:1.
- All state changes in cart, forms, payments and orders have programmatic status communication.
- Respect reduced motion, text zoom and 320px reflow.
- Provide meaningful page titles, landmarks, logical headings and descriptive link text.

## 10. Future implementation guidance

- Intended future stack: semantic HTML, compiled Tailwind CSS, modular JavaScript, Supabase and Razorpay. No application code is delivered in this phase.
- Import `tokens.css` before component styles.
- Tailwind theme values must reference CSS variables; never duplicate hex values in utility classes.
- Browser code uses only the Supabase publishable/anon key. Service-role and Razorpay secrets remain server-side.
- Supabase Edge Functions create Razorpay orders, verify checkout signatures and process idempotent webhooks.
- RLS and database grants protect every exposed table; admin authorization derives from trusted app metadata/roles, never user-editable metadata.
- Monetary values are integers in the smallest currency unit.
- Inventory changes and payment webhook processing are transactional and idempotent.

## 11. Exceptions and open decisions

- No dark mode in v1.
- Wordmark and logo direction are deferred by the Design Decision Leader.
- I1 Field Notes is canonical. I2 Cultivation Geometry and I3 Harvest Cut are retained only as decision history.
- Exact service area, slot rules, catalogue, claims, licences, taxes and restaurant terms remain operational inputs.
- Application architecture, data model, checkout behavior and operational policies require a separate implementation engagement.
- Final design-system package remains proposed until leader finalization and archive permission.

## 12. Change history

- 2026-10-02 — v1.2.0-proposed: V1 and M1 approved; core component CSS/specimen completed; Phase 6 consistency, accessibility, feasibility, originality and evidence reviews passed with disclosed limitations.
- 2026-10-02 — Phase 7: H1 Harvest to Home approved; synchronized homepage prototype and Design Direction Manual PDFs rendered and inspected.
- 2026-10-02 — v1.1.0: I1 Field Notes selected; icon tokens, construction rules and reusable SVG assets added; wordmark work remains deferred.
- 2026-10-02 — v1.0.0: Canonical Cultivated Editorial system created with C2, T2, G3, V1 and M1.
