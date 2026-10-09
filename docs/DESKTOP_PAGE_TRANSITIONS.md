# Desktop page transitions — review phase

User sequence: Home → Shop → Our Story → Restaurant Supply → Contact → Account. Any forward jump slides the current page left and brings the destination in from the right. A backward jump reverses it. Browser history uses the same route ordering.

This horizontal system runs at widths of 1051px and above, matching the current full desktop header. Mobile and tablet retain their existing page behaviour until desktop review is finalized. Existing account access remains denied until authentication is connected.

The fixed header stays outside the moving content track. Page content and footer move together through a clipped viewport, using the component's `--motion-page-slide: 420ms` and `--motion-page-slide-easing: cubic-bezier(.25, .1, .25, 1)` tokens. Other component timings are unchanged.

Only the outgoing page is copied. Its temporary copy has no IDs and is inert and accessibility-hidden. The actual incoming stage retains its IDs, listeners and form state; it moves into the viewport during animation and returns to normal document flow at completion. A height placeholder preserves the destination's scroll range. Both stages are temporarily inert; keyboard focus moves to the destination's main content when motion settles. Layout geometry is read before positioning writes; only transforms animate. Paint/layout containment and temporary `will-change` are removed with the transition layer.

Lazy image attributes are preserved in the outgoing snapshot and below the incoming viewport. Only the first visible incoming image is prioritized and decoded opportunistically; navigation does not wait for network or decode completion.

Rapid navigation finishes the visible slide without cancelling it, then transitions toward the latest requested destination. Additional requests replace that single pending destination instead of accumulating stale page animations. URLs/history update immediately; content and its header update when the queued destination starts rendering. Cart opening, viewport resize and live reduced-motion changes settle the current stage and render any latest pending destination without another slide. Hot-reload dispose discards pending work. Each path restores interaction and scrolling.

New page visits start at the top while the outgoing copy retains its previous visible scroll position. Desktop Back/Forward restores scroll saved per history entry for the current session, including distinct visits to the same URL and in-page chapter anchors. The smooth-scroll module exposes before/after anchor-history hooks so each anchor entry has its own saved position; reduced-motion anchors use immediate native scrolling with the same focus and header offset. Mobile/tablet retains its existing scrolling and fade behavior. Reduced motion skips slides but still restores desktop history positions. Initial loads, same-section navigation and utility routes retain existing animation behaviour. Shop categories/products/search and account/auth routes share their section's position.

Implementation: `route-motion-order.js` defines direction centrally; `page-transitions.js` manages lifecycle; `page-transitions.css` owns the clipped viewport. The static public HTML pipeline and route counts are unchanged. No mobile directional animations are introduced in this phase.
