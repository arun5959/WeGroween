# Story visual-variety concept review

Status: PROPOSED. User requested concept ideas; production page, story copy and canonical identity remain unchanged. This is a bounded comparison, not a replacement imagery standard.

Open `index.html` directly or use `http://127.0.0.1:5173/design-system/story-visual-concepts/2026-10-07/index.html` while the local server is running. The direction buttons compare three treatments. The five chapter buttons show the treatment across the whole journey. Gallery selection is preview state, not approval.

## Sources

`concepts.json` owns direction theses, chapter plans, benefits/tradeoffs, motion/mobile behavior and provenance limits. `build.mjs` uses those inputs, the current `src/content/story.js`, canonical tokens, existing fonts/logo and supplied crop images. It creates original schematic SVG scenes that extend Field Notes icon geometry. `CONCEPTS.md` and the gallery are generated views.

Rebuild from the project directory with `node design-system/story-visual-concepts/2026-10-07/build.mjs`. Local asset copies are kept in `assets/`; retain that directory when sharing the gallery. Source media files are copied without alteration. No new raster images were generated. The crop images represent subject matter, not founding history or verified growing practices. Actual terrace origin imagery is unavailable, so its photograph slot remains visibly reserved.

## Review — 2026-10-07

All 15 direction/chapter combinations checked. All three compositions fit 320, 390, 720 and 1440px widths without horizontal overflow. Reduced motion disables reveals. Runtime errors: none observed. Desktop and mobile visual review captures are `notes-desktop.png`, `living-desktop.png`, `editorial-desktop.png` and the corresponding `*-mobile.png` files.

The comparison shares chapter copy and media geometry to make artwork differences assessable. Genuine founder/terrace imagery and final illustration refinement remain follow-up work after concept selection. Recommendation: Grower's Field Notes, with occasional Living Cultivation scenes to vary the timeline.
