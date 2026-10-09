# WeGroween story direction review

Status: PROPOSED. Direction and copy await user review. This is an incremental, non-production study; existing website and canonical identity inputs are unchanged.

Open `index.html` directly, or at `http://127.0.0.1:5173/design-system/story-proposals/2026-10-06/index.html` while the local development server is running. The two comparison buttons switch composition. Chapter links use ordinary page scrolling; the closing action opens the current local shop.

## Sources and rebuild

- `story.json` owns proposed copy based on the five milestones supplied by the user on 2026-10-06.
- `proposal.json` owns the two directions, purpose, claim boundaries, motion and pending decision.
- `build.mjs` owns prototype composition. Run `node design-system/story-proposals/2026-10-06/build.mjs` from the project checkout to regenerate `index.html` and `story.md`.
- Embedded palette tokens, fonts, supplied logo and Field Notes symbols come from the existing project. The page works without external asset requests.
- Symbols illustrate the journey. They are not documentary evidence. Actual origin imagery remains a future optional input; historical photos have not been invented.

## Rendered review — 2026-10-06

PASS: both directions rendered and desktop/mobile screenshots inspected. No horizontal overflow at 320, 390, 720 and 1440px. Both directions also fit at 320px with 200% CSS zoom. Comparison switching works with keyboard input. Native chapter anchors, progression and reveal states checked. Reduced motion shows all chapter copy without translation or decorative animation. No runtime errors observed.

Screenshots: `seed-desktop.png`, `seed-chapter-desktop.png`, `seed-mobile.png`, `journal-desktop.png`, `journal-chapter-desktop.png`, `journal-mobile.png`.

This is expert review, not a user study. The production header, navigation, image collection and commerce behavior will be reused during implementation after a direction is chosen.

Recommendation: A — A seed of something bigger. Its chronological growth line explains the transition from a small terrace garden to a broader purpose. B — The grower's journal offers a quieter reading experience with a sticky desktop chapter panel.
