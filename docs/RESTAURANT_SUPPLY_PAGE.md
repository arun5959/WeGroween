# Restaurant Supply page

Implemented route: `/restaurant-supply` (existing page type C07). This page combines the approved produce-led direction with the structured business enquiry direction.

## Information sequence

1. An editorial introduction and a direct anchor to the enquiry.
2. Separate mushroom and microgreen sections linking to the existing catalogue categories.
3. A compact account of the brand's terrace-gardening beginnings, linking to Our Story.
4. Three steps: share requirements, discuss possibilities, agree supply details.
5. A grouped enquiry: Your kitchen, Your produce, Your contact.
6. Four expandable FAQs about produce, approximate quantities, frequency, and delivery/pricing discussions.

The cream, soil brown, typography, custom interface icons, shared button states and increased section spacing come from the established DLS. Layouts stack on smaller screens. Existing route motion, smooth anchors and animated FAQs are retained; conditional fields and draft/error regions animate through the shared layout-motion controller and respect reduced motion.

The hero fits the viewport space below the sticky header on desktop. The frequency selector uses the shared [branded dropdown control](BRANDED_SELECT.md), also used on Contact, with keyboard and touch support.

### Enquiry form refinement (11 October 2026)

The approved header search field guides the enquiry controls: 44px inputs and frequency selector, cream fill, light warm borders, 14px desktop text and a stronger warm border on focus. Mobile inputs use 16px text. Textareas retain vertical resizing from 104px up to 240px, capped further at 40% of a short viewport; longer content scrolls internally with the shared branded scrollbar. Native fieldset/legend semantics, validation and conditional-field animation are retained.

Section headings use display type at 24px (22px on mobile), weight 500; labels use 14px, weight 500; supporting notes use 12px regular text. Label-to-control spacing is 6px, field gaps are 18px, heading-to-content spacing is 20px, and subsequent groups have a divider with separate breathing room. Produce checkboxes follow the warm control treatment with a soil-brown selected state and native keyboard semantics; forced-colour mode restores native checkbox rendering. Guidance uses smaller headings and 14px body text to stay secondary to the form.

Checked at 1440px, 390px and 320px with 44px controls and no horizontal overflow. Existing enquiry and dropdown browser checks cover validation, keyboard/touch use, draft preparation and animated conditional fields. See [the current geometry record](verification/supply-search-style.json); the earlier spacing review remains in [the previous verification record](verification/supply-form-refinement.json).

## Enquiry behaviour

- Kitchen name, city, contact person's name and at least one produce interest are required.
- At least an email address or phone number is required. A provided email or phone must pass basic format validation; the form does not verify ownership or deliverability.
- PIN is optional; when provided it must be six digits and cannot begin with zero.
- Mushrooms and microgreens reveal separate optional quantity fields. Another produce request reveals a required description. Unselected fields are disabled and omitted from the email, including retained values from earlier selections.
- The visitor reviews a safely rendered draft, then chooses to open it in their email application, addressed to `wegroween@gmail.com`. Editing the form discards the stale draft.
- No enquiry is sent, saved or uploaded by the site. A connected sending backend is still outside this implementation; delivery depends on the visitor's email application and their sending the email.
- Without JavaScript, the interactive form is hidden and an email link plus direct contact details remain available. FAQs use native disclosure behaviour.

No availability, minimum order, price, delivery coverage, recurring schedule or response time is promised. These are explicitly matters for discussion.

## Supplied images

The four photo spaces have now been populated with user-supplied media. See [the placement record](MEDIA_PLACEMENTS_2026-10-10.md) for the selected subjects, responsive crops and retained images. The original [image collection brief](RESTAURANT_SUPPLY_IMAGE_BRIEF.md) records the initial requirements.

## Source files

- `src/content/restaurant-supply.js`: copy, produce interests, frequency choices and FAQs.
- `src/pages/restaurant-supply.js`: page markup and responsive photo areas.
- `src/styles/components/restaurant-supply.css`: responsive layout using existing semantic tokens.
- `src/app/restaurant-supply-form.js`: local email-draft interaction and validation.
- `src/app/render-page.js` / `src/app/bootstrap.js`: existing-route rendering, metadata and disposable form setup.
- `tests/e2e/restaurant-supply.spec.js`: page, conditional fields, validation, safe draft, navigation, responsive and no-JavaScript checks.
