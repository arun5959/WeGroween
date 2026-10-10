# Shared header search

Implemented 10 October 2026, following [the interaction review](HEADER_SEARCH_REVIEW.md). Desktop is the primary visual implementation; tablet and mobile adapt the field to the available left-hand space while preserving right-hand actions, without a separate search page.

## Behavior

- Search expands leftward in the existing header in 300ms, ending at the original Search slot. Desktop keeps the logo, Account and Cart stationary and usable; only central navigation and Search triggers fade and become inert. At 1050px and below, search temporarily uses the logo/navigation space. Mobile Menu remains accessible. Header height stays constant. The field uses measured viewport positioning to prevent native caret typing from shifting the reading position.
- A compact 44px cream field matches the original header control's visual weight, with 14px desktop type, a warm focus border and the close icon inside the field. Its close control retains a 44px target. Closing contracts/fades the field in 280ms and restores the original trigger focus. Search from the mobile menu restores focus to the persistent mobile search icon.
- Two meaningful characters reveal an input-width panel using a short 200ms downward fade. The panel exits in 160ms; subsequent height changes settle in 150ms. Reduced motion skips these animations and settles existing ones.
- Results contain existing public product thumbnails, names and categories. Matching normalizes case, diacritics, punctuation and whitespace, requires all query words, and ranks exact names before prefixes, substrings and category/alias matches. The current catalogue contains only two product records. No prices, stock claims, remote results or fabricated suggestions are introduced.
- The list is bounded to available viewport height and scrolls independently when needed. Product selection opens the existing product page. Empty results display the typed query as text and offer catalogue category links.
- Typing is immediate. No artificial loading state is used for the local data source. A remote search API, remote error/loading states and a larger-catalogue expansion control remain future work.
- Arrow keys activate results while focus stays in the combobox. Enter chooses an active result; without one it refreshes suggestions and keeps the page URL. Escape dismisses results, then closes search on a second press. Clearing the field dismisses results while search stays open. The cross closes the whole search interaction.
- Outside pointer interaction closes search without canceling the clicked action. Tab leaves normally; there is no focus trap. Closed/closing controls are inert. The query is retained for reopening on the same page but discarded on page navigation/reload.
- Opening search closes the mobile menu and settles pending page slides. The controller uses the current header after a queued slide replaces it. Cart, navigation and history changes dismiss search and dispose its event listeners/animations. Opening/closing search alone preserves page position and unsaved form/account values.

## Route inventory and compatibility

Search is an interface state, not a page. C04 is retired; remaining IDs are stable. `PAGE_MANIFEST.json` now has 36 reusable page types (21 customer + 15 admin) and 37 page route patterns, with `/search` documented as an uncounted compatibility handler.

Old `/search?q=radish` addresses load Shop and replace the current history entry with `/shop?q=radish`, opening header search with that query. Direct/reloaded `/shop?q=…` also restores search. Keystrokes do not create history entries. Static builds retain a `/search/index.html` compatibility entry so old URLs work on static hosting, including a configured project-directory prefix. Without JavaScript, these links still render the Shop catalogue rather than an empty search screen.

## Sources and verification

- Markup: `src/components/header-search.js`, consumed by shared navigation.
- Controller: `src/app/header-search.js`, mounted/disposed by bootstrap.
- Matching: `src/app/catalogue-search.js`.
- Styling: `src/styles/components/header-search.css`.
- Unit checks: matching/ranking/aliases and retired-page compatibility.
- Browser checks: geometry, retained form/account edits, keyboard selection, Escape, outside clicks, empty/escaped queries, history/cart coordination, animation interruption, compatibility, and seven viewport widths from 320px to 1920px.
- Static-host checks verify compatibility and navigation on generated entries. Browser tests use independent servers on 4173/4183/4184, leaving the user's 5173 server running.

Automated keyboard/touch emulation and geometry checks do not establish full assistive-technology or real mobile software-keyboard compatibility. Manual screen-reader/mobile-keyboard review remains part of release QA. No backend search, authentication, stock or ordering services are enabled by this change.
