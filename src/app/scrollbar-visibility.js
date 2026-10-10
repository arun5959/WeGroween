// One passive capture listener covers document, cart, menus and portalled lists.
export function setupScrollbarVisibility() {
  const events = new AbortController();
  const timers = new Map();
  function reset() {
    for (const [element, timer] of timers) {
      clearTimeout(timer);
      element.removeAttribute('data-scrollbar-active');
    }
    timers.clear();
  }
  document.addEventListener('scroll', event => {
    // Chromium can paint viewport scrollbar styles from body even though html
    // owns scrollTop. Keep both in sync; nested scroll containers stay separate.
    const elements = event.target === document ? [document.scrollingElement, document.body] : [event.target];
    for (const element of elements) {
      if (!(element instanceof Element)) continue;
      if (!timers.has(element)) {
        element.classList.add('wg-scrollbar-managed');
        element.setAttribute('data-scrollbar-active', '');
      } else clearTimeout(timers.get(element));
      timers.set(element, setTimeout(() => {
        element.removeAttribute('data-scrollbar-active');
        timers.delete(element);
      }, 650));
    }
  }, { capture: true, passive: true, signal: events.signal });
  window.addEventListener('pagehide', reset, { signal: events.signal });
  return {
    dispose() {
      events.abort();
      reset();
      document.querySelectorAll('.wg-scrollbar-managed').forEach(element => element.classList.remove('wg-scrollbar-managed'));
    },
  };
}
