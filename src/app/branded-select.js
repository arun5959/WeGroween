import { icon } from '../components/icons.js';
import { mountHtml } from './hosting.js';

// Progressive enhancement: the native select remains the form's value source.
// Popups live outside animated form panels so expanding layouts never clip them.
export function setupBrandedSelects(root, { selector = 'select:not([multiple])' } = {}) {
  const controller = new AbortController();
  const events = { signal: controller.signal };
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups = [];
  let closeCurrent = () => {};
  const timing = getComputedStyle(document.documentElement).getPropertyValue('--motion-standard').trim();
  const duration = (parseFloat(timing) * (timing.endsWith('ms') ? 1 : 1000)) || 220;

  root.querySelectorAll(selector).forEach(select => {
    if (!select.id || select.disabled || select.querySelector('optgroup')) return;
    const labels = [...select.labels];
    const originalLabelFors = labels.map(label => label.htmlFor);
    const originalHidden = select.hidden;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `${select.id}-trigger`;
    button.className = 'wg-select-trigger';
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `${select.id}-listbox`);
    button.innerHTML = `<span class="wg-select-value" id="${select.id}-value"></span>${mountHtml(icon('chevron-down'))}`;
    if (select.hasAttribute('aria-describedby')) button.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
    const labelIds = labels.map((label, index) => {
      if (!label.id) label.id = `${select.id}-label-${index}`;
      label.htmlFor = button.id;
      return label.id;
    });
    if (labelIds.length) button.setAttribute('aria-labelledby', labelIds.join(' '));
    else button.setAttribute('aria-label', select.getAttribute('aria-label') || select.name);
    select.hidden = true;
    select.insertAdjacentElement('afterend', button);

    const list = document.createElement('div');
    list.id = `${select.id}-listbox`;
    list.className = 'wg-select-listbox';
    list.setAttribute('role', 'listbox');
    list.setAttribute('data-lenis-prevent', '');
    list.setAttribute('aria-label', labels.map(label => label.textContent.trim()).join(' ') || select.name);
    list.hidden = true;
    // Keep a modal's popup in the same native top layer as its input.
    (select.closest('dialog') || document.body).append(list);
    const choices = [...select.options];
    const items = choices.map((choice, index) => {
      const item = document.createElement('div');
      item.id = `${select.id}-option-${index}`;
      item.className = 'wg-select-option';
      item.setAttribute('role', 'option');
      item.dataset.index = String(index);
      const text = document.createElement('span');
      text.textContent = choice.label;
      item.append(text);
      item.insertAdjacentHTML('beforeend', mountHtml(icon('check')));
      if (choice.disabled) item.setAttribute('aria-disabled', 'true');
      list.append(item);
      return item;
    });
    let open = false;
    let active = select.selectedIndex;
    let frame = 0;
    let animation;
    let search = '';
    let lastSearch = 0;
    const enabled = () => choices.map((choice, index) => choice.disabled ? -1 : index).filter(index => index >= 0);

    function sync() {
      button.querySelector('.wg-select-value').textContent = choices[select.selectedIndex]?.label || '';
      items.forEach((item, index) => item.setAttribute('aria-selected', String(index === select.selectedIndex)));
      if (!open) active = select.selectedIndex;
    }

    function position() {
      if (!open) return;
      const box = button.getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = viewport?.offsetTop ?? 0;
      const height = viewport?.height ?? innerHeight;
      const header = root.querySelector('.site-header')?.getBoundingClientRect().bottom ?? top;
      const floor = Math.max(top + 8, header + 8);
      if (box.bottom <= floor || box.top >= top + height - 8) { close({ immediate: true }); return; }
      const below = Math.max(0, top + height - box.bottom - 16);
      const above = Math.max(0, box.top - floor - 8);
      const desired = Math.min(list.scrollHeight, 320);
      const upward = below < desired && above > below;
      const room = upward ? above : below;
      const popupHeight = Math.min(desired, room);
      list.dataset.side = upward ? 'up' : 'down';
      list.style.width = `${Math.min(box.width, document.documentElement.clientWidth - 16)}px`;
      list.style.left = `${Math.max(8, Math.min(box.left, document.documentElement.clientWidth - box.width - 8))}px`;
      list.style.maxHeight = `${Math.max(0, room)}px`;
      list.style.top = `${upward ? box.top - popupHeight - 8 : box.bottom + 8}px`;
    }

    function queuePosition() {
      if (!open || frame) return;
      frame = requestAnimationFrame(() => { frame = 0; position(); });
    }

    function highlight(index, scroll = true) {
      active = index;
      items.forEach((item, i) => item.classList.toggle('is-active', i === active));
      button.setAttribute('aria-activedescendant', items[active]?.id || '');
      if (scroll && items[active]) {
        const item = items[active];
        // Scroll only the list; native scrollIntoView can move the whole page.
        if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
        else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
      }
    }

    function close({ immediate = false } = {}) {
      if (!open && list.hidden) return;
      open = false;
      button.setAttribute('aria-expanded', 'false');
      button.removeAttribute('aria-activedescendant');
      list.inert = true;
      list.setAttribute('aria-hidden', 'true');
      animation?.cancel();
      if (immediate || preference.matches || !list.animate) list.hidden = true;
      else {
        animation = list.animate([{ opacity: 1 }, { opacity: 0 }], { duration: duration / 2, easing: 'ease-out' });
        animation.onfinish = () => { if (!open) list.hidden = true; };
      }
    }

    function show() {
      if (open || !enabled().length) return;
      closeCurrent({ immediate: true });
      closeCurrent = close;
      open = true;
      search = '';
      animation?.cancel();
      list.hidden = false;
      list.inert = false;
      list.removeAttribute('aria-hidden');
      button.setAttribute('aria-expanded', 'true');
      position();
      if (!open) return;
      highlight(choices[select.selectedIndex]?.disabled ? enabled()[0] : select.selectedIndex);
      if (!preference.matches && list.animate) animation = list.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration, easing: 'ease-out' });
    }

    function choose(index) {
      if (index < 0 || choices[index]?.disabled) return;
      const changed = select.selectedIndex !== index;
      select.selectedIndex = index;
      sync();
      close();
      button.focus({ preventScroll: true });
      if (changed) {
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    button.addEventListener('click', () => open ? close() : show(), events);
    button.addEventListener('keydown', event => {
      const indices = enabled();
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const wasOpen = open;
        show();
        let index = indices.indexOf(active);
        if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = indices.length - 1;
        else if (wasOpen) index = Math.max(0, Math.min(indices.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
        highlight(indices[Math.max(0, index)]);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (open) choose(active);
        else show();
      } else if (event.key === 'Escape' && open) {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (event.key === 'Tab') close();
      else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        show();
        const now = performance.now();
        search = now - lastSearch > 600 ? event.key.toLowerCase() : search + event.key.toLowerCase();
        lastSearch = now;
        const repeated = [...search].every(char => char === search[0]);
        const query = repeated ? search[0] : search;
        const start = repeated ? indices.indexOf(active) + 1 : 0;
        const ordered = [...indices.slice(start), ...indices.slice(0, start)];
        const match = ordered.find(index => choices[index].label.trim().toLowerCase().startsWith(query));
        if (match !== undefined) highlight(match);
      }
    }, events);
    list.addEventListener('pointerdown', event => event.preventDefault(), events);
    list.addEventListener('pointermove', event => {
      const item = event.target.closest('[role="option"]');
      if (item && !choices[Number(item.dataset.index)].disabled) highlight(Number(item.dataset.index), false);
    }, events);
    list.addEventListener('click', event => {
      const item = event.target.closest('[role="option"]');
      if (item) choose(Number(item.dataset.index));
    }, events);
    button.addEventListener('blur', () => close(), events);
    document.addEventListener('pointerdown', event => {
      if (open && !button.contains(event.target) && !list.contains(event.target)) close();
    }, events);
    window.addEventListener('scroll', queuePosition, { ...events, capture: true, passive: true });
    window.addEventListener('resize', queuePosition, events);
    window.visualViewport?.addEventListener('resize', queuePosition, events);
    window.visualViewport?.addEventListener('scroll', queuePosition, events);
    preference.addEventListener('change', () => { animation?.cancel(); if (!open) list.hidden = true; }, events);
    select.addEventListener('change', sync, events);
    select.form?.addEventListener('reset', () => queueMicrotask(sync), events);
    sync();
    cleanups.push(() => {
      animation?.cancel();
      cancelAnimationFrame(frame);
      list.remove();
      button.remove();
      select.hidden = originalHidden;
      labels.forEach((label, index) => { label.htmlFor = originalLabelFors[index]; });
    });
  });

  return () => { controller.abort(); cleanups.forEach(cleanup => cleanup()); };
}
