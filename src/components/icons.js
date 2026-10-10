import manifest from '../../design-system/icons/manifest.json' with { type: 'json' };

const availableIcons = new Set(manifest.icons);

// Consume the approved Field Notes family; never redraw or mix icon families.
export function icon(name) {
  // Reverse the approved arrow geometry for return navigation.
  if (name === 'arrow-left') return `<svg class="wg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g transform="rotate(180 12 12)"><use href="/icons/field-notes.svg#wg-arrow-right"></use></g></svg>`;
  if (!availableIcons.has(name)) throw new Error(`Unknown WeGroween icon: ${name}`);
  return `<svg class="wg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="/icons/field-notes.svg#wg-${name}"></use></svg>`;
}
