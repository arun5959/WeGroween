import { escapeHtml as e, link } from './primitives.js';
import { icon } from './icons.js';

export const tag = value => `<span class="account-tag">${e(value)}</span>`;
export const action = (label, type, record = '') => `<button class="account-text-action" type="button" data-work-action="${e(type)}" data-record="${e(record)}">${e(label)}</button>`;
export const demoNote = () => `<p class="work-demo">${icon('information')} Design workspace · Fictional records and illustrative prices. Changes stay in this tab and reset on reload.</p>`;
export function workHeader(eyebrow, title, description, actions = '') {
  return `<header class="work-header"><div><p class="eyebrow">${e(eyebrow)}</p><h1 tabindex="-1">${e(title)}</h1><p>${e(description)}</p></div>${actions ? `<div class="work-header-actions">${actions}</div>` : ''}</header>`;
}
export function panel(title, body, aside = '') {
  return `<section class="work-panel"><div class="work-section-heading"><h2>${e(title)}</h2>${aside}</div>${body}</section>`;
}
export function workField(name, label, value = '', options = {}) {
  const id = `work-${name}`;
  const disabled = options.disabled ? 'disabled' : '';
  const required = options.required ? 'required' : '';
  const input = options.choices
    ? `<select id="${id}" name="${e(name)}" ${disabled}>${options.choices.map(choice => `<option value="${e(choice)}" ${choice === value ? 'selected' : ''}>${e(choice)}</option>`).join('')}</select>`
    : options.type === 'textarea'
      ? `<textarea id="${id}" name="${e(name)}" rows="3" maxlength="1200" data-lenis-prevent ${required} ${disabled}>${e(value)}</textarea>`
      : `<input id="${id}" name="${e(name)}" type="${e(options.type || 'text')}" value="${e(value)}" ${options.type === 'number' ? `min="${options.min ?? 0}" max="${options.max ?? 1000000}" step="${options.step ?? 1}"` : 'maxlength="160"'} ${required} ${disabled} ${options.autocomplete ? `autocomplete="${e(options.autocomplete)}"` : ''}>`;
  return `<div class="field">${options.type === 'checkbox' ? `<label class="work-check"><input type="checkbox" name="${e(name)}" ${value ? 'checked' : ''} ${disabled}>${e(label)}</label>` : `<label for="${id}">${e(label)}</label>${input}`}${options.hint ? `<p class="muted work-small">${e(options.hint)}</p>` : ''}</div>`;
}
export function workForm(key, body, label = 'Save changes') {
  return `<form data-work-form="${e(key)}" class="work-form">${body}<div class="work-form-actions"><button class="button" type="submit">${e(label)} ${icon('arrow-right')}</button><p class="work-small muted">Local design preview. Nothing is sent.</p></div></form>`;
}
export function metrics(items) {
  return `<dl class="work-metrics">${items.map(([label, value, note]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd><p>${e(note)}</p></div>`).join('')}</dl>`;
}
export function table(headers, rows, { search = 'Find a record', statuses = [] } = {}) {
  return `<section class="work-records"><div class="work-toolbar"><div class="field"><label for="work-filter">${e(search)}</label><input id="work-filter" type="search" data-work-filter placeholder="Search these records" maxlength="120"></div>${statuses.length ? workField('status-filter', 'Status', 'All statuses', { choices: ['All statuses', ...statuses] }) : ''}<p class="work-small" data-work-count>${rows.length} records</p></div><div class="work-table-scroll" tabindex="0" role="region" aria-label="Records table" data-lenis-prevent><table class="work-table"><thead><tr>${headers.map(h => `<th scope="col">${e(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr data-work-row data-status="${e(row.status || '')}">${row.cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="work-no-results" data-work-empty hidden>No matching records. Try another name or clear the filters.</p></section>`;
}
export const saveActions = () => `<div class="work-form-actions"><button class="button" type="submit">Save changes</button><button type="button" class="button button--secondary" data-work-close>Cancel</button></div>`;
export const back = (label, href) => link(label, href, 'quiet', { direction: 'back' });
