import { brand, main, skipLink } from '../components/navigation.js';
import { icon } from '../components/icons.js';

function checkoutProgress(page) {
  const current = page?.id === 'C11' ? 3 : 2;
  const steps = [['Selection', '/cart'], ['Details', '/checkout'], ['Confirmation', null]];
  return `<nav class="checkout-progress" aria-label="Checkout progress"><ol>${steps.map(([label, href], index) => {
    const number = index + 1;
    const content = `<span class="checkout-step-number" aria-hidden="true">${number < current ? icon('check') : `0${number}`}</span><span>${label}</span>`;
    return `<li class="checkout-step${number === current ? ' is-current' : number < current ? ' is-previous' : ''}">${number < current && href ? `<a href="${href}">${content}</a>` : `<span${number === current ? ' aria-current="step"' : ''}>${content}</span>`}</li>`;
  }).join('')}</ol></nav>`;
}

export function checkout(content, context) {
  return `${skipLink}<header class="site-header checkout-masthead"><div class="container header-inner checkout-masthead-inner">${brand()}${checkoutProgress(context.page)}<nav class="checkout-header-actions" aria-label="Checkout support"><a href="/shop" aria-label="Continue shopping">${icon('arrow-left')}<span class="checkout-shopping-full">Continue shopping</span><span class="checkout-shopping-short" aria-hidden="true">Shop</span></a><a href="/help">${icon('mail')}<span>Contact</span></a></nav></div></header>${main(`<div class="container section">${content}</div>`, 'checkout-layout')}<footer class="container compact-footer">Ordering is not open in this local preview.</footer>`;
}
