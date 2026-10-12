# Dynamic WeGroween operations plan

Date: 11 October 2026. Scope: all 14 operations screens (A02–A15); staff sign-in remains inactive until verified authentication exists. Build within the existing brand and route system, without inventing live stock, revenue, delivery or staff access.

## Audit

Existing overview metrics come from two fictional orders but are not actionable. Reports use a hard-coded unrelated chart. Record editors exist, but changes reset on reload. Tables lack sort, pagination, selected-record actions and recoverable URL state. Stock and publishing actions need domain validation and an audit trail. Customer details and kitchen enquiries need connected order/conversation context. Preview/public boundaries must stay explicit.

## Execution sequence and acceptance

1. **Shared operations model.** Add validated commands, stable record IDs, allowed fulfilment transitions, reasoned inventory adjustments and append-only activity. Persist only preview operations collections in versioned browser storage; handle corrupt/unavailable storage. Preserve public access checks and keep ordering closed. Add an explicit reset of preview data.
2. **Tables and navigation.** Search, status filters, sort, pagination, visible-row selection, selected-record actions and filtered CSV export. Preserve filters/page on reload and refresh with URL query state. Provide useful zero-results feedback, readable row links, mobile navigation and sidebar queue counts.
3. **Dashboard.** Actionable overview metrics, a date range, a data-derived order chart, fulfilment queue, low-stock alerts, kitchen follow-ups and recent activity. Changes in any module update these summaries and counts. No unrelated fictional chart series.
4. **Catalogue and inventory.** Product create/edit with approved image selection and immediate preview; category editing and ordered display; valid prices, packs and stock. Bulk publishing/archive controls, stock thresholds and a reasoned movement notebook. Product edits may not silently rewrite stock without a movement reason.
5. **Orders and people.** Valid next-step fulfilment, cancellation reason, immutable purchased line snapshots, internal order notes and history; customer create/edit and linked order history; enquiry create/edit, follow-up dates and stage changes. No outbound messages or simulated payment capture.
6. **Offers, delivery and settings.** Promotion codes, dates, percentage/minimum-order validation; zone/PIN/fee validation; local business preferences and low-stock threshold; preview reset through the existing centred confirmation pattern. Store settings cannot enable actual delivery or grant staff permissions.
7. **Reports.** Period and status controls drive the same order totals, average, delivered share, item quantities and daily bars. Export precisely the filtered ledger and protect spreadsheet cells from formula execution.
8. **Verification.** Unit checks for transitions, invalid inputs, immutable order snapshots, reporting arithmetic, filtered queries and storage recovery. Browser checks for each mutation, persistence, cross-module updates, dialogs, rapid navigation, reduced motion, keyboard operation, empty states and 320/390/768/1440px overflow. Production and Pages checks must continue denying staff access.

## Brand treatment

Use existing Soil & Saffron variables, Fraunces headings and DM Sans controls. Muted state tints, light borders and small thumbnails keep the operational interface calm. Standard 220ms motion and 44px actions; centred editors use the existing light blur and soil backdrop. Tables scroll inside their container on small screens. Copy follows harvest, kitchen and fulfilment vocabulary while remaining precise for operational decisions.

## Delivery boundary

The completed feature is a functional, persistent browser operations preview on localhost. Real Supabase Auth/RLS, shared database persistence, verified payment/refund operations and live delivery remain separate infrastructure work in SYSTEM_ARCHITECTURE.md. No deployment or GitHub push is included in this request.

## Completion — 11 October 2026

All eight steps above are implemented and verified for the stated localhost preview scope. A02–A15 now share one validated operations model, versioned browser records and activity notebook. Domain validation preserves purchased names, packs and prices; stock changes require reasons; delivered/cancelled fulfilment remains closed to further transitions. Approved photographs can be selected, previewed or removed from drafts.

Tables combine URL-recoverable filtering, sort and pagination; bulk actions validate the entire selection before mutation. Overview, inventory alerts, order history and period reports use the same records. Promotions, zones and workspace settings persist, and reset uses a centred confirmation. Storage failures remain usable with an explicit warning.

Verification passed: 27 unit checks, all 13 new admin workflow checks, the 16 existing transformed-page checks after updating intentional persistence/fixture expectations, 3 selected production-boundary checks and 4 Pages checks. All 14 operations screen types, including both product editor modes, fit 320/390/768/1440px with no browser errors. Desktop/mobile screenshots and measured observations are in [the verification record](reviews/admin-dynamic-2026-10-11/VERIFICATION.md).

Backend integration, verified staff identities, shared database writes, actual stock reservation, payment/refund processing and live delivery remain outside this preview implementation. No new deployment has been performed.

## Publishing extension — 12 October 2026

The user subsequently requested removal of the Vercel restriction and publication of this editable sample operations interface. The Vercel target now explicitly enables the fictional operations preview, including browser persistence and editor functionality. Standard builds preserve the previous guard. This later publishing authorization supersedes the original local-only delivery scope; real authentication, shared backend records and live ordering remain separate.
