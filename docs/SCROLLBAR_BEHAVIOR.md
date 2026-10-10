# Scrollbar appearance and visibility

Updated at the user's request on 2026-10-10.

- The Chromium/WebKit scrollbar gutter is 6px, with a rounded 4px muted-brown thumb and a cream track. Other browsers use the standard thin scrollbar API.
- The thumb is transparent at rest. Actual scroll events reveal only the scrollbar belonging to the scrolling element. Hovering an idle scrollbar does not reveal it.
- After 650ms without another scroll event, the thumb fades away using the existing standard motion duration/easing. Reduced-motion mode changes visibility without a fade.
- A single passive capture listener handles document, cart, mobile menu, textarea and portalled dropdown scrolling. Keyboard, touch, mouse wheel and programmatic scrolling use the same behavior.
- Viewport visibility is synchronized on both html and body because Chromium can paint scrollbar styling from body while html owns the scroll position. Nested containers stay independent.
- The root scrollbar gutter remains stable, so visibility does not move content. Forced-color mode keeps the system scrollbar presentation.
- Timers and state are cleared on page hide; the listener and managed classes are disposed during hot-module replacement.

Source: `src/styles/components/scrollbars.css` and `src/app/scrollbar-visibility.js`, initialized once by `src/app/bootstrap.js`.

Verification: production build and seven browser checks passed (four existing cart checks plus three visibility/scrolling checks). Native thumb-color measurements cover idle, active and resting states, page and cart scroll containers, keyboard scrolling, unchanged viewport width, reduced motion and system contrast fallback. Live-server screenshots also verify actual painted thumb pixels: none at rest, 2,076 while scrolling, none after the fade. The result record is `docs/verification/scrollbar-auto-visibility.json`. The user's development server on 5173 remained active.
