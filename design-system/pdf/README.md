# WeGroween PDF delivery

Status: **v1.2.0-proposed**.

## Final PDFs

- `wegroween-homepage-prototype.pdf` - R3 contains three client-facing pages for the approved H1 Harvest to Home direction: a 16:9 opening, one uninterrupted 1080 x 5256 point desktop homepage canvas, and a 16:9 responsive/interaction closing page. It uses mandatory Color Approach #1, C1 Orchard Ink, while retaining selected T2 typography and G3 grid behavior. By explicit leader authorization, R3 uses selected current project photography, current catalogue names, WhatsApp and Instagram details. Prices, pack sizes, serviceability states and delivery rules remain clearly illustrative or to be confirmed.
- `wegroween-design-direction-manual.pdf` - twenty A4 pages covering the brief, research synthesis, creative territories, Brand Identity Blueprint, three color approaches, two typography options, foundations, iconography, components, H1 rationale, accessibility, implementation, governance and sources.

## Maintainable sources

The Chromium print sources are stored under `source/`:

- `homepage-prototype.html` and `prototype.css`
- `design-direction-manual.html` and `manual.css`

The superseded five-screen R1 prototype and the placeholder-only continuous R2 prototype are preserved under `archive/r1-screen-deck/` and `archive/r2-continuous-placeholders/`.

Serve the repository root over HTTP before printing so local WOFF2 font files resolve correctly. Both documents contain their own page size, footer and print-color rules.

## QA record

- Homepage prototype R3: 3 pages. Pages 1 and 3 are 1152 x 648 PDF points; page 2 is one continuous 1080 x 5256 point homepage canvas.
- Design Direction Manual: 20 pages at A4, 594.96 x 841.92 PDF points.
- Every prototype page was rendered using PyMuPDF. The long homepage page was additionally inspected as five readable slices.
- Full-page renders and readable long-page slices were inspected for clipping, overlap, font failure, image crops and readable contrast. Selected R3 images were visually checked; watermarked candidates were excluded.
- PDF text extraction found text on every page and zero text characters outside page bounds.

The PDFs remain proposed until the Design Decision Leader completes the final release-status checkpoint.
