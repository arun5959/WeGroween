import { test, expect } from '@playwright/test';

const routes = ['/', '/shop', '/our-farm', '/restaurant-supply', '/help', '/account'];
async function touch(page, locator) {
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
}
async function navigate(page, route, width) {
  if (route === '/') return touch(page, page.locator('.site-header .brand'));
  if (width <= 720) {
    await touch(page, page.getByRole('button', { name: 'Menu', exact: true }));
    await expect.poll(() => page.locator('#site-navigation').evaluate(menu => menu.getAnimations().length)).toBe(0);
  }
  const group = route === '/account' ? (width <= 720 ? '.mobile-menu-actions' : '.header-actions') : '.site-navigation';
  await touch(page, page.locator(`${group} a[href="${route}"]`));
}
async function clean(page) {
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.locator('.page-transition-placeholder')).toHaveCount(0);
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('.page-stage')).toHaveJSProperty('inert', false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
}

for (const width of [320, 360, 390, 440, 600, 720, 768, 1024]) {
  test(`touch navigation follows the page order in both directions at ${width}px`, async ({ browser }) => {
    test.setTimeout(45000);
    const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: true, hasTouch: true });
    try {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const compactHeader = await page.locator('.site-header').boundingBox();
      let previous = '/';
      // Includes distant jumps as well as every adjacent section, in reverse.
      for (const route of [...routes.slice(1), ...routes.slice(0, -1).reverse(), '/help', '/shop']) {
        const direction = routes.indexOf(route) > routes.indexOf(previous) ? 'forward' : 'backward';
        await navigate(page, route, width);
        await expect(page.locator('#app')).toHaveAttribute('data-page-transition', direction);
        const motion = await page.locator('.page-transition-incoming').evaluate(stage => ({
          frames: stage.getAnimations()[0].effect.getKeyframes(),
          duration: stage.getAnimations()[0].effect.getTiming().duration,
          distance: document.documentElement.clientWidth,
          top: stage.parentElement.getBoundingClientRect().top,
          headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
        }));
        expect(motion.frames[0].transform).toBe(`translateX(${direction === 'forward' ? motion.distance : -motion.distance}px)`);
        expect(motion.duration).toBe(420);
        expect(Math.abs(motion.top - motion.headerBottom)).toBeLessThan(1);
        await expect(page.locator('.page-transition-copy')).toHaveCount(1);
        await expect(page.locator('#main-content')).toHaveCount(1);
        const header = await page.locator('.site-header').boundingBox();
        expect(header.height).toBe(compactHeader.height);
        if (width <= 720) await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
        await clean(page);
        if (route === '/account') await expect(page.locator('#app')).toHaveAttribute('data-status', '403');
        previous = route;
      }
      expect(errors).toEqual([]);
    } finally { await context.close(); }
  });
}

test('rapid mobile taps preserve movement; height changes keep it running and orientation settles it', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await touch(page, page.getByRole('link', { name: 'Shop this harvest' }));
    await page.evaluate(() => {
      window.visibleStage = document.querySelector('.page-transition-incoming');
      document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 160; }));
      window.visibleTransform = getComputedStyle(window.visibleStage).transform;
    });
    await touch(page, page.locator('.mobile-header-controls .menu-toggle'));
    await touch(page, page.locator('.site-header .brand'));
    expect(await page.evaluate(() => document.querySelector('.page-transition-incoming') === window.visibleStage && getComputedStyle(window.visibleStage).transform === window.visibleTransform)).toBe(true);
    await page.setViewportSize({ width: 390, height: 700 });
    await expect(page.locator('.page-transition-incoming')).toHaveCount(1);
    expect(await page.locator('.page-transition-incoming').evaluate(stage => stage.getAnimations()[0].playState)).toBe('paused');
    await page.setViewportSize({ width: 844, height: 390 });
    await clean(page);
    await expect(page).toHaveURL('/');
    await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C01');
  } finally { await context.close(); }
});

test('phone and tablet history restore scroll; reduced motion skips slides', async ({ browser }) => {
  for (const width of [390, 768]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    try {
      const page = await context.newPage();
      await page.goto('/our-farm');
      await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(900);
      await navigate(page, '/help', width);
      await clean(page);
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await page.goBack();
      await clean(page);
      expect(await page.evaluate(() => scrollY)).toBe(900);
      await page.goForward();
      await clean(page);
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goBack();
      await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C06');
      await clean(page);
      expect(await page.evaluate(() => scrollY)).toBe(900);
      await navigate(page, '/shop', width);
      await expect(page).toHaveURL('/shop');
      await clean(page);
      await expect(page.locator('#app')).not.toHaveAttribute('data-page-transition');
    } finally { await context.close(); }
  }
});

test('a menu tap during a slide waits for a stable header and can be cancelled', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto('/');
    const header = await page.locator('.site-header').boundingBox();
    await touch(page, page.getByRole('link', { name: 'Shop this harvest' }));
    await page.evaluate(() => document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => animation.pause())));
    await touch(page, page.getByRole('button', { name: 'Menu', exact: true }));
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
    expect((await page.locator('.site-header').boundingBox()).height).toBe(header.height);
    await touch(page, page.getByRole('button', { name: 'Menu', exact: true }));
    await page.evaluate(() => document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => animation.play())));
    await clean(page);
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
    await touch(page, page.locator('.site-header .brand'));
    await page.evaluate(() => document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => animation.pause())));
    await touch(page, page.getByRole('button', { name: 'Menu', exact: true }));
    await page.evaluate(() => document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => animation.play())));
    await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-navigation')).toHaveJSProperty('inert', false);
  } finally { await context.close(); }
});
