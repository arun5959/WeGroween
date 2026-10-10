# WeGroween Design Language System

Updated 2026-10-05 | 1.3.0-proposed | PROPOSED release

This is the active schema-2 design-language package. The user accepted the migration mapping and additions, and requested all three palette previews. C2 Soil & Saffron remains primary, with T2 Fraunces + DM Sans, G3 Curated Market, I1 Field Notes, H1 Harvest to Home and the authorized R3 project photographs.

Start with [the comparison gallery](artifact/index.html), [the primary responsive homepage](artifact/homepage-palette-2.html), and [project status](PROJECT_STATUS.md).

## Current deliverables

- Homepage PDFs: pdf/wegroween-homepage-prototype-palette-2.pdf (primary), palette-1.pdf and palette-3.pdf (comparisons); each uses the approved three-page format.
- pdf/wegroween-imagery-direction-guide.pdf: separate two-page art-direction guide.
- pdf/wegroween-design-direction-manual.pdf: synchronized 15-page manual.
- Narrative/system documents: BRAND_IDENTITY_BLUEPRINT.md, DESIGN_SYSTEM.md, IMAGERY_DIRECTION_GUIDE.md, DESIGN_DIRECTION_MANUAL.md, research-summary.md and decisions.md.
- Canonical inputs: design-language.json, design-tokens.json and language-state.json; generated tokens.css. State owns current progress and approvals.
- Review evidence: quality-review.json, QUALITY_REVIEW.md, migration-equivalence.json and validation/.

## Verified scope and remaining decision

165 selected values match the legacy system. All 26 current PDF pages were reviewed, nine palette/viewport cases have no measured overflow or broken images, 102 declared contrast checks pass and 609 rendered text-element checks have no measured failures. Gallery keyboard navigation and proposed-choice export work. These checks are not user testing or formal accessibility certification.

Final release status and a private archive destination still need leader confirmation. Pricing, delivery rules and public image rights remain unconfirmed. Wordmark/logo remains deferred. Existing historic research is carried with its dates; it was not refreshed in this migration.

The complete 92-file legacy rollback is retained under history/2026-10-05-system-migration/. Earlier root filenames such as artifact/components.html and older PDFs are legacy references; use the current filenames above. migration-v2 is the retained migration workspace. Existing project memory and product source remain unchanged.

## Rebuilding

Website neutral shades were refined on 2026-10-10 at the user's request: soft white `#FCFAF6`, card surface `#FAF7F0`, and existing warm dark text `#2B211D`. Canonical token values and generated `tokens.css` are synchronized. See [the interface color policy](../docs/INTERFACE_COLOR_POLICY.md). The historical PDFs and migration QA above were not reissued for this website update.

Use scripts/build_project_delivery.py for this project's authorized R3 presentation adapter, then scripts/validate_project_delivery.py rendered. The generic skill renderer cannot preserve the approved photo/form content and three-page presentation. The adapter retains the standard approval, token/CSS, coverage, file, hash, PDF and scope checks. Review affected rendered outputs after any rebuild; final validation additionally requires confirmed release and immutable private archival.
