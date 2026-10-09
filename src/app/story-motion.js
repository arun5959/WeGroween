export function setupStoryMotion(root) {
  const timeline = root.querySelector('.story-timeline');
  if (!timeline) return () => {};
  const story = root.querySelector('.brand-story');
  const chapters = [...timeline.querySelectorAll('[data-story-chapter]')];
  const stages = [...story.querySelectorAll('[data-story-stage]')];
  const progress = timeline.querySelector('.story-progress');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  let active = -1;

  function update() {
    frame = null;
    const marker = Math.max(window.innerHeight * .5, document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0);
    let current = -1;
    chapters.forEach((chapter, index) => {
      const bounds = chapter.getBoundingClientRect();
      if (bounds.top < window.innerHeight * .85) chapter.classList.add('is-seen');
      if (bounds.top <= marker) current = index;
    });
    const bounds = timeline.getBoundingClientRect();
    const amount = preference.matches ? 1 : Math.max(0, Math.min(1, (marker - bounds.top) / bounds.height));
    progress.style.transform = `scaleY(${amount})`;
    if (current !== active) {
      active = current;
      stages.forEach((stage, index) => {
        if (index === current) stage.setAttribute('aria-current', 'step');
        else stage.removeAttribute('aria-current');
      });
    }
  }

  function schedule() {
    if (frame === null) frame = requestAnimationFrame(update);
  }

  function syncPreference() {
    if (frame !== null) cancelAnimationFrame(frame);
    story.classList.toggle('story-motion', !preference.matches);
    update();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  preference.addEventListener('change', syncPreference);
  syncPreference();
  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    preference.removeEventListener('change', syncPreference);
  };
}
