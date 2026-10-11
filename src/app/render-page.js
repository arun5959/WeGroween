import { matchRoute } from './routes.js';
import { accessDecision } from './session.js';
import { storefront } from '../layouts/storefront.js';
import { checkout } from '../layouts/checkout.js';
import { identity } from '../layouts/identity.js';
import { account } from '../layouts/account.js';
import { accountPreview } from '../pages/account-preview.js';
import { sampleAccount } from '../content/sample-account.js';
import { publishedAccountPreview } from './account-review-config.js';
import { admin } from '../layouts/admin.js';
import { home, shop, category, product } from '../pages/storefront.js';
import { ourStory } from '../pages/story.js';
import { contactPage } from '../pages/contact.js';
import { restaurantSupplyPage } from '../pages/restaurant-supply.js';
import { supplyCopy } from '../content/restaurant-supply.js';
import { contactCopy } from '../content/enquiries.js';
import { brandStory } from '../content/story.js';
import { categories } from '../content/foundation.js';
import { shopQuery } from './catalogue-view.js';
import { mountHtml } from './hosting.js';
import { operationsPage } from '../pages/operations.js';
import { basketPage, checkoutPage, confirmationPage, identityDesign, policyPage } from '../pages/customer-workflows.js';
import { unavailablePage, cart, identityPage, accessRequired, notFound, foundationPreview } from '../pages/scaffold.js';

const layouts = { storefront, checkout, identity, account, admin };
const defaultDescription = 'Explore the WeGroween catalogue.';

export function renderPage(path, { development = false, accountReview = publishedAccountPreview, search = '' } = {}) {
  if (['/search', '/shop/category/combos'].includes(path.replace(/\/$/, ''))) path = '/shop';
  // Synthetic review workspace only. This never changes the account access decision.
  if (development && path === '/__account-preview') {
    return { html: mountHtml(accountPreview()), title: 'Sample account', description: 'A fictional WeGroween account for design review.', status: 200, shell: 'account', pageId: 'development-account' };
  }
  const matched = matchRoute(path);
  if (development && path === '/__foundation') {
    return { html: storefront(foundationPreview(), { path }), title: 'Foundation review', description: defaultDescription, status: 200, shell: 'storefront', pageId: 'development' };
  }
  if (!matched) return errorPage(path);
  const { page, params } = matched;
  if (development && page.shell === 'admin') {
    const content = operationsPage(page, params, path);
    if (content === null) return errorPage(path);
    return { html: mountHtml(admin(content, { path, page, development })), title: page.name, description: 'Fictional operations workspace for design review.', status: 200, shell: page.shell, pageId: page.id };
  }
  if (development && ['C10', 'C11'].includes(page.id)) {
    return { html: mountHtml(checkout(page.id === 'C10' ? checkoutPage() : confirmationPage(params), { path, page, development })), title: page.name, description: 'Sample purchasing flow. No real order or payment.', status: 200, shell: page.shell, pageId: page.id };
  }
  // Local and published design review share fictional data and in-memory edits.
  if ((development || accountReview) && page.shell === 'account') {
    if (page.id === 'C18' && !sampleAccount.orders.some(order => order.id === params.orderId)) return errorPage(path);
    const initialView = page.id === 'C16' ? 'addresses' : ['C17', 'C18'].includes(page.id) ? 'orders' : 'overview';
    return { html: mountHtml(accountPreview({ assumedSignedIn: true, initialView, orderId: params.orderId })), title: 'Your account', description: 'Your orders, delivery addresses and personal details.', status: 200, shell: 'account', pageId: page.id };
  }
  const decision = accessDecision(page);
  let content;
  if (!decision.allowed) content = accessRequired(page, decision, path);
  else if (page.id === 'C01') content = home();
  else if (page.id === 'C02') content = shop({ development, ...shopQuery(search) });
  else if (page.id === 'C03') content = category(params, { development, ...shopQuery(search) });
  else if (page.id === 'C05') content = product(params, { development });
  else if (page.id === 'C06') content = ourStory();
  else if (page.id === 'C07') content = restaurantSupplyPage();
  else if (page.id === 'C08') content = contactPage();
  else if (page.id === 'C09') content = basketPage({ development });
  else if (['identity', 'staff-identity'].includes(page.access)) content = identityDesign(page, { development });
  else if (['C19', 'C20', 'C21', 'C22'].includes(page.id)) content = policyPage(page);
  else content = unavailablePage(page);
  if (content === null) return errorPage(path);
  return { html: mountHtml(layouts[page.shell](content, { path, page })), title: page.id === 'C03' ? `${categories.find(category => category.slug === params.slug).name} · Shop` : page.name, description: page.id === 'C06' ? brandStory.description : page.id === 'C07' ? supplyCopy.metaDescription : page.id === 'C08' ? contactCopy.description : defaultDescription, status: decision.allowed ? 200 : 403, shell: page.shell, pageId: page.id };
}

function errorPage(path) {
  return { html: mountHtml(storefront(`<div class="container section narrow">${notFound()}</div>`, { path })), title: 'Page not found', description: defaultDescription, status: 404, shell: 'storefront', pageId: null };
}
