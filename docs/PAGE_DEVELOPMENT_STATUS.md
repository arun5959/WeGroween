# Page development tracker

Updated: 11 October 2026. Active source: working tree based on commit 9a8a30b.
Inventory: [PAGE_MANIFEST.json](PAGE_MANIFEST.json). Review: [PAGE_TRANSFORMATION_REVIEW.md](PAGE_TRANSFORMATION_REVIEW.md).

**All 32 previously remaining page types now have purpose-specific frontend designs.** There are 36 frontend types available for review: 21 customer and 15 administration. No inventoried page remains just a generic coming-soon layout in development.

This counts frontend designs and local review interactions, **not production business readiness**. Authentication, shared database records, live purchasing, payment integration and approved operating policies remain to be connected or supplied. Local admin records now persist in browser storage. Protected production routes still deny access; identity fields collect no credentials.

| Area | Previously developed | Newly transformed | Frontend types for review | Total |
| --- | ---: | ---: | ---: | ---: |
| Customer | 4 | 17 | 21 | 21 |
| Administration | 0 | 15 | 15 | 15 |
| Total | 4 | 32 | 36 | 36 |

## Counting and status rules

- Existing: established frontend experience retained.
- Transformed: purpose-specific frontend implemented. Each row distinguishes public behavior, local fictional workflows and inactive identity designs.
- Dynamic preview: connected, validated local workflows with versioned browser persistence; production integration remains separate.
- Dynamic records, create/edit paths, popups, screen sizes and UI states do not increase the count. Header search replaces C04. The cart drawer belongs to C09. The 404 and separate review artifacts are outside the inventory.

## Customer pages

| ID | Page type | Review route | Frontend | Implemented scope / launch dependency |
| --- | --- | --- | --- | --- |
| C01 | Home | / | Existing | Editorial homepage, supplied imagery, navigation and responsive motion. |
| C02 | Shop | /shop | Transformed | Compact intro and Category selector; Our selections contains Fresh discoveries (4) and Kitchen favourites (7). All products provides one global sort. Four-column desktop, two-column tablet, manually scrolled mobile shelves. All 11 records retain sample prices and distinct product-detail / purchase actions. Confirmed range and availability remain. |
| C03 | Category listing | /shop/category/mushrooms | Transformed | Shared Shop results grid: Mushrooms (6), Microgreens (5), Organic Harvest and Exotics (Coming soon). One sort covers the selected category. In-place changes preserve focus; category paths and view/sort queries recover on reload/history. Actual published range and availability remain. |
| C05 | Product detail | /products/button-mushrooms | Transformed | Image-led detail, category return, context and related products; DEV pack/quantity/cart selection. Public ordering stays unavailable. |
| C06 | Our Story | /our-farm | Existing | Approved five-chapter story, illustrations, navigation and motion. |
| C07 | Restaurant Supply | /restaurant-supply | Existing | Supplied photos, validated enquiry email draft and FAQs. Direct submission would require a backend. |
| C08 | Contact | /help | Existing | Direct contacts, validated email draft and animated FAQs. |
| C09 | Cart | /cart | Transformed | DEV populated drawer/page, quantities, removal and illustrative totals. One primary Proceed to checkout link stays in the drawer footer; empty carts disable it. Resets on reload; production retains ordering-closed empty state. |
| C10 | Checkout | /checkout | Transformed | DEV delivery details and Online payment / Cash on delivery preferences. Quantity changes retain details and payment choice. Place order is disabled and submission is blocked while deliveries are unavailable. Real quotes, stock, coverage and payment integration remain. |
| C11 | Order confirmation | /orders/SAMPLE-1042/confirmation | Transformed | DEV confirmation-layout preview with reference, recipient, delivery summary and next steps. Checkout cannot create orders while delivery is paused; no verified payment/order response. |
| C12 | Sign in | /sign-in | Transformed | Branded customer entry with inactive fields. Secure authentication and redirect behavior remain. |
| C13 | Register | /register | Transformed | Branded account-creation entry with inactive fields. Account creation, verification and service responses remain. |
| C14 | Password recovery | /recover-password | Transformed | Branded recovery entry with inactive fields. Recovery request, reset-token and new-password states require the identity service. |
| C15 | Profile | /account | Transformed | Assumed signed-in localhost/Pages preview dashboard, populated initial essentials and local centered profile editor. Real identity/profile persistence remains. |
| C16 | Saved addresses | /account/addresses | Transformed | Localhost/Pages preview create/edit/remove/default address flows in centered editors. Authorised persistent storage remains. |
| C17 | Order history | /account/orders | Transformed | Fictional history with item/address/total disclosures and detail links. Actual owned-order history remains. |
| C18 | Order detail and tracking | /account/orders/SAMPLE-1042 | Transformed | Focused sample order, leading return, fulfilment timeline and support. Local admin updates reach this tracking view. Real owned-order data remain. |
| C19 | Delivery policy | /policies/delivery | Transformed | Editorial policy navigation and factual preview content. Approved coverage, fees, slots and service rules remain. |
| C20 | Returns and refunds | /policies/returns | Transformed | Purpose-specific issue/support content. Approved perishable-produce cancellation, returns and refund rules remain. |
| C21 | Privacy policy | /policies/privacy | Transformed | Current email-draft and local preview behavior explained. Final policy must match actual services. |
| C22 | Terms | /policies/terms | Transformed | Current catalogue/enquiry scope and terms layout. Approved purchasing/service terms remain. |

## Administration

Administrative workflows are fictional previews available locally and through the explicit Vercel operations-preview build. A02–A15 now share validated operations, browser persistence, activity records, search/sort/pagination and selected-record actions where applicable. Staff authentication and private backend access remain unconnected; the published preview edits only browser-local sample records. See [the implementation plan](ADMIN_DYNAMIC_PLAN.md) and [verification](reviews/admin-dynamic-2026-10-11/VERIFICATION.md).

| ID | Page type | Review route | Frontend | Implemented scope / launch dependency |
| --- | --- | --- | --- | --- |
| A01 | Admin sign in | /admin/sign-in | Transformed | Branded staff entry with inactive fields. Authentication, membership, MFA and permissions remain. |
| A02 | Overview | /admin | Dynamic preview | Actionable queue metrics, period reporting, ledger chart, low-stock alerts, kitchen follow-ups and activity. Real authorised data remain. |
| A03 | Orders | /admin/orders | Dynamic preview | Search/status/sort/pagination with reloadable URL state; selected preparing orders can advance to Ready. Authorised server querying remains. |
| A04 | Order detail | /admin/orders/SAMPLE-1042 | Dynamic preview | Saved next-stage fulfilment, cancellation reason, internal notes/history, immutable purchased packs/prices and linked sample tracking. Real exceptions/refunds remain. |
| A05 | Products | /admin/products | Dynamic preview | Category/status/search/sort/pagination and selected publishing/draft/archive actions. Preview catalogue remains separate from public catalogue. |
| A06 | Product editor | /admin/products/button-mushrooms/edit | Dynamic preview | Saved create/edit with approved photographs and live preview, description, category, pack, decimal price, stock and state; changed stock requires a reason. Also /admin/products/new. Real media uploads/publication remain. |
| A07 | Categories | /admin/categories | Dynamic preview | Saved centered category editors, unique names, display positions and linked product counts. Public ordering/publication remain separate. |
| A08 | Inventory | /admin/inventory | Dynamic preview | Reasoned saved stock adjustments, threshold summaries, sortable stock table and before/after movement notebook. Server transactions/reservations remain. |
| A09 | Customers | /admin/customers | Dynamic preview | Saved customer creation/editing, searchable/paged records and selected active/inactive changes. Authorised customer storage remains. |
| A10 | Customer detail | /admin/customers/sample-customer | Dynamic preview | Contact/service notes, linked customer orders and values, saved modal editing. Permission-checked records remain. |
| A11 | Restaurant enquiries and accounts | /admin/restaurant-supply | Dynamic preview | Saved kitchen creation/editing, follow-up dates, conversation notes/stages and overview summaries. Real enquiry capture and business terms remain. |
| A12 | Promotions | /admin/promotions | Dynamic preview | Saved unique codes, dates, validated percentages/minimum values and state actions. Preview offers do not alter storefront pricing; real eligibility/usage remain. |
| A13 | Delivery settings | /admin/delivery | Dynamic preview | Saved zone/PIN uniqueness, fee/minimum/cut-off validation and state actions. Actual coverage/capacity remain; delivery stays closed. |
| A14 | Reports | /admin/reports | Dynamic preview | Period/stage-filtered ledger, consistent totals/averages/daily bars/item quantities and exact search-filtered CSV with formula protection. Real permission-checked reporting remains. |
| A15 | General settings | /admin/settings | Dynamic preview | Saved business contacts, stock-alert threshold and activity preference; confirmed preview reset with storage recovery warnings. Staff access and real integrations remain. |

## Remaining launch work

1. Confirm catalogue records, packs, prices, media rights, stock and purchasing availability.
2. Connect secure customer/staff identity, owner checks, roles and persistence.
3. Connect cart sessions, stock reservations, delivery validation, trusted checkout/payment verification and the order lifecycle.
4. Confirm delivery/cancellation/returns/refunds/purchasing rules and final policies against actual services.
5. Connect authorised administration and extend the remaining operating modes: business-account arrangements, promotion rules, delivery slots and exception/refund handling.

The frontend transformation does not reduce these operating dependencies to a zero-page launch backlog.

## Verification and history

The earlier audit found 4 developed, 8 partial and 24 foundation types. This work transforms the frontend designs of those 32 remaining types. All 36 types plus product-create mode were checked at 1440px and 320px. See the review document for workflow and production-boundary verification.

The 11 October admin upgrade adds dynamic preview functionality to A02–A15 without increasing the page count. Domain, persistence, browser workflows, responsive layouts and protected production/Pages boundaries are verified in the linked admin review.
