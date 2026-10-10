# Expanding header search — interaction review

Prepared 10 October 2026 as the interaction specification. Implementation subsequently authorized; see [the implementation record](HEADER_SEARCH.md) for delivered behavior and remaining work.

## Assessment

This is a strong direction for WeGroween's current, compact catalogue. Search becomes an immediate part of the header and preserves the visitor's page, reading position and unsaved work. The same-width results panel gives the interaction a clear visual boundary. Its success depends on predictable keyboard behavior, stable header geometry and useful results rather than the expansion animation alone.

The main tradeoff is discoverability of navigation while search is open. The second is catalogue growth: a small panel needs a way to explore more matches without becoming a long, dense list. Neither requires a separate search page.

## Current implementation and constraints

- Header search currently links to `/search` on desktop and mobile, including within the mobile menu.
- The search page is a placeholder: submitting shows a preparation notice and echoes the query rather than matching products.
- The current public product data contains two records: Button mushrooms and Radish microgreens. Category data contains Mushrooms, Microgreens and Pairings. Broader category copy is not evidence of additional searchable product records.
- The desktop header has a logo, four central navigation links, and Search/Account/Cart actions. The sticky header is approximately 99px high. Mobile uses a logo plus Search and Menu icons.
- Existing page slides, cart drawer, mobile menu, smooth scrolling and reduced-motion support must cooperate with search.
- `/search` is page type C04 in the route manifest and architecture. Retiring it needs deliberate route, generator, test and documentation updates.

## Recommended desktop layout

The accepted refinement keeps the logo, Account and Cart stationary. Search expands leftward from its existing slot into the central navigation area. Only the four navigation links and original Search trigger yield their space. The custom search icon sits inside the field on the left; the close control sits inside the field on the right.

The field is 44px high, with restrained cream styling and header-sized typography. The results panel aligns to both edges of the complete field and sits approximately 8px beneath it. Header height and the page beneath it stay fixed; results overlay the page instead of pushing it down.

Navigation hidden during search must also be unavailable to keyboard and assistive technology, rather than remaining focusable behind a transparent layer. Closing restores the normal header and its active navigation state.

## Interaction sequence

| State | Visible interface | Behavior |
| --- | --- | --- |
| Resting | Existing header | Search trigger opens the field without navigation. |
| Opening | Navigation fades; input expands leftward; close appears | Input receives focus during the opening interaction. Typing is accepted immediately, even before motion completes. |
| Open, empty | Expanded field and close | Placeholder: “Search mushrooms, microgreens…”; no product panel yet. |
| Open, matching | Same-width product panel | Start matching at two meaningful characters. Display actual published records. |
| Open, no matches | Small panel with empty message and category recovery | “No matches for ‘…’.” Offer the existing catalogue categories without invented products. |
| Closing | Panel retracts; input contracts; navigation returns | Return focus to Search for explicit close/Escape. Keep the page and scroll position unchanged. |

Whitespace-only queries behave as empty. Clearing the field closes the results panel but keeps search open. The large cross closes the whole search interaction; its accessible name is “Close search.” Avoid adding a second cross for clearing in the first version.

The query can remain in memory when closed and reopened on the same page. Clear it after choosing a result, leaving the page or reloading. Do not record search history by default.

## Motion specification

These values are design starting points, to be judged in the browser, not claims of measured ideal timing:

- Navigation fade: around 120–160ms.
- Field expansion/contraction: around 260–320ms with the established easing.
- Panel entrance: around 180–220ms, fading with a short downward reveal. Start it when matching content exists.
- Subsequent result changes: about 120–160ms opacity/layout settling. Do not replay the full slide for every keystroke.
- Closing reverses the sequence, allowing the navigation to return as the search area retreats.

Use the existing motion system, with cancellation on rapid open/close, route changes and browser history. Keep text and thumbnails at their normal size during expansion; a stretched input interior would undermine the typography. Reduced motion uses immediate state changes or a brief fade. Input responsiveness never waits for an animation or result-fetch delay.

## Result design and matching

Use a compact vertical list, initially showing up to five products. Each row contains a 44–48px product thumbnail, a 15–16px medium-weight name and a smaller category label. Keep the whole row as one selectable action. Prices, stock and pack sizes should appear only when confirmed public catalogue data supplies them.

Use the current cream surface, soil text, warm divider, subtle shadow and terracotta match emphasis. Hover and keyboard active states use a restrained tinted surface. Do not add separate arrows, add-to-cart controls or other nested actions to every result; the row's purpose is to open its product.

Match case-insensitively, normalize whitespace and punctuation, and rank exact names before name prefixes, word matches and category/alias matches. Initially “button,” “mushroom” and “radish” should resolve from existing records. A maintained alias field can later support actual local terms; typo tolerance should not silently substitute unrelated produce.

For the current two records, local matching can run immediately and needs no artificial loading indicator. If catalogue search becomes remote, debounce requests by roughly 150–200ms, cancel superseded requests and reject stale responses. A delayed loading indicator should only appear for an actual wait. Handle network failure separately from zero matches, retain the typed query and offer retry.

When the catalogue grows, show a count and a “Show all matching products” control only if there are more matches. It expands the same panel into a bounded, scrollable list, with pagination or incremental loading. This preserves the no-search-page direction. A category link can take users to an existing catalogue category for broader browsing.

## Keyboard and accessibility

Use an editable combobox with a list popup and manual selection. Maintain focus in the input and represent the active product using `aria-activedescendant`. Announce result counts politely without rereading the complete list after every character. The label is “Search products”; placeholder text does not replace it. Hidden navigation and closed panels must not retain reachable controls.

- Down/Up arrows move the active result; ordinary cursor editing, selection, copy/paste and IME composition remain intact.
- Enter opens an explicitly active product. Without an active product, Enter updates/reveals matches and announces the count; it does not choose an arbitrary first product or navigate to a new search page.
- Escape first dismisses an open results panel while keeping the typed query. A second Escape closes search and restores trigger focus.
- The cross closes search in one action. Tab leaves the combobox normally and reaches the close/other available controls; search is not a desktop modal and should not trap focus.
- Outside pointer interaction dismisses search without swallowing the user's intended click or forcing focus back to Search. Defer focus-leave dismissal safely so product selection is not lost on input blur.
- All touch actions have at least a 44px target. Confirm the implementation with actual keyboard and screen-reader testing, including touch assistive technology.

These semantics follow the [W3C combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and its [manual-selection autocomplete example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/). The example is a reference, not a substitute for testing the resulting website.

## Mobile adaptation

At narrow widths, temporarily replace the logo/menu area with a full-width search row rather than squeezing the input alongside the full logo. Preserve header height, use at least 16px input text, and keep the close control at the right. The panel remains aligned to the input. Bound its height to the visible space above the software keyboard, using the visual viewport when available, and scroll results within that space.

Focus must be initiated by the user's tap so the mobile keyboard opens reliably. The page's reading position should be restored on dismissal. Check 320px, 390px, 720px and intermediate sizes, landscape, zoom, keyboard opening, resize and orientation changes. Mobile browser Back should not leave the user trapped in a transient overlay; the implementation must deliberately coordinate overlay dismissal with history rather than assuming Escape exists.

## Coordination and architecture

Only one major header interaction is active at a time. Opening search closes an expanded mobile menu and dismisses any cart overlay safely. Opening Cart closes search. Product selection closes search before the existing page transition; its controller must cancel pending motion and requests on route changes or header replacement.

Keep search state separate from routing, menu state and cart state. A dedicated controller should own the field, popup, query, active result and cleanup. A small matching function should consume public catalogue records. Shared header markup should support all storefront and account screens; there should be no independent implementation for each page.

On approval to implement, retire the separate C04 search screen and update the route manifest, architecture, count validation, generated entries and tests together. Existing `/search?q=…` addresses can become compatibility redirects to the existing Shop page with the header search opened and query restored. This is a compatibility entry, not a separate search results page. Decide that fallback explicitly before removing the old route. Do not add history entries for each keystroke.

## Acceptance criteria

1. Clicking Search changes neither the current page URL nor its reading position.
2. The header keeps its height; the input does not overlap the logo or close control.
3. The popup aligns with the input and remains inside the viewport at every supported width.
4. Opening, closing and fast repeated actions settle cleanly; typing never lags behind motion.
5. Matching, clearing, zero results, loading and failure are distinct, honest states.
6. Product selection opens the correct existing product; Enter without selection never opens an arbitrary result.
7. Hidden navigation cannot receive focus; keyboard and screen-reader users can select and dismiss results.
8. Mobile keyboard, zoom and resize leave the input, close control and results usable.
9. Search, menu, cart and page transitions cannot leave duplicate overlays or stale focus.
10. The implementation passes relevant discovery/navigation checks and preserves unsaved form/account data when search is opened and closed.

Recommended delivery: desktop behavior and visual review first, then mobile adaptation and assistive-technology verification, followed by catalogue growth states. This follows the project's existing approach of settling desktop interactions before extending them across mobile sizes.
