import { test, expect } from '@playwright/test';

test('new category surfaces, empty ranges, reload and retired Pairings links stay consistent', async ({ page }) => {
  const errors = [];page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion:'reduce' });
  for (const width of [1440,390,320]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await expect(page.locator('.category-card h3')).toHaveText(['Mushrooms','Microgreens','Organic Harvest','Exotics']);
    await expect(page.locator('.footer-store a[href="/shop/category/organic-harvest"]')).toHaveText('Organic Harvest');
    await expect(page.locator('.footer-store a[href="/shop/category/exotics"]')).toHaveText('Exotics');
    await expect(page.locator('a[href="/shop/category/combos"]')).toHaveCount(0);
    for(const slug of ['organic-harvest','exotics']) {
      await page.goto(`/shop/category/${slug}`);
      await expect(page.locator('#app')).toHaveAttribute('data-status','200');
      await expect(page.locator('#shop-category')).toHaveValue(slug);
      await expect(page.locator('.shop-category-empty')).toBeVisible();
      await expect(page.locator('[data-product-card]')).toHaveCount(0);
      await expect(page.locator('.shop-global-sort')).not.toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
      await page.reload();
      await expect(page.locator('.shop-category-empty')).toBeVisible();
      await page.getByRole('link',{name:'Explore the current harvest',exact:true}).click();
      await expect(page).toHaveURL('/shop');
      await expect(page.locator('[data-product-card]')).toHaveCount(11);
    }
  }
  await page.goto('/shop/category/combos');
  await expect(page).toHaveURL('/shop');
  await page.goto('/combos.html');
  await expect(page).toHaveURL('/shop');
  expect(errors).toEqual([]);
});
