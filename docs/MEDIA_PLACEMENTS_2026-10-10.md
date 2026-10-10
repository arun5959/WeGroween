# Supplied media placements — 10 October 2026

The ten newly added PNGs were inspected visually and by filename/dimensions. Eight source images are now used; two are retained for more suitable future content. The originals stay unchanged in `public/media`.

| Supplied image | Placement | Reason |
| --- | --- | --- |
| `fresh-mushrooms-and-microgreens-on-parchment-portrait.png` | Restaurant Supply hero, desktop | Shows the ingredients a kitchen is enquiring about; the portrait composition fits the existing 4:5 space. |
| `fresh-mushrooms-and-microgreens-on-parchment-landscape.png` | Restaurant Supply hero, tablet/mobile | Uses the prepared wider composition instead of forcing the portrait into the landscape hero. |
| `sauteed-mushrooms-with-microgreens-portrait.png` | Homepage hero, desktop | The finished dish and garnishing hand connect “Chosen for flavour” with a kitchen use for the produce. |
| `sauteed-mushrooms-with-microgreens-landscape.png` | Homepage hero, mobile | The wider view supports the stacked layout while retaining the pan and garnishing action. |
| `Oyster Mushroom Cluster on Stone.png` | Restaurant Supply mushroom section | A close view of caps and gills gives the ingredient texture and a clear subject. |
| `Fresh Microgreens on Stone Texture.png` | Restaurant Supply microgreen section | Leaves, stems and cut ends are visible; the simple stone background matches the mushroom image. |
| `Harvesting Microgreens on Indoor Racks.png` | Restaurant Supply growing-story section | Adds a human cultivation scene beside the short story, with the 3:2 composition kept intact. It is not labelled as a historical terrace photograph or proof of the brand's actual facilities. |
| `Vibrant Microgreen Trio Overhead.png` | Microgreens category card on Home and Shop | Shows a varied microgreen range clearly, and provides an overhead view distinct from the supply-page detail. |
| `Rustic Hands Tearing Oyster Mushrooms.png` | Retained for later preparation/cooking content | A useful process image; a product supply section benefits from showing the whole ingredient first. |
| `Oyster Mushrooms on the Grow Rack.png` | Retained for later mushroom-cultivation content | A useful growing-process image, rather than an appropriate photo for the current button-mushroom product. |

## Delivery

`scripts/prepare-editorial-media.py` creates WebP copies under `public/media/optimized/` at 480px, 768px and the original width, without enlarging images. It uses Pillow when manually regenerating these assets; the website build only validates the generated files. Source filenames and files are preserved.

The eight original files total 20,527,976 bytes. Their eight largest WebP copies total 1,673,714 bytes, approximately 92% smaller. Responsive `srcset`/`sizes` allow smaller versions to be selected; hero `<picture>` sources also switch compositions at the layout breakpoint. Hero images have high fetch priority; below-the-fold images load lazily. Alternative text describes what is visible and does not identify crop varieties that cannot be confirmed from the image.

The shared media registry is `src/content/media.js`; the build validates every responsive variant through `scripts/prepare-assets.js`. Existing Our Story illustrations, product records, account access and ordering status are preserved.
