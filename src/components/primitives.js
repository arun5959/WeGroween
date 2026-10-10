import { icon } from './icons.js';

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function link(label, href, variant = 'primary', { direction = 'forward' } = {}) {
  const isBack = direction === 'back';
  return `<a class="button button--${escapeHtml(variant)}" href="${escapeHtml(href)}">${isBack ? icon('arrow-left') : ''}${escapeHtml(label)}${!isBack && variant === 'primary' ? icon('arrow-right') : ''}</a>`;
}

export function notice(title, message) {
  return `<div class="notice"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;
}

export function field({ id, label, type = 'text', hint = '', disabled = false, error = '' }) {
  const messages = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ');
  return `<div class="field"><label for="${escapeHtml(id)}">${escapeHtml(label)}</label><input id="${escapeHtml(id)}" name="${escapeHtml(id)}" type="${escapeHtml(type)}" ${disabled ? 'disabled' : ''} ${messages ? `aria-describedby="${escapeHtml(messages)}"` : ''} ${error ? 'aria-invalid="true"' : ''}>${hint ? `<p id="${escapeHtml(id)}-hint" class="muted text-sm">${escapeHtml(hint)}</p>` : ''}${error ? `<p id="${escapeHtml(id)}-error" class="field-error">${escapeHtml(error)}</p>` : ''}</div>`;
}

export function pageIntro(eyebrow, heading, description = '') {
  return `<header class="page-intro"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(heading)}</h1>${description ? `<p class="lead">${escapeHtml(description)}</p>` : ''}</header>`;
}
