import { test, expect } from '@playwright/test';

const field = page => page.getByRole('combobox', { name: 'Search products' });
const trigger = page => page.locator('.header-actions a[href="/search"]');
const panel = page => page.locator('[data-header-search-panel]');
async function settled(page) {
  await expect.poll(() => page.locator('[data-header-search]').evaluate(form => form.getAnimations().length)).toBe(0);
}

async function pointerClick(page, locator) {
  const bounds = await locator.boundingBox();
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
}
for (const reducedMotion of ['reduce', 'no-preference']) {
  test(`expansion preserves reading position and form data (${reducedMotion})`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion });
    await page.goto('/help');
    await page.evaluate(() => document.fonts.ready);
    await page.getByLabel('Your message').fill('Keep my unsent question');
    const position = await page.evaluate(() => scrollY);
    const header = await page.locator('.site-header').boundingBox();
    await pointerClick(page, trigger(page));
    await expect(field(page)).toBeFocused();
    await page.keyboard.type('mush');
    await settled(page);
    await expect(page.locator('#header-search-list [role="option"]')).toHaveCount(1);
    const input = await page.locator('.header-search-field').boundingBox();
    const popup = await panel(page).boundingBox();
    expect(Math.abs(input.x - popup.x)).toBeLessThan(1);
    expect(Math.abs(input.width - popup.width)).toBeLessThan(1);
    expect((await page.locator('.site-header').boundingBox()).height).toBe(header.height);
    expect(Math.abs(await page.evaluate(() => scrollY) - position)).toBeLessThan(1);
    await expect(page).toHaveURL('/help');
    await expect(page.locator('#site-navigation')).toHaveJSProperty('inert', true);
    await pointerClick(page, page.getByRole('button', { name: 'Close search' }));
    await expect(trigger(page)).toBeFocused();
    await expect(page.getByLabel('Your message')).toHaveValue('Keep my unsent question');
    await expect(page.locator('#site-navigation')).toHaveJSProperty('inert', false);
  });
}

test('compact search preserves right actions with its close control inside the field', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const account = page.locator('.header-actions a[href="/account"]');
  const cart = page.locator('.header-actions a[href="/cart"]');
  const positions = await Promise.all([account.boundingBox(), cart.boundingBox()]);
  await trigger(page).click();
  await settled(page);
  const area = await page.locator('.header-search-field').boundingBox();
  const close = await page.getByRole('button', { name: 'Close search' }).boundingBox();
  expect(area.height).toBe(44);
  expect(close.x).toBeGreaterThan(area.x);
  expect(close.x + close.width).toBeLessThanOrEqual(area.x + area.width + 1);
  for (const [index, link] of [account, cart].entries()) {
    await expect(link).toBeVisible();
    expect((await link.boundingBox()).x).toBe(positions[index].x);
    expect(await link.evaluate(element => Boolean(element.closest('[inert]')))).toBe(false);
  }
  expect(area.x + area.width).toBeLessThan(positions[0].x);
  await cart.click();
  await expect(page.locator('#cart-drawer')).toBeVisible();
  await expect(page.locator('[data-header-search]')).not.toBeVisible();
  await page.keyboard.press('Escape');
  await trigger(page).click();
  await account.click();
  await expect(page).toHaveURL('/account');
});

test('manual keyboard selection, Escape layers, query retention and clearing behave predictably', async ({ page }) => {
  await page.goto('/');
  await trigger(page).click();
  await field(page).fill('radish');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/');
  await expect(field(page)).not.toHaveAttribute('aria-activedescendant');
  await page.keyboard.press('ArrowDown');
  await expect(field(page)).toHaveAttribute('aria-activedescendant', 'header-search-result-0');
  await expect(field(page)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel(page)).not.toBeVisible();
  await expect(field(page)).toHaveValue('radish');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-header-search]')).not.toBeVisible();
  await expect(trigger(page)).toBeFocused();
  await trigger(page).click();
  await expect(field(page)).toHaveValue('radish');
  await field(page).fill('');
  await expect(panel(page)).not.toBeVisible();
  await expect(field(page)).toBeVisible();
  await field(page).fill('radish');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/products/radish-microgreens');
  await expect(page.locator('[data-header-search]')).not.toBeVisible();
});

test('empty matches are escaped and recovery navigation still works', async ({ page }) => {
  await page.goto('/');
  await trigger(page).click();
  await field(page).fill('<img src=x onerror=alert(1)>');
  await expect(page.locator('[data-header-search-empty]')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('[data-header-search-empty] img')).toHaveCount(0);
  await expect(page.locator('#header-search-list [role="option"]')).toHaveCount(0);
  await page.locator('.header-search-categories').getByRole('link', { name: 'Mushrooms', exact: true }).click();
  await expect(page).toHaveURL('/shop/category/mushrooms');
  await expect(page.locator('[data-header-search]')).not.toBeVisible();
});

test('outside clicks retain their action, cart closes search, and route/history dispose the popup', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await trigger(page).click();
  await field(page).fill('mush');
  await page.getByRole('link', { name: 'Shop this harvest' }).click();
  await expect(page).toHaveURL('/shop');
  await trigger(page).click();
  await field(page).fill('mush');
  await page.locator('.footer-store').getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.locator('#cart-drawer')).toBeVisible();
  await expect(page.locator('[data-header-search]')).not.toBeVisible();
  await page.keyboard.press('Escape');
  await trigger(page).click();
  await field(page).fill('radish');
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.locator('[data-header-search]')).not.toBeVisible();
  await expect(page.locator('[data-header-search-panel]')).toHaveCount(1);
});

test('rapid open/close settles and reduced-motion changes finish active motion', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const search = document.querySelector('.header-actions a[href="/search"]');
    const close = document.querySelector('.header-search-close');
    search.click(); close.click(); search.click(); close.click(); search.click();
  });
  await field(page).fill('mush');
  await expect(field(page)).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await settled(page);
  await expect(panel(page)).toBeVisible();
  await page.getByRole('button', { name: 'Close search' }).click();
  await expect(page.locator('[data-header-search]')).not.toBeVisible();
  await expect(trigger(page)).toBeFocused();
});

test('old search addresses reopen the header on Shop without a separate search page', async ({ page }) => {
  await page.goto('/search?q=radish');
  await expect(page).toHaveURL('/shop?q=radish');
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await expect(field(page)).toHaveValue('radish');
  await expect(page.locator('#header-search-list [role="option"]')).toContainText('Radish microgreens');
  await page.reload();
  await expect(field(page)).toHaveValue('radish');
});

test('search settles pending page slides and opens against the current header', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.querySelector('#site-navigation a[href="/shop"]').click());
  await page.evaluate(() => {
    document.querySelectorAll('.page-transition-viewport .page-stage').forEach(stage => stage.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 100; }));
    document.querySelector('#site-navigation a[href="/our-farm"]').click();
    document.querySelector('.header-actions a[href="/search"]').click();
  });
  await expect(page).toHaveURL('/our-farm');
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C06');
  await expect(page.locator('.page-transition-viewport')).toHaveCount(0);
  await expect(field(page)).toBeFocused();
  await field(page).fill('mush');
  await expect(page.locator('#header-search-list [role="option"]')).toHaveCount(1);
});

for (const width of [1920, 1440, 1280, 1024, 768, 390, 320]) {
  test(`search and results stay aligned within ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await page.locator(width <= 720 ? '.mobile-header-controls a[href="/search"]' : '.header-actions a[href="/search"]').click();
    await field(page).fill('micro');
    await settled(page);
    const input = await page.locator('.header-search-field').boundingBox();
    const popup = await panel(page).boundingBox();
    expect(Math.abs(input.width - popup.width)).toBeLessThan(1);
    expect(Math.abs(input.x - popup.x)).toBeLessThan(1);
    expect(popup.x).toBeGreaterThanOrEqual(0);
    expect(popup.x + popup.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await expect(page.getByRole('button', { name: 'Close search' })).toBeVisible();
    if (width <= 720) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await expect(page.locator('[data-header-search]')).not.toBeVisible();
      await expect(page.locator('#site-navigation')).toBeVisible();
    }
  });
}

test('mobile menu search restores a usable trigger and hidden navigation stays inert', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).tap();
  await page.locator('.mobile-menu-actions a[href="/search"]').tap();
  await field(page).fill('mush');
  await expect.poll(() => page.locator('#site-navigation').evaluate(nav => nav.getAnimations().length)).toBe(0);
  await expect(page.locator('#site-navigation')).toHaveJSProperty('inert', true);
  await page.getByRole('button', { name: 'Close search' }).tap();
  await expect(page.locator('.mobile-header-controls a[href="/search"]')).toBeFocused();
  await expect(page.locator('#site-navigation')).toHaveJSProperty('inert', false);
  await context.close();
});
