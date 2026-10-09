import { matchRoute } from './routes.js';
import { accessDecision } from './session.js';
import { storefront } from '../layouts/storefront.js';
import { checkout } from '../layouts/checkout.js';
import { identity } from '../layouts/identity.js';
import { account } from '../layouts/account.js';
import { admin } from '../layouts/admin.js';
import { home, shop, category, product } from '../pages/storefront.js';
import { ourStory } from '../pages/story.js';
import { contactPage } from '../pages/contact.js';
import { contactCopy } from '../content/enquiries.js';
import { brandStory } from '../content/story.js';
import { mountHtml } from './hosting.js';
import { unavailablePage, cart, search, identityPage, accessRequired, notFound, foundationPreview } from '../pages/scaffold.js';

const layouts = { storefront, checkout, identity, account, admin };
const defaultDescription = 'Explore the WeGroween catalogue.';

export function renderPage(path, { development = false } = {}) {
  const matched = matchRoute(path);
  if (development && path === '/__foundation') {
    return { html: storefront(foundationPreview(), { path }), title: 'Foundation review', description: defaultDescription, status: 200, shell: 'storefront', pageId: 'development' };
  }
  if (!matched) return errorPage(path);
  const { page, params } = matched;
  const decision = accessDecision(page);
  let content;
  if (!decision.allowed) content = accessRequired(page, decision, path);
  else if (page.id === 'C01') content = home();
  else if (page.id === 'C02') content = shop();
  else if (page.id === 'C03') content = category(params);
  else if (page.id === 'C05') content = product(params);
  else if (page.id === 'C06') content = ourStory();
  else if (page.id === 'C08') content = contactPage();
  else if (page.id === 'C09') content = cart();
  else if (page.id === 'C04') content = search();
  else if (['identity', 'staff-identity'].includes(page.access)) content = identityPage(page);
  else content = unavailablePage(page);
  if (content === null) return errorPage(path);
  return { html: mountHtml(layouts[page.shell](content, { path, page })), title: page.name, description: page.id === 'C06' ? brandStory.description : page.id === 'C08' ? contactCopy.description : defaultDescription, status: decision.allowed ? 200 : 403, shell: page.shell, pageId: page.id };
}

function errorPage(path) {
  return { html: mountHtml(storefront(`<div class="container section narrow">${notFound()}</div>`, { path })), title: 'Page not found', description: defaultDescription, status: 404, shell: 'storefront', pageId: null };
}
