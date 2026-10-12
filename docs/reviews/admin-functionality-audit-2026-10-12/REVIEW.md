# Admin functionality audit

Date: 12 October 2026. Scope: the editable fictional operations dashboard, A02–A15.

## Reproduced failures and fixes

| Failure | Fix | Evidence |
| --- | --- | --- |
| Correcting an invalid photograph/select left its custom validation error active, blocking further saves. Related-field corrections could also leave obsolete errors. | Clear custom form errors on input/change, revalidate on submission, and focus the visible dropdown trigger for select errors. | Product publication recovery and related date-window recovery checks. |
| Delivery fees, minimum values and discount percentages rejected otherwise valid decimals. | Match numeric control steps to the permitted monetary/percentage precision. | Decimal zone and promotion save/reload checks. |
| Reports showed totals/chart/item quantities for a broader set than their searched/status-filtered CSV ledger. | Apply period, reporting stage, table stage and search consistently to totals, chart and quantities. Pagination affects display only; all matching rows are included. | Search, combined-stage, clear-filter and reload checks plus arithmetic unit cases. |
| Creating a category named All categories hijacked the default product filter; name-based bookmarks broke after renaming. | Store category IDs as option values and query values. Normalise legacy name-based links to IDs on load. | Reserved-label, rename and legacy-bookmark checks. |
| Stock reason textarea accepted 1200 characters but the model silently retained only 160. | Preserve the permitted full reason and validate the complete notebook message on reload. | Full 1200-character reason round-trip. |
| Repeated submissions during modal closing could add duplicate customer records. | Guard pending submissions and selected-record actions, disable submit while saving, and retain the guard until refresh/navigation completes. | Repeated requestSubmit regression in normal animation mode. |
| Tabs stayed stale and could overwrite other records or save an obsolete editor over newer details. | Refresh browser records on storage events and before mutations; serialise writers with Web Locks where available; compare canonical record snapshots before saving. Keep drafts and reject conflicts, while merging unrelated changes. | Two-tab synchronisation, conflict/draft preservation and unrelated-record merge checks. |

Additional hardening keeps record creation within the existing 2000-record storage limit and retains the latest 5000 inventory movements. Canonical record fingerprints remain stable across reloads, including drafts without photographs. Existing preview data stays on storage schema version 1; no reset is required for this release.

## Validation

Seven initial regression cases failed against the preceding production build, confirming the failures before implementation. After correction, 34 unit checks and all 23 production-build admin workflow checks passed (the original 13 workflows plus ten audit/edge cases). The Vercel build passed route, asset and initial-HTML validation. All five root static-host compatibility checks also passed. Dropdown focus remains on the visible control after report updates; when a refreshed record disappears from the current filter, focus returns to the page heading. Live publication is verified separately.

## Preview boundaries

Operations records remain fictional and browser-local. This work improves those workflows without introducing authenticated backend access, shared server persistence, live order placement, payment capture or outbound messaging. Multi-tab checks used separate pages on the same origin; cross-device synchronisation remains backend work. Web Locks provide writer serialisation on supporting secure browsers, with refresh/conflict checks retained as the fallback.
