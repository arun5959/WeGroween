import { escapeHtml } from './primitives.js';
import { icon } from './icons.js';
import { mediaAssets } from '../content/media.js';
import { categories } from '../content/foundation.js';
import { businessContact } from '../content/contact.js';

export function navLink(label, href, currentPath, iconName = null, { reserveEmphasis = false } = {}) {
  const exactOnly = ['/', '/account', '/admin'].includes(href);
  const current = currentPath === href || (!exactOnly && currentPath.startsWith(`${href}/`));
  const text = escapeHtml(label);
  const labelMarkup = reserveEmphasis ? `<span class="navigation-label-slot"><span class="navigation-label-sizer" aria-hidden="true">${text}</span><span class="navigation-label">${text}</span></span>` : text;
  return `<a href="${escapeHtml(href)}" ${current ? 'aria-current="page"' : ''}>${iconName ? icon(iconName) : ''}${labelMarkup}</a>`;
}

export function brand(variant = 'header') {
  const isFooter = variant === 'footer';
  const asset = isFooter ? mediaAssets.logoFooter : mediaAssets.logoHeader;
  return `<a class="brand${isFooter ? ' brand--footer' : ''}" href="/" aria-label="WeGroween home"><img src="${asset.src}" alt="${asset.alt}" width="${isFooter ? 2018 : 2111}" height="${isFooter ? 514 : 460}" decoding="async"${isFooter ? ' loading="lazy"' : ''}></a>`;
}

export function header(path) {
  const headerLink = (label, href, glyph = null) => navLink(label, href, path, glyph, { reserveEmphasis: true });
  const actions = [['Search', '/search', 'search'], ['Account', '/account', 'account'], ['Cart', '/cart', 'basket']]
    .map(([label, href, glyph]) => headerLink(label, href, glyph)).join('');
  return `<header class="site-header"><div class="container header-inner header-inner--storefront">${brand()}<div class="mobile-header-controls"><a class="header-icon-control" href="/search" aria-label="Search">${icon('search')}</a><button class="menu-toggle header-icon-control" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-navigation"><span class="menu-open-icon">${icon('menu')}</span><span class="menu-close-icon">${icon('close')}</span></button></div><nav id="site-navigation" class="site-navigation" aria-label="Main navigation">${[['Shop', '/shop'], ['Our Story', '/our-farm'], ['Restaurant Supply', '/restaurant-supply'], ['Contact', '/help']].map(([label, href]) => headerLink(label, href)).join('')}<div class="mobile-menu-actions">${actions}</div></nav><div class="header-actions">${actions}</div></div></header>`;
}

export function footer() {
  const columns = [
    { id: 'store', title: 'Store', links: [['Shop all', '/shop'], ...categories.map(category => [category.name, `/shop/category/${category.slug}`]), ['Cart', '/cart']] },
    { id: 'policies', title: 'Policies', links: [['Delivery', '/policies/delivery'], ['Returns and refunds', '/policies/returns'], ['Privacy', '/policies/privacy'], ['Terms', '/policies/terms']] },
    { id: 'contact', title: 'Contact', links: [] },
  ];
  const contactDetails = `<address class="footer-contact-details"><a class="footer-contact-row" href="mailto:${escapeHtml(businessContact.email)}">${icon('mail')}<span>${escapeHtml(businessContact.email)}</span></a><a class="footer-contact-row" href="${escapeHtml(businessContact.phoneHref)}" aria-label="Call WeGroween on ${escapeHtml(businessContact.phone)}">${icon('phone')}<span>${escapeHtml(businessContact.phone)}</span></a></address><ul class="footer-socials"><li><a class="footer-contact-row" href="${escapeHtml(businessContact.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="WeGroween on Instagram (opens in a new tab)">${icon('instagram')}<span>Instagram</span></a></li><li><div class="footer-contact-row">${icon('youtube')}<span>YouTube</span></div></li><li><div class="footer-contact-row">${icon('facebook')}<span>Facebook</span></div></li></ul>`;
  return `<footer class="site-footer"><div class="container footer-grid"><div class="footer-brand">${brand('footer')}<p>Mushrooms. Microgreens. Thoughtful pairings.</p><a class="footer-story-link text-link" href="/our-farm">Our Story ${icon('arrow-right')}</a></div>${columns.map(column => `<nav class="footer-column footer-${column.id}" aria-labelledby="footer-heading-${column.id}"><h2 id="footer-heading-${column.id}">${column.title}</h2>${column.id === 'contact' ? contactDetails : `<ul>${column.links.map(([label, href]) => `<li>${navLink(label, href, '')}</li>`).join('')}</ul>`}</nav>`).join('')}</div><div class="container footer-base"><span>© ${new Date().getFullYear()} WeGroween</span><span>Local catalogue preview · ordering is not open.</span></div></footer>`;
}

export function main(content, className = '') {
  return `<main id="main-content" tabindex="-1" class="${className}">${content}</main>`;
}

export const skipLink = '<a class="skip-link" href="#main-content">Skip to content</a>';
