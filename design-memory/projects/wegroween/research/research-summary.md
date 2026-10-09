# WeGroween Research Synthesis

Date: 2026-10-02  
Status: sufficient for creative-territory and architecture decisions  
Knowledge class: DERIVED

## Executive finding

The strongest opportunity is not “another organic shop.” WeGroween can own a more specific position: a premium, harvest-aware food brand that makes unusual freshness, cultivation, and seasonal variety easy for households while giving professional kitchens a credible supply path.

Premium should be demonstrated through specificity: what is growing, where and how it was cultivated, when it was harvested, how it tastes, how to use it, when it can arrive, and what remedy exists when reality changes. This is more defensible than luxury adjectives or a beige-and-sage surface treatment.

## Current-state findings

### Worth preserving
- Warm earth-derived base colors.
- Product-led photography and simple category structure.
- “Rooted in science / grown for flavor” as an early signal of cultivation knowledge.
- Directness and compact catalogue scope.

### Must change
- The script logo loses clarity at small sizes and needs a robust wordmark/lockup strategy.
- Declared typefaces are not loaded; typography is therefore uncontrolled.
- Pale/transparent text and decorative gradients require measured contrast.
- Rounded glassy bento cards feel generic and do not establish provenance or premium craft.
- The cart, mobile menu, links, and product actions are placeholders.
- Product architecture covers only mushrooms, microgreens, and combos.
- There is no serviceability, inventory, checkout, account, database, authentication, payment, or admin layer.
- Repeated page-local styles will drift and must be replaced with semantic tokens.

## Market and user findings

1. **Trust is operational.** Stronger Indian references explain source verification, delivery limits, cut-offs, refunds, and certifications before purchase.
2. **Freshness needs states.** Harvest dates, next availability, delivery windows, storage guidance, and notify-me behavior convert biological variability into useful expectations.
3. **Repeat shopping deserves first-class UX.** Buy-again, saved baskets, and eventually controlled subscriptions reduce routine effort.
4. **Perishables complicate checkout.** Serviceability, slots, stock risk, and substitutions should not appear only after a shopper has invested time.
5. **Restaurant buyers need a distinct operating mode.** Reorder speed, availability, GST-ready information, delivery status, account support, and saved lists matter more than lifestyle storytelling.
6. **Breadth needs editorial curation.** Seasonality, uses, varieties, recipes, growers, and cultivation stories prevent a broad catalogue from feeling like a commodity grid.

## Visual-system implications

- Avoid a monochrome eco-green identity and avoid default beige wellness minimalism.
- Let produce generate seasonal accents within a stable brand framework.
- Use one authoritative editorial type voice plus a highly readable UI companion.
- Prefer crisp borders, deliberate spacing, tactile paper/mineral surfaces, and controlled radii over glassmorphism.
- Commission or create original botanical marks if used; local stock-pattern files have uncertain licenses and some visible watermarks.
- Photography should show texture, scale, hands, cultivation, harvest, and finished-food context—not only isolated catalogue cutouts.

## Required experience patterns

- Early pincode/serviceability check.
- Explicit `Growing`, `Harvesting`, `Ready`, `Limited`, and `Resting` availability states with plain explanations.
- Product-card attributes appropriate to each category: pack size, harvest/dispatch timing, taste, growing method, and storage life.
- Delivery promise carried from catalogue through checkout.
- Global substitution preference plus item-level exceptions where substitutions apply.
- Buy-again and saved lists for households; rapid reorder and GST/account data for restaurants.
- Admin validation for product claims, FSSAI details, price, inventory, availability, shelf-life or best-use fields, imagery, and delivery eligibility.

## Accessibility and quality bar

- WCAG 2.2 AA target.
- Semantic native controls, visible focus, keyboard-complete flows, 44px preferred touch targets, reduced-motion support, and no color-only statuses.
- Cart, inventory, payment, and order updates must expose accessible status messages.
- Required contrast combinations will be measured before any palette becomes canonical.

## Compliance implications

The application must support qualified launch review for FSSAI, consumer-protection, tax/invoicing, privacy, refunds, delivery, and payment terms. Official FSSAI material requires food-commerce compliance and alignment between online claims and physical labels; current guidance also emphasizes valid license display and safe fulfilment. Compliance conclusions remain subject to professional legal and accounting review.

## Architecture evidence

- Next.js App Router supports server-rendered storefront routes, server-side mutations, and route handlers, but its official guidance requires authentication and authorization checks inside every server mutation and endpoint.
- Supabase can provide Postgres, authentication, and row-level authorization, but every exposed table requires deliberate grants, policies, and tests.
- Medusa provides product, order, customer, inventory, reservation, pricing, fulfilment, and admin foundations; it reduces commerce reinvention but adds a separate service and customization model.
- Razorpay is an appropriate India-oriented payment candidate, but production integration requires merchant credentials, signature verification, server-side order creation, idempotent webhooks, and reconciliation.

## Evidence gaps to carry forward

- Final service city/region, delivery radius, slot rules, and fulfilment capacity.
- Registered business name, FSSAI status, GST status, invoice rules, and policies.
- Exact product catalogue, pack sizes, pricing, stock cadence, shelf life, and claims.
- Restaurant pricing, credit terms, minimum quantities, and approval process.
- Production hosting, email/SMS/WhatsApp providers, Supabase project, Razorpay merchant account, and domain.

These gaps do not block creative-direction work or an application scaffold. They do block a compliant production launch and final operational configuration.

## Sources

- Current project source and UI board in the WeGroween workspace.
- https://www.sanesa.in/
- https://bhoomi.farm/web/
- https://gourmetmushroomco.com/
- https://www.microgreenstore.in/
- https://www.eztrolley.com/
- https://www.riverford.co.uk/
- https://oishii.com/pages/our-farms
- https://natoora.com/en-GB/
- https://baymard.com/research-articles/online-grocery-ecommerce-ux-2026
- https://www.w3.org/TR/WCAG22/
- https://fssai.gov.in/upload/advisories/2024/12/674efa161d756Adobe%20Scan%203%20Dec%202024.pdf
- https://nextjs.org/docs/app
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://docs.medusajs.com/user-guide
- https://razorpay.com/docs/
