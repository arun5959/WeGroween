# WeGroween dropdown control

`setupBrandedSelects(root)` in `src/app/branded-select.js` progressively enhances the existing single-select fields on Restaurant Supply and Contact. Styles live in `src/styles/components/select.css` and consume the established DLS colours, typography, input dimensions, radii and timings.

The native select stays hidden as the form value source. Its label is associated with a visible select-only combobox button. The popup is a listbox with selected-option semantics, a custom Field Notes check icon and a rotating Field Notes chevron. All option labels are inserted as plain text. Selecting an option dispatches native input and change events, preserving draft invalidation and contact-topic guidance.

## Interaction

- Click/tap, Enter or Space opens the popup. Enter/Space or a click/tap selects the active option.
- Arrow keys move the active option; Home/End move to the first/last enabled option. Typing searches by the beginning of an option label; repeated letters cycle matching options.
- Escape cancels without changing the committed value. Tab closes and follows the normal form tab order. Clicking elsewhere or scrolling the trigger out of view closes the popup.
- Focus remains on the combobox, with `aria-activedescendant` identifying the active option. A choice restores focus to the control.
- The popup uses a subtle opening fade/translation and closing fade. Live reduced-motion changes settle animations immediately.

Popups are rendered under the document body so form height animations cannot clip them. They choose an upward or downward placement, stay inside the visible viewport, scroll internally with Lenis prevention, and follow the trigger during page scrolling or resizing. Opening a popup does not resize the form. Page disposal removes popup nodes and listeners; client navigation never accumulates old controls.

## Reuse

Provide a labelled native `<select>` with a stable unique ID and name in the rendered page. The shared bootstrap enhances it automatically. The current component handles single selects without option groups; multiple, disabled or grouped selects retain their native presentation. Disabled options are skipped during navigation. Static/no-JavaScript output retains the original markup and fallback behaviour.

## Restaurant Supply hero

The desktop hero now uses the viewport height remaining below the measured sticky header. Its portrait image space preserves the 4:5 ratio while sizing within that height; typography and spacing also respond to the viewport. There is no fixed-height clipping or scaling of the whole section. On smaller widths, the hero stacks naturally and the empty image area remains landscape 4:3.

Verified desktop viewports: 1920×882, 1536×706, 1440×900, 1366×768, 1280×720, 1024×600 and 1920×600. Very small or highly zoomed viewports may naturally require scrolling; content remains visible rather than being hidden to enforce a height.
