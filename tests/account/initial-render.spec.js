import { test, expect } from '@playwright/test';

async function expectStyledPage(page) {
  await expect(page.locator('head link[rel="stylesheet"]')).toHaveCount(1);
  await expect(page.locator('main h1')).toBeVisible();
  await expect.poll(() => page.evaluate(() => {
    const logo = document.querySelector('.brand img');
    return getComputedStyle(document.documentElement).backgroundColor === 'rgb(251, 244, 232)'
      && logo.getBoundingClientRect().width < 350
      && document.documentElement.scrollWidth <= innerWidth;
  })).toBe(true);
}

test('server-rendered routes are styled before JavaScript, on desktop and mobile', async ({ browser, baseURL }) => {
  for (const width of [1440, 320]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of ['/', '/shop', '/our-farm', '/restaurant-supply', '/help', '/account', '/sign-in']) {
      await page.goto(`${baseURL}${route}`);
      await expectStyledPage(page);
    }
    await context.close();
  }
});

test('account reload keeps the correct styled content while application startup is delayed', async ({ page }) => {
  for (const visit of ['navigate', 'reload']) {
    let release;
    const startup = new Promise(resolve => { release = resolve; });
    const deferStartup = async route => { await startup; await route.continue(); };
    await page.route('**/src/app/bootstrap.js', deferStartup);
    try {
      if (visit === 'navigate') await page.goto('/account', { waitUntil: 'commit' });
      else await page.reload({ waitUntil: 'commit' });
      await expectStyledPage(page);
      await expect(page.locator('main h1')).toHaveText('Your kitchen, at a glance.');
      await expect(page.getByText('Sign-in required', { exact: true })).toHaveCount(0);
      expect(await page.locator('#app').getAttribute('data-page-id')).toBeNull();
    } finally {
      release();
    }
    await expect(page.locator('.account-welcome .eyebrow')).toHaveText('Good to see you, Aarav');
    await expectStyledPage(page);
    await page.unroute('**/src/app/bootstrap.js', deferStartup);
  }
});
