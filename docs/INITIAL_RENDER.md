# Stable initial rendering

Verified 11 October 2026.

The HTML document links the application stylesheet directly in its head. The
browser applies it before painting server-rendered content, including on the
development server. Styling does not wait for application JavaScript.

The three approved local font files are embedded by Vite in that stylesheet.
Native font blocking covers their brief local decode, without a late network
font swap. This preserves Fraunces, its italic variant and DM Sans, including
their existing weights and sizes. The public font files remain available for
compatibility. The fonts share the versioned stylesheet's cache lifetime.

The original separate font requests and `font-display: swap` caused the hero
text to redraw: at 1440px, its text width changed from 589.55px to 522.52px and
the primary button grew from 212.27px to 218.09px. The corrected first render
and settled render both use the final dimensions.

Verification:

- Development pages render with CSS even without JavaScript, at 1440px and 320px.
- Delayed account startup and reload preserve the correct styled route.
- Production cold loads and reloads at 1440px, 390px and 320px retain identical
  hero text and button dimensions before and after startup. Blocking external
  font requests does not change the brand typography.
- Production public HTML without JavaScript and shopping/history navigation pass.

Regression coverage: `tests/account/initial-render.spec.js` and
`tests/e2e/initial-fonts.spec.js`.
