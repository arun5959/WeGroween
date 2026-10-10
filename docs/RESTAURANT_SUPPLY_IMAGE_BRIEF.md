# Restaurant Supply — image collection brief

Page: `/restaurant-supply`. This is the original collection brief. On 10 October 2026 the user supplied new media and authorised placement; the four spaces are now populated. See [the placement record](MEDIA_PLACEMENTS_2026-10-10.md) for the selected files. The requirements below remain useful for future photography.

## Required photographs

| Space | Photograph to collect | Composition and crop | Suggested master size | Future filename |
| --- | --- | --- | --- | --- |
| Hero | Fresh mushrooms and microgreens together on a clean kitchen preparation surface. A loose, thoughtful arrangement that shows the produce clearly. | Portrait 4:5 on desktop; landscape 4:3 on mobile. Keep the main ingredients near the centre, with enough space around them for both crops. Capture a wider alternative if one photograph cannot support both crops. | 2400 × 3000 px or larger, plus a landscape alternative if needed | `supply-hero-kitchen.webp` |
| Mushrooms | A close view or small grouping of the mushroom varieties actually represented in the catalogue. Whole mushrooms, surface texture and shape should be visible. | Landscape 4:3. Fill the frame with produce while leaving a little breathing room; avoid dishes that obscure what is being supplied. | 2400 × 1800 px or larger | `supply-mushrooms-detail.webp` |
| Microgreens | Fresh microgreens in a growing tray or freshly cut, with the leaves and stems easy to see. Use varieties from the current range. | Landscape 4:3. A low or slightly overhead angle; clear leaf detail and a simple background. | 2400 × 1800 px or larger | `supply-microgreens-detail.webp` |
| Growing story | A genuine cultivation scene: tending trays, inspecting a mushroom crop, or hands working with the harvest in the actual growing space. | Landscape 3:2. One clear activity or subject, with room around it. The photograph should sit comfortably beside the short story on a dark brown section. | 2400 × 1600 px or larger | `supply-growing-story.webp` |

## Shared visual treatment

- Natural, soft daylight; warm neutral or earthy surroundings, consistent with the cream, soil brown and terracotta website palette.
- Real produce colours and readable textures. Avoid heavy colour filters, glossy advertising effects, text overlays and watermarks.
- Send original JPEG or PNG files at full resolution rather than compressed messaging-app copies. Retain the originals; generate responsive WebP versions when integrating the selected photos.
- Record the source and pictured crop varieties so captions and alternative text can be accurate. Use photos the business has permission to publish, including permission from identifiable people pictured.
- The growing-story image may depict today's growing space. Describe it that way; only use an image as evidence of the original terrace garden if a genuine historical photograph is available.

Optional for a later expansion: a chef plating with the produce, and the actual packed harvest prepared for supply. These are not needed to fill the current page and have no reserved spaces yet.

## Integration map

The photo elements are identified by `data-supply-image="hero"`, `"mushrooms"`, `"microgreens"` and `"growing-story"` in `src/pages/restaurant-supply.js`. Their established aspect ratios are retained, with responsive sources and alternative text based on the selected images. Delivery copies live under `public/media/optimized/` and original files remain under `public/media/`.
