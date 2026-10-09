# Contact directions review

Status: PROPOSED — awaiting the user's structure selection. No production route, page, shared component or canonical token changes.

Open `http://127.0.0.1:5173/design-system/contact-directions/2026-10-07/index.html` and select one of the three directions. Direct URLs accept `?direction=desk`, `?direction=letter` or `?direction=guide`.

`directions.json` records the proposal, confirmed facts and boundaries. `DIRECTIONS.md` gives the comparison. `build.mjs` rebuilds the isolated gallery from those specifications and existing brand assets. The review includes the current header/footer, with Contact proposed as the navigation label for the existing `/help` route.

The scoped deliverable is an interactive HTML gallery, written comparison, six screenshots and verification record. This is a page-structure extension within the existing brand; it does not reopen palette, typography, icon or identity decisions.

## Verification

Run `node design-system/contact-directions/2026-10-07/qa.mjs` from the checkout while the development server is running. Results are in `verification.json`.

Passed at widths 320, 390, 640, 768 and 1440 pixels: direction switching, horizontal overflow, asset loading, topic guidance, email draft validation and construction, stale draft dismissal, keyboard accordions, mobile menu and Escape, reduced motion, no-JavaScript fallback, and absence of submissions or runtime errors. Desktop and mobile renders of all three directions were visually reviewed.

SHA256 hashes confirmed that the 86 protected production and canonical DLS files in `scope-baseline.json` remain unchanged.

Email draft preparation stays local and does not send or save messages. Native website submission is a later functional decision if that direction is selected. Opening hours, exact address, response times and delivery promises are unconfirmed and are not invented.

Pending decision: select, combine or revise the proposed contact structures. The Harvest Desk is recommended because direct contact is the principal task for the current catalogue site.
