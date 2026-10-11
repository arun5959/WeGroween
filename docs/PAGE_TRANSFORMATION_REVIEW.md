# Remaining-page frontend transformation

Reviewed: 11 October 2026. Source: working tree based on `b95b035` in `E:\WeGroween\WeGroween`.

The 32 remaining page types now follow the established Soil & Saffron design: cream surfaces, muted soil/terracotta, Fraunces headings, DM Sans labels and approved Field Notes icons. The existing home, story, supply and contact designs remain the reference.

## Delivered frontend scope

- Catalogue: supplied product images, 11 asset-backed product cards with sample prices and two purchase actions, image-led details, category return arrows, relevant related produce and shared filters for Mushrooms, Microgreens, Organic Harvest and Exotics. The latter two show themed empty range states.
- Commerce: shared populated DEV cart/drawer, quantities, removal, illustrative totals and a single bottom Proceed to checkout action. Checkout has delivery details, Online payment and Cash on delivery preferences. Quantity changes retain details and payment choice. Final order placement is disabled while delivery is paused.
- Identity: distinct customer entry, registration, recovery and staff entry designs with deliberately inactive fields while secure account services are unconnected.
- Account: populated first-render essentials and focused order details with a fulfilment timeline, delivery context and correct return link. Existing profile/address modals remain functional.
- Policies: readable editorial sections and compact navigation explain current preview behavior without invented operating promises.
- Administration: metrics, searchable/status-filtered tables, product create/edit, centered local record editors, reasoned inventory changes, order updates, enquiries, promotions, zones, illustrative reports/CSV export and business settings.

## Design and interaction consistency

Inputs use the approved search proportions: 44px desktop controls, warm surfaces, restrained borders and moderate label weight. Field gaps are compact; mobile input text is 16px. Textareas have a height limit with internal scrolling. Selects reuse the branded dropdown.

Editors reuse the account modal, with the cart's light blur and soil-colored shade. Escape, backdrop/cancel, tab containment, restored focus, internal scrolling and reduced motion are supported. Dropdowns remain in the dialog's native top layer. Saves finish their closing animation before refreshing the record.

Tables scroll within their own regions on small screens; administration navigation becomes a horizontal strip. Every reviewed route has one main region and one page heading. Existing header/search/cart and directional page transitions remain supported.

Checkout no longer creates a fictional or real order: the final button is disabled and the submit handler rejects attempts while delivery is paused. Existing fictional orders remain available for reviewing account and operations layouts. Admin status changes update local customer tracking. Order line prices and packs are snapshots, so later product edits do not change old line totals.

## Review routes

Development server: `http://127.0.0.1:5173`.

- [Shop](http://127.0.0.1:5173/shop)
- [Product and sample cart](http://127.0.0.1:5173/products/button-mushrooms)
- [Checkout](http://127.0.0.1:5173/checkout) — load a sample selection or add produce first.
- [Order tracking](http://127.0.0.1:5173/account/orders/SAMPLE-1042)
- [Customer entry](http://127.0.0.1:5173/sign-in)
- [Delivery information](http://127.0.0.1:5173/policies/delivery)
- [Operations overview](http://127.0.0.1:5173/admin)
- [Inventory](http://127.0.0.1:5173/admin/inventory)
- [Restaurant enquiries](http://127.0.0.1:5173/admin/restaurant-supply)
- [All page examples](http://127.0.0.1:5173/__foundation)

Known fictional records make the registry links usable. Unknown product, customer and order-detail IDs show a not-found view. An unknown confirmation reference explicitly demonstrates the layout without claiming a verified order.

## Scope still required for launch

Review records stay in tab memory and reset on reload. There is no database write, actual stock change, payment or real order placement. Illustrative packs/prices are not public offers. Production account, checkout and administrative routes continue to deny access. The earlier not-signed-in state remains in the guarded renderer; previewing a local account never grants actual access.

Authentication/verification/recovery responses, authorised persistent records, image upload, stock reservations, delivery validation, trusted payments and durable order operations remain service work. Richer operating modes also remain: business-account arrangements, promotion eligibility/dates/limits, delivery slots/cut-offs and refunds/exceptions. Final policies require business-approved terms matched to actual services.

See [PAGE_DEVELOPMENT_STATUS.md](PAGE_DEVELOPMENT_STATUS.md) for all 36 types and their dependencies.

## Verification

The development suite passed 33 checks: all 36 types plus product-create mode at 1440px/320px, sample shopping through tracking, combined table filters, escaped local records, stock reasons, product drafts, fulfilment, mobile editors, CSV download, settings/reset and existing account/modal behavior. The production suite passed 92 browser checks, including protected routes, shared navigation/search/cart, typography stability, responsive transitions and existing public pages.

Final validation: 12 unit checks, 33 development browser checks, 92 production browser checks and 3 static-hosting checks passed (140 checks total). The final build validates 36 page types / 37 route patterns and generates the public/static entries. A final live-server check confirmed port 5173 was listening and Shop returned HTTP 200. Screenshots were reviewed for product detail, identity, operations, checkout and mobile editor balance.

Representative screenshots: [reviews/page-transformation-2026-10-11](reviews/page-transformation-2026-10-11).
