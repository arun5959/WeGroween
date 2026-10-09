# Story artwork and earlier illustration exports

## Current production treatment — Layers of Growth

The user selected direction 2, Layers of Growth, on 2026-10-07. Our Story now uses responsive matte paper illustrations from `paper/` for stages 1, 2, 3 and 5. Stage 4 retains its existing supplied logo and crop motif.

Delivery files: `paper/01-terrace-{768,1536}.webp`, `paper/02-indoor-growing-{768,1536}.webp`, `paper/03-purpose-{768,1536}.webp`, `paper/05-table-{768,1536}.webp`.

These are original AI-generated symbolic illustrations, not historical or cultivation photographs. Original PNGs, full prompts, approved reference and delivery manifest are preserved under `design-system/story-illustration-directions/paper-production`. Only encoding and downsampling were applied. The page uses responsive source sets, intrinsic dimensions and lazy loading, with a single reveal and reduced-motion support.

## Earlier Field Notes scenes — rollback assets

These generated SVG scenes implement the artwork direction selected by the user on 2026-10-07. They are symbolic illustrations of story milestones, not documentary growing or origin photographs.

- `01-terrace.svg`: one planter and crop symbol.
- `02-indoor-growing.svg`: microgreens and mushrooms in shallow trays.
- `03-purpose.svg`: crops, supply basket and kitchen.
- `05-table.svg`: produce arranged on a plate.

Stage 4 uses `../Logo/wegroween-header.svg` inside the preserved brand panel.

The earlier scenes are authored in `src/components/story-artwork.js`. Approved Field Notes symbol geometry is embedded from `design-system/icons/icons.svg`; colors resolve from `design-system/tokens.css`. Rebuild with `npm run prepare:assets`. These exports remain as rollback artwork; the production page uses the selected paper illustrations. The exports are standalone, have a transparent background and make no external resource requests.
