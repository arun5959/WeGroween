import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage();
const measurements = [];
try {
  for (const width of [1920, 1440, 1024, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://127.0.0.1:5173/help');
    await page.evaluate(() => document.fonts.ready);
    const trigger = page.locator(width <= 720 ? '.mobile-header-controls a[href="/search"]' : '.header-actions a[href="/search"]');
    await trigger.click();
    await page.getByRole('combobox', { name: 'Search products' }).fill('mush');
    await page.evaluate(async () => {
      await Promise.all(document.querySelector('[data-header-search]').getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
    });
    measurements.push(await page.evaluate(() => {
      const bounds = selector => {
        const box = document.querySelector(selector).getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      };
      return { viewport: innerWidth, field: bounds('.header-search-field'), panel: bounds('.header-search-panel'), close: bounds('.header-search-close'), overflow: document.documentElement.scrollWidth > innerWidth };
    }));
    await page.screenshot({ path: 'docs/verification/header-search-' + width + '.png' });
    if (width === 1440) {
      await page.screenshot({ path: 'docs/verification/header-search-first-desktop.png' });
      await page.getByRole('combobox', { name: 'Search products' }).fill('unavailable produce');
      await page.evaluate(async () => {
        await Promise.all(document.querySelector('[data-header-search]').getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
      });
      await page.screenshot({ path: 'docs/verification/header-search-empty-desktop.png' });
    }
  }
  await writeFile('docs/verification/header-search.json', JSON.stringify(measurements, null, 2) + '\n');
} finally {
  await browser.close();
}
