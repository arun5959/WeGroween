import { pageMotionDirection } from './route-motion-order.js';

// Runtime-only presentation layer: public HTML stays intact at every width.
export function setupPageTransitions({ root, pauseScroll, resumeScroll }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const options = { signal: events.signal };
  const priorScrollRestoration = history.scrollRestoration;
  history.scrollRestoration = 'manual';
  let viewportWidth = document.documentElement.clientWidth;
  let active = null;
  let pending = null;
  const idleWaiters = new Set();
  function notifyIdle() {
    if (active) return;
    idleWaiters.forEach(resolve => resolve());
    idleWaiters.clear();
  }

  function wrapPage() {
    const stage = document.createElement('div');
    stage.className = 'page-stage';
    [...root.children].filter(element => !element.matches('.skip-link, .site-header, .identity-header')).forEach(element => stage.append(element));
    root.append(stage);
  }

  function snapshot(stage, bounds) {
    const copy = stage.cloneNode(true);
    copy.classList.add('page-transition-copy');
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    // Keep lazy images lazy, including those below the outgoing viewport.
    copy.style.width = `${bounds.width}px`;
    copy.style.left = `${bounds.left}px`;
    return copy;
  }

  function settle({ focus = true, animateNext = true, discardPending = false } = {}) {
    if (!active) return;
    const current = active;
    const next = discardPending ? null : pending;
    active = pending = null;
    current.animations.forEach(animation => animation.cancel());
    current.placeholder.replaceWith(current.stage);
    current.overlay.remove();
    current.stage.classList.remove('page-transition-incoming');
    if (current.style === null) current.stage.removeAttribute('style');
    else current.stage.setAttribute('style', current.style);
    current.stage.inert = current.inert;
    delete root.dataset.pageTransition;
    resumeScroll();
    if (next) {
      if (animateNext) run(current.to, next.to, next.update);
      else next.update({ slide: false });
    } else if (focus) root.querySelector('#main-content')?.focus({ preventScroll: true });
    notifyIdle();
  }

  function run(from, to, update) {
    if (active) {
      // Finish the visible movement. Coalesce extra clicks into one latest
      // destination rather than snapping or building a queue of stale pages.
      pending = { to, update };
      return;
    }
    const direction = pageMotionDirection(from, to);
    const oldStage = root.querySelector('.page-stage');
    if (reduced.matches || !direction || !oldStage?.animate) {
      update({ slide: false });
      notifyIdle();
      return;
    }
    // Read the outgoing geometry before rendering changes scroll or layout.
    const oldBounds = oldStage.getBoundingClientRect();
    const outgoing = snapshot(oldStage, oldBounds);
    update({ slide: true });
    const stage = root.querySelector('.page-stage');
    const top = Math.max(0, root.querySelector('.site-header, .identity-header')?.getBoundingClientRect().bottom ?? 0);
    const bounds = stage.getBoundingClientRect();
    const distance = document.documentElement.clientWidth;
    const tokens = getComputedStyle(document.documentElement);
    const timing = tokens.getPropertyValue('--motion-page-slide').trim();
    const duration = (parseFloat(timing) * (timing.endsWith('ms') ? 1 : 1000)) || 420;
    const easing = tokens.getPropertyValue('--motion-page-slide-easing').trim() || 'cubic-bezier(.25, .1, .25, 1)';
    // Measure images before positioning writes. Decode only the first visible
    // image opportunistically; navigation never waits on it.
    const visibleImage = [...stage.querySelectorAll('img')].find(image => {
      const rect = image.getBoundingClientRect();
      return rect.bottom > top && rect.top < innerHeight && rect.width > 0;
    });
    if (visibleImage) {
      visibleImage.loading = 'eager';
      visibleImage.fetchPriority = 'high';
      visibleImage.decode?.().catch(() => {});
    }
    const placeholder = document.createElement('div');
    placeholder.className = 'page-transition-placeholder';
    placeholder.style.height = `${bounds.height}px`;
    placeholder.setAttribute('aria-hidden', 'true');
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-viewport';
    overlay.style.top = `${top}px`;
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.inert = true;
    outgoing.style.top = `${oldBounds.top - top}px`;
    const style = stage.getAttribute('style');
    const inert = stage.inert;
    stage.replaceWith(placeholder);
    stage.classList.add('page-transition-incoming');
    stage.style.width = `${bounds.width}px`;
    stage.style.left = `${bounds.left}px`;
    stage.style.top = `${bounds.top - top}px`;
    stage.inert = true;
    overlay.append(outgoing, stage);
    root.append(overlay);
    active = { to, stage, placeholder, overlay, animations: [], style, inert };
    root.dataset.pageTransition = direction;
    pauseScroll();
    const sign = direction === 'forward' ? 1 : -1;
    const leave = outgoing.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-sign * distance}px)` }], { duration, easing, fill: 'both' });
    const enter = stage.animate([{ transform: `translateX(${sign * distance}px)` }, { transform: 'translateX(0)' }], { duration, easing, fill: 'both' });
    active.animations = [leave, enter];
    const current = active;
    enter.onfinish = () => { if (active === current) settle(); };
  }
  reduced.addEventListener('change', () => settle({ animateNext: false }), options);
  window.addEventListener('resize', () => {
    const width = document.documentElement.clientWidth;
    // Mobile browser chrome changes height while scrolling. The fixed clipped
    // layer follows its viewport without cancelling an otherwise valid slide.
    if (width !== viewportWidth) settle({ animateNext: false });
    viewportWidth = width;
  }, options);
  return {
    wrapPage, run,
    whenIdle() { return active ? new Promise(resolve => idleWaiters.add(resolve)) : Promise.resolve(); },
    cancel: (options) => settle({ ...options, animateNext: false }),
    dispose() { settle({ focus: false, discardPending: true }); history.scrollRestoration = priorScrollRestoration; events.abort(); },
  };
}
