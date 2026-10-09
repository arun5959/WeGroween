# Contact page

Implemented at `/help`, labelled **Contact** in navigation and page metadata. C08 remains the same public route; the 37-page registry is preserved.

The user selected approach 2 as primary, combined with approach 3 as FAQs on 2026-10-07. The original gallery remains in `design-system/contact-directions/2026-10-07`; the accepted composition is recorded in `selection.json` there.

Page order: editorial introduction, enquiry form with direct email/phone/Instagram alongside it, then three expandable FAQs. Mobile follows the same priority with the form first. FAQ answers are informational, with no enquiry actions. The catalogue link uses an inline editorial style aligned with the section text.

The form validates email and message, then prepares a local draft. An explicit **Open in your email app** link opens a mailto draft for the visitor to send. It does not submit to a website service or store form data. Editing any form field invalidates the prepared draft. Navigation disposes the page listeners. Without JavaScript, the form stays hidden and direct contacts and FAQs remain available.

Contact details reuse `src/content/contact.js`. Copy and topics live in `src/content/enquiries.js`; the rendered page, lifecycle setup and styles live in `src/pages/contact.js`, `src/app/contact-form.js` and `src/styles/components/contact.css`. Existing brand tokens and button states are retained.

Native website sending would require a separate delivery-service integration. Opening hours, response commitments, exact address and delivery coverage remain unconfirmed.

FAQ answers now expand and collapse with the shared 220ms motion timing, including the surrounding section height. Rapid clicks reverse from the current height. Form feedback and draft changes use the same layout helper. Reduced-motion preferences settle transitions immediately, and native FAQs still work without JavaScript.

Validation: `npm run check` includes contact tests for field validation, safe draft rendering and encoding, stale drafts, FAQ keyboard use, client navigation and no-JavaScript support, alongside the existing route and responsive checks.
