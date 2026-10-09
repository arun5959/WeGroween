# Shared application components

## Interface motion

`motion.css` and `src/app/interface-motion.js` share the existing 140ms micro and 220ms standard tokens. Property-specific transitions cover links, inputs and icons. Client-side page changes use a short opacity settle. `setupInterfaceMotion(root)` enhances native details with reversible height interpolation and animates the mobile menu.

Use the returned `changeLayout(element, change)` to animate a container around synchronous content changes, `reveal(element)` for a short opacity settle, and `dispose()` when the page is replaced. The Contact form uses these for draft and validation feedback. Avoid blanket `transition: all`, arbitrary maximum heights, or delaying focus and input behind animations.

Animations cancel and restart from the current visual height during rapid interaction; completed elements return to their natural responsive height. A viewport resize or live reduced-motion change settles active animations and releases temporary clipping. Native details and direct contact remain usable without JavaScript. Durations handle both CSS milliseconds and seconds, including production optimizer conversions.

## Buttons

`buttons.css` is imported once through `app.css`. Use this component for all link-style actions and native form buttons. The default `.button` is primary; `.button--primary` is an explicit, optional modifier. `link()` in `src/components/primitives.js` already consumes it.

```html
<button class="button button--primary" type="submit">Submit enquiry</button>
<a class="button button--secondary" href="/shop">Explore products</a>
<a class="button button--quiet" href="/our-farm">Our story</a>
```

The primary runtime states use existing Soil & Saffron palette tokens: brown by default, terracotta on hover or keyboard focus, and deeper brown while pressed. The runtime mapping deliberately gives more visible feedback than the design package's legacy same-color hover token. Palette tokens remain authoritative; do not add page-specific hex colors or copy hover selectors onto individual buttons.

To add a variant or adapt a button to a dark surface, set its `--button-background`, `--button-foreground`, `--button-border` and matching `--button-hover-*` / `--button-active-*` properties. The shared selectors own behavior. `.story-grid .button--secondary` demonstrates an inverted outline button.

Hover applies only to a fine pointer with hover support. Keyboard focus uses the same feedback with the existing focus ring. Pressed rules work for touch, mouse and keyboard. Color transitions use the motion token and are disabled under reduced motion. No state changes the button's dimensions or position.

Native `disabled`, `aria-disabled="true"` and `aria-busy="true"` exclude enabled-state feedback. Use native `disabled` for unavailable native buttons. Consumers must enforce activation prevention for disabled links and repeated submissions for busy controls; ARIA attributes alone do not disable their behavior.
