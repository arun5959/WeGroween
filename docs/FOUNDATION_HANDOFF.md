# WeGroween phase-1 foundation

6 October 2026 | Actual checkout: `E:\WeGroween\WeGroween`

## Implemented

- Pinned Vite 8.3.3, Tailwind 4.3.3, its Vite plugin, Playwright 1.63.0 and Lenis 1.3.26, with a lockfile and Node 22.12+ requirement.
- A runtime registry derived from the existing `PAGE_MANIFEST.json`: 37 page types and 38 route patterns (product create/edit modes share a type).
- Five reusable shells: storefront, checkout, identity, account and admin. Restricted shell previews contain access-denied messaging only, with no customer/staff records.
- Existing `design-system/tokens.css`, Fraunces and DM Sans consumed without editing canonical design inputs. Website images now use the updated supplied assets in `public/media`, mapped in `src/content/media.js`. Asset preparation validates those files and creates missing local font files without overwriting public assets.
- Shared escaped markup, links/buttons, field labels/help/error state, notices, navigation, focusable main landmarks, skip links and mobile menus.
- Working local homepage/category navigation and two product examples. These are composition examples; catalogue enrichment and final homepage content belong to phase 2.
- Client navigation, browser back/forward, focus restoration, URL-backed search query, empty cart, placeholder informational/policy pages and proper not-found views.
- All account, checkout, order and staff-data routes deny access. Authentication forms are disabled; the preview does not collect credentials or call a backend.
- Development-only `/__foundation` registry and primitive review. It returns not-found in the production preview.
- A reusable public HTML generator: 14 concrete public routes, `404.html`, client app shell and prerender manifest. Generated pages contain useful headings, content and image URLs without JavaScript. All previews remain `noindex, nofollow`.
- Vite development/preview middleware: route-specific HTML, HTTP 403 for protected access, HTTP 404 for unknown/unpublished records and 301 redirects for legacy categories.
- Native unit checks, a manifest validator and Playwright browser checks. No production release has been performed.

## What remains

The 37 types are wired foundation scaffolds, not 37 finished business pages. Supabase tables/RLS/Auth, real permissions, cart contents, live catalogue/search, stock, delivery eligibility, checkout, Razorpay, notifications and admin actions are not connected. Inputs for launch products, prices, delivery rules, guest checkout, operating policies, public asset rights and hosting remain open.

The route access guard deliberately denies everything protected; it is not a substitute for the server/RLS ownership checks planned for later phases. Public example records are the existing Button mushrooms and Radish microgreens, with no invented pack, price, stock or purchase availability. Restaurant/supplier claims and legal policies are not fabricated.

## Commands

```powershell
Set-Location -LiteralPath 'E:\WeGroween\WeGroween'
npm.cmd ci
npm.cmd run dev
```

Development: `http://127.0.0.1:5173`. Review: `http://127.0.0.1:5173/__foundation`.

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run preview
```

Production-format local preview: `http://127.0.0.1:4173`. Playwright uses cached Chromium revision 1243 in this session; on another machine install its matching browser before running end-to-end checks. `npm.cmd run check` runs the combined checks.

## Verification scope

Final local check passed on 6 October 2026: **5 unit tests, 6 browser tests, manifest validation and the production build**. All 37 route types fit at 390px and 320px in the browser checks. Desktop/mobile homepage and denied-admin screenshots were visually reviewed. Fraunces and DM Sans loaded from local files, the development registry exposed exactly 37 entries, and the inspection recorded no runtime errors. Evidence: `verification/foundation-qa.json` and the three `verification/foundation-*.png` screenshots.

Updated-media check on 6 October 2026: all six mapped images loaded on their homepage/category/product pages; the public-page test without JavaScript and the production build passed. All 17 supplied PNG originals match the built copies byte-for-byte. Updated desktop/mobile screenshots were reviewed at `verification/updated-media-home-desktop.png` and `verification/updated-media-home-mobile.png`. The original foundation test results above remain the earlier baseline run.

Interface cleanup on 6 October 2026: removed the hero image caption and numbered Catalogue labels; category cards use the approved mushroom, microgreens and cloche glyphs. Action links use the same family's arrow-right glyph. `src/components/icons.js` consumes the canonical Field Notes sprite, prepared at `public/icons/field-notes.svg` and copied into the build. The sprite matches the design-system source byte-for-byte. Build, navigation/public rendering checks, rendered SVG geometry and mobile overflow checks passed. Reviewed images: `verification/category-custom-icons.png` and `verification/home-cleanup-*.png`.

Site-wide smooth scrolling added on 6 October 2026 through `src/app/scroll.js`, using pinned Lenis and its recommended stylesheet. The shared controller smooths wheel input and route-to-top movement, handles same-page fragment links without losing URL/focus behaviour, preserves native touch scrolling, and tears down when reduced motion is requested. It refreshes dimensions after route rendering and cleans up for page lifecycle/hot reload. The production build and all **9 browser tests** passed, including three new wheel/fragment/reduced-motion cases. The setup follows the [Lenis documentation](https://github.com/darkroomengineering/lenis).

The manifest validator checks counts, unique route patterns, renderer coverage, five shells, one main landmark/heading per page and absence of placeholder `href="#"` links. Unit checks exercise route matching, invalid path handling, unpublished example records, access denial, safe return destinations and HTML escaping.

Browser checks visit all 37 types, verify protected-state denial, test history/focus, check every route for horizontal overflow at 390px and 320px, exercise mobile-menu Escape, load generated public routes without JavaScript, verify image loads, exercise escaped search queries and verify HTTP denial/not-found/legacy redirect responses. These tests do not claim full accessibility certification or working commerce.

## Repository and rollout

Root `index.html` is the application HTML entry. Runtime code lives in `src/`, tooling in `scripts/`, and checks in `tests/`. The source manifest remains in `docs/`; no duplicated route list is maintained. Supplied `public/media` images are source assets and are included in version control. `public/fonts` is prepared from canonical font files if missing and ignored by Git. Build outputs and secrets are ignored.

The previous homepage is preserved byte-for-byte at `legacy/pre-foundation/index.html`, SHA-256 `6F2205CBD4A0800B60CD3868BAB53DFB83290B73B949DEDA4911BC6B78CB62AA`. To roll back the homepage entry only, copy that file over root `index.html`; category sources and root product photographs were not changed. This is a source rollback, not a deployed-site rollback.

The static build requires host configuration when deployed: serve generated public pages and their assets directly; valid client routes use `app-shell.html`; unknown routes use `404.html` with HTTP 404; apply legacy redirects. Vite's local middleware is not automatically deployed to a CDN. A real backend must enforce protected operations regardless of frontend routing. Launch must wait for hosting rules, public rights, operational data and commerce checks; this session only provides a local foundation.

## Next implementation stage

Extend the existing foundation into the full reviewed catalogue: complete the approved H1 homepage composition, product/category dataset, pack variants, product detail and real cart interactions using explicit local fixtures first. Preserve manifest-derived routes and shared layouts. Backend integrations follow their architecture dependencies rather than being implied by sample UI.
