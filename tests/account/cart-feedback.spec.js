import { test, expect } from '@playwright/test';

const cartLink = page => page.locator('.site-header a[href="/cart"]:visible').first();
const badge = page => cartLink(page).locator('[data-cart-count]');
const toast = page => page.getByRole('complementary', { name: 'Cart notification' });
const cart = page => page.getByRole('dialog', { name: 'Your cart' });
const add = (page, slug) => page.locator(`[data-product-card="${slug}"]`).getByRole('button', { name: 'Add to cart', exact: true });

test('adding retains focus and layout, totals quantities, and only an explicit Cart click opens the drawer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/shop/category/mushrooms');
  const button = add(page, 'button-mushrooms');
  await button.scrollIntoViewIfNeeded();
  const before = await page.locator('.header-actions').evaluate(node => ({ x:node.getBoundingClientRect().x, width:node.getBoundingClientRect().width, y:scrollY }));
  await button.click();
  await expect(page).toHaveURL('/shop/category/mushrooms');
  await expect(cart(page)).not.toBeVisible();
  await expect(button).toBeFocused();
  await expect(toast(page)).toContainText('Added to your cart');
  await expect(toast(page)).toContainText('Button mushrooms · 1 item in your cart');
  await expect(badge(page)).toHaveText('1');
  const after = await page.locator('.header-actions').evaluate(node => ({ x:node.getBoundingClientRect().x, width:node.getBoundingClientRect().width, y:scrollY }));
  expect(after).toEqual(before);
  await button.click();
  await add(page, 'golden-oyster-mushrooms').click();
  await expect(badge(page)).toHaveText('3');
  await expect(toast(page)).toContainText('Golden oyster mushrooms · 3 items in your cart');
  await expect(page.locator('.cart-feedback')).toHaveCount(1);
  await cartLink(page).click();
  await expect(cart(page)).toBeVisible();
  await expect(toast(page)).not.toBeVisible();
  await expect(cart(page).locator('[aria-label="Quantity"]').first()).toHaveText('2');
  await cart(page).getByRole('button', { name: 'Reduce Button mushrooms quantity' }).click();
  await expect(badge(page)).toHaveText('2');
  await cart(page).getByRole('button', { name: 'Remove', exact: true }).first().click();
  await expect(badge(page)).toHaveText('1');
  await cart(page).getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(badge(page)).toBeHidden();
  await expect(cartLink(page)).toHaveAttribute('aria-description', 'Your cart is empty');
});

test('detail-page additions report quantities and the cap honestly, and dismissing returns focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/products/button-mushrooms');
  const quantity = page.getByLabel('Number of packs');
  const button = page.getByRole('button', { name: 'Add sample to cart' });
  await quantity.fill('3');
  await button.click();
  await expect(cart(page)).not.toBeVisible();
  await expect(toast(page)).toContainText('3 items in your cart');
  await expect(badge(page)).toHaveText('3');
  await toast(page).getByRole('button', { name: 'Dismiss cart notification' }).click();
  await expect(toast(page)).not.toBeVisible();
  await expect(button).toBeFocused();
  await quantity.fill('20');
  await button.click();
  await expect(badge(page)).toHaveText('20');
  await button.click();
  await expect(toast(page)).toContainText('You’ve reached the limit of 20 packs');
  await expect(badge(page)).toHaveText('20');
});

test('count and notification animate subtly, interrupted additions settle, reduced motion and auto-dismiss work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/shop/category/mushrooms');
  const result = await page.evaluate(() => {
    document.querySelector('[data-product-card="button-mushrooms"] [data-work-action="card-add"]').click();
    return { badge:document.querySelector('.header-actions [data-cart-count]').getAnimations().map(animation => animation.effect.getKeyframes()), toast:document.querySelector('.cart-feedback').getAnimations().map(animation => animation.effect.getKeyframes()) };
  });
  expect(result.badge.some(frames => frames.some(frame => frame.transform))).toBe(true);
  expect(result.toast.some(frames => frames.some(frame => frame.opacity))).toBe(true);
  await page.evaluate(() => { for (let i=0;i<5;i++) document.querySelector('[data-product-card="golden-oyster-mushrooms"] [data-work-action="card-add"]').click(); });
  await expect(badge(page)).toHaveText('6');
  await expect(toast(page)).toContainText('Golden oyster mushrooms · 6 items in your cart');
  await expect(cart(page)).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => badge(page).evaluate(node => node.getAnimations().length)).toBe(0);
  await expect.poll(() => page.locator('.cart-feedback').evaluate(node => node.getAnimations().length)).toBe(0);
  await expect(toast(page)).not.toBeVisible({ timeout:6000 });
  await expect(badge(page)).toHaveText('6');
});

test('mobile Cart count stays visible, the compact notice fits, and counts persist through page navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 560, 768]) {
    await page.setViewportSize({ width, height:900 });
    await page.goto('/shop/category/mushrooms');
    await add(page, 'button-mushrooms').click();
    await expect(badge(page)).toBeVisible();
    await expect(badge(page)).toHaveText('1');
    const box = await toast(page).boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x+box.width).toBeLessThanOrEqual(width);
    expect(box.y+box.height).toBeLessThanOrEqual(900);
    const target = await cartLink(page).boundingBox();
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
    await page.locator('[data-product-card="button-mushrooms"]').getByRole('link', { name:'Button mushrooms', exact:true }).click();
    await expect(page).toHaveURL('/products/button-mushrooms');
    await expect(badge(page)).toHaveText('1');
    await expect(toast(page)).not.toBeVisible();
    await cartLink(page).click();
    await expect(cart(page)).toContainText('Button mushrooms');
  }
});
