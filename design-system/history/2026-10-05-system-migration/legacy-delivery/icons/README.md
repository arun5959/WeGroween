# Field Notes icon library

I1 Field Notes is the approved WeGroween icon family. It contains crop, commerce and universal interface glyphs without acting as a logo or monogram.

## Construction

- Coordinate grid: 24×24
- Optical stroke: 1.75
- Line caps: square
- Line joins: round
- Fill: none unless a future documented exception requires it
- Color: `currentColor`
- Standard display sizes: 16, 20, 24 and 32px
- Minimum icon-only control target: 44×44px

Organic subjects may use slight asymmetry. Universal actions should remain conventional. Keep exterior forms open where possible and leave at least 2 grid units between unrelated interior strokes.

For functional icons on light surfaces, use contrast-safe foreground tokens such as primary text, brand primary, brand secondary, information or success. Saffron is decorative on light surfaces and must not be the sole functional icon color.

## Assets

- `icons.svg` — external symbol sprite; IDs use the `wg-` prefix.
- `svg/` — standalone SVG files.
- `manifest.json` — machine-readable inventory and construction metadata.
- `generate-icons.mjs` — deterministic source and asset generator.

## Symbol sprite example

```html
<svg class="icon" aria-hidden="true" focusable="false">
  <use href="/design-system/icons/icons.svg#wg-basket"></use>
</svg>
```

External SVG `<use>` behavior can vary in unusual file-hosting or security environments. If the target stack cannot resolve it reliably, inline the sprite once in the document or import the standalone SVG through the build pipeline.

## Accessible controls

Decorative icon beside visible text:

```html
<button type="button">
  <svg aria-hidden="true" focusable="false"><use href="icons.svg#wg-basket"></use></svg>
  Add to harvest
</button>
```

Icon-only control:

```html
<button type="button" aria-label="Open basket">
  <svg aria-hidden="true" focusable="false"><use href="icons.svg#wg-basket"></use></svg>
</button>
```

Do not use an icon as the only carrier of availability, payment, delivery or error status. Pair semantic color with visible text or an equivalent programmatic cue.

## Extension checklist

1. Confirm a new glyph is necessary; prefer an existing conventional action icon where meaning overlaps.
2. Draw on the 24px grid using Field Notes geometry.
3. Test at 16, 20, 24 and 32px on background and surface colors.
4. Compare stroke density with `search`, `basket`, `microgreens` and `mushroom`.
5. Add the icon source to `generate-icons.mjs`, regenerate, then update the manifest version.
6. Review recognition, text pairing, contrast and 200% zoom behavior before release.

## Prohibited mixing

Do not mix this set with I2 Cultivation Geometry’s round monoline terminals or I3 Harvest Cut’s bevelled, filled construction. Third-party icons require a documented exception and optical redrawing before entering the canonical family.
