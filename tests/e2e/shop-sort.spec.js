import { test, expect } from '@playwright/test';

test('public Shop sorts sample prices without treating preview inventory as live availability', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/shop/category/mushrooms');
  await expect(page.locator('.shop-page')).toHaveAttribute('data-shop-preview', 'false');
  const control = page.getByRole('combobox', { name: 'Sort by in Mushrooms' });
  await control.click();
  await page.getByRole('option', { name: 'Price: high to low', exact: true }).click();
  await expect(page.locator('[data-product-card]').first()).toHaveAttribute('data-product-card', 'oyster-radish-pairing');
  await expect(page.locator('[data-product-card] .product-card-price-note').first()).toHaveText('Sample price');
  await control.click();
  await page.getByRole('option', { name: 'Availability', exact: true }).click();
  await expect(page.locator('[data-shop-sort-status]')).toContainText('Availability is not confirmed yet');
  await expect(page.locator('[data-product-card]').first()).toHaveAttribute('data-product-card', 'button-mushrooms');
  for (const button of await page.locator('[data-product-card] button').all()) await expect(button).toBeDisabled();
});


test('public All products sorts the complete catalogue and recovers its state on reload', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [1440,390,320]) {
    await page.setViewportSize({width,height:900});await page.goto('/shop');
    await expect(page.locator('[data-shop-collection]')).toHaveCount(2);
    await page.getByRole('link',{name:'All products',exact:true}).click();
    await expect(page.locator('[data-product-card]')).toHaveCount(11);
    const sort=page.getByRole('combobox',{name:'Sort by in All products'});
    await sort.click();await page.getByRole('option',{name:'Price: low to high',exact:true}).click();
    await expect(page).toHaveURL('/shop?view=all&sort=price-asc');
    const prices=await page.locator('.product-card-price strong').evaluateAll(items=>items.map(item=>Number(item.textContent.replace(/[^0-9]/g,''))));
    expect(prices).toEqual([...prices].sort((a,b)=>a-b));
    await page.reload();await expect(sort).toHaveText('Price: low to high');
    await expect(page.locator('.shop-page')).toHaveAttribute('data-shop-view','all');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
    for(const button of await page.locator('[data-product-card] button').all())await expect(button).toBeDisabled();
  }
});
