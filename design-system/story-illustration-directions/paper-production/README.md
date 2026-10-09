# Layers of Growth — selected story artwork

Selected by the user on 2026-10-07: "i'll go with second direction move ahead". Integrated into `/our-farm` (Our Story).

## Artwork

1. Terrace: a climbing vegetable plant in one terracotta paper planter.
2. Curiosity: the approved paper study, showing microgreens beside oyster mushrooms.
3. Purpose: the small starter planter beside a larger produce crate.
4. Brand: existing supplied logo panel and crop motif, preserved.
5. Next chapter: a cream plate of paper produce.

The three new scenes were created with the built-in image generation tool using the approved stage 2 study as a style reference. Full prompts, reference paths and generation provenance are in [prompts.json](prompts.json). Unmodified generated PNGs are retained under `originals/`. These are symbolic illustrations, not historical or cultivation photographs.

Responsive delivery images are in `public/media/story/paper/`, with 768px and 1536px WebP copies for each scene. Mobile copies are 20–41 KB; full-resolution copies are 79–151 KB. Only delivery encoding and downsampling were applied. No artwork was cropped, retouched, recoloured or composited. `encode.mjs` records the reproducible conversion; `delivery-manifest.json` records actual dimensions and byte counts. The earlier SVG artwork remains available as rollback assets.

## Verification

Production build passed. All 5 unit tests and 14 existing browser tests passed. Actual page checks passed at 320, 390, 640 and 1440px: no horizontal overflow, all four images loaded at the correct displayed ratio, all eight delivery assets returned 200. Reduced motion removes translations; all four scenes load without JavaScript. Stage 4 markup was checked against its preserved copy. Desktop views of every stage and mobile chapter crops were visually inspected. See `verification.json` and `stage-*-desktop.png` / `stage-*-mobile.png`.
