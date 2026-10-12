import { test, expect } from '@playwright/test';
import { siteUrl } from '../../src/app/hosting.js';
import { publishedOperationsPreview } from '../../src/app/operations-review-config.js';
import { publishedAccountPreview } from '../../src/app/account-review-config.js';

test('mounted navigation, history, search, and cart stay at the publishing address', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(siteUrl('/'));
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C01');
  await page.locator('#site-navigation').getByRole('link', { name: 'Shop', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(siteUrl('/shop') + '$'));
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await page.goBack();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C01');
  await page.goto(siteUrl('/search?q=radish'));
  await expect(page).toHaveURL(new RegExp(siteUrl('/shop') + '\\?q=radish$'));
  await expect(page.getByLabel('Search products')).toHaveValue('radish');
  await expect(page.locator('#header-search-list').getByRole('option', { name: 'Radish microgreens Microgreens', exact: true })).toBeVisible();
  await page.goto(siteUrl('/'));
  await page.locator('.header-actions').getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.locator('#cart-drawer')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#cart-drawer')).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('direct routes, assets, legacy redirects, denied access, and unknown pages survive static hosting', async ({ page, request }) => {
  for (const path of ['/shop', '/our-farm', '/help', '/products/button-mushrooms', '/cart', '/sign-in', '/account', '/admin', '/checkout']) {
    const response = await page.goto(siteUrl(path));
    expect(response.status()).toBe(200);
    await expect(page.locator('#app')).not.toHaveAttribute('data-page-id', '404');
    const images = await page.locator('img').evaluateAll(images => Promise.all(images.map(image => new Promise(resolve => { image.loading = 'eager'; if (image.complete) resolve(image.naturalWidth > 0); else { image.onload = () => resolve(true); image.onerror = () => resolve(false); } }))));
    expect(images.every(Boolean)).toBe(true);
    if (['/checkout', ...(!publishedOperationsPreview ? ['/admin'] : []), ...(!publishedAccountPreview ? ['/account'] : [])].includes(path)) await expect(page.locator('#app')).toHaveAttribute('data-status', '403');
    const rootUrls = await page.locator('[href], [src]').evaluateAll(elements => elements.flatMap(element => ['href', 'src'].map(attribute => element.getAttribute(attribute)).filter(value => value?.startsWith('/') && !value.startsWith('//'))));
    expect(rootUrls.every(value => value.startsWith(siteUrl('/')))).toBe(true);
  }
  for (const file of ['/icons/field-notes.svg', '/fonts/dm-sans-latin-variable.woff2', '/media/Logo/wegroween-favicon.svg']) expect((await request.get(siteUrl(file))).status()).toBe(200);
  await page.goto(siteUrl('/mushrooms.html'));
  await expect(page).toHaveURL(new RegExp(siteUrl('/shop/category/mushrooms') + '$'));
  const unknown = await page.goto(siteUrl('/unknown-release-path'));
  expect(unknown.status()).toBe(404);
  await expect(page.locator('#app')).toHaveAttribute('data-status', '404');
  const dynamicDenied = await page.goto(siteUrl('/admin/orders/example-order'));
  expect(dynamicDenied.status()).toBe(publishedOperationsPreview ? 200 : 404);
  await expect(page.locator('#app')).toHaveAttribute('data-status', publishedOperationsPreview ? '404' : '403');
});

test('public pages render without JavaScript on mobile', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const path of ['/', '/shop', '/our-farm', '/help']) {
    const response = await page.goto(`http://127.0.0.1:4183${siteUrl(path)}`);
    expect(response.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await context.close();
});

test('published account matches local design on first paint, reload and centred editing',async({page,request})=>{
  test.skip(!publishedAccountPreview,'Account review is enabled for the GitHub Pages build.');
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [path,heading] of [['/account','Your kitchen, at a glance.'],['/account/addresses','Delivery addresses.'],['/account/orders','Your orders.'],['/account/orders/SAMPLE-1042','Order SAMPLE-1042.']]) {
    const response=await request.get(siteUrl(path));expect(response.status()).toBe(200);
    const html=await response.text();expect(html).toContain('data-account-assumed-session="true"');expect(html).not.toContain('Go to sign in');
    await page.goto(siteUrl(path));await expect(page.locator('#app')).toHaveAttribute('data-status','200');
    await expect(page.locator('#sample-account-heading')).toHaveText(heading);
    await page.reload();await expect(page.locator('#sample-account-heading')).toHaveText(heading);
  }
  for(const width of [1440,390,320]) {
    await page.setViewportSize({width,height:900});await page.goto(siteUrl('/account'));
    await page.getByRole('button',{name:'Edit details',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Edit your details'});await expect(dialog).toBeVisible();
    await expect(page.getByLabel('Full name',{exact:true})).toHaveValue('Aarav Sample');
    await page.getByLabel('Full name',{exact:true}).fill('Account Preview');
    await dialog.getByRole('button',{name:'Save changes',exact:true}).click();await expect(dialog).not.toBeVisible();
    await expect(page.locator('[data-account-panel="overview"] [data-account-name]')).toHaveText('Account Preview');
    await page.reload();await expect(page.locator('[data-account-panel="overview"] [data-account-name]')).toHaveText('Aarav Sample');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  }
  await page.goto(siteUrl('/account/addresses'));await page.getByRole('button',{name:'Add an address',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Add an address'})).toBeVisible();await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();expect(errors).toEqual([]);
});
