import { test, expect } from '@playwright/test';

test('brand typography has stable dimensions before startup and after reload, without late font requests', async ({ browser, baseURL }) => {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const lateFontRequests = [];
    // Cold loads must not depend on a second, potentially slow font transfer.
    await page.route('**/*.woff2', route => {
      lateFontRequests.push(route.request().url());
      return route.abort();
    });
    for (const visit of ['navigate', 'reload']) {
      let release;
      const startup = new Promise(resolve => { release = resolve; });
      const scripts = /\/assets\/[^/]+\.js(?:\?.*)?$/;
      const deferStartup = async route => { await startup; await route.continue(); };
      await page.route(scripts, deferStartup);
      try {
        if (visit === 'navigate') await page.goto(`${baseURL}/`, { waitUntil: 'commit' });
        else await page.reload({ waitUntil: 'commit' });
        await expect.poll(() => page.evaluate(() => {
          const families = [...document.fonts];
          return families.length === 3 && families.every(font => font.status === 'loaded');
        })).toBe(true);
        const dimensions = () => page.evaluate(() => {
          return ['.hero h1', '.hero .lead', '.hero .button', '.hero .button--quiet'].map(selector => {
            const element = document.querySelector(selector);
            const range = document.createRange();
            range.selectNodeContents(element);
            const { x, y, width, height } = range.getBoundingClientRect();
            return { x, y, width, height };
          });
        });
        const first = await dimensions();
        release();
        await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C01');
        expect(await dimensions()).toEqual(first);
        expect(lateFontRequests).toEqual([]);
      } finally {
        release();
        await page.unroute(scripts, deferStartup);
      }
    }
    await context.close();
  }
});
