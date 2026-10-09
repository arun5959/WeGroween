import { icon } from './icons.js';
import { link } from './primitives.js';

// Shared by the progressive /cart fallback and the interactive drawer.
export function cartContents({ panel = false } = {}) {
  const heading = panel ? 'h3' : 'h2';
  return `<div class="cart-empty"><div class="cart-empty-icon">${icon('basket')}</div><${heading}>Your cart is empty.</${heading}><p>Find something for your next harvest in the catalogue.</p>${link('Explore the catalogue', '/shop')}</div>`;
}

export function cartDrawerMarkup() {
  return `<dialog id="cart-drawer" class="cart-drawer" aria-labelledby="cart-drawer-title" data-lenis-prevent>
    <div class="cart-drawer-shade" aria-hidden="true"></div>
    <section class="cart-drawer-panel">
      <header class="cart-drawer-header"><div><p class="eyebrow">Your selection</p><h2 id="cart-drawer-title">Your cart</h2></div><button class="header-icon-control cart-drawer-close" type="button" aria-label="Close cart" autofocus>${icon('close')}</button></header>
      <div class="cart-drawer-content">${cartContents({ panel: true })}</div>
      <footer class="cart-drawer-footer"><p>Ordering is not open yet. Packs, prices and delivery details are being prepared.</p><button class="button button--secondary cart-drawer-close" type="button">Continue browsing</button></footer>
    </section>
  </dialog>`;
}
