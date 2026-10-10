import { categories } from '../content/foundation.js';
import { escapeHtml } from '../components/primitives.js';
import { mountHtml, siteUrl, appPath } from './hosting.js';
import { normalizeSearch, searchCatalogue } from './catalogue-search.js';

export function setupHeaderSearch(root, { beforeOpen = () => {}, navigate }) {
  const header = root.querySelector('.site-header');
  const form = header?.querySelector('[data-header-search]');
  if (!form) return { handleClick: () => false, close: () => {}, open: () => {}, isOpen: () => false, dispose: () => {} };
  const inner = header.querySelector('.header-inner');
  const input = form.querySelector('input');
  const panel = form.querySelector('[data-header-search-panel]');
  const list = form.querySelector('[role="listbox"]');
  const empty = form.querySelector('[data-header-search-empty]');
  const count = form.querySelector('[data-header-search-count]');
  const status = form.querySelector('[data-header-search-status]');
  const closeButton = form.querySelector('.header-search-close');
  const triggers = [...header.querySelectorAll(`a[href="${siteUrl('/search')}"]`)];
  triggers.forEach(element => element.classList.add('header-search-trigger'));
  const hiddenGroups = [...header.querySelectorAll('.site-navigation'), ...triggers];
  const originalInert = new Map(hiddenGroups.map(element => [element, element.inert]));
  const events = new AbortController();
  const options = { signal: events.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opened = false;
  let trigger = null;
  let fieldAnimation = null;
  let panelAnimation = null;
  let results = [];
  let active = -1;
  let sequence = 0;
  let composing = false;
  let panelOpen = false;

  triggers.forEach(element => {
    element.setAttribute('aria-expanded', 'false');
    element.setAttribute('aria-controls', 'header-search-input');
  });
  const motion = getComputedStyle(document.documentElement);
  const easing = motion.getPropertyValue('--motion-easing-standard').trim() || 'ease-out';

  function geometry() {
    const bounds = inner.getBoundingClientRect();
    const brand = header.querySelector('.brand').getBoundingClientRect();
    const small = matchMedia('(max-width: 1050px)').matches;
    const slot = triggers.find(item => item.closest(matchMedia('(max-width: 720px)').matches ? '.mobile-header-controls' : '.header-actions'));
    const edge = slot.getBoundingClientRect().right;
    const left = small ? bounds.left : brand.right + 32;
    form.style.setProperty('--search-top', `${brand.top + brand.height / 2}px`);
    form.style.setProperty('--search-left', `${left}px`);
    form.style.setProperty('--search-right', `${document.documentElement.clientWidth - edge}px`);
    const viewport = window.visualViewport;
    const bottom = form.getBoundingClientRect().bottom;
    panel.style.maxHeight = `${Math.max(80, Math.min(380, (viewport ? viewport.offsetTop + viewport.height : innerHeight) - bottom - 24))}px`;
    return left;
  }
  function stopFieldAnimation() { fieldAnimation?.cancel(); fieldAnimation = null; }
  function stopPanelAnimation() { panelAnimation?.cancel(); panelAnimation = null; }
  function showPanel(show) {
    const wasVisible = panelOpen;
    const previousOpacity = getComputedStyle(panel).opacity;
    panelOpen = show;
    stopPanelAnimation();
    if (!show) {
      panel.inert = true;
      input.setAttribute('aria-expanded', 'false');
      if (panel.hidden || reduced.matches) { panel.hidden = true; return; }
      const animation = panel.animate([{ opacity: previousOpacity, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 160, easing, fill: 'forwards' });
      panelAnimation = animation;
      animation.onfinish = () => { if (panelAnimation === animation) { panel.hidden = true; stopPanelAnimation(); } };
      return;
    }
    panel.hidden = false;
    panel.inert = false;
    geometry();
    input.setAttribute('aria-expanded', String(results.length > 0));
    if (!wasVisible && !reduced.matches) {
      panelAnimation = panel.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200, easing });
    }
  }
  function setActive(index) {
    active = index;
    const rows = [...list.querySelectorAll('[role="option"]')];
    rows.forEach((row, i) => row.setAttribute('aria-selected', String(i === active)));
    if (active < 0) input.removeAttribute('aria-activedescendant');
    else {
      const row = rows[active];
      input.setAttribute('aria-activedescendant', row.id);
      const bounds = row.getBoundingClientRect();
      const area = panel.getBoundingClientRect();
      if (bounds.bottom > area.bottom) panel.scrollTop += bounds.bottom - area.bottom;
      else if (bounds.top < area.top) panel.scrollTop -= area.top - bounds.top;
    }
  }
  function updateResults() {
    if (!opened || composing) return;
    results = searchCatalogue(input.value);
    active = -1;
    input.removeAttribute('aria-activedescendant');
    if (normalizeSearch(input.value).length < 2) { showPanel(false); status.textContent = ''; return; }
    const previousHeight = panelOpen ? panel.getBoundingClientRect().height : 0;
    list.innerHTML = mountHtml(results.map((product, i) => `<li><a id="header-search-result-${i}" role="option" aria-selected="false" tabindex="-1" class="header-search-result" href="/products/${escapeHtml(product.slug)}" data-search-index="${i}"><img src="${escapeHtml(product.image)}" alt="" width="48" height="48" decoding="async"><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(categories.find(category => category.slug === product.category)?.name ?? product.category)}</small></span></a></li>`).join(''));
    list.hidden = !results.length;
    empty.hidden = Boolean(results.length);
    count.hidden = !results.length;
    count.textContent = `${results.length} ${results.length === 1 ? 'product' : 'products'}`;
    form.querySelector('[data-header-search-message]').textContent = `No matches for “${input.value.trim()}”.`;
    status.textContent = results.length ? `${count.textContent} found. Use the arrow keys to explore.` : `No matching products for ${input.value.trim()}.`;
    panel.scrollTop = 0;
    showPanel(true);
    if (previousHeight && !reduced.matches) {
      const nextHeight = panel.getBoundingClientRect().height;
      if (Math.abs(previousHeight - nextHeight) > 1) panelAnimation = panel.animate([{ height: `${previousHeight}px` }, { height: `${nextHeight}px` }], { duration: 150, easing });
    }
  }
  function close({ restoreFocus = true, immediate = false, clear = false } = {}) {
    if (!opened) return;
    opened = false;
    panelOpen = false;
    const request = ++sequence;
    const currentStyle = getComputedStyle(form);
    const currentLeft = parseFloat(currentStyle.left);
    const currentOpacity = currentStyle.opacity;
    stopFieldAnimation();
    stopPanelAnimation();
    const target = trigger?.getBoundingClientRect();
    delete header.dataset.searchOpen;
    hiddenGroups.forEach(element => { element.inert = originalInert.get(element); });
    triggers.forEach(element => element.setAttribute('aria-expanded', 'false'));
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    if (clear) input.value = '';
    const finish = () => { if (sequence === request && !opened) { form.hidden = true; panel.hidden = true; stopFieldAnimation(); } };
    if (immediate || reduced.matches) finish();
    else {
      const bounds = inner.getBoundingClientRect();
      const start = Math.min(Math.max(bounds.left, target?.left ?? bounds.right - 100), bounds.right - 100);
      fieldAnimation = form.animate([{ left: `${currentLeft}px`, opacity: currentOpacity }, { left: `${start}px`, opacity: 0 }], { duration: 280, easing, fill: 'forwards' });
      fieldAnimation.onfinish = finish;
    }
    // A collapsing search must never leave its controls reachable after focus exits.
    form.inert = true;
    if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
  }
  function open(element = triggers.find(item => item.getClientRects().length), query) {
    if (opened) { input.focus({ preventScroll: true }); return; }
    const priorLeft = !form.hidden ? parseFloat(getComputedStyle(form).left) : null;
    const priorOpacity = !form.hidden ? getComputedStyle(form).opacity : 0;
    stopFieldAnimation();
    const request = ++sequence;
    trigger = element?.closest('.mobile-menu-actions') ? triggers.find(item => item.closest('.mobile-header-controls')) : element;
    const bounds = inner.getBoundingClientRect();
    const start = Math.min(Math.max(bounds.left, trigger?.getBoundingClientRect().left ?? bounds.right - 100), bounds.right - 100);
    beforeOpen();
    opened = true;
    form.hidden = false;
    form.inert = false;
    if (query !== undefined) input.value = query.slice(0, 120);
    const end = geometry();
    header.dataset.searchOpen = 'true';
    hiddenGroups.forEach(group => { group.inert = true; });
    triggers.forEach(item => item.setAttribute('aria-expanded', 'true'));
    input.focus({ preventScroll: true });
    if (!reduced.matches) {
      fieldAnimation = form.animate([{ left: `${priorLeft ?? start}px`, opacity: priorOpacity }, { left: `${end}px`, opacity: 1 }], { duration: 300, easing, fill: 'forwards' });
      fieldAnimation.onfinish = () => { if (request === sequence) { stopFieldAnimation(); geometry(); } };
    }
    updateResults();
  }
  function choose(index) {
    const product = results[index];
    if (!product) return;
    close({ restoreFocus: false, immediate: true, clear: true });
    navigate(new URL(siteUrl(`/products/${product.slug}`), location.href));
  }
  input.addEventListener('input', updateResults, options);
  input.addEventListener('compositionstart', () => { composing = true; }, options);
  input.addEventListener('compositionend', () => { composing = false; updateResults(); }, options);
  form.addEventListener('submit', event => { event.preventDefault(); if (!composing) { if (active >= 0) choose(active); else updateResults(); } }, options);
  input.addEventListener('keydown', event => {
    if (event.isComposing || composing) return;
    if (['ArrowDown', 'ArrowUp'].includes(event.key) && results.length) {
      event.preventDefault();
      if (!panelOpen) showPanel(true);
      setActive(event.key === 'ArrowDown' ? Math.min(active + 1, results.length - 1) : active < 0 ? results.length - 1 : Math.max(0, active - 1));
    }
  }, options);
  form.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.isComposing) return;
    event.preventDefault(); event.stopPropagation();
    if (panelOpen) { setActive(-1); showPanel(false); }
    else close();
  }, options);
  closeButton.addEventListener('click', () => close(), options);
  document.addEventListener('pointerdown', event => {
    if (opened && !form.contains(event.target) && !triggers.some(item => item.contains(event.target))) close({ restoreFocus: false });
  }, options);
  document.addEventListener('focusin', event => {
    if (opened && !form.contains(event.target) && !triggers.includes(event.target)) close({ restoreFocus: false });
  }, options);
  function resize() { if (opened) { stopFieldAnimation(); geometry(); hiddenGroups.forEach(group => { group.inert = true; }); } }
  window.addEventListener('resize', resize, options);
  window.visualViewport?.addEventListener('resize', resize, options);
  window.visualViewport?.addEventListener('scroll', resize, options);
  reduced.addEventListener('change', () => { stopFieldAnimation(); stopPanelAnimation(); if (!opened) { form.hidden = true; panel.hidden = true; } else geometry(); }, options);
  return {
    open, close, isOpen: () => opened,
    handleClick(event) {
      const anchor = event.target.closest('a');
      if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
      if (triggers.includes(anchor)) { event.preventDefault(); open(anchor); return true; }
      if (anchor.matches('[data-search-index]') && form.contains(anchor)) { event.preventDefault(); choose(Number(anchor.dataset.searchIndex)); return true; }
      if (opened && anchor.origin === location.origin && appPath(anchor.pathname) === '/cart') close({ restoreFocus: false, immediate: true });
      return false;
    },
    dispose() { close({ restoreFocus: false, immediate: true, clear: true }); stopFieldAnimation(); stopPanelAnimation(); events.abort(); },
  };
}
