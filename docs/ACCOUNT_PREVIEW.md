# Account workspace — Directions 1 + 2

Review: http://127.0.0.1:5173/account

Direction 1 supplies the welcome, latest-order overview, recent produce and default address. Direction 2 supplies the compact sidebar, ruled information rows and modest headings. As of 11 October 2026, profile and address editors open in a centred modal instead of expanding inline. Existing fonts, Soil & Saffron tokens, Field Notes icons and shared interruptible motion are reused.

## Review features

- Overview, orders, addresses and profile, with responsive navigation.
- Two fictional delivered orders and illustrated totals. Order details include immutable address snapshots and links to existing catalogue products.
- Profile edit/save/cancel with required name/email and optional ten-digit phone validation.
- Address add/edit/remove, one default address, and an empty state.
- Reset sample data. Updates stay in module memory for this tab and reset on full reload; there is no storage, request, authentication or order submission.
- Smooth panel height changes, disclosure expansion and centred editor opening, with keyboard focus and reduced-motion support.

## Centred account editors

“Edit details” in the overview or Profile, address “Edit,” and “Add an address” open a labelled native modal dialog. Current values are prefilled; new addresses start with an empty label/address and the current profile's recipient name. The existing save/cancel and validation behavior remains local to the preview.

The modal is centred against the full viewport. Its backdrop shares the cart's warm 36% shade and 2px blur; the form remains sharp. It enters with a subtle 220ms fade/lift and exits in 160ms, settling immediately for reduced motion. The body locks while open; on short screens the modal's form scrolls internally while the title and close button remain visible. Controls retain the approved 44px cream treatment, 14px desktop type and 16px mobile input type.

Escape, Cancel, close icon and a deliberate backdrop click discard unsaved changes. Focus stays inside the popup and returns to the invoking edit action after closing. Background navigation/search/cart remain inert until it closes. Route disposal and browser history close the modal, release the scroll lock and remove listeners and animations.

As of 10 October 2026, local development `/account` opens this workspace directly, assuming a signed-in user for design review. `/account/addresses` and `/account/orders` select their corresponding views; a known sample order URL opens that order. The two competing sign-in/sample-account entry actions are removed. The sample-data disclosure and reset sit beneath the workspace as secondary utilities. Edits remain temporary and use only fictional data.

Production `/account*` still deny access with status 403 until real authentication is connected; `/__account-preview` resolves to not-found. The isolated development preview URL remains as a review alias. No credentials, payments or customer records are connected.

### Previous signed-out state (preserved for authentication work)

Before this change, local `/account` rendered the account sidebar (Profile, Orders, Addresses), the heading “Profile,” and a “Sign-in required” notice: “Your personal information and orders require account access. Sign-in is not open yet.” It showed a primary “Go to sign in” link to `/sign-in?returnTo=%2Faccount`, a secondary “Explore the catalogue” link to `/shop`, and a separate development-only primary “Explore the sample account” link to `/__account-preview`. That last action competed with sign-in and broke the hierarchy. The guard renderer is retained in `src/pages/scaffold.js`; production still uses it. On authentication integration, restore a clear signed-out entry with one primary sign-in action and a secondary catalogue link, without the separate sample-account action.

## Verification

Run `npm test`, `npm run build`, and `npx playwright test --config playwright.account.config.js`. The account suite uses its own development server on 4184; it does not stop the user's server on 5173. Production foundation checks run against the build on 4173.

Verified on 2026-10-10: build passed; nine unit checks, ten account browser checks, 21 foundation/cart/navigation regression checks and one production-boundary browser check passed. Five viewport widths were checked (320, 390, 720, 1024 and 1440). Review screenshots and the result record are in `docs/verification/account-preview.json`. Opening an editor smoothly brings its focused input into view using the existing scroll controller.

Verified on 2026-10-11 after the modal migration: build and 12 unit checks passed; all 15 account browser checks and five cart/production-boundary checks passed. Modal geometry and screenshots cover 1440×900, 390×844 and 320×480 in [the modal verification record](verification/account-editor-modal.json). Checks cover viewport centring, shared blur/shade, retained page position, focus containment/restoration, validation, save/cancel, internal scrolling, reduced motion and browser-history cleanup. The previous inline-editor scroll behavior has been replaced by focus inside the centred popup.
