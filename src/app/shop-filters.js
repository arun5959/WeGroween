import { matchRoute } from './routes.js';
import { shopDestination } from './catalogue-view.js';
import { setupBrandedSelects } from './branded-select.js';
import { siteUrl } from './hosting.js';

export function setupShopFilters(root, { motion, navigate }) {
  const page = root.querySelector('.shop-page');
  if (!page) return null;
  const results = page.querySelector('[data-shop-results]');
  const picker = page.querySelector('[data-shop-category-picker]');
  const sort = page.querySelector('[data-shop-sort]');
  const status = page.querySelector('.shop-filter-status');
  const controller = new AbortController();
  const events = { signal: controller.signal };
  const mobile = matchMedia('(max-width:720px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let syncing = false;
  let disposeShelves = () => {};
  const disposeSelects = setupBrandedSelects(page);

  function enhanceShelves() {
    disposeShelves();
    const shelves = new AbortController();
    const timers = new Set();
    const observer = new ResizeObserver(() => tracks.forEach(sync));
    const tracks = [...results.querySelectorAll('.shop-shelf-track')];
    function sync(track, announce = false) {
      const section = track.closest('.shop-shelf');
      const cards = [...track.querySelectorAll('[data-product-card]')];
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      track.tabIndex = mobile.matches ? 0 : -1;
      const step = (cards[0]?.getBoundingClientRect().width || 1) + 16;
      const index = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / step)));
      section.querySelector('[data-shelf-scroll="-1"]').disabled = track.scrollLeft < 2;
      section.querySelector('[data-shelf-scroll="1"]').disabled = track.scrollLeft >= max - 2;
      section.querySelector('[data-shelf-position]').textContent = `${index + 1} / ${cards.length}`;
      if (announce) section.querySelector('[data-shelf-status]').textContent = `${index + 1} of ${cards.length}: ${cards[index]?.querySelector('h3').textContent || ''}`;
    }
    tracks.forEach(track => {
      observer.observe(track);sync(track);
      let timer;
      track.addEventListener('scroll', () => {
        sync(track);clearTimeout(timer);timers.delete(timer);
        timer = setTimeout(() => { sync(track, true);timers.delete(timer); }, 160);timers.add(timer);
      }, { signal:shelves.signal, passive:true });
      track.addEventListener('keydown', event => {
        if (!mobile.matches || event.target !== track || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home' || event.key === 'End') track.scrollTo({left:event.key === 'Home' ? 0 : track.scrollWidth,behavior:reduced.matches ? 'instant' : 'smooth'});
        else move(track,event.key === 'ArrowRight' ? 1 : -1);
      }, {signal:shelves.signal});
    });
    disposeShelves = () => { shelves.abort();observer.disconnect();timers.forEach(clearTimeout); };
  }
  function move(track, direction) {
    const card = track.querySelector('[data-product-card]');
    track.scrollBy({left:direction * (card.getBoundingClientRect().width + 16),behavior:reduced.matches ? 'instant' : 'smooth'});
  }
  page.addEventListener('click', event => {
    const button = event.target.closest('[data-shelf-scroll]');
    if (button && !button.disabled) move(button.closest('.shop-shelf').querySelector('.shop-shelf-track'),Number(button.dataset.shelfScroll));
  }, events);
  page.addEventListener('change', event => {
    if (syncing) return;
    if (event.target === picker || event.target === sort) {
      const destination = shopDestination(picker.value,event.target === sort ? 'all' : page.dataset.shopView,sort.value);
      navigate(new URL(siteUrl(destination),location.href));
    }
  }, events);
  enhanceShelves();
  return {
    canUpdate(path) { return page.isConnected && ['C02','C03'].includes(matchRoute(path)?.page.id); },
    update(html, { focus = false } = {}) {
      const template = document.createElement('template');template.innerHTML = html;
      const next = template.content.querySelector('.shop-page');if (!next) return false;
      const sorting = results.querySelector('.product-grid') && page.dataset.shopView === 'all' && next.dataset.shopView === 'all' && page.dataset.shopCategory === next.dataset.shopCategory && page.dataset.shopOrder !== next.dataset.shopOrder;
      ['shopCategory','shopView','shopOrder'].forEach(key => page.dataset[key] = next.dataset[key]);
      syncing = true;
      picker.value = next.querySelector('[data-shop-category-picker]').value;
      sort.value = next.querySelector('[data-shop-sort]').value;
      picker.dispatchEvent(new Event('change',{bubbles:true}));sort.dispatchEvent(new Event('change',{bubbles:true}));
      syncing = false;
      page.querySelector('.shop-global-sort').hidden = next.querySelector('.shop-global-sort').hidden;
      page.querySelector('.shop-result-toolbar').hidden = next.querySelector('.shop-result-toolbar').hidden;
      page.querySelector('.shop-sort label .sr-only').textContent = next.querySelector('.shop-sort label .sr-only').textContent;
      page.querySelectorAll('[data-shop-view-link]').forEach(link => {
        const target = next.querySelector(`[data-shop-view-link="${link.dataset.shopViewLink}"]`);
        link.href = target.href;
        if (target.hasAttribute('aria-current')) link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
      });
      if (sorting) {
        const grid = results.querySelector('.product-grid');
        const cards = new Map([...grid.children].map(card => [card.dataset.productCard,card]));
        const order = [...next.querySelectorAll('[data-product-card]')].map(card => card.dataset.productCard);
        motion.changeLayout(grid,() => grid.append(...order.map(slug => cards.get(slug))));motion.reveal(grid);
        const message = sort.value === 'availability'
          ? (page.dataset.shopPreview === 'true' ? 'Available sample items first. Stock is illustrative.' : 'Availability is not confirmed yet; the current order is unchanged.')
          : `Products sorted by ${sort.selectedOptions[0].textContent}.`;
        page.querySelector('[data-shop-sort-status]').textContent = message;
      } else {
        disposeShelves();
        motion.changeLayout(results,() => { results.replaceChildren(...next.querySelector('[data-shop-results]').childNodes);enhanceShelves(); });motion.reveal(results);
        page.querySelector('[data-shop-sort-status]').textContent = '';
      }
      status.textContent = next.querySelector('.shop-filter-status').textContent;
      if (focus && !page.querySelector('.shop-toolbar').contains(document.activeElement) && !page.querySelector('.shop-result-toolbar').contains(document.activeElement)) page.querySelector('#shop-category-trigger')?.focus({preventScroll:true});
      return true;
    },
    dispose() { controller.abort();disposeShelves();disposeSelects(); },
  };
}
