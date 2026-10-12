import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const routes = [
  '/', '/shop', '/shop/category/mushrooms', '/products/button-mushrooms',
  '/our-farm', '/restaurant-supply', '/help', '/cart', '/checkout', '/orders/SAMPLE-1050/confirmation',
  '/sign-in', '/register', '/recover-password', '/account', '/account/addresses', '/account/orders', '/account/orders/SAMPLE-1042',
  '/policies/delivery', '/policies/returns', '/policies/privacy', '/policies/terms',
  '/admin/sign-in', '/admin', '/admin/orders', '/admin/orders/SAMPLE-1050', '/admin/products', '/admin/products/button-mushrooms/edit',
  '/admin/categories', '/admin/inventory', '/admin/customers', '/admin/customers/sample-customer', '/admin/restaurant-supply',
  '/admin/promotions', '/admin/delivery', '/admin/reports', '/admin/settings', '/admin/products/new',
];
async function ready(page, path) {
  await page.goto(path);
  await expect(page.locator('#app'), path).toHaveAttribute('data-status', '200');
  await page.evaluate(() => document.fonts.ready);
}
async function choose(page, label, value) {
  await page.getByRole('combobox', { name: label, exact: true }).click();
  await page.getByRole('option', { name: value, exact: true }).click();
}
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

for (const width of [1440, 320]) {
  test(`all 36 page types and product create mode render without viewport overflow at ${width}px`, async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      const routePage = await page.context().newPage();
      await routePage.setViewportSize({ width, height: 900 });
      routePage.on('pageerror', error => errors.push(error.message));
      await ready(routePage, route);
      await expect(routePage.locator('main')).toHaveCount(1);
      await expect(routePage.locator('h1')).toHaveCount(1);
      const overflow = await routePage.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      expect(overflow, `${route} overflows ${width}`).toBe(false);
      await routePage.close();
    }
    expect(errors).toEqual([]);
  });
}

test('cart has one bottom checkout action and payment selection cannot place an order', async ({ page }) => {
  const errors = [];page.on('pageerror', error => errors.push(error.message));
  await ready(page, '/products/button-mushrooms');
  await page.getByLabel('Number of packs').fill('2');await page.getByRole('button', { name:'Add sample to cart' }).click();
  await page.locator('.site-header a[href="/cart"]:visible').first().click();
  const cart = page.getByRole('dialog', { name:'Your cart' });
  await cart.getByRole('button', { name:'Increase Button mushrooms quantity' }).click();await expect(cart).toContainText('₹420');
  await expect(cart.locator('.cart-drawer-content .button')).toHaveCount(0);
  await expect(cart.locator('.cart-drawer-footer .button')).toHaveCount(1);
  await expect(cart.getByText('Continue browsing',{exact:true})).toHaveCount(0);
  await cart.getByRole('link', { name:'Proceed to checkout' }).click();await expect(page).toHaveURL('/checkout');
  await expect(cart).not.toBeVisible();expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
  const online=page.getByRole('radio',{name:/^Online payment/}),cod=page.getByRole('radio',{name:/^Cash on delivery/});
  await expect(online).toBeChecked();await cod.check();await expect(cod).toBeChecked();await expect(online).not.toBeChecked();
  await page.getByLabel('PIN code',{exact:true}).fill('000000');
  await expect(page.getByRole('button',{name:'Place order',exact:true})).toBeDisabled();
  await expect(page.locator('#checkout-order-unavailable')).toContainText('not currently delivering');
  const before=await page.evaluate(async()=>{const {developmentWorkspace:s}=await import('/src/content/development-workspace.js');return {basket:s.basket,orders:s.orders,lastOrder:s.lastOrder};});
  for (const payment of [online,cod]) {
    await payment.check();await page.locator('[data-work-form="checkout"]').evaluate(form=>form.requestSubmit());
    await expect(page.locator('.work-status')).toContainText('Orders are unavailable');await expect(page).toHaveURL('/checkout');
  }
  const after=await page.evaluate(async()=>{const {developmentWorkspace:s}=await import('/src/content/development-workspace.js');return {basket:s.basket,orders:s.orders,lastOrder:s.lastOrder};});
  expect(after).toEqual(before);expect(errors).toEqual([]);
});

test('table filtering combines search and status and handles no matching records', async ({ page }) => {
  await ready(page, '/admin/orders');
  await choose(page, 'Status', 'Delivered');
  await expect(page.locator('[data-work-row]:visible')).toHaveCount(3);
  await page.getByLabel('Find an order').fill('1050');
  await expect(page.locator('[data-work-empty]')).toBeVisible();
  await choose(page, 'Status', 'All statuses');
  await expect(page.locator('[data-work-row]:visible')).toContainText('SAMPLE-1050');
  await page.getByLabel('Find an order').fill('');
  await expect(page.locator('[data-work-row]:visible')).toHaveCount(6);
});

test('category editor contains dropdown, restores focus and escapes saved content', async ({ page }) => {
  await ready(page, '/admin/categories');
  const add = page.getByRole('button', { name: 'Add a category' });
  await add.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.getByLabel('Category name').fill('<img onerror=alert(1)>');
  await page.getByLabel('Description', { exact: true }).fill('Sample category');
  await choose(page, 'State', 'Published');
  expect(await dialog.getByRole('listbox', { includeHidden: true }).count()).toBe(1);
  await dialog.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('[data-work-row]').filter({hasText:'<img onerror=alert(1)>'})).toHaveCount(1);
  await expect(page.locator('.work-table img')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add a category' })).toBeFocused();
  await page.getByRole('button', { name: 'Add a category' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.reload();
  await expect(page.locator('[data-work-row]')).toHaveCount(5);
});

test('stock adjustments require a reason and keep a local adjustment record', async ({ page }) => {
  await ready(page, '/admin/inventory');
  await page.getByRole('button', { name: 'Adjust stock' }).first().click();
  await page.getByLabel('New sample stock (packs)').fill('40');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Reason for the adjustment').fill('Sample recount');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('[data-work-row]').first()).toContainText('40 packs');
  await expect(page.locator('.admin-activity')).toContainText('Button mushrooms: 36 → 40 packs · Sample recount');
});

test('product drafts can be added and order fulfilment can be advanced', async ({ page }) => {
  await ready(page, '/admin/products/new');
  await page.getByLabel('Product name').fill('Sample draft');
  await page.getByLabel('Sample pack size').fill('100 g');
  await page.getByLabel('Illustrative price (₹)').fill('150');
  await page.getByRole('button', { name: 'Save product' }).click();
  await expect(page).toHaveURL(/\/admin\/products\?q=Sample/);
  await expect(page.locator('[data-work-row]').last()).toContainText('Sample draft');
  await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Orders', exact: true }).click();
  await page.locator('[data-work-row]').first().getByRole('link', { name: 'Open order' }).click();
  await choose(page, 'Order status', 'Ready');
  await page.getByRole('button', { name: 'Update sample order' }).click();
  await expect(page.locator('.work-header .account-tag')).toHaveText('Ready');
  await expect(page.locator('.admin-activity')).toContainText('Preparing → Ready');
});

for (const example of [
  ['/admin/customers/sample-customer', 'Edit details', 'Full name', 'Updated Sample', 'Your essentials'],
  ['/admin/restaurant-supply', 'Review enquiry', 'Kitchen', 'Updated Kitchen'],
  ['/admin/promotions', 'Edit', 'Promotion name', 'Updated Invitation'],
  ['/admin/delivery', 'Edit', 'Zone name', 'Updated Zone'],
]) {
  test(`local record editing works for ${example[0]}`, async ({ page }) => {
    await ready(page, example[0]);
    await page.getByRole('button', { name: example[1], exact: true }).first().click();
    await page.getByLabel(example[2], { exact: true }).fill(example[3]);
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(example[3], { exact: true }).first()).toBeVisible();
  });
}

test('report export uses sample data and business settings remain local', async ({ page }) => {
  await ready(page, '/admin/reports');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export sample CSV' }).click();
  const download = await downloadPromise;
  const csv = await fs.readFile(await download.path(), 'utf8');
  expect(csv).toContain('SAMPLE-1050');
  expect(csv).toContain('Illustrative total');
  await page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('link', { name: 'Settings', exact: true }).click();
  await page.getByLabel('Business name').fill('Local sample');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator('.work-status')).toContainText('Sample settings updated');
  await page.reload();
  await expect(page.getByLabel('Business name')).toHaveValue('Local sample');
});

test('editing checkout quantities preserves delivery details and the selected payment method', async ({ page }) => {
  await ready(page,'/checkout');await expect(page.locator('.checkout-progress [aria-current="step"]')).toContainText('Details');
  await page.getByRole('button',{name:'Load sample selection'}).click();
  await page.getByLabel('Recipient name').fill('Sample Guest');await page.getByLabel('PIN code',{exact:true}).fill('000000');
  const cod=page.getByRole('radio',{name:/^Cash on delivery/}),online=page.getByRole('radio',{name:/^Online payment/});
  await cod.check();await page.getByRole('button',{name:'Increase Button mushrooms quantity'}).click();
  await expect(page.getByLabel('Recipient name')).toHaveValue('Sample Guest');await expect(page.getByLabel('PIN code',{exact:true})).toHaveValue('000000');await expect(cod).toBeChecked();
  await online.check();await page.getByRole('button',{name:'Increase Button mushrooms quantity'}).click();await expect(online).toBeChecked();await expect(cod).not.toBeChecked();
  await expect(page.getByRole('button',{name:'Place order',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Remove',exact:true}).first().click();await expect(online).toBeChecked();
});

test('new screens have usable mobile editors and deliberately inactive credential fields', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, '/admin/restaurant-supply');
  await page.locator('[data-record-id="sample-kitchen"]').getByRole('button', { name: 'Review enquiry' }).click();
  await choose(page, 'Conversation stage', 'Discussing');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.locator('[data-record-id="sample-kitchen"]')).toContainText('Discussing');
  for (const route of ['/sign-in', '/register', '/recover-password', '/admin/sign-in']) {
    await ready(page, route);
    await expect(page.getByLabel('Email address', { exact: true })).toBeDisabled();
    if (route === '/admin/sign-in') await expect(page.getByRole('link', { name: 'Create an account', exact: true })).toHaveCount(0);
  }
});

for (const width of [320, 390]) {
  test(`filled cart and checkout fit ${width}px with 44px quantity controls`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await ready(page, '/products/button-mushrooms');
    await page.getByRole('button', { name: 'Add sample to cart' }).click();
    await expect(page.getByRole('dialog', { name: 'Your cart' })).not.toBeVisible();
    await page.locator('.site-header a[href="/cart"]:visible').first().click();
    const cart = page.getByRole('dialog', { name: 'Your cart' });
    const increase = cart.getByRole('button', { name: 'Increase Button mushrooms quantity' });
    const box = await increase.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    const overflow = await cart.evaluate(el => el.scrollWidth > el.clientWidth + 1);
    expect(overflow).toBe(false);
    await increase.click();
    await cart.getByRole('link', { name: 'Proceed to checkout' }).click();
    await expect(page).toHaveURL('/checkout');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  });
}
