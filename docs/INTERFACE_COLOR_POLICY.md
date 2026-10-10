# Muted interface shades

User-requested website update, 2026-10-10. Keep the existing Soil & Saffron identity and use softly toned endpoints throughout the interface.

| Role | Token | Shade |
| --- | --- | --- |
| Dark text / muted black | `--color-text-primary` | `#2B211D` (existing warm ink) |
| Soft white / elevated surface | `--color-surface-elevated` | `#FCFAF6` |
| Card and form surface | `--color-surface` | `#FAF7F0` |
| Main cream canvas | `--color-background` | `#FBF4E8` (existing) |
| Text on dark surfaces | `--color-text-inverse` | `#FFF8EC` (existing warm cream) |

Use semantic tokens for backgrounds, text, borders, icons and interactive states. Avoid literal pure black or pure white, including named CSS colors and equivalent RGB/HSL values. Tailwind's `black` and `white` utilities are mapped to the muted dark-text and elevated-surface roles, so new components inherit this policy. Form controls inherit text color; text selection and form accent colors use the shared brown and cream palette.

Color depth means keeping distinct dark, midtone and light roles; it does not mean clamping individual RGB channels or desaturating photographs. The existing brand, focus and feedback hues remain intact. Photographs, supplied logos and historical rollback files are preserved.

The source is `design-system/design-tokens.json`; `design-system/tokens.css` is regenerated using the existing `language_core.css_tokens` serializer. Historical design PDFs and review evidence describe the earlier palette, not this website update.

Verified on 2026-10-10: production build and eight foundation browser checks passed. The computed-color audit covered all 37 page types at 390px and 1440px, plus sample-account editors and the open cart: 80 rendered cases, 6,586 visible elements, no pure-endpoint failures, and 2,444 active-text contrast checks with no measured failures. Disabled controls and aria-hidden decorations are exempt from contrast checks. Photographs and browser chrome are outside the UI audit. Re-run with `node scripts/audit-interface-colors.js` while the development server is running; results are in `docs/verification/muted-interface-colors.json`.
