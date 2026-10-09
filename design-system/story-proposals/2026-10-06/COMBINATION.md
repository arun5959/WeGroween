# Selected combination — 2026-10-06

Owner: User. Evidence: “mix this combination in the last image the whole process should continue from here”, with screenshots of the centered B opening, A illustrated overview and A first timeline chapter.

Selected composition: B centered editorial heading and introduction; A five-stage illustrated strip directly underneath; A alternating timeline continuing through all five story milestones. Production route: `/our-farm`. Existing palette, fonts, Field Notes icons, header, footer and smooth-scroll behavior retained.

This selection authorizes implementation of the combined page. Earlier A/B studies remain unchanged as review history. Runtime copy is in `src/content/story.js`; page structure in `src/pages/story.js`; appearance in `src/styles/components/story.css`; lifecycle-safe enhancement in `src/app/story-motion.js`.

Animations enhance the symbolic illustrations and timeline. Every paragraph is present in prerendered HTML and readable without JavaScript. Reduced motion removes chapter translation and icon drawing and shows the complete timeline. The aim for fresh, organic supply remains explicitly an ambition.

Validation: production build passed. All 13 browser tests passed, covering all 37 routes, shopping navigation, mobile layouts, smooth scrolling, the combined story structure, chapter navigation, dynamic reduced motion and the complete story without JavaScript. Visual review captures are in `docs/verification/story-combined-*.png`; desktop and mobile layouts inspected. No overflow at 320, 390, 720, 1024 or 1440px, or 200% CSS zoom at 640px.

## Refinement — 2026-10-07

User requested fixes for copy repetition, page naming and technical polish. Runtime story copy reduced from 356 to 286 displayed words, with distinct chapter descriptions and a new closing line. All five milestones, the selected composition and spacing are retained. Navigation, footer and document title now use “Our Story”; `/our-farm` remains the route. The homepage story link was relabeled accordingly.

Story-specific description is rendered in generated files, development/preview HTML responses and client-side route changes. Lenis now relies on the existing root scroll-padding, removing the second header offset from anchor navigation. Chapter targets align below the header in both smooth-scroll and reduced-motion modes at desktop/mobile widths.

Validation: build, five unit tests and all 14 browser tests passed. Live description/title also verified without JavaScript at `127.0.0.1:5173`. Refined opening screenshots: `docs/verification/story-refined-opening-desktop.png` and `story-refined-opening-mobile.png`.
