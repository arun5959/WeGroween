import Lenis from 'lenis';

export function setupSmoothScroll({ beforeAnchorNavigation = () => {}, afterAnchorNavigation = () => {} } = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let controller = null;
  const headerObserver = new ResizeObserver(updateHeaderOffset);

  function headerHeight() {
    return document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
  }

  function updateHeaderOffset() {
    document.documentElement.style.setProperty('--site-header-height', `${headerHeight()}px`);
  }

  function destroy() {
    controller?.destroy();
    controller = null;
  }

  function syncPreference() {
    if (reducedMotion.matches) return destroy();
    if (!controller) controller = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.12,
      respectReducedMotion: true,
    });
  }

  function onAnchorClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); }
    catch { return; }
    if (!target) return;
    event.preventDefault();
    if (location.hash !== url.hash) {
      beforeAnchorNavigation();
      history.pushState({}, '', url.pathname + url.search + url.hash);
      afterAnchorNavigation();
    }
    if (!target.hasAttribute('tabindex') && target.tabIndex < 0) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    target.focus({ preventScroll: true });
    if (controller) {
      controller.resize();
      // Lenis already reads the root scroll-padding set by updateHeaderOffset().
      controller.scrollTo(target);
    } else target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  syncPreference();
  reducedMotion.addEventListener('change', syncPreference);
  document.addEventListener('click', onAnchorClick);
  window.addEventListener('pagehide', destroy);
  window.addEventListener('pageshow', syncPreference);

  function toPosition(top, { immediate = false } = {}) {
    if (controller) controller.scrollTo(top, { immediate, force: true });
    else window.scrollTo({ top, left: 0, behavior: immediate || reducedMotion.matches ? 'instant' : 'smooth' });
  }

  return {
    pause() { controller?.stop(); },
    resume() { controller?.start(); },
    refresh() {
      headerObserver.disconnect();
      const header = document.querySelector('.site-header');
      if (header) headerObserver.observe(header);
      updateHeaderOffset();
      controller?.resize();
    },
    toPosition,
    toTop(options) { toPosition(0, options); },
    dispose() {
      destroy();
      headerObserver.disconnect();
      document.documentElement.style.removeProperty('--site-header-height');
      reducedMotion.removeEventListener('change', syncPreference);
      document.removeEventListener('click', onAnchorClick);
      window.removeEventListener('pagehide', destroy);
      window.removeEventListener('pageshow', syncPreference);
    },
  };
}
