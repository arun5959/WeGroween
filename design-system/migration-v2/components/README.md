# WeGroween core components

Status: **Phase 6 reviewed; proposed pending Phase 7 delivery and final leader approval**.

This package is a framework-neutral reference layer for the approved Cultivated Editorial system. It demonstrates component styling and state behavior; it is not application code.

## Included

- Navigation with current, scrolled, overflow, desktop, collapsed and expanded states
- Primary, secondary, tertiary, destructive and icon-only buttons
- Small, medium and large button sizing
- Loading and disabled button behavior
- Labelled text, search, select and textarea fields
- Helper, error, success, validating, disabled and read-only field states
- Checkbox and radio patterns
- Neutral, brand, success, warning, error and information badges
- Static, interactive, selected, unavailable, loading and error cards
- Quantity control
- Success, warning, error and information feedback

## Loading order

```html
<link rel="stylesheet" href="/design-system/tokens.css">
<link rel="stylesheet" href="/design-system/components/components.css">
```

Load the approved Fraunces and DM Sans font files before component styles. The interactive reference uses the self-hosted files in `design-system/assets/`.

## Class policy

All public reference classes use the `wg-` prefix. JavaScript behavior should use `data-*` hooks instead of styling classes. Do not depend on the exact DOM of the specimen; follow each component’s semantic contract in `DESIGN_SYSTEM.md`.

## Accessibility baseline

- Native elements are required for links, buttons and form controls.
- Visible labels remain present; placeholders are examples only.
- Focus uses the canonical focus token and 3px ring.
- Icon-only buttons require accessible names and 44×44px targets.
- Loading controls expose `aria-busy="true"` and prevent repeated activation.
- Status messages include visible text and suitable live-region semantics when dynamically inserted.
- Disabled and read-only fields remain visually distinct.
- Mobile navigation returns focus to its trigger when closed in a real implementation.

The target is WCAG 2.2 AA. Automated structural checks and contrast measurements do not replace keyboard, screen-reader, zoom and touch testing in the implemented product.

## Tailwind adoption

The future Tailwind implementation should map theme utilities to `tokens.css`; it should not copy raw hex values or introduce alternate radii and spacing. Component classes in this file are a behavioral and visual reference, not a mandate to use traditional CSS in the future application.
