# Modern image delivery and sample admin publishing

Date: 12 October 2026. Target: wegroween.vercel.app.

## Image changes

All raster references in src/content/media.js and the favicon now use WebP. Existing product/editorial/story photos were already WebP. Remaining farm, mushroom-category and platter PNG references now use responsive 480/768/full-size WebP copies. Header/footer logos use lossless cropped WebP with the exact previously approved SVG framing and transparency. Favicon uses the approved paper background at 256px. Old SVG logo URLs remain compatible with WebP payloads. True vector icons remain SVG.

Original PNG editing sources remain untouched. scripts/prepare-modern-media.py recreates committed delivery copies. The build checks source hashes and WebP signatures without requiring Python. Unit checks validate every media registry raster; browser checks eagerly load images across storefront, story, supply, contact, account and admin routes and assert no PNG/JPEG/GIF/BMP image requests or missing images.

[Conversion measurements](conversion.json): the converted six sources total 8,902,233 bytes; their largest delivery copies total 1,256,738 bytes, an 85.9% reduction. Smaller responsive variants reduce delivery further. Logo decoded pixels match their prepared encodes exactly.

## Editable published admin

Vercel explicitly opts into VITE_OPERATIONS_PREVIEW=true. The published A02–A15 interface uses the existing fictional operations model, browser storage and modal editors. All 13 workflow checks passed against the production build, including newly created product detail reloads. Static HTML prerenders known sample records; the Vercel admin fallback serves the client shell for browser-local records. Standard builds preserve the earlier protected presentation. This creates no staff authentication, private database access, outbound messages, real ordering or shared data writes.

Thirty unit checks passed. Five static-host checks passed for the root Vercel target, covering navigation, direct routes, account parity, no-JavaScript output and modern raster requests. The Pages subdirectory target also passed all five static-host checks, retaining the existing account preview and protected admin default.

## Publishing verification

Publication and live image/admin checks are completed after pushing the tested release. This record will be updated with the deployed commit and live observations.
