# Shop page structure audit

Reviewed 11 October 2026 against the running development website at http://127.0.0.1:5173/shop. This is a design and interaction audit, not a conversion study. Recommendations describe likely friction observed in the interface; no customer analytics or user study was available. Application source was not changed for this audit.

## Verdict

The visual foundation is coherent: supplied photography, cream and soil palette, Fraunces headings, aligned card tiers, distinct Buy now/Add to cart actions and smooth category changes. The main problem is the browsing structure around those cards. The page spends too much space introducing itself, presents local sort controls with a generic label, and becomes a long stack of products on phones.

Preserve the default editorial sections the user requested. Give deliberate product comparison a separate, clearly named mode rather than silently turning the default Shop into a flat catalogue.

## Observed structure

Header → large catalogue introduction → five category controls → product-count sentence → New to the harvest (4 products, local sort) → Kitchen favourites (4 products, local sort) → A little more to explore (3 products, local sort) → catalogue-preview notice → footer.

There are 11 distinct records, with no duplicates across the three collections. Mushrooms contains six records, including the two existing mixed selections; Microgreens contains five. Organic Harvest and Exotics each currently contain zero products.

## Measurements

CSS pixels after fonts and product images finished loading, at a 900px viewport height; document positions include the header. Main height includes the intro, filters, product collections, notice and page spacing, but excludes the footer.

| Viewport width | First product image starts | First Buy now starts | Main height | Grid columns |
| --- | ---: | ---: | ---: | ---: |
| 1440 | 542 | 956 | 2540 | 4 |
| 1024 | 587 | 992 | 3514 | 3 |
| 768 | 683 | 1115 | 4372 | 2 |
| 390 | 708 | 1142 | 7558 | 1 |
| 320 | 750 | 1159 | 7154 | 1 |

No horizontal page overflow appeared at these widths. Card body descriptions are 12px; primary and secondary actions retain 44px height. The default mobile page has eleven full-width product cards and repeated collection headings and sort controls.

Evidence: [desktop top](shop-top-1440.png), [mobile top](shop-top-390.png), [desktop collection](first-collection-1440.png), [full desktop](shop-full-1440.png), [full mobile](shop-full-390.png), [measured observations](observations.json).

## Findings, in priority order

### 1. Too much setup before products

The introductory heading and paragraph, category grid, count sentence, collection eyebrow/title and sort menu all precede the first image. On a 390px phone, the categories alone occupy 153px. The first product's buying action is beyond the initial 900px viewport even on desktop.

Recommendation: make Shop's intro smaller than the homepage hero, shorten its supporting sentence, and merge count and sorting into a compact browsing toolbar. On phones, use one 44px category selector rather than three rows of category controls. Keep every category accessible inside the branded selector, including the upcoming ranges. Aim to bring the first image into roughly the upper half of a typical phone viewport; confirm the final position visually rather than enforcing one rigid number across devices.

### 2. Sorting scope is easy to misread

There are three separate menus labelled Sort by. Sorting the first section by ascending price produces ₹180, ₹180, ₹180, ₹220. Kitchen favourites still starts with ₹140, and the last section keeps its own order. The implementation correctly sorts each collection, but the visible label does not explain that scope.

Recommendation: add two explicit browsing modes: Our selections (default) and All products. Curated mode preserves the editorial shelves. All products, and selected-category results, use a single sort control that acts on the complete visible result set. Sorting remains by the displayed pack price, not an invented common unit price. If a smaller intervention is preferred, retain the existing menus but rename their label to Sort this selection; this improves clarity without delivering whole-catalogue comparison.

### 3. Mobile browsing is excessively vertical

At 390px, the main content is about 7,558px tall for eleven products. Stacking two actions beneath every full-width image compounds the length. Making every card smaller again would risk weakening legibility while leaving the repeated structure intact.

Recommendation: use manually scrolled horizontal shelves for curated mobile sections, with one comfortable card and a visible preview of the next, explicit previous/next controls, keyboard access and reduced-motion support. No automatic carousel movement. Keep the conventional vertical grid/list in the deliberate All products or category-results mode. Preserve both requested purchase actions and their touch targets.

### 4. The final collection lacks a useful browsing purpose

A little more to explore says where the section appears, rather than why its products belong together. It contains two mixed mushroom selections and mixed microgreens. The first two collections have understandable roles, while this group needs more interpretation.

Recommendation: with the current small catalogue, start with two meaningful groups: Fresh discoveries (the current four new selections) and Kitchen favourites (the remaining seven records). This removes one collection header and its repeated control. If three sections are retained, give the last one a concrete use-case name such as For the whole plate, rather than restoring Pairings as a category. Use Fresh discoveries unless actual harvest/new-release dates are available.

### 5. Upcoming categories look like empty shopping filters

Organic Harvest 0 and Exotics 0 are currently presented beside populated categories. Their empty states are clear after opening, but the zero badge gives little explanation beforehand. These are future ranges, not failed searches.

Recommendation: label them Coming soon in the category selector and on their direct views. Keep their URLs and discoverability, show the existing clear empty state, and avoid adding products or organic claims without actual catalogue inputs. Retain product counts for populated categories.

### 6. Tablet rows are uneven

At 1024px, each four-product collection uses three columns, leaving one card alone in a second row. This creates large unused areas. At 768px, the category controls also wrap Exotics onto its own row.

Recommendation: prefer four columns when comfortable card width permits, then two on intermediate screens for four-item curated shelves. Use the compact category selector earlier when the desktop controls no longer fit on one line. Choose breakpoints from content fit, not just device labels. Longer All products results can use their own balanced grid.

### 7. Small repeated details add noise

The same Sample price text appears eleven times, alongside small body copy and long bundle-pack labels. This is intentional preview information, not a functional bug. At four columns, long pack descriptions need their existing wrapping and aligned tracks.

Recommendation: keep the card hierarchy image → name → short wrapping description → price and pack → two actions. Do not truncate names or packs. Consider a single clear preview notice above results, with necessary individual price context retained accessibly. Actual product availability and confirmed prices are business inputs; production currently keeps ordering closed.

## Recommended page composition

1. Compact Shop introduction.
2. Browsing toolbar: category selector, Our selections/All products mode, contextual result count, one sort control in results mode.
3. Default Our selections: Fresh discoveries, then Kitchen favourites. Four-column desktop shelves; comfortable horizontal mobile shelves.
4. Category or All products mode: one consistent product grid/list with the chosen global sort.
5. A short assistance/availability note where relevant, then the existing footer.

Keep the current theme, image treatment, aligned card tracks, product-detail click destination, separate buying controls and subtle motion. Avoid inserting another hero image, large promotion band or additional decision controls ahead of products. Prioritise intro/toolbar and sorting clarity first, then collection structure and mobile shelves.

## Interaction verification

Observed category filtering and URL updates, sorted first-collection prices, upcoming-range recovery, card-body navigation to the correct product, and Add to cart feedback without opening the drawer. Keyboard Enter activated a category while retaining focus; the sort menu accepted keyboard selection and returned focus; a product-name anchor opened its details with Enter. No browser JavaScript errors occurred during this review. No checkout, auth, payment or production ordering capability was inferred from the development preview.
