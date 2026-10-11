import { test, expect } from '@playwright/test';

test('public product cards open details while ordering is closed, including category and related cards', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [path, slug, target, name] of [
      ['/shop', 'golden-oyster-mushrooms', 'figure', 'Golden oyster mushrooms'],
      ['/shop/category/mushrooms', 'oyster-radish-pairing', '.product-card-description', 'Oyster & radish pairing'],
      ['/products/button-mushrooms', 'radish-microgreens', '.product-card-price', 'Radish microgreens'],
    ]) {
      await page.goto(path);
      const card = page.locator(`[data-product-card="${slug}"]`);
      expect(await card.evaluate(el => getComputedStyle(el).cursor)).toBe('pointer');
      await expect(card.getByRole('button', { name: 'Buy now', exact: true })).toBeDisabled();
      await card.locator(target).click();
      await expect(page).toHaveURL(`/products/${slug}`);
      await expect(page.getByRole('heading', { level: 1, name, exact: true })).toBeVisible();
      await expect(page.locator('#app')).toHaveAttribute('data-status', '200');
    }
  }
});
