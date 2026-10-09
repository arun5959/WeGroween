import { test, expect } from '@playwright/test';

test('FAQ height and surrounding layout interpolate on opening and closing', async ({ page }) => {
  await page.goto('/help');
  await expect(page.locator('.contact-questions details').first()).toHaveClass(/motion-disclosure/);
  await page.evaluate(() => document.fonts.ready);
  for (const expanded of [true, false]) {
    const frames = await page.locator('.contact-questions details').first().evaluate(async details => {
      const section = details.closest('.contact-faq');
      const frames = [{ detail: details.getBoundingClientRect().height, section: section.getBoundingClientRect().height }];
      details.querySelector('summary').click();
      const start = performance.now();
      await new Promise(resolve => {
        function sample() {
          frames.push({ detail: details.getBoundingClientRect().height, section: section.getBoundingClientRect().height });
          if (performance.now() - start < 350) requestAnimationFrame(sample);
          else resolve();
        }
        requestAnimationFrame(sample);
      });
      return frames;
    });
    const first = frames[0], last = frames.at(-1);
    expect(expanded ? last.detail > first.detail : last.detail < first.detail).toBe(true);
    for (const property of ['detail', 'section']) {
      const low = Math.min(first[property], last[property]);
      const high = Math.max(first[property], last[property]);
      expect(frames.some(frame => frame[property] > low + 1 && frame[property] < high - 1), `${expanded ? 'opening' : 'closing'} ${property}: ${JSON.stringify(frames)}`).toBe(true);
    }
    await expect(page.locator('.contact-questions details').first()).toHaveJSProperty('open', expanded);
  }
});

test('rapid FAQ clicks reverse safely and a live reduced-motion preference settles expansion', async ({ page }) => {
  await page.goto('/help');
  const detail = page.locator('.contact-questions details').first();
  await detail.evaluate(async element => {
    for (let i = 0; i < 3; i++) {
      element.querySelector('summary').click();
      await new Promise(resolve => setTimeout(resolve, 35));
    }
  });
  await expect(detail).toHaveJSProperty('open', true);
  await expect.poll(() => detail.evaluate(e => e.getAnimations().length)).toBe(0);
  await detail.locator('summary').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(detail).toHaveJSProperty('open', false);
  expect(await detail.evaluate(e => e.getAnimations({ subtree: true }).length)).toBe(0);
  await detail.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(detail).toHaveJSProperty('open', true);
  expect(await detail.evaluate(e => e.getAnimations({ subtree: true }).length)).toBe(0);
});

test('mobile menu remains usable when reversed or resized mid-animation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/help');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  await toggle.click();
  await page.keyboard.press('Escape');
  await toggle.click();
  await expect(page.locator('#site-navigation')).toHaveClass(/is-open/);
  await expect.poll(() => page.locator('#site-navigation').evaluate(e => e.getAnimations().length)).toBe(0);
  await expect(page.locator('#site-navigation')).toHaveJSProperty('inert', false);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('#site-navigation')).toBeVisible();
  await expect(page.locator('#site-navigation')).toHaveJSProperty('inert', false);
  await page.locator('.site-navigation a[href="/shop"]').click();
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page).toHaveURL('/shop');
});
