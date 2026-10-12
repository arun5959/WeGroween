# WeGroween website logo assets

Prepared on 6 October 2026 from the three supplied PNG files. The existing mushroom-and-sprout identity and exact `WeGroween` wordmark are retained; no new identity was introduced.

## Asset roles

| Supplied file | Preserved original | Website use |
| --- | --- | --- |
| ChatGPT Image Oct 6, 2026, 08_23_39 PM.png | sources/wegroween-header-lockup-original.png | Wide lockup for the shared storefront, checkout, identity, account and admin branding |
| ChatGPT Image Oct 6, 2026, 08_23_46 PM.png | sources/wegroween-footer-lockup-original.png | Lockup with a larger symbol for the shared storefront footer |
| ChatGPT Image Oct 6, 2026, 08_23_52 PM.png | sources/wegroween-brand-mark-original.png | Standalone mark for the browser icon |

The originals were renamed and moved without changing their bytes. Their SHA-256 hashes are:

```
header: 1D4E59408219123D06C98EC5A78CABEB238442717AF9ACC1D1F012B9C43EDE37
footer: 100E3ADE0E135FFF7878F2FA16FFF975DA8717DB520BD3CC512BBACC82FA99D9
mark:   40D28B333AB4C9EC50792538182EA1B40E336F9E3A3A84397C0189F007C55C9D
```

## Prepared versions

- `wegroween-header-logo.png`: transparent header artwork, 2176 × 723.
- `wegroween-footer-logo.png`: transparent footer artwork, 2079 × 756.
- `wegroween-brand-mark.png`: transparent standalone mark, 1254 × 1254.
- `wegroween-header.svg`: tightly framed header display asset.
- `wegroween-footer.svg`: tightly framed footer display asset.
- `wegroween-favicon.svg`: standalone mark on the approved cream background, readable against light and dark browser chrome.

The PNG edits used the built-in image-generation tool through the imagegen skill, not the CLI. All three PNGs contain genuine transparency. `scripts/prepare-logo-assets.js` builds portable SVG containers with embedded PNG artwork: these are raster logos inside SVG viewports, not traced vector logos. The header/footer viewports trim spare display canvas without resampling the artwork. The favicon adds the approved `#FBF4E8` backing. `npm run prepare:assets` regenerates these containers and validates the runtime assets.

The header displays at 236px wide on desktop and 200px on mobile; the footer displays at 280px, constrained to its container. Explicit image dimensions reserve space. The home link has an accessible name, and footer artwork loads lazily.

## Final edit prompts

### Header

Use case: background-extraction. Edit target: the supplied WeGroween wide horizontal header logo. Remove only the cream paper background, including all cream areas inside the symbol and between letters, and output actual transparent alpha. Preserve the exact mushroom-and-sprout silhouette, original brown-to-green gradient, wordmark letter shapes, and relative sizing and positioning. Text must remain exactly 'WeGroween'. Crop away the enormous empty margins: output a tightly framed horizontal logo strip with a small even clear margin of about 3 percent. Flat crisp artwork only, no texture in the background, no redesign, no new text, no shadows, no mockup.

### Footer

Use case: background-extraction. Edit target: supplied WeGroween footer logo with a proportionally prominent mushroom-and-sprout symbol. Remove only the cream paper background, including cream negative space inside the symbol and between letters, and output actual transparent alpha. Preserve the exact symbol silhouette, original brown-to-green gradient, wordmark letter shapes, and the original relative scale of the larger symbol beside the wordmark. Text must remain exactly 'WeGroween'. Crop away the large empty margins, leaving a tightly framed horizontal logo strip with about 3 percent even clear margin. No redesign, new text, drop shadow, or mockup.

### Standalone mark

Use case: background-extraction. Edit target: supplied standalone WeGroween mushroom-and-sprout symbol. Remove the cream paper background and all cream negative space within the mark, replacing these with genuine transparent alpha. Preserve the exact mushroom-and-sprout silhouette and original brown-to-green gradient. Output a square transparent canvas with the complete mark centered, large enough to fill approximately 88 percent of the width, balanced clear margins, no clipping. Clean crisp flat logo artwork for browser and mobile app icons. No text, no redraw, no shadow, no mockup, no decorative elements.

## Verification

The production build, 5 unit tests and 9 browser tests passed. The logo images loaded at 1440px, 390px and 320px; no horizontal overflow or runtime errors were observed. All 37 routes passed the existing mobile checks. Header/footer screenshots and the browser mark at 16px/32px on light/dark backgrounds were reviewed in `docs/verification/logo-*.png`. Original source hashes were verified after renaming.

## WebP delivery — 12 October 2026

The website now uses wegroween-header.webp (2111 × 460), wegroween-footer.webp (2018 × 514) and wegroween-favicon.webp (256 × 256). Header/footer pixels are cropped to the exact previously approved SVG viewports and encoded losslessly with transparency; the favicon keeps its approved paper background. Encoding is checked against the decoded pixels. The PNG sources remain untouched. scripts/prepare-modern-media.py recreates the copies and source hash manifest; prepare-logo-assets.js validates them and retains old SVG URLs with WebP payloads for cached documents.
