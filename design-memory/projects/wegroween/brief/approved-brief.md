# Approved Design System Brief

## Administrative
- Project: WeGroween
- Client: WeGroween
- Design Decision Leader: User
- Additional approvers: None identified
- Delegated decision scope: Routine implementation and objective quality corrections
- Mode: REFRESH
- Version: 1.0
- Date: 2026-10-02
- Status: approved

## Product understanding
- Product: Premium farm-and-food commerce brand
- Maturity: Existing static catalogue informing a refreshed, implementation-ready design system
- Core offer: Microgreens, mushrooms, organic vegetables and fruits, and exotic farming-related products
- Value proposition: Premium fresh products cultivated and selected with care, authenticity, and credible farm knowledge
- Business model: Household e-commerce with restaurant supply also available

## Users
- Primary audience: Quality-conscious households and home cooks
- Secondary audience: Restaurants, chefs, caterers, and hospitality buyers
- Jobs to be done: Discover trustworthy specialty produce, understand quality and provenance, order conveniently, and manage repeat purchasing
- Trust and accessibility considerations: Freshness, provenance, cultivation practices, delivery clarity, price transparency, readable content, keyboard operation, reduced motion, and WCAG 2.2 AA contrast

## Future product context
- Archetype: E-commerce storefront plus authenticated operations dashboard; implementation is outside the current scope
- Primary conversion: Complete an online purchase
- Secondary conversions: Restaurant-supply enquiry/account onboarding, repeat ordering, WhatsApp support, and product discovery
- Required customer surfaces: Homepage, catalogue, category and search, product detail, cart, checkout, account, order history, restaurant supply, about/provenance, support, and policies
- Required admin surfaces: Sign-in, overview, orders, order detail, products, categories, inventory, customers, restaurant enquiries/accounts, promotions, delivery settings, and basic reporting
- Content status: Existing mushroom and microgreen content is a starting point; organic produce, fruit, exotic-product, provenance, and restaurant content are draft or unavailable

## Brand intent
- Brand-name idea: WeGroween combines “we grow green”
- Desired attributes: Premium, authentic, cultivated, fresh, knowledgeable, warm, trustworthy
- Anti-attributes: Generic eco branding, bargain-market styling, artificial luxury, clinical sterility, decorative green clichés, and unsubstantiated wellness claims
- Emotional objective: Quiet confidence in unusually fresh, carefully grown food
- Tone: Knowledgeable, transparent, sensory, and warm; never inflated or medicinal
- Existing assets: Script wordmark, earthy brown/clay/sage palette, product photography, static HTML catalogue, and prior UI board
- Competitors or territories to avoid: Any direct imitation of competitor layouts, copy, identity, or distinctive photography

## Technical and scale context
- Current stack: Static HTML using Tailwind browser CDN, Font Awesome, and AOS
- Future target stack: Semantic HTML, compiled Tailwind CSS, modular JavaScript, Supabase (Postgres, Auth, Storage and Edge Functions), and Razorpay
- Browser/device requirements: Mobile-first responsive experience, current evergreen browsers
- Themes/locales/brands: English-first and single-brand initially; architecture should not prevent later localization
- Performance requirements: Product imagery must be optimized; core shopping routes should remain fast on mobile networks
- Governance: `design-tokens.json` will be the visual source of truth
- Security boundary: Razorpay order creation and signature/webhook verification must run in trusted Supabase Edge Functions; service-role and payment secrets must never be shipped to the browser
- Local learning-resources root: `E:\WeGroween\Resources`
- Project design-system root: `E:\WeGroween\GitHub Clone\WeGroween\design-system`
- Confidentiality and cross-project reuse: Project-private; no promotion without explicit approval

## Required deliverables
- Brand Identity Blueprint
- Three creative territories, three complete palette approaches, and two typography combinations
- Design-system documentation and machine-readable tokens
- Interactive design-system artifact
- Component and pattern specifications for future household commerce and restaurant-supply experiences
- Accessibility validation and versioned delivery snapshot

## Research questions
1. Which trust and provenance patterns make premium fresh-produce commerce credible to households without feeling clinical?
2. How should household shopping and restaurant supply coexist without creating a confusing navigation or value proposition?
3. Which catalogue, freshness, availability, delivery, substitution, and repeat-order patterns are essential for perishable goods?
4. Which visual territory can express premium authenticity while remaining distinct from generic beige-and-sage organic brands?
5. Which component contracts and governance rules will let future storefront and admin implementation remain coherent and accessible?

## Exclusions
- Medical or nutritional claims without substantiation
- A multi-vendor marketplace in the first release
- Cross-project publication of project-specific research or assets
- Copying competitor identity, layout, wording, or protected media

## Assumptions accepted for research
- Initial market: India
- Primary language: English
- Primary customer: Premium household shopper
- Secondary customer: Restaurant or hospitality buyer
- Online checkout is the primary order route; WhatsApp remains a support option
- Exact payment, fulfilment geography, delivery rules, tax configuration, and production hosting remain future implementation inputs

## Success criteria
- The brand feels premium and authentic without relying on generic luxury or eco conventions
- Future household flows are clearly supported by reusable, responsive component specifications
- Restaurant-supply and operations contexts are represented without overtaking the household-first identity
- The system is accessible, maintainable, and governed by reusable tokens and documented decisions
- The design system can be evaluated independently of a working application
