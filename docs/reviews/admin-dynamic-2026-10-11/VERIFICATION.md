# Dynamic admin verification

Date: 11 October 2026. Checkout: E:\WeGroween\WeGroween, working tree based on 9a8a30b. Review address: http://127.0.0.1:5173/admin. Implementation scope is [the planned browser operations preview](../../ADMIN_DYNAMIC_PLAN.md), A02–A15.

## Functional evidence

- 27 unit checks passed, including atomic invalid/bulk mutations, allowed order stages, cancellation reasons, preserved purchased snapshots, reasoned stock, valid promotion/date/PIN rules, closed ordering, reporting arithmetic, safe queries/CSV and storage recovery.
- All 13 new browser checks passed: actionable queues; combined filters/sort/page after reload; bulk fulfilment and connected counts; cancellation notes; stock movements and alert thresholds; approved live photographs/decimal prices; saved category/customer records and owned-order context; follow-ups; promotion/delivery rejection and recovery; period reports and exact filtered CSV; settings/reset; 320px keyboard/focus/history cleanup in both motion modes; corrupt/unavailable storage and successful recovery.
- All 16 existing transformed-page checks passed across the initial run and targeted corrections. Assertions were updated for intentionally saved records, expanded fixtures, category ordering and scoped notebook messages. Each direct route now uses a fresh browser page to avoid a Windows browser worker/navigation crash observed during long reused-page loops. Cart/payment restrictions and preserved delivery details passed unchanged.
- Three selected production checks passed: default account protection, every direct route/shell without runtime errors, and HTTP denial/404/redirect boundaries.
- Four Pages checks passed with WEGROWEEN_BASE_PATH=/WeGroween/ and VITE_ACCOUNT_PREVIEW=true: mounted navigation/search/cart/history, direct/static routes and denied access, no-JavaScript mobile pages, and published account first paint/reload/editing. Staff routes remain denied.
- Production build and route/asset validation passed. Inventory remains 36 frontend page types / 37 route patterns; this work adds behavior without inflating page count.

## Responsive and visual evidence

[Measured observations](review-observations.json) contain 60 route/viewport results: all 14 operations screen types plus the second product editor mode, each at 1440, 768, 390 and 320px. Every result rendered status 200 without document overflow; browser errors were empty. Tables and chart series scroll within their own containers when needed.

The screenshots were inspected for typography, hierarchy, field density, approved photos, softened brand colours, table layout, centred modal fit and the light blurred soil backdrop. Controls retain 44px targets. Dropdowns, modal focus return, Escape and reduced motion were exercised through browser workflows.

- [Desktop dashboard](dashboard-1440.png)
- [Mobile dashboard](dashboard-390.png)
- [Product editor](product-editor.png)
- [Order detail](order-detail.png)
- [Reports](reports.png)
- [Mobile stock editor](stock-editor-390.png)

## Reproduce

```powershell
npm.cmd test
npm.cmd run build
npx.cmd playwright test --config playwright.account.config.js operations-dynamic.spec.js transformed-pages.spec.js
npx.cmd playwright test account-boundary.spec.js foundation.spec.js --grep "production does not expose|all current direct links|HTTP denies protected"
```

For the Pages compatibility build, set WEGROWEEN_BASE_PATH=/WeGroween/ and VITE_ACCOUNT_PREVIEW=true before building and running npm.cmd run test:pages. These are process-local build settings; the localhost admin review stays development-only.

## Operating limits

Preview records persist in this browser only, under wegroween.operations.preview.v1. Settings → Reset preview data restores the original records after confirmation. Shared multi-user persistence and conflict resolution are not connected. Basket and customer profile/address edits remain separate previews. Reports exclude cancelled orders from monetary/item totals and anchor periods at the newest fictional order date. CSV uses all matching rows, across pagination, and escapes spreadsheet formula prefixes.

No staff authentication, server-authorised data changes, outbound enquiry messaging, real promotion evaluation, delivery coverage, order placement, payment capture or refund operation is enabled. Publishing inside the admin preview changes the preview catalogue only. Real infrastructure dependencies remain in SYSTEM_ARCHITECTURE.md. No GitHub push or deployment was performed for this upgrade.
