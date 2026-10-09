# WeGroween Decision Log

## Decision: Operating mode
- Date: 2026-10-02
- Phase: Preflight
- Decision owner: User
- Status: selected
- Options presented: CREATE, EXTEND, REFRESH, AUDIT, MIGRATE
- Selected approach: REFRESH
- Rationale: An existing identity and static catalogue are present, but the brand and application require substantial evolution.
- Risks accepted: Existing visual continuity may be selectively reduced where it conflicts with premium positioning or accessibility.
- Implications: Existing assets are evidence and inputs, not immutable constraints.
- Supersedes: None

## Decision: Audience and commercial emphasis
- Date: 2026-10-02
- Phase: Brief
- Decision owner: User
- Status: selected
- Options presented: Premium household brand, chef/hospitality specialist, premium farm marketplace
- Selected approach: Premium household brand with restaurant supply also available
- Rationale: Household commerce provides broad relevance while restaurant supply adds expertise and recurring B2B potential.
- Risks accepted: The two pathways require clear hierarchy to avoid navigation and messaging ambiguity.
- Implications: Household purchase is the primary journey; restaurant supply receives a distinct secondary journey.
- Supersedes: None

## Decision: Application scope
- Date: 2026-10-02
- Phase: Brief
- Decision owner: User
- Status: superseded
- Options presented: Design-system/prototype scope or complete application development
- Selected approach: Develop the entire application
- Rationale: Online shopping must create orders directly in an admin dashboard.
- Risks accepted: The current static repository has no application framework, database, authentication, payment, or admin implementation.
- Implications: Historical context only; replaced by the design-system-only scope below.
- Supersedes: None

## Decision: Application architecture
- Date: 2026-10-02
- Phase: Research synthesis
- Decision owner: User
- Status: deferred
- Options presented: Next.js with Medusa, HTML/JavaScript with Supabase, or Shopify headless
- Selected approach: HTML, Tailwind CSS, JavaScript, Supabase, and Razorpay
- Rationale: The user prefers a direct web stack with a custom storefront and admin dashboard.
- Risks accepted: Commerce, inventory, fulfilment, refunds, order-state logic, authorization, and reconciliation must be designed and maintained within the project rather than inherited from a commerce engine.
- Implications: Retain as future implementation guidance only. No storefront, database, payments or admin application will be built in the current engagement.
- Supersedes: Architecture options proposed after research synthesis

## Decision: Creative territory
- Date: 2026-10-02
- Phase: Creative territory
- Decision owner: User
- Status: selected
- Options presented: Cultivated Editorial, Living Laboratory, Harvest House
- Selected approach: Cultivated Editorial
- Rationale: Selected directly by the Design Decision Leader after reviewing comparable visual previews.
- Risks accepted: The direction depends on disciplined photography, editorial copy, and balancing spacious storytelling with efficient shopping.
- Implications: The identity system will use quiet editorial confidence, seasonal produce-led accents, evidence-rich provenance, restrained radii, and efficient commerce components.
- Supersedes: None

## Decision: Canonical palette
- Date: 2026-10-02
- Phase: Identity system
- Decision owner: User
- Status: selected
- Options presented: C1 Orchard Ink, C2 Soil & Saffron, C3 Plum & Leaf
- Selected approach: C2 Soil & Saffron
- Rationale: Selected directly by the Design Decision Leader using the response `c2 t2 g3`.
- Risks accepted: Warm clay and saffron require discipline to avoid rustic or festive styling.
- Implications: C2 semantic colors are canonical; C1 and C3 remain decision history.
- Supersedes: Recommended C1 bundle

## Decision: Canonical typography
- Date: 2026-10-02
- Phase: Identity system
- Decision owner: User
- Status: selected
- Options presented: T1 Newsreader + Manrope, T2 Fraunces + DM Sans
- Selected approach: T2 Fraunces + DM Sans
- Rationale: Selected directly by the Design Decision Leader using the response `c2 t2 g3`.
- Risks accepted: Fraunces must remain restrained in transactional and data-dense contexts.
- Implications: T2 is canonical; T1 remains decision history.
- Supersedes: Recommended T1 bundle

## Decision: Canonical grid and density
- Date: 2026-10-02
- Phase: Identity system
- Decision owner: User
- Status: selected
- Options presented: G1 Dual Rhythm, G2 Gallery Spacious, G3 Curated Market
- Selected approach: G3 Curated Market
- Rationale: Selected directly by the Design Decision Leader using the response `c2 t2 g3`.
- Risks accepted: Editorial premium must be preserved through typography, imagery and disciplined spacing within the denser commerce grid.
- Implications: G3 is canonical; G1 and G2 remain decision history.
- Supersedes: Recommended G1 bundle

## Decision: Tone of voice
- Date: 2026-10-02
- Phase: Identity system
- Decision owner: User
- Status: selected
- Options presented: V1 Cultivated Authority, V2 Warm Abundance, V3 Exacting Grower
- Selected approach: V1 Cultivated Authority
- Rationale: The Design Decision Leader explicitly instructed the architect to use the recommended option.
- Risks accepted: The voice depends on real operational detail; vague copy will make the brand feel performative.
- Implications: V1 becomes canonical for household, restaurant and operational content.
- Supersedes: None

## Decision: Motion and component character
- Date: 2026-10-02
- Phase: Identity system
- Decision owner: User
- Status: selected
- Options presented: M1 Restrained Editorial, M2 Expressive Narrative, M3 Near Static
- Selected approach: M1 Restrained Editorial
- Rationale: The Design Decision Leader explicitly instructed the architect to use the recommended option.
- Risks accepted: The system must preserve crafted character through typography, spacing and content rather than relying on decorative motion.
- Implications: Use 140/220/360ms motion, restrained radii, rule-based hierarchy and minimal shadows; canonical component assets may now be generated.
- Supersedes: None

## Decision: Current delivery scope
- Date: 2026-10-02
- Phase: Scope correction
- Decision owner: User
- Status: selected
- Options presented: Application development or design-system development only
- Selected approach: Design-system development only
- Rationale: The user clarified that the current engagement is focused on developing the design system, not the application.
- Risks accepted: Functional commerce and admin behavior will not be validated in this phase.
- Implications: Deliver brand identity, tokens, foundations, component specifications, patterns, an interactive specimen and governance documentation. Treat HTML, Tailwind CSS, JavaScript, Supabase and Razorpay as future implementation context only.
- Supersedes: Decision: Application scope

## Decision: Wordmark and logo direction
- Date: 2026-10-02
- Phase: Iconography extension
- Decision owner: User
- Status: deferred
- Options presented: Continue wordmark/logo work or isolate iconography
- Selected approach: Leave wordmark and logo direction for later; work only on iconography
- Rationale: The current priority is a coherent icon system independent of the unresolved wordmark.
- Risks accepted: Icon proportions cannot yet be optically tuned against a final logo lockup.
- Implications: Do not create, revise or approve wordmark, logo, monogram or lockup assets during this extension.
- Supersedes: None

## Decision: Canonical iconography direction
- Date: 2026-10-02
- Phase: Iconography extension
- Decision owner: User
- Status: selected
- Options presented: I1 Field Notes, I2 Cultivation Geometry, I3 Harvest Cut
- Selected approach: I1 Field Notes
- Rationale: Selected directly by the Design Decision Leader after reviewing the three comparable vector systems.
- Risks accepted: Controlled organic asymmetry requires optical review when new crop-specific glyphs are added.
- Implications: Field Notes becomes the canonical icon family: 24px grid, 1.75px optical stroke, square caps, rounded joins, open counters and crop-specific asymmetry. I2 and I3 remain documented alternatives only.
- Supersedes: Initial 1.75px icon hypothesis in Brand Identity Blueprint v1.0.0

## Decision: Homepage narrative and PDF delivery
- Date: 2026-10-02
- Phase: Synchronized delivery
- Decision owner: User
- Status: selected
- Options presented: H1 Harvest to Home, H2 Home and Kitchen, H3 Cultivation Journal; include or exclude the two design-delivery PDFs
- Selected approach: H1 Harvest to Home with both the homepage prototype PDF and Design Direction Manual PDF
- Rationale: The Design Decision Leader explicitly selected `H1 + PDFs` after reviewing the conversion logic and content trade-offs.
- Risks accepted: H1 requires credible harvest, cultivation, delivery and product information; the prototype must keep photography regions as empty bounded placeholders.
- Implications: Use a household-first sequence with restaurant supply secondary. Render the homepage prototype with mandatory Color Palette Approach #1 while retaining C2 Soil & Saffron as the canonical design system in the manual.
- Supersedes: None

## Decision: Continuous homepage prototype presentation
- Date: 2026-10-03
- Phase: Synchronized delivery revision
- Decision owner: User
- Status: selected
- Options presented: Existing section-by-section screen deck; one continuous homepage following the established John Wesley prototype approach
- Selected approach: Preserve the themed opening and closing presentation pages, and replace the internal section screens with one uninterrupted desktop homepage canvas. Keep the final prototype concise at three pages.
- Rationale: The Design Decision Leader requested a client-readable homepage design that can be understood as one integrated experience rather than a set of disconnected screens.
- Risks accepted: A long PDF page requires zoom for close reading, so the opening page explains the reading model and the closing page separately demonstrates responsive continuity and hidden interaction behavior.
- Implications: Page 2 is the complete desktop homepage from utility bar to footer; pages 1 and 3 retain the presentation theme. All intended media remains represented by bounded empty placeholders.
- Supersedes: The five-screen R1 homepage prototype presentation model; R1 remains archived for decision history.

## Decision: Direct use of current project imagery
- Date: 2026-10-03
- Phase: Synchronized delivery revision
- Decision owner: User
- Status: selected
- Options presented: Retain bounded media placeholders or use currently available project images directly in the prototype
- Selected approach: Use selected current project images directly in the R3 homepage prototype
- Rationale: The Design Decision Leader requested greater prototype credibility using resources already available in the project.
- Risks accepted: Prototype-use authorization does not independently establish ownership or production/public-reuse rights.
- Implications: Use visually reviewed, hash-matched project files; exclude visible-watermark candidates; label unconfirmed commercial and delivery data as illustrative; document or replace imagery before public release.
- Supersedes: The placeholder-only media treatment in R2

## Decision: Cross-project reuse permission
- Date: 2026-10-03
- Phase: Memory and archive
- Decision owner: User
- Status: selected
- Options presented: B1 project-private only; B2 reviewed-redacted structural reuse
- Selected approach: B2 reviewed-redacted structural reuse
- Rationale: The Design Decision Leader authorized reusable learning from the project while preserving client-specific material.
- Risks accepted: Reuse requires a deliberate redaction boundary and project-specific revalidation.
- Implications: Promote only generic structural patterns. Exclude WeGroween identity, copy, contact details, images, catalogue data, confidential material and client-specific decisions. The project release itself remains proposed pending a separate release-status decision.
- Supersedes: Default project-private reuse status
