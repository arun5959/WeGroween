// Shared, interruptible motion. Content and focus update immediately;
// layout settles gently using the existing DLS timings.
export function setupInterfaceMotion(root) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const heights = new Map();
  const fades = new Set();
  const tokens = getComputedStyle(document.documentElement);
  // The production CSS optimizer may convert 220ms to .22s.
  const timing = tokens.getPropertyValue('--motion-standard').trim();
  const duration = (parseFloat(timing) * (timing.endsWith('ms') ? 1 : 1000)) || 220;
  const easing = tokens.getPropertyValue('--motion-easing-standard').trim() || 'ease-out';

  function cancelHeight(element) {
    const current = heights.get(element);
    if (!current) return;
    heights.delete(element);
    current.animation.cancel();
    element.style.overflow = current.overflow;
  }

  function height(element, from, to, finish = () => {}) {
    if (preference.matches || Math.abs(from - to) < .5 || !element.animate) {
      finish();
      return;
    }
    const overflow = element.style.overflow;
    element.style.overflow = 'hidden';
    const animation = element.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration, easing });
    const record = { animation, overflow, finish };
    heights.set(element, record);
    animation.onfinish = () => {
      if (heights.get(element) !== record) return;
      heights.delete(element);
      element.style.overflow = overflow;
      finish();
    };
  }

  function reveal(element) {
    if (preference.matches || !element?.animate) return;
    const animation = element.animate([{ opacity: .65 }, { opacity: 1 }], { duration, easing });
    fades.add(animation);
    animation.onfinish = () => fades.delete(animation);
  }

  function changeLayout(element, change) {
    const from = element.getBoundingClientRect().height;
    cancelHeight(element);
    change();
    height(element, from, element.getBoundingClientRect().height);
  }

  root.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;
    details.classList.add('motion-disclosure');
    details.dataset.expanded = String(details.open);
    summary.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const expanded = details.dataset.expanded !== 'true';
      const from = details.getBoundingClientRect().height;
      cancelHeight(details);
      details.dataset.expanded = String(expanded);
      summary.setAttribute('aria-expanded', String(expanded));
      details.open = expanded;
      const to = details.getBoundingClientRect().height;
      // Keep the answer rendered while closing so its height can interpolate.
      details.open = true;
      height(details, from, to, () => { details.open = expanded; });
      if (expanded) reveal(details.querySelector('.contact-answer'));
    }, options);
  });

  function toggleMenu(toggle, navigation, expanded) {
    const from = navigation.getBoundingClientRect().height;
    cancelHeight(navigation);
    toggle.setAttribute('aria-expanded', String(expanded));
    navigation.classList.add('is-open');
    navigation.inert = !expanded;
    navigation.toggleAttribute('data-lenis-prevent', expanded);
    const to = expanded ? navigation.getBoundingClientRect().height : 0;
    height(navigation, from, to, () => {
      navigation.classList.toggle('is-open', expanded);
      // Inert is only needed during the closing animation. Desktop stays usable.
      navigation.inert = false;
    });
    if (expanded) reveal(navigation);
  }

  function settle() {
    for (const [element, record] of [...heights]) {
      cancelHeight(element);
      record.finish();
    }
    for (const animation of fades) animation.cancel();
    fades.clear();
  }
  preference.addEventListener('change', settle, options);
  window.addEventListener('resize', settle, options);
  return {
    changeLayout, reveal, toggleMenu,
    dispose() { controller.abort(); settle(); },
  };
}
