import { cartDrawerMarkup } from '../components/cart.js';
import { shouldHandleLink } from './navigation.js';
import { appPath, mountHtml, siteUrl } from './hosting.js';
import { developmentWorkspace as state, basketTotal, money } from '../content/development-workspace.js';
import { basketLines } from '../pages/customer-workflows.js';
import { cartContents } from '../components/cart.js';
import { link } from '../components/primitives.js';

export function setupCartDrawer({ pauseScroll, resumeScroll, navigate }) {
  const host = document.createElement('div');
  host.innerHTML = mountHtml(cartDrawerMarkup());
  const dialog = host.firstElementChild;
  document.body.append(dialog);
  const panel = dialog.querySelector('.cart-drawer-panel');
  const shade = dialog.querySelector('.cart-drawer-shade');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const options = { signal: events.signal };
  let desiredOpen = false;
  let trigger = null;
  let animations = [];
  let completion = null;
  let scrollStyles = null;
  function paintSelection() {
    if (!import.meta.env.DEV) return;
    const content = dialog.querySelector('.cart-drawer-content');
    const scroll = content.scrollTop;
    content.innerHTML = mountHtml(state.basket.length ? `<div class="work-form"><p class="work-small">Sample selection · Illustrative packs and prices.</p>${basketLines({ compact: true })}<div class="work-section-heading"><span>Illustrative subtotal</span><strong>${money(basketTotal())}</strong></div></div>` : cartContents({ panel: true }));
    content.scrollTop = scroll;
    dialog.querySelector('[data-cart-checkout-action]').innerHTML = mountHtml(state.basket.length
      ? link('Proceed to checkout', '/checkout')
      : '<button class="button button--primary" type="button" disabled aria-describedby="cart-checkout-note">Proceed to checkout</button>');
  }
  document.addEventListener('wg:basket-changed', paintSelection, options);
  dialog.addEventListener('click', event => {
    if (!import.meta.env.DEV) return;
    const control = event.target.closest('[data-basket-change], [data-basket-remove]'); if (!control) return;
    const id = control.dataset.basketRemove || control.dataset.product, line = state.basket.find(l => l.id === id); if (!line) return;
    const change = control.dataset.basketChange;
    if (control.dataset.basketRemove) state.basket = state.basket.filter(l => l.id !== id);
    else { line.quantity = Math.min(20, line.quantity + Number(change)); if (line.quantity < 1) state.basket = state.basket.filter(l => l.id !== id); }
    document.dispatchEvent(new CustomEvent('wg:basket-changed'));
    (dialog.querySelector(`[data-product="${id}"][data-basket-change="${change}"]`) || dialog.querySelector('.cart-drawer-close')).focus({ preventScroll: true });
  }, options);

  function stopAnimation() {
    for (const animation of animations) animation.cancel();
    animations = [];
    completion = null;
  }
  function setTriggers(expanded) {
    document.querySelectorAll(`a[href="${siteUrl('/cart')}"]`).forEach(anchor => {
      anchor.setAttribute('aria-haspopup', 'dialog');
      anchor.setAttribute('aria-controls', 'cart-drawer');
      anchor.setAttribute('aria-expanded', String(expanded));
    });
  }
  function lockScroll() {
    const body = document.body;
    scrollStyles = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    const priorWidth = document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.overflow = 'hidden';
    pauseScroll();
    const gap = document.documentElement.clientWidth - priorWidth;
    if (gap) body.style.paddingRight = `${padding + gap}px`;
  }
  function unlockScroll() {
    if (!scrollStyles) return;
    Object.assign(document.body.style, scrollStyles);
    scrollStyles = null;
    resumeScroll();
  }
  function animate(open, finish) {
    const transform = dialog.open ? getComputedStyle(panel).transform : 'translateX(100%)';
    const opacity = dialog.open ? getComputedStyle(shade).opacity : '0';
    stopAnimation();
    if (!dialog.open) { dialog.showModal(); lockScroll(); }
    if (preference.matches || !panel.animate) { finish(); return; }
    const tokens = getComputedStyle(document.documentElement);
    const value = tokens.getPropertyValue('--motion-emphasized').trim();
    const duration = (parseFloat(value) * (value.endsWith('ms') ? 1 : 1000)) || 360;
    const easing = tokens.getPropertyValue('--motion-easing-standard').trim() || 'ease-out';
    const slide = panel.animate([{ transform }, { transform: open ? 'translateX(0)' : 'translateX(100%)' }], { duration, easing, fill: 'forwards' });
    const fade = shade.animate([{ opacity }, { opacity: open ? '1' : '0' }], { duration, easing, fill: 'forwards' });
    animations = [slide, fade];
    completion = finish;
    slide.onfinish = () => {
      if (!animations.includes(slide)) return;
      stopAnimation();
      finish();
    };
  }
  function reset({ restoreFocus = true } = {}) {
    desiredOpen = false;
    stopAnimation();
    if (dialog.open) dialog.close();
    unlockScroll();
    setTriggers(false);
    if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
  }
  function open(anchor) {
    if (desiredOpen) return;
    paintSelection();
    desiredOpen = true;
    trigger = anchor;
    setTriggers(true);
    animate(true, () => {});
  }
  function close(afterClose) {
    if (!dialog.open || !desiredOpen) return;
    desiredOpen = false;
    setTriggers(false);
    animate(false, () => { reset({ restoreFocus: !afterClose }); afterClose?.(); });
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); }, options);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.closest('[hidden], [inert]') && element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }, options);
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target === shade || event.target.closest('.cart-drawer-close')) close();
  }, options);
  preference.addEventListener('change', () => {
    if (preference.matches && completion) {
      const finish = completion;
      stopAnimation();
      finish();
    }
  }, options);
  return {
    isOpen: () => dialog.open,
    refresh: () => setTriggers(dialog.open),
    reset,
    handleClick(event) {
      const anchor = event.target.closest('a');
      if (!shouldHandleLink(event, anchor, new URL(location.href))) return false;
      const url = new URL(anchor.href);
      if (appPath(url.pathname) === '/cart') { event.preventDefault(); open(anchor); return true; }
      if (dialog.contains(anchor)) { event.preventDefault(); close(() => navigate(url)); return true; }
      return false;
    },
    dispose() { reset({ restoreFocus: false }); events.abort(); dialog.remove(); },
  };
}
