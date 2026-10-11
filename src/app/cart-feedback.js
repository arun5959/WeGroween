import { developmentWorkspace as state } from '../content/development-workspace.js';
import { icon } from '../components/icons.js';
import { mountHtml, siteUrl } from './hosting.js';

export function setupCartFeedback() {
  const host = document.createElement('aside');
  host.className = 'cart-feedback';
  host.hidden = true;
  host.setAttribute('aria-label', 'Cart notification');
  host.innerHTML = mountHtml(`${icon('check')}<div class="cart-feedback-message" role="status" aria-live="polite" aria-atomic="true"><strong></strong><p></p></div><button class="cart-feedback-close" type="button" aria-label="Dismiss cart notification">${icon('close')}</button>`);
  document.body.append(host);
  const title = host.querySelector('strong');
  const detail = host.querySelector('p');
  const close = host.querySelector('button');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const events = { signal: controller.signal };
  const bumps = new Set();
  let timer, animation, desired = false, trigger = null;
  let previousCount = 0;
  const count = () => import.meta.env.DEV ? state.basket.reduce((total, item) => total + item.quantity, 0) : 0;
  const countLabel = total => total ? `${total} ${total === 1 ? 'item' : 'items'} in your cart` : 'Your cart is empty';

  function sync({ animate = false } = {}) {
    const total = count();
    document.querySelectorAll('[data-cart-count]').forEach(badge => {
      badge.textContent = String(total);
      badge.hidden = total === 0;
      if (animate && total > previousCount && !preference.matches && badge.getClientRects().length) {
        badge.getAnimations().forEach(current => current.cancel());
        const bump = badge.animate([{ transform: 'scale(.8)', opacity: .6 }, { transform: 'scale(1.15)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }], { duration: 220, easing: 'ease-out' });
        bumps.add(bump);
        bump.onfinish = () => bumps.delete(bump);
        bump.oncancel = () => bumps.delete(bump);
      }
    });
    document.querySelectorAll(`a[href="${siteUrl('/cart')}"]`).forEach(anchor => anchor.setAttribute('aria-description', countLabel(total)));
    previousCount = total;
  }

  function dismiss({ restoreFocus = true, immediate = false } = {}) {
    clearTimeout(timer);
    desired = false;
    animation?.cancel();
    if (restoreFocus && host.contains(document.activeElement) && trigger?.isConnected) trigger.focus({ preventScroll: true });
    if (immediate || preference.matches || host.hidden) { host.hidden = true; return; }
    animation = host.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-out', fill: 'forwards' });
    animation.onfinish = () => { if (!desired) { host.hidden = true; animation.cancel(); } };
  }

  function schedule() {
    clearTimeout(timer);
    if (desired && !host.matches(':hover') && !host.contains(document.activeElement)) timer = setTimeout(() => dismiss(), 4000);
  }

  document.addEventListener('wg:basket-changed', () => sync({ animate: true }), events);
  document.addEventListener('wg:cart-added', event => {
    if (!import.meta.env.DEV) return;
    trigger = event.detail.trigger;
    animation?.cancel();
    clearTimeout(timer);
    desired = true;
    host.hidden = false;
    title.textContent = event.detail.added > 0 ? 'Added to your cart' : 'Your cart is already stocked';
    detail.textContent = event.detail.added > 0 ? `${event.detail.productName} · ${countLabel(count())}` : `You’ve reached the limit of 20 packs for ${event.detail.productName}.`;
    if (!preference.matches) animation = host.animate([{ opacity: .5, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
    schedule();
  }, events);
  close.addEventListener('click', () => dismiss(), events);
  host.addEventListener('pointerenter', () => clearTimeout(timer), events);
  host.addEventListener('pointerleave', schedule, events);
  host.addEventListener('focusin', () => clearTimeout(timer), events);
  host.addEventListener('focusout', schedule, events);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && desired) dismiss(); }, events);
  document.addEventListener('click', event => { if (event.target.closest(`a[href="${siteUrl('/cart')}"]`)) dismiss({ restoreFocus: false }); }, events);
  preference.addEventListener('change', () => {
    if (preference.matches) { animation?.cancel(); bumps.forEach(bump => bump.cancel()); if (!desired) host.hidden = true; }
  }, events);
  return {
    refresh() { dismiss({ restoreFocus: false, immediate: true }); sync(); },
    dispose() { clearTimeout(timer); animation?.cancel(); bumps.forEach(bump => bump.cancel()); controller.abort(); host.remove(); },
  };
}
