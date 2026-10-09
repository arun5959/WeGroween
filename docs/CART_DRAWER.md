# Cart drawer

Normal Cart activation in the header, mobile menu or footer opens a modal panel from the right while preserving the current URL, scroll position and page form state. The drawer uses the existing colours, fonts, Field Notes icons and 360ms emphasized motion token. Closing reverses the slide; reduced motion skips it, including when the preference changes during an animation.

Native dialog provides focus containment and modal background isolation. Close button, Escape and backdrop dismiss it and restore focus to the opener. Background scroll is locked, Lenis pauses, and scroll styles are restored on close, navigation or disposal. Mobile fills the viewport width; desktop uses a 480px panel.

The current catalogue has no enabled purchasing actions or live cart records. The drawer displays the existing empty state, shared with the `/cart` route through `src/components/cart.js`. No products, prices or order data are fabricated, and this change does not enable checkout. The direct route remains available as the navigation fallback; modified clicks keep normal link behaviour.

Implementation: `src/app/cart-drawer.js` is initialized once by bootstrap outside the replaced page root. Cart triggers are refreshed after each client render. Internal catalogue navigation waits for the drawer to close. Future live cart integration should render the same authoritative contents through the shared component rather than maintaining a separate drawer cart.
