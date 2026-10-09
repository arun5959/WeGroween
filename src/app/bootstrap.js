import '../styles/app.css';
import { renderPage } from './render-page.js';
import { legacyDestination } from './routes.js';
import { shouldHandleLink } from './navigation.js';
import { escapeHtml } from '../components/primitives.js';
import { setupSmoothScroll } from './scroll.js';
import { setupStoryMotion } from './story-motion.js';
import { setupContactForm } from './contact-form.js';
import { setupInterfaceMotion } from './interface-motion.js';
import { setupCartDrawer } from './cart-drawer.js';
import { setupPageTransitions } from './page-transitions.js';
import { appPath, siteUrl } from './hosting.js';

const scroller = setupSmoothScroll({
  beforeAnchorNavigation: () => rememberScroll(),
  afterAnchorNavigation: () => { renderedEntry = entryKey(); },
});
let disposePage = () => {};
let interfaceMotion;
if (import.meta.hot) import.meta.hot.dispose(() => { pageTransitions.dispose(); disposePage(); cartDrawer.dispose(); scroller.dispose(); });

const root = document.getElementById('app');
const announcement = document.getElementById('route-announcement');
const pageTransitions = setupPageTransitions({ root, pauseScroll: () => scroller.pause(), resumeScroll: () => scroller.resume() });
const cartDrawer = setupCartDrawer({ pauseScroll: () => scroller.pause(), resumeScroll: () => scroller.resume(), navigate });
let priorLocation = location.pathname + location.search;
const scrollPositions = new Map();
function entryKey() {
  if (!history.state?.wgEntry) history.replaceState({ ...history.state, wgEntry: crypto.randomUUID() }, '');
  return history.state.wgEntry;
}
let renderedEntry = entryKey();
function rememberScroll() { scrollPositions.set(renderedEntry, window.scrollY); }

function render({ focus = false, slide = false, restoreY = null } = {}) {
  const redirect = legacyDestination(appPath(location.pathname));
  if (redirect) history.replaceState(history.state, '', siteUrl(redirect));
  renderedEntry = entryKey();
  const view = renderPage(appPath(location.pathname), { development: import.meta.env.DEV });
  cartDrawer.reset({ restoreFocus: false });
  disposePage();
  root.innerHTML = view.html;
  pageTransitions.wrapPage();
  root.dataset.pageId = view.pageId ?? '404';
  root.dataset.shell = view.shell;
  root.dataset.status = String(view.status);
  document.title = `${view.title} · WeGroween`;
  document.querySelector('meta[name="description"]').setAttribute('content', view.description);
  scroller.refresh();
  if (slide || restoreY !== null) scroller.toPosition(restoreY ?? 0, { immediate: true });
  const disposeStory = setupStoryMotion(root);
  interfaceMotion = setupInterfaceMotion(root);
  const disposeContact = setupContactForm(root, interfaceMotion);
  disposePage = () => { disposeStory(); disposeContact(); interfaceMotion.dispose(); };
  cartDrawer.refresh();
  if (focus) {
    if (!slide) root.querySelector('#main-content')?.focus({ preventScroll: true });
    if (!slide && restoreY === null) scroller.toTop();
    announcement.textContent = `${view.title} page`;
    if (!slide) interfaceMotion.reveal(root.querySelector('#main-content'));
  }
  const query = new URLSearchParams(location.search).get('q');
  const input = document.getElementById('search-query');
  if (input && query) {
    input.value = query;
    document.getElementById('search-results').innerHTML = `<div class="notice"><strong>Search is being prepared.</strong><p>Your query: ${escapeHtml(query)}</p><a href="${siteUrl('/shop')}">Browse the catalogue</a></div>`;
  }
}

function navigate(url) {
  const from = priorLocation;
  rememberScroll();
  history.pushState({ wgEntry: crypto.randomUUID() }, '', url.pathname + url.search);
  priorLocation = location.pathname + location.search;
  pageTransitions.run(from, priorLocation, ({ slide }) => render({ focus: true, slide }));
}

document.addEventListener('click', (event) => {
  if (event.target.closest(`a[href="${siteUrl('/cart')}"]`)) pageTransitions.cancel({ focus: false });
  if (cartDrawer.handleClick(event)) return;
  const toggle = event.target.closest('.menu-toggle');
  if (toggle) {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    const navigation = document.getElementById(toggle.getAttribute('aria-controls'));
    interfaceMotion.toggleMenu(toggle, navigation, expanded);
    return;
  }
  const anchor = event.target.closest('a');
  if (!shouldHandleLink(event, anchor, new URL(location.href))) return;
  const url = new URL(anchor.href);
  if (/\.[a-z0-9]+$/i.test(url.pathname) && !legacyDestination(appPath(url.pathname))) return;
  event.preventDefault();
  navigate(url);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (cartDrawer.isOpen()) return;
  const toggle = document.querySelector('.menu-toggle[aria-expanded="true"]');
  if (toggle) {
    const navigation = document.getElementById(toggle.getAttribute('aria-controls'));
    interfaceMotion.toggleMenu(toggle, navigation, false);
    toggle.focus();
  }
});

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'catalogue-search') return;
  event.preventDefault();
  const query = new FormData(event.target).get('q');
  navigate(new URL(siteUrl(`/search?q=${encodeURIComponent(query)}`), location.href));
});

window.addEventListener('popstate', () => {
  rememberScroll();
  const current = location.pathname + location.search;
  const destinationEntry = entryKey();
  const restoreY = window.matchMedia('(min-width: 1051px)').matches ? scrollPositions.get(destinationEntry) ?? 0 : null;
  if (current !== priorLocation) {
    const from = priorLocation;
    priorLocation = current;
    pageTransitions.run(from, current, ({ slide }) => render({ focus: true, slide, restoreY }));
  } else if (renderedEntry !== destinationEntry) {
    renderedEntry = destinationEntry;
    if (restoreY !== null) scroller.toPosition(restoreY, { immediate: true });
  }
});

render();
