import { test, expect } from '@playwright/test';

const modal = page => page.getByRole('dialog');
async function settled(page) {
  await expect.poll(() => page.locator('#account-edit-modal').evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
}

test('overview edits open centrally with cart-like blur, focus containment and restored reading position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/account');
  const trigger = page.getByRole('button', { name: 'Edit details', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  const position = await page.evaluate(() => scrollY);
  const height = await page.locator('.account-content').evaluate(el => el.offsetHeight);
  await trigger.click();
  await settled(page);
  await expect(modal(page)).toHaveAccessibleName('Edit your details');
  await expect(page.getByLabel('Full name', { exact: true })).toBeFocused();
  const box = await page.locator('.account-edit-modal-panel').boundingBox();
  expect(Math.abs(box.x + box.width / 2 - 720)).toBeLessThan(1);
  expect(Math.abs(box.y + box.height / 2 - 450)).toBeLessThan(1);
  const shade = await page.locator('.account-edit-modal-shade').evaluate(el => ({ filter: getComputedStyle(el).backdropFilter, background: getComputedStyle(el).backgroundColor }));
  expect(shade.filter).toBe('blur(2px)');
  expect(shade.background).toBe(await page.locator('.cart-drawer-shade').evaluate(el => getComputedStyle(el).backgroundColor));
  expect(await page.locator('.account-content').evaluate(el => el.offsetHeight)).toBe(height);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  await page.getByRole('button', { name: 'Close editor' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close editor' })).toBeFocused();
  await page.mouse.move(8, 8);
  await page.mouse.wheel(0, 500);
  expect(await page.evaluate(() => scrollY)).toBe(position);
  await page.getByLabel('Full name', { exact: true }).fill('Discard this edit');
  await page.mouse.click(8, 8);
  await expect(modal(page)).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(position);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await expect(page.locator('[data-account-panel="overview"] [data-account-name]')).toHaveText('Aarav Sample');
});

test('address edit and creation stay centred and scroll internally on a short mobile screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.goto('/account/addresses');
  await page.locator('[data-address-id="sample-work"]').getByRole('button', { name: 'Edit', exact: true }).click();
  await settled(page);
  await expect(modal(page)).toHaveAccessibleName('Edit address');
  await expect(page.getByLabel('Address label', { exact: true })).toHaveValue('Work');
  const box = await page.locator('.account-edit-modal-panel').boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(16);
  expect(box.y + box.height).toBeLessThanOrEqual(464);
  expect(Math.abs(box.x + box.width / 2 - 160)).toBeLessThan(1);
  await page.getByRole('button', { name: 'Close editor' }).click();
  await expect(modal(page)).not.toBeVisible();
  await page.getByRole('button', { name: 'Add an address', exact: true }).click();
  await settled(page);
  await expect(modal(page)).toHaveAccessibleName('Add an address');
  await expect(page.getByLabel('Address label', { exact: true })).toHaveValue('');
  const body = page.locator('.account-edit-modal-body');
  expect(await body.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await page.getByLabel('Address label', { exact: true }).hover();
  await page.mouse.wheel(0, 300);
  await expect.poll(() => body.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.keyboard.press('Escape');
  await expect(modal(page)).not.toBeVisible();
});

test('motion changes and browser history clean up dialogs and scroll locks', async ({ page }) => {
  await page.goto('/shop');
  await page.locator('.header-actions a[href="/account"]').click();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await settled(page);
  await expect(modal(page)).toBeVisible();
  await page.getByRole('button', { name: 'Close editor' }).click();
  await expect(modal(page)).not.toBeVisible();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL('/shop');
  await expect(page.locator('#account-edit-modal')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});
