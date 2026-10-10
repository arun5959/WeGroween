import { test, expect } from '@playwright/test';

const routes = ['/', '/shop', '/our-farm', '/restaurant-supply', '/help', '/account'];
function headerLink(page, route) {
  if (route === '/') return page.locator('.site-header .brand');
  return page.locator(`${route === '/account' ? '.header-actions' : '.site-navigation'} a[href="${route}"]`);
}

test('all ordered desktop section jumps slide in the correct direction with a stable header', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  for (let from = 0; from < routes.length; from++) {
    for (let to = 0; to < routes.length; to++) {
      if (from === to) continue;
      await page.goto(routes[from]);
      await page.evaluate(() => document.fonts.ready);
      const width = await page.evaluate(() => document.documentElement.clientWidth);
      const header = await page.locator('.site-header').boundingBox();
      await headerLink(page, routes[to]).click();
      const direction = to > from ? 'forward' : 'backward';
      await expect(page.locator('#app')).toHaveAttribute('data-page-transition', direction);
      await expect(page.locator('.page-transition-copy')).toHaveCount(1);
      await expect(page.locator('#main-content')).toHaveCount(1);
      const frames = await page.locator('.page-transition-incoming').evaluate(node => node.getAnimations()[0].effect.getKeyframes());
      expect(frames[0].transform).toBe(`translateX(${direction === 'forward' ? width : -width}px)`);
      expect(frames.at(-1).transform).toBe('translateX(0px)');
      expect(await page.locator('.page-transition-incoming').evaluate(node => node.getAnimations()[0].effect.getTiming().duration)).toBe(420);
      const after = await page.locator('.site-header').boundingBox();
      expect(after.x).toBe(header.x);
      expect(after.y).toBe(header.y);
      expect(after.height).toBe(header.height);
      await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
      await expect(page.locator('#main-content')).toBeFocused();
      await expect(page.locator('.page-stage')).toHaveJSProperty('inert', false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
      if (routes[to] === '/account') await expect(page.locator('#app')).toHaveAttribute('data-status', '403');
    }
  }
});

test('Back/Forward, rapid navigation and cart activation clean up the active transition', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await headerLink(page, '/help').click();
  await headerLink(page, '/shop').click();
  await expect(page).toHaveURL('/shop');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await page.goBack();
  await expect(page.locator('#app')).toHaveAttribute('data-page-transition', 'forward');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await page.goForward();
  await expect(page.locator('#app')).toHaveAttribute('data-page-transition', 'backward');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await headerLink(page, '/help').click();
  await page.locator('.header-actions a[href="/cart"]').click();
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Your cart', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#cart-drawer')).not.toHaveAttribute('open');
});

test('transitions settle on width changes and reduced motion, then continue on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await headerLink(page, '/help').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.locator('#main-content')).toBeFocused();
  await headerLink(page, '/shop').click();
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await headerLink(page, '/help').click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('.site-navigation a[href="/shop"]').click();
  await expect(page).toHaveURL('/shop');
  await expect(page.locator('#app')).toHaveAttribute('data-page-transition', 'backward');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.locator('#app')).not.toHaveAttribute('data-page-transition');
});

test('navigation from a scrolled page preserves the outgoing view and lands at the destination top', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/our-farm');
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.wheel(0, 1400);
  await expect.poll(() => page.evaluate(() => Math.abs(scrollY - 1400))).toBeLessThan(2);
  // The header is already visible; click its viewport position without an
  // automation scroll-into-view changing the outgoing scroll snapshot.
  const target = await headerLink(page, '/help').boundingBox();
  await page.mouse.click(target.x + target.width / 2, target.y + target.height / 2);
  const outgoingTop = await page.locator('.page-transition-copy').first().evaluate(e => parseFloat(e.style.top));
  expect(outgoingTop).toBeLessThan(-1300);
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.goBack();
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C06');
  expect(await page.evaluate(() => Math.abs(scrollY - 1400))).toBeLessThan(2);
  await expect(page.locator('#main-content')).toBeFocused();
  await page.goForward();
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('rapid requests keep the current animation and coalesce into the latest destination', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await headerLink(page, '/help').click();
  await page.evaluate(() => {
    window.visibleStage = document.querySelector('.page-transition-incoming');
    window.visibleAnimation = window.visibleStage.getAnimations()[0];
    document.querySelectorAll('.page-transition-viewport').forEach(viewport => {
      viewport.querySelectorAll('.page-stage').forEach(stage => {
        stage.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 160; });
      });
    });
    window.visibleTransform = getComputedStyle(window.visibleStage).transform;
    document.querySelector('.site-navigation a[href="/our-farm"]').click();
    document.querySelector('.site-navigation a[href="/shop"]').click();
  });
  await expect(page).toHaveURL('/shop');
  expect(await page.evaluate(() => ({
    same: document.querySelector('.page-transition-incoming') === window.visibleStage,
    state: window.visibleAnimation.playState,
    transform: getComputedStyle(window.visibleStage).transform === window.visibleTransform,
  }))).toEqual({ same: true, state: 'paused', transform: true });
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C08');
  await page.evaluate(() => document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => animation.play())));
  await expect(page.locator('#app')).toHaveAttribute('data-page-transition', 'backward');
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.locator('.page-transition-placeholder')).toHaveCount(0);
  await expect(page.locator('.page-stage')).toHaveCSS('will-change', 'auto');
});

test('only visible incoming imagery is prioritized and offscreen images stay lazy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/our-farm');
  const lazyCount = await page.locator('.page-stage img[loading="lazy"]').count();
  expect(lazyCount).toBeGreaterThan(0);
  await headerLink(page, '/').click();
  expect(await page.locator('.page-transition-copy img[loading="lazy"]').count()).toBe(lazyCount);
  await expect(page.locator('.page-transition-incoming img[fetchpriority="high"]')).toHaveCount(1);
  expect(await page.locator('.page-transition-incoming img[loading="lazy"]').count()).toBeGreaterThan(0);
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
});

test('history keeps separate scroll positions for repeated visits, including reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/our-farm');
  async function scrollTo(top) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(top);
  }
  async function visit(route) {
    // Header links are visible without scrolling; preserve the outgoing view.
    const target = await headerLink(page, route).boundingBox();
    await page.mouse.click(target.x + target.width / 2, target.y + target.height / 2);
    await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
    await expect(page.locator('#main-content')).toBeFocused();
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
  await scrollTo(1000);
  await visit('/help');
  await scrollTo(600);
  await visit('/our-farm');
  await scrollTo(1800);
  await visit('/help');
  await page.goBack();
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(1800);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goBack();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C08');
  expect(await page.evaluate(() => scrollY)).toBe(600);
  await page.goBack();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C06');
  expect(await page.evaluate(() => scrollY)).toBe(1000);
  await page.goForward();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C08');
  expect(await page.evaluate(() => scrollY)).toBe(600);
});

test('cart and reduced-motion interruptions commit the latest pending destination', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  async function queuePages() {
    await headerLink(page, '/help').click();
    await page.evaluate(() => {
      document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => animation.pause()));
      document.querySelector('.site-navigation a[href="/shop"]').click();
    });
  }
  await queuePages();
  await page.locator('.header-actions a[href="/cart"]').click();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Your cart', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#cart-drawer')).not.toHaveAttribute('open');
  await page.goto('/');
  await queuePages();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('.page-stage')).toHaveJSProperty('inert', false);
});

test('chapter anchor history restores both the chapter view and its preceding scroll position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const reducedMotion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/our-farm');
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(1000);
    await page.locator('.story-stage').nth(2).evaluate(link => link.click());
    await expect.poll(() => page.evaluate(() => Math.abs(document.querySelector('#story-chapter-3').getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom))).toBeLessThan(2);
    const chapterScroll = await page.evaluate(() => scrollY);
    const target = await headerLink(page, '/help').boundingBox();
    await page.mouse.click(target.x + target.width / 2, target.y + target.height / 2);
    await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
    await page.goBack();
    await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
    await expect(page).toHaveURL(/\/our-farm#story-chapter-3$/);
    expect(await page.evaluate(() => scrollY)).toBe(chapterScroll);
    await page.goBack();
    await expect(page).toHaveURL('/our-farm');
    expect(await page.evaluate(() => scrollY)).toBe(1000);
    await page.goForward();
    await expect(page).toHaveURL(/#story-chapter-3$/);
    expect(await page.evaluate(() => scrollY)).toBe(chapterScroll);
  }
});
