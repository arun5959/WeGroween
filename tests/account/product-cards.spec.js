import { test, expect } from '@playwright/test';
import { products, shopCollections } from '../../src/content/foundation.js';

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });
const mushrooms = page => page.locator('[data-product-card="button-mushrooms"]');

test('neighbouring cards align every content tier despite wrapping titles, descriptions and packs', async ({ page }) => {
  for (const width of [1440, 1100, 1024, 768, 560, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/shop');
    await page.evaluate(() => document.fonts.ready);
    const grids = await page.locator('.product-grid').evaluateAll(grids => grids.map(grid => {
      const selectors = ['figure', 'h3', '.product-card-description', '.product-card-price p', '.product-card-price-note', '.product-card-actions'];
      const rows = new Map();
      for (const card of grid.children) {
        const top = Math.round(card.getBoundingClientRect().top);
        const row = rows.get(top) || [];
        row.push(selectors.map(selector => card.querySelector(selector).getBoundingClientRect().top));
        rows.set(top, row);
      }
      return [...rows.values()];
    }));
    for (const rows of grids) for (const row of rows) for (let tier = 0; tier < 6; tier++) {
      const positions = row.map(card => card[tier]);
      expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(1);
    }
    const intact = await page.locator('[data-product-card]').evaluateAll(cards => cards.every(card => {
      const description = card.querySelector('.product-card-description');
      const name = card.querySelector('h3');
      return description.scrollHeight <= description.clientHeight + 1 && name.scrollHeight <= name.clientHeight + 1 && card.scrollWidth <= card.clientWidth + 1;
    }));
    expect(intact).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  }
  // Related products use the same hierarchy at the original card scale.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/products/button-mushrooms');
  const descriptionTops = await page.locator('.product-grid .product-card-description').evaluateAll(items => items.map(item => item.getBoundingClientRect().top));
  expect(descriptionTops.length).toBeGreaterThan(1);
  expect(Math.max(...descriptionTops) - Math.min(...descriptionTops)).toBeLessThan(1);
});

test('Shop presents unique editorial collections in a compact four-column desktop grid', async ({ page }) => {
  for (const [width, columns] of [[1440, 4], [1100, 4], [1024, 2], [768, 2], [560, 1], [390, 1], [320, 1]]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/shop');
    await expect(page.locator('[data-shop-collection]')).toHaveCount(2);
    for (const collection of shopCollections) {
      const section = page.locator(`[data-shop-collection="${collection.id}"]`);
      await expect(section.getByRole('heading', { name: collection.name, exact: true })).toBeVisible();
      expect(await section.locator('[data-product-card]').evaluateAll(cards => cards.map(card => card.dataset.productCard))).toEqual(collection.slugs);
      if (width > 720) expect(await section.locator('.product-grid').evaluate(grid => getComputedStyle(grid).gridTemplateColumns.split(' ').length)).toBe(columns);
      else expect(await section.locator('.shop-shelf-track').evaluate(track => track.scrollWidth > track.clientWidth)).toBe(true);
    }
    const slugs = await page.locator('[data-product-card]').evaluateAll(cards => cards.map(card => card.dataset.productCard));
    expect(slugs.length).toBe(products.length);
    expect(new Set(slugs).size).toBe(products.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    const metrics = await mushrooms(page).evaluate(card => ({ title: parseFloat(getComputedStyle(card.querySelector('h3')).fontSize), padding: parseFloat(getComputedStyle(card.querySelector('.product-card-copy')).paddingTop), targets: [...card.querySelectorAll('button')].every(button => button.getBoundingClientRect().height >= 44) }));
    expect(metrics.title).toBeCloseTo(27 * .8);
    expect(metrics.padding).toBeCloseTo(24 * .8);
    expect(metrics.targets).toBe(true);
  }
  await page.getByRole('combobox', { name: 'Category', exact: true }).click();
  await page.getByRole('option', { name: 'Mushrooms · 6', exact: true }).click();
  await expect(page).toHaveURL('/shop/category/mushrooms');
});

test('expanded categories and every asset-backed product have matching images, packs and sample cart values', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [category, count] of [['mushrooms', 6], ['microgreens', 5], ['organic-harvest', 0], ['exotics', 0]]) {
      await page.goto(`/shop/category/${category}`);
      await expect(page.locator('[data-product-card]')).toHaveCount(count);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
  }
  for (const product of products) {
    await page.goto(`/products/${product.slug}`);
    await expect(page.getByRole('heading', { level: 1, name: product.name, exact: true })).toBeVisible();
    const photo = page.locator('.product-editorial > figure img');
    await expect(photo).toHaveAttribute('alt', product.imageAlt);
    await expect.poll(() => photo.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(page.getByRole('combobox', { name: 'Sample pack', exact: true })).toContainText(product.samplePack);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await page.getByRole('button', { name: 'Add sample to cart' }).click();
    await expect(page.getByRole('dialog', { name: 'Your cart' })).not.toBeVisible();
    await page.locator('.site-header a[href="/cart"]:visible').first().click();
    const cart = page.getByRole('dialog', { name: 'Your cart' });
    await expect(cart).toBeVisible();
    await expect(cart.locator('.work-basket-line')).toContainText(product.name);
    await expect(cart.locator('.work-basket-line')).toContainText(product.samplePack);
    await expect(cart.locator('.work-basket-line')).toContainText(`₹${product.samplePrice}`);
  }
  expect(errors).toEqual([]);
});

test('product cards retain their name, wrapping description and two distinct actions at desktop and mobile sizes', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/shop');
    const card = mushrooms(page);
    await expect(card.getByRole('heading', { name: 'Button mushrooms' })).toBeVisible();
    await expect(card.locator('.product-card-price')).toContainText('₹140');
    await expect(card.locator('.product-card-price')).toContainText('/ 200 g');
    const microgreens = page.locator('[data-product-card="radish-microgreens"]');
    await expect(microgreens.locator('.product-card-price')).toContainText('₹190');
    await expect(microgreens.locator('.product-card-price')).toContainText('/ 50 g');
    await expect(card.getByRole('button', { name: 'Buy now', exact: true })).toBeEnabled();
    await expect(card.getByRole('button', { name: 'Add to cart', exact: true })).toBeEnabled();
    await expect(card.locator('.eyebrow')).toHaveCount(0);
    expect(await card.locator('a button, button a').count()).toBe(0);
    const layout = await card.evaluate(el => {
      const primary = getComputedStyle(el.querySelector('.button--primary'));
      const secondary = getComputedStyle(el.querySelector('.button--secondary'));
      const description = el.querySelector('.product-card-description');
      return { distinct: primary.backgroundColor !== secondary.backgroundColor, overflow: el.scrollWidth > el.clientWidth + 1, wrapped: description.clientHeight > parseFloat(getComputedStyle(description).lineHeight), viewportOverflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    expect(layout.distinct).toBe(true);
    expect(layout.overflow).toBe(false);
    expect(layout.viewportOverflow).toBe(false);
    expect(layout.wrapped).toBe(true);
  }
});

test('secondary adds one pack without opening the drawer and primary continues to checkout', async ({ page }) => {
  await page.goto('/shop/category/mushrooms');
  await mushrooms(page).getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Your cart' })).not.toBeVisible();
  await page.locator('.site-header a[href="/cart"]:visible').first().click();
  const cart = page.getByRole('dialog', { name: 'Your cart' });
  await expect(cart).toBeVisible();
  await expect(page).toHaveURL('/shop/category/mushrooms');
  await expect(cart.locator('[aria-label="Quantity"]')).toHaveText('1');
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-header a[href="/cart"]:visible').first()).toBeFocused();
  await mushrooms(page).getByRole('button', { name: 'Buy now', exact: true }).click();
  await expect(page).toHaveURL('/checkout');
  await expect(page.getByRole('dialog', { name: 'Your cart' })).not.toBeVisible();
  await expect(page.locator('#main-content [aria-label="Quantity"]')).toHaveText('2');
  await expect(page.getByText('₹280', { exact: true }).first()).toBeVisible();
});

test('collection, category and related cards open details without adding to the cart; names remain keyboard links', async ({ page }) => {
  for (const [path, slug, target, name] of [
    ['/shop', 'golden-oyster-mushrooms', 'figure', 'Golden oyster mushrooms'],
    ['/shop/category/microgreens', 'radish-microgreens', '.product-card-description', 'Radish microgreens'],
    ['/products/button-mushrooms', 'radish-microgreens', '.product-card-price', 'Radish microgreens'],
  ]) {
    await page.goto(path);
    const card = page.locator(`[data-product-card="${slug}"]`);
    expect(await card.evaluate(el => getComputedStyle(el).cursor)).toBe('pointer');
    await card.locator(target).click();
    await expect(page).toHaveURL(`/products/${slug}`);
    await expect(page.getByRole('heading', { level: 1, name, exact: true })).toBeVisible();
    await page.locator('.site-header').getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'Your cart' }).getByRole('heading', { name: 'Your cart is empty.' })).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await page.goto('/shop/category/mushrooms');
  await mushrooms(page).getByRole('link', { name: 'Button mushrooms', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/products/button-mushrooms');
  await expect(page.getByRole('heading', { level: 1, name: 'Button mushrooms' })).toBeVisible();
});

test('related-product actions select the related item and mouse text selection does not purchase', async ({ page }) => {
  await page.goto('/products/button-mushrooms');
  const card = page.locator('[data-product-card="radish-microgreens"]');
  await card.locator('.product-card-description').evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); el.click(); });
  await expect(page).toHaveURL('/products/button-mushrooms');
  await card.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Your cart' })).not.toBeVisible();
  await page.locator('.site-header a[href="/cart"]:visible').first().click();
  await expect(page.getByRole('dialog', { name: 'Your cart' })).toContainText('Radish microgreens');
});
