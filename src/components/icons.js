import manifest from '../../design-system/icons/manifest.json' with { type: 'json' };

const availableIcons = new Set(manifest.icons);

// Consume the approved Field Notes family; never redraw or mix icon families.
export function icon(name) {
  if (!availableIcons.has(name)) throw new Error(`Unknown WeGroween icon: ${name}`);
  return `<svg class="wg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="/icons/field-notes.svg#wg-${name}"></use></svg>`;
}
