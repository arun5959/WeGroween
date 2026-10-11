# Catalogue asset review

Reviewed 11 October 2026: all 28 original photographs at the root of public/media, using filenames and a labelled visual contact sheet. The supplied originals remain unchanged.

The catalogue now contains 11 asset-backed records, increased from 2: six records under Mushrooms (four individual options and two mixed selections) and five under Microgreens. Organic Harvest and Exotics are new categories with themed placeholders and empty range states; no products or organic growing claims have been invented. Prices, packs and stock remain fictional review values. Photography supports the visual catalogue; it does not establish cultivation, actual stock or confirmed sale offers.

| Product | Category | Matching original image | Sample pack | Sample price |
| --- | --- | --- | --- | ---: |
| Button mushrooms | Mushrooms | Natural White Mushroom Still Life.png | 200 g | ₹140 |
| Oyster mushrooms | Mushrooms | Fresh Oyster Mushroom Cluster.png | 200 g | ₹180 |
| White oyster mushrooms | Mushrooms | Creamy Oyster Mushroom Cluster.png | 200 g | ₹180 |
| Golden oyster mushrooms | Mushrooms | Golden Oyster Mushroom Cluster.png | 200 g | ₹220 |
| Radish microgreens | Microgreens | Fresh Pink-Stemmed Microgreens Pile.png | 50 g | ₹190 |
| Broccoli microgreens | Microgreens | Fresh Broccoli Microgreens on Stone.png | 50 g | ₹180 |
| Sunflower microgreens | Microgreens | Fresh Sunflower Sprouts on Stone.png | 50 g | ₹170 |
| Mustard microgreens | Microgreens | Fresh Mustard Microgreens on Stone Surface.png | 50 g | ₹180 |
| Mixed microgreens | Microgreens | Vibrant Mixed Microgreens on Ceramic Plate.png | 50 g | ₹200 |
| Mushroom & microgreen pairing | Mushrooms | Rustic Mushroom and Microgreen Platter (1).png | 200 g mushrooms + 50 g microgreens | ₹320 |
| Oyster & radish pairing | Mushrooms | Oyster Mushrooms with Radish Microgreens.png | 200 g mushrooms + 50 g microgreens | ₹350 |

The grey, pale and golden oyster photographs support separate visual options. Their commercial varieties and labels should be confirmed before launch. The mixed selection and two pairings are review concepts based on the supplied arrangements.

## Remaining asset roles

- Oyster Mushroom Cluster on Stone.png: alternate pale oyster photograph; also already used on Restaurant Supply.
- Rustic Hands Tearing Oyster Mushrooms.png: preparation detail for oyster mushrooms.
- Oyster Mushrooms on the Grow Rack.png, Harvesting Microgreens on Indoor Racks.png and Industrial Microgreens and Mushroom Farm.png: cultivation or editorial scenes, rather than standalone products.
- Fresh Microgreens on Stone Texture.png: alternate mixed microgreen close-up; already used on Restaurant Supply.
- Vibrant Microgreen Trio Overhead.png: category image, rather than three unverified product records.
- Rustic Mixed Mushroom Harvest.png: mushroom category image.
- Other platters, medleys and still lifes: alternate category, pairing and editorial images. Repeated compositions do not become duplicate products.
- Rustic Mushrooms with Pea Shoots.png shows a plated arrangement. There is no dedicated standalone pea-shoot photograph, so a standalone product was not added.
- The portrait/landscape parchment and sautéed-dish pairs continue serving the existing hero layouts.

## Implementation

Each product has a stable URL, its matching image and alternative text, a wrapping description, explicit sample pack and price, and the established primary/secondary card actions. Search aliases support terms such as yellow oyster, sunflower sprouts and combo. The two existing mixed mushroom selections remain under Mushrooms. Pairings has been retired as a category; its old category URL and /combos.html return to Shop.

Clicking a product card's image or non-interactive content opens that product's details without adding anything to the basket. Its name remains a native keyboard link. Buy now alone adds a sample pack and continues to checkout; Add to cart adds a sample pack without opening the drawer. A compact notification confirms the product and total item count, and the header count gently animates. These separate actions apply to collection, category and related-product cards. Public browsing remains enabled when ordering is closed; text selection does not navigate.

Detail-page additions use the same feedback. Notifications dismiss after four seconds, pause on hover/focus and can be closed manually; focus stays on the addition control. Cart counts total quantities rather than distinct product names, update on removal and quantity changes, and persist across client navigation. A direct mobile header Cart control keeps the count visible. Reduced motion disables the feedback animations. The drawer opens only through an explicit Cart link.

Thirty-three WebP derivatives at 480, 768 and 1448 pixels reduce the 11 selected source photographs from 23.68 MiB to 2.54 MiB for all three sizes combined. Cards and detail images use responsive sources; search uses a smaller thumbnail. Detail pages show up to three relevant suggestions rather than repeating the entire catalogue.

The development workspace consumes the explicit product pack and price, replacing the old first-product-versus-all-others defaults. New products participate in sample cart, checkout and operations. Production ordering remains closed.

Visual inventory: [contact sheet](asset-contact-sheet.jpg). Exact optimisation mapping: [JSON mapping](product-image-mapping.json).

## Shop structure after the approved audit

The default Our selections view groups the 11 products once across Fresh discoveries (4) and Kitchen favourites (7). These are editorial choices, not verified sales rankings or harvest timestamps. A compact introduction and branded Category selector sit beside Our selections / All products. Populated options show counts; Organic Harvest and Exotics explicitly say Coming soon and retain their honest empty states.

Desktop cards use four columns above 1050px and two from 721px to 1050px. Curated shelves become manually scrolled horizontal rows at 720px and below, with a preview of the next card, previous/next buttons, position feedback and Arrow/Home/End keyboard support. There is no autoplay. All products and category results keep a conventional responsive grid/list for comparison. Body copy remains readable and purchase controls retain 44px targets. The established card actions, detail URLs and aligned content tracks are preserved.

## Shared navigation and sorting

Category changes and browsing-mode changes update only Shop results and toolbar state; the page, header, selects and footer stay mounted. Category paths remain shareable. View and sort choices use URL query parameters, so reload and browser history recover the selected state. Our selections returns to the editorial layout. A native link fallback retains category navigation without JavaScript.

One Sort by menu appears only in All products or populated category results and sorts the entire visible set by name, availability or displayed sample pack price. Our selection restores catalogue order. Sorting reorders existing card nodes, preserves dropdown focus, announces results and uses the established subtle motion. Reduced-motion preferences also apply to shelf scrolling.

Development availability uses illustrative inventory; public availability remains unconfirmed and the availability sort retains catalogue order. Equal prices retain their original relative order. The visible count / Sample prices row has been removed, with product-count announcements and individual price context retained accessibly; the bottom note explains that prices, packs and availability await confirmation.

Implementation evidence and before/after measurements: [Shop implementation review](../shop-audit-2026-10-11/SHOP_IMPLEMENTATION.md).
