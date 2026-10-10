import { test, expect } from '@playwright/test';

test('branded dropdown supports keyboard selection, cancellation, typeahead and Tab', async ({ page }) => {
  await page.goto('/restaurant-supply');
  const control = page.getByRole('combobox', { name: 'Preferred frequency' });
  await control.click();
  await expect(control).toBeFocused();
  await expect(control).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option', { name: 'Still exploring' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(control).toHaveAttribute('aria-activedescendant', 'supply-frequency-option-3');
  await page.keyboard.press('Enter');
  await expect(control).toHaveText('Another schedule — to discuss');
  await expect(page.locator('#supply-frequency')).toHaveValue('other');
  await control.click();
  await page.keyboard.press('Home');
  await page.keyboard.press('Escape');
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#supply-frequency')).toHaveValue('other');
  await page.keyboard.press('i');
  await expect(control).toHaveAttribute('aria-activedescendant', 'supply-frequency-option-2');
  await page.keyboard.press('Space');
  await expect(page.locator('#supply-frequency')).toHaveValue('weekly');
  await control.click();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Tab');
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#supply-name')).toBeFocused();
  await expect(page.locator('#supply-frequency')).toHaveValue('weekly');
});

test('popup fits above or below the control and never changes form height', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/restaurant-supply');
  const control = page.getByRole('combobox', { name: 'Preferred frequency' });
  const panel = page.locator('.supply-form-panel');
  for (const [position, side] of [['bottom', 'up'], ['top', 'down']]) {
    await control.evaluate((element, position) => {
      const y = element.getBoundingClientRect().top + scrollY;
      const header = document.querySelector('.site-header').getBoundingClientRect().height;
      const target = position === 'bottom' ? innerHeight - element.offsetHeight - 20 : header + 20;
      window.scrollTo({ top: y - target, behavior: 'instant' });
    }, position);
    const before = await panel.evaluate(element => element.getBoundingClientRect().height);
    await control.click();
    const popup = page.getByRole('listbox', { name: 'Preferred frequency' });
    await expect(popup).toHaveAttribute('data-side', side);
    const bounds = await popup.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(1280);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(721);
    expect(await panel.evaluate(element => element.getBoundingClientRect().height)).toBe(before);
    expect(await popup.evaluate(element => element.getAnimations().length)).toBe(0);
    await page.keyboard.press('Escape');
  }
  await control.click();
  await page.locator('#supply-name').click();
  await expect(control).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('listbox')).toHaveCount(0);
});

test('dropdowns initialise on both pages and clean up their portals on navigation', async ({ page }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.goto('/restaurant-supply');
  await page.getByRole('combobox', { name: 'Preferred frequency' }).click();
  await page.locator('.site-navigation a[href="/help"]').click();
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('#supply-frequency-listbox')).toHaveCount(0);
  const topic = page.getByRole('combobox', { name: 'What is your enquiry about?' });
  await topic.click();
  await page.getByRole('option', { name: 'Restaurant enquiries' }).click();
  await expect(page.locator('#contact-topic')).toHaveValue('restaurant');
  await expect(page.locator('#contact-message-hint')).toContainText('Share your kitchen');
  await page.locator('.site-navigation a[href="/shop"]').click();
  await expect(page.locator('.wg-select-listbox')).toHaveCount(0);
  await page.goBack();
  await expect(topic).toHaveCount(1);
  await expect(page.locator('.wg-select-listbox')).toHaveCount(1);
  await topic.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  expect(failures).toEqual([]);
});

for (const width of [320, 390, 768]) {
  test(`branded dropdown supports touch and stays inside ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto('/restaurant-supply');
    const control = page.getByRole('combobox', { name: 'Preferred frequency' });
    await control.tap();
    const popup = page.getByRole('listbox');
    await expect(popup).toBeVisible();
    const bounds = await popup.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.getByRole('option', { name: 'One-off requirement' }).tap();
    await expect(control).toHaveText('One-off requirement');
    await expect(page.locator('#supply-frequency')).toHaveValue('one-off');
    await expect(control).toHaveAttribute('aria-expanded', 'false');
    await context.close();
  });
}

test('dropdown uses gentle opening motion which settles on reduced-motion changes', async ({ page }) => {
  await page.goto('/restaurant-supply');
  await page.getByRole('combobox', { name: 'Preferred frequency' }).click();
  const popup = page.getByRole('listbox');
  expect(await popup.evaluate(element => element.getAnimations().some(animation => animation.effect.getKeyframes().some(frame => frame.opacity === '0')))).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => popup.evaluate(element => element.getAnimations().length)).toBe(0);
  await expect(popup).toBeVisible();
});

for (const [width, height] of [[1920, 882], [1536, 706], [1440, 900], [1366, 768], [1280, 720], [1024, 600], [1920, 600]]) {
  test(`entire supply hero fits below the header at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/restaurant-supply');
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.evaluate(() => ({
      header: document.querySelector('.site-header').getBoundingClientRect().bottom,
      hero: document.querySelector('.supply-intro').getBoundingClientRect().bottom,
      contents: [...document.querySelectorAll('.supply-intro-copy, .supply-photo--hero')].map(element => {
        const box = element.getBoundingClientRect();
        return { top: box.top, bottom: box.bottom };
      }),
    }));
    expect(bounds.hero).toBeLessThanOrEqual(height + 1);
    for (const box of bounds.contents) {
      expect(box.top).toBeGreaterThanOrEqual(bounds.header);
      expect(box.bottom).toBeLessThanOrEqual(height);
    }
  });
}
