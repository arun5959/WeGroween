import { escapeHtml, link, notice, pageIntro, field } from '../components/primitives.js';
import { pages, examplePath } from '../app/routes.js';
import { cartContents } from '../components/cart.js';

export function unavailablePage(page) {
  const descriptions = {
    C06: ['Our story', 'Our farm, your kitchen.', 'The WeGroween story and verified growing practices are being prepared.'],
    C19: ['Delivery', 'From harvest to your door.', 'Service areas, delivery charges and timing will be published before ordering opens.'],
    C20: ['Order support', 'Returns and refunds.', 'The policy for perishable produce and order issues will be published here.'],
    C21: ['Your information', 'Privacy policy.', 'The approved policy will describe how WeGroween handles your information.'],
    C22: ['Purchasing information', 'Terms and conditions.', 'The approved purchasing and service terms will be published here.'],
  };
  const [eyebrow, heading, description] = descriptions[page.id] ?? ['WeGroween', page.name, 'This part of the store is being prepared.'];
  return `<div class="container section narrow">${pageIntro(eyebrow, heading, description)}${notice('Coming soon', 'Please return when this section opens.')}${link('Explore the catalogue', '/shop', 'secondary')}</div>`;
}

export function cart() {
  return `${pageIntro('Your selection', 'Your cart.')}<div class="empty-state">${cartContents()}${notice('Ordering is not open', 'Shopping and payment will be available after the catalogue and delivery details are confirmed.')}</div>`;
}

export function identityPage(page) {
  const title = page.id === 'A01' ? 'Staff sign in.' : page.id === 'C13' ? 'Create your account.' : page.id === 'C14' ? 'Recover your account.' : 'Welcome back.';
  return `${pageIntro(page.id === 'A01' ? 'WeGroween operations' : 'Your WeGroween account', title)}${notice('Account access is not open', 'Sign-in and account recovery will be available when the account service opens. No credentials are collected in this preview.')}<div class="identity-fields">${field({ id: 'identity-email', label: 'Email address', type: 'email', disabled: true })}${page.id !== 'C14' ? field({ id: 'identity-password', label: 'Password', type: 'password', disabled: true }) : ''}<button class="button" type="button" disabled aria-describedby="identity-disabled">${escapeHtml(page.primary_action)}</button><p id="identity-disabled" class="muted">Account access is unavailable in this preview.</p></div>${page.id === 'C12' ? '<div class="action-row"><a href="/register">Create an account</a><a href="/recover-password">Forgot password?</a></div>' : ''}`;
}

export function accessRequired(page, decision, path) {
  return `${pageIntro(page.area === 'admin' ? 'Restricted workspace' : 'Your account', page.name)}${notice('Sign-in required', page.area === 'admin' ? 'Only authorised staff can access this workspace. Staff sign-in is not open yet.' : 'Your personal information and orders require account access. Sign-in is not open yet.')}${link('Go to sign in', `${decision.signIn}?returnTo=${encodeURIComponent(path)}`)}<div class="action-row"><a href="/shop">Explore the catalogue</a></div>`;
}

export function notFound() {
  return `${pageIntro('404', 'This page could not be found.', 'The address may have changed, or this item is not in the available catalogue.')}${link('Back to the catalogue', '/shop', 'primary', { direction: 'back' })}`;
}

export function foundationPreview() {
  return `<div class="container section">${pageIntro('Development only', 'Application foundation.', `${pages.length} page types · five shells · existing design tokens. No live services connected.`)}<div class="action-row">${link('Storefront', '/')}${link('Checkout shell', '/cart', 'secondary')}${link('Identity shell', '/sign-in', 'secondary')}${link('Account shell', '/account', 'secondary')}${link('Admin shell', '/admin', 'secondary')}</div><section class="section"><h2>Shared primitives</h2><div class="specimen-grid"><div>${field({ id: 'example-field', label: 'Editable field', hint: 'Keyboard-accessible primitive example.' })}${field({ id: 'example-error', label: 'Field with validation error', error: 'Please enter a value.' })}<button class="button" type="button" disabled>Disabled action</button></div>${notice('Information state', 'Persistent inline feedback uses the shared component.')}</div></section><section><h2>Route registry</h2><div class="route-grid">${pages.map((page) => `<a class="route-entry" href="${examplePath(page)}"><span class="eyebrow">${page.id} · ${page.shell}</span><strong>${escapeHtml(page.name)}</strong><code>${escapeHtml(page.route)}</code><span>${escapeHtml(page.access)}</span></a>`).join('')}</div></section></div>`;
}
