import { renderPage } from './render-page.js';
import { legacyDestination } from './routes.js';
import { shouldHandleLink } from './navigation.js';
import { setupSmoothScroll } from './scroll.js';
import { setupScrollbarVisibility } from './scrollbar-visibility.js';
import { setupStoryMotion } from './story-motion.js';
import { setupContactForm } from './contact-form.js';
import { setupRestaurantSupplyForm } from './restaurant-supply-form.js';
import { setupBrandedSelects } from './branded-select.js';
import { setupAccountPreview } from './account-preview.js';
import { initializeOperationsPreview } from './operations-store.js';
import { setupOperationsInteractions } from './operations-interactions.js';
import { setupWorkspaceInteractions } from './workspace-interactions.js';
import { setupShopFilters } from './shop-filters.js';
import { setupHeaderSearch } from './header-search.js';
import { setupInterfaceMotion } from './interface-motion.js';
import { setupCartDrawer } from './cart-drawer.js';
import { setupCartFeedback } from './cart-feedback.js';
import { setupPageTransitions } from './page-transitions.js';
import { appPath, siteUrl } from './hosting.js';

const scroller = setupSmoothScroll({
  beforeAnchorNavigation: () => rememberScroll(),
  afterAnchorNavigation: () => { renderedEntry = entryKey(); },
});
const scrollbarVisibility = setupScrollbarVisibility();
let disposePage = () => {};
let interfaceMotion;
let headerSearch;
let shopFilters;
if (import.meta.hot) import.meta.hot.dispose(() => { navigationRequest++; cancelPendingMenu(); pageTransitions.dispose(); disposePage(); cartDrawer.dispose(); cartFeedback.dispose(); scrollbarVisibility.dispose(); scroller.dispose(); });

initializeOperationsPreview();

const root = document.getElementById('app');
const announcement = document.getElementById('route-announcement');
const pageTransitions = setupPageTransitions({ root, pauseScroll: () => scroller.pause(), resumeScroll: () => scroller.resume() });
const cartDrawer = setupCartDrawer({ pauseScroll: () => scroller.pause(), resumeScroll: () => scroller.resume(), navigate });
const cartFeedback = setupCartFeedback();
let priorLocation = location.pathname + location.search;
const scrollPositions = new Map();
function entryKey() {
  if (!history.state?.wgEntry) history.replaceState({ ...history.state, wgEntry: crypto.randomUUID() }, '');
  return history.state.wgEntry;
}
let renderedEntry = entryKey();
let navigationRequest = 0;
let menuRequest = 0;
let pendingMenuOpen = false;
let menuScrollY = null;
function cancelPendingMenu() { menuRequest++; pendingMenuOpen = false; }
function rememberScroll() { scrollPositions.set(renderedEntry, window.scrollY); }

function render({ focus = false, slide = false, restoreY = null } = {}) {
  const compatibilitySearch = appPath(location.pathname).replace(/\/$/, '') === '/search';
  if (compatibilitySearch) {
    const destination = new URL(siteUrl('/shop'), location.href);
    destination.search = location.search;
    history.replaceState(history.state, '', destination.pathname + destination.search);
    priorLocation = location.pathname + location.search;
  }
  const redirect = legacyDestination(appPath(location.pathname));
  if (redirect) history.replaceState(history.state, '', siteUrl(redirect));
  renderedEntry = entryKey();
  const view = renderPage(appPath(location.pathname), { development: import.meta.env.DEV, search: location.search });
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
  shopFilters = setupShopFilters(root, { motion: interfaceMotion, navigate });
  const disposeContact = setupContactForm(root, interfaceMotion);
  const disposeSupply = setupRestaurantSupplyForm(root, interfaceMotion);
  // Shop owns its selects because filter changes replace only the results.
  const disposeSelects = setupBrandedSelects(root, { selector: 'select:not([multiple]):not([data-shop-sort]):not([data-shop-category-picker])' });
  const disposeAccount = setupAccountPreview(root, interfaceMotion, scroller);
  const disposeOperations = setupOperationsInteractions(root, { scroller, refresh: () => { render(); interfaceMotion.reveal(root.querySelector('.admin-operations-page')); }, navigate });
  const disposeWorkspace = setupWorkspaceInteractions(root, { scroller, refresh: () => { render(); interfaceMotion.reveal(root.querySelector('[data-workspace]')); }, navigate });
  headerSearch = setupHeaderSearch(root, { navigate, beforeOpen: () => {
    cancelPendingMenu();
    pageTransitions.cancel({ focus: false });
    cartDrawer.reset({ restoreFocus: false });
    const toggle = root.querySelector('.menu-toggle[aria-expanded="true"]');
    if (toggle) {
      const previous = menuScrollY ?? window.scrollY;
      menuScrollY = null;
      const searchNavigationRequest = navigationRequest;
      interfaceMotion.toggleMenu(toggle, root.querySelector('#site-navigation'), false).then(() => {
        if (searchNavigationRequest !== navigationRequest) return;
        if (headerSearch?.isOpen()) root.querySelector('#site-navigation').inert = true;
        scroller.toPosition(previous, { immediate: true });
      });
    }
  } });
  const thisSearch = headerSearch;
  const thisShopFilters = shopFilters;
  disposePage = () => { thisSearch.dispose(); thisShopFilters?.dispose(); disposeStory(); disposeContact(); disposeSupply(); disposeSelects(); disposeAccount(); disposeOperations(); disposeWorkspace(); interfaceMotion.dispose(); };
  cartDrawer.refresh();
  cartFeedback.refresh();
  if (focus) {
    if (!slide) root.querySelector('#main-content')?.focus({ preventScroll: true });
    if (!slide && restoreY === null) scroller.toTop();
    announcement.textContent = `${view.title} page`;
    if (!slide) interfaceMotion.reveal(root.querySelector('#main-content'));
  }
  const query = new URLSearchParams(location.search).get('q');
  if (compatibilitySearch || (appPath(location.pathname) === '/shop' && query !== null)) headerSearch.open(undefined, query ?? '');
}

function renderShopFilter({ focus = false, restoreY = null } = {}) {
  if (root.dataset.pageTransition || !shopFilters?.canUpdate(appPath(location.pathname)) || new URLSearchParams(location.search).has('q')) return false;
  const view = renderPage(appPath(location.pathname), { development: import.meta.env.DEV, search: location.search });
  if (view.status !== 200 || !shopFilters.update(view.html, { focus })) return false;
  cartDrawer.reset({ restoreFocus: false });
  renderedEntry = entryKey();
  root.dataset.pageId = view.pageId;
  root.dataset.shell = view.shell;
  root.dataset.status = String(view.status);
  document.title = `${view.title} · WeGroween`;
  document.querySelector('meta[name="description"]').setAttribute('content', view.description);
  scroller.refresh();
  if (restoreY !== null) scroller.toPosition(restoreY, { immediate: true });
  return true;
}

function navigate(url) {
  headerSearch?.close({ restoreFocus: false, immediate: true, clear: true });
  cancelPendingMenu();
  const request = ++navigationRequest;
  const toggle = root.querySelector('.menu-toggle[aria-expanded="true"]');
  if (toggle && window.matchMedia('(max-width: 720px)').matches) {
    const previousScroll = menuScrollY ?? window.scrollY;
    menuScrollY = null;
    const menu = root.querySelector(`#${toggle.getAttribute('aria-controls')}`);
    interfaceMotion.toggleMenu(toggle, menu, false).then(() => {
      if (request !== navigationRequest) return;
      // Collapsing the in-flow header can trigger browser scroll anchoring.
      // Restore the pre-menu reading position before saving route history.
      scroller.toPosition(previousScroll, { immediate: true });
      navigate(url);
    });
    return;
  }
  const from = priorLocation;
  if (url.pathname + url.search === priorLocation && shopFilters?.canUpdate(appPath(url.pathname))) return;
  rememberScroll();
  history.pushState({ wgEntry: crypto.randomUUID() }, '', url.pathname + url.search);
  priorLocation = location.pathname + location.search;
  if (renderShopFilter({ focus: true })) return;
  pageTransitions.run(from, priorLocation, ({ slide }) => render({ focus: true, slide }));
}

document.addEventListener('click', (event) => {
  const searchTrigger = event.target.closest('.site-header a[href]');
  if (searchTrigger && appPath(new URL(searchTrigger.href).pathname) === '/search' && shouldHandleLink(event, searchTrigger, new URL(location.href))) {
    event.preventDefault();
    cancelPendingMenu();
    // Settling a queued page slide can replace the header: use its new controller.
    pageTransitions.cancel({ focus: false });
    headerSearch?.open(searchTrigger.isConnected ? searchTrigger : undefined);
    return;
  }
  if (headerSearch?.handleClick(event)) return;
  if (event.target.closest(`a[href="${siteUrl('/cart')}"]`)) {
    cancelPendingMenu();
    pageTransitions.cancel({ focus: false });
  }
  if (cartDrawer.handleClick(event)) return;
  const toggle = event.target.closest('.menu-toggle');
  if (toggle) {
    navigationRequest++;
    if (pendingMenuOpen) { cancelPendingMenu(); return; }
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    if (expanded && root.dataset.pageTransition) {
      const request = ++menuRequest;
      pendingMenuOpen = true;
      // Keep the compact header stable while the page moves. A second tap,
      // another navigation or Escape cancels this deferred opening.
      pageTransitions.whenIdle().then(() => {
        if (request !== menuRequest) return;
        pendingMenuOpen = false;
        if (!window.matchMedia('(max-width: 720px)').matches) return;
        const currentToggle = root.querySelector('.menu-toggle');
        if (!currentToggle) return;
        menuScrollY = window.scrollY;
        currentToggle.focus({ preventScroll: true });
        interfaceMotion.toggleMenu(currentToggle, root.querySelector(`#${currentToggle.getAttribute('aria-controls')}`), true);
      });
      return;
    }
    const navigation = document.getElementById(toggle.getAttribute('aria-controls'));
    if (expanded) menuScrollY = window.scrollY;
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
  cancelPendingMenu();
  if (cartDrawer.isOpen()) return;
  const toggle = document.querySelector('.menu-toggle[aria-expanded="true"]');
  if (toggle) {
    const navigation = document.getElementById(toggle.getAttribute('aria-controls'));
    interfaceMotion.toggleMenu(toggle, navigation, false);
    toggle.focus();
  }
});

window.addEventListener('popstate', () => {
  cancelPendingMenu();
  // A history movement supersedes any link waiting for the mobile menu to close.
  navigationRequest++;
  rememberScroll();
  const current = location.pathname + location.search;
  const destinationEntry = entryKey();
  const restoreY = scrollPositions.get(destinationEntry) ?? 0;
  if (current !== priorLocation) {
    const from = priorLocation;
    priorLocation = current;
    if (renderShopFilter({ focus: true, restoreY })) return;
    pageTransitions.run(from, current, ({ slide }) => render({ focus: true, slide, restoreY }));
  } else if (renderedEntry !== destinationEntry) {
    renderedEntry = destinationEntry;
    if (restoreY !== null) scroller.toPosition(restoreY, { immediate: true });
  }
});

render();
