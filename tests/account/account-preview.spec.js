import { test, expect } from '@playwright/test';

const tab = (page, name) => page.getByRole('navigation', { name: 'Sample account navigation' }).getByRole('button', { name, exact: true });
test('account opens directly in the assumed signed-in dashboard without competing entry actions', async ({ page }) => {
  await page.goto('/account');
  await expect(page.locator('#app')).toHaveAttribute('data-status', '200');
  await expect(page.getByRole('link', { name: 'Go to sign in' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore the sample account' })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Account navigation', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your kitchen, at a glance.' })).toBeVisible();
  await expect(page.getByText('Fictional orders, prices and addresses.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'View order', exact: true }).click();
  await expect(page.locator('[data-order-id="SAMPLE-1042"]')).toHaveAttribute('data-expanded', 'true');
  await expect(page.getByText('8 October 2026', { exact: true })).toBeVisible();
  await page.locator('[data-order-id="SAMPLE-1042"] summary').click();
  await expect(page.locator('[data-order-id="SAMPLE-1042"]')).toHaveAttribute('data-expanded', 'false');
});
test('direct account routes select the right section and preserve local profile edits', async ({ page }) => {
  await page.goto('/account/addresses');
  await expect(page.locator('[data-account-panel="addresses"]')).toBeVisible();
  await page.goto('/account/orders/SAMPLE-1031');
  await expect(page.locator('[data-order-id="SAMPLE-1031"]')).toHaveAttribute('data-expanded', 'true');
  await page.goto('/account');
  await page.getByRole('navigation', { name: 'Account navigation', exact: true }).getByRole('button', { name: 'Profile', exact: true }).click();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Local chef');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.locator('[data-account-panel="profile"] [data-account-name]')).toHaveText('Local chef');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your kitchen, at a glance.' })).toBeVisible();
  await expect(page.locator('[data-account-panel="overview"] [data-account-name]')).toHaveText('Aarav Sample');
});
test('modal editing keeps background search unavailable and discards unsaved changes on Escape', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/account');
  await page.getByRole('navigation', { name: 'Account navigation', exact: true }).getByRole('button', { name: 'Profile', exact: true }).click();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Unsent local edit');
  expect(await page.getByRole('dialog').evaluate(el => el.matches(':modal'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.locator('.header-actions a[href="/search"]').click();
  await page.getByRole('combobox', { name: 'Search products' }).fill('mush');
  await page.getByRole('button', { name: 'Close search' }).click();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await expect(page).toHaveURL('/account');
  await expect(page.getByLabel('Full name', { exact: true })).toHaveValue('Aarav Sample');
});
test('modal edits are local, escaped, cancellable and reset on reload', async ({ page }) => {
  const external = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4184') && !request.url().startsWith('data:')) external.push(request.url()); });
  await page.goto('/__account-preview');
  await tab(page, 'Profile').click();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('<img onerror=alert(1)>');
  await page.getByLabel('Email', { exact: true }).fill('review@example.invalid');
  await page.getByRole('button', { name: 'Save sample changes' }).click();
  await expect(page.locator('.account-feedback')).toContainText('Sample profile updated');
  await expect(page.locator('[data-account-panel="profile"] [data-account-name]')).toHaveText('<img onerror=alert(1)>');
  expect(await page.locator('[data-account-name] img').count()).toBe(0);
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Unsaved name');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('[data-account-panel="profile"] [data-account-name]')).not.toHaveText('Unsaved name');
  await page.reload();
  await tab(page, 'Profile').click();
  await expect(page.locator('[data-account-panel="profile"] [data-account-name]')).toHaveText('Aarav Sample');
  expect(external).toEqual([]);
});
test('address creation, editing, defaults, empty state and reset work', async ({ page }) => {
  await page.goto('/__account-preview');
  await tab(page, 'Addresses').click();
  await page.locator('[data-address-id="sample-work"]').getByRole('button', { name: 'Make default' }).click();
  await expect(page.locator('[data-address-id="sample-work"]')).toContainText('Default');
  await page.getByRole('button', { name: 'Add an address' }).click();
  await page.getByLabel('Address label', { exact: true }).fill('Studio');
  await page.getByLabel('Address line', { exact: true }).fill('1 Sample Road');
  await page.getByLabel('City', { exact: true }).fill('Gohana');
  await page.getByLabel('PIN code (6 digits)').fill('000000');
  await page.getByRole('button', { name: 'Save sample changes' }).click();
  const studio = page.locator('.account-address').filter({ has: page.getByRole('heading', { name: 'Studio', exact: true }) });
  await studio.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByLabel('Address line', { exact: true }).fill('2 Sample Road');
  await page.getByRole('button', { name: 'Save sample changes' }).click();
  await expect(studio).toContainText('2 Sample Road');
  for (let i = 0; i < 3; i++) await page.locator('.account-address').first().getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByText('No sample addresses yet.', { exact: false })).toBeVisible();
  await tab(page, 'Overview').click();
  await expect(page.getByText('No default address yet.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Reset sample' }).click();
  await expect(page.locator('[data-account-default-address]')).toContainText('12 Demo Lane');
});
test('required fields and formats prevent saving incomplete sample data', async ({ page }) => {
  await page.goto('/__account-preview');
  await tab(page, 'Profile').click();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('   ');
  await page.getByRole('button', { name: 'Save sample changes' }).click();
  await expect(page.locator('[data-profile-editor]')).toBeVisible();
  expect(await page.getByLabel('Full name', { exact: true }).evaluate(input => input.validity.valid)).toBe(false);
  await page.getByLabel('Full name', { exact: true }).fill('Demo Customer');
  await page.getByLabel('Phone (optional, 10 digits)').fill('123');
  await page.getByRole('button', { name: 'Save sample changes' }).click();
  expect(await page.getByLabel('Phone (optional, 10 digits)').evaluate(input => input.validity.valid)).toBe(false);
  await page.getByLabel('Phone (optional, 10 digits)').fill('');
  await page.getByRole('button', { name: 'Save sample changes' }).click();
  await expect(page.locator('.account-feedback')).toContainText('Sample profile updated');
});
for (const width of [320, 390, 720, 1024, 1440]) {
  test(`account layout and editors fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/__account-preview');
    if ([390, 1440].includes(width)) {
      await page.screenshot({ path: `docs/verification/account-overview-${width}.png`, fullPage: true });
    }
    for (const view of ['Overview', 'Orders', 'Addresses', 'Profile']) {
      await tab(page, view).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('#sample-account-heading')).toBeFocused();
    }
    await page.getByRole('button', { name: 'Edit details', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByLabel('Full name', { exact: true })).toBeFocused();
    await expect.poll(() => page.getByLabel('Full name', { exact: true }).evaluate(input => {
      const rect = input.getBoundingClientRect();
      const header = document.querySelector('.site-header').getBoundingClientRect();
      return rect.top >= header.bottom && rect.bottom <= innerHeight;
    })).toBe(true);
    if ([390, 1440].includes(width)) {
      await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
      await page.screenshot({ path: `docs/verification/account-profile-${width}.png`, fullPage: true });
    }
  });
}
test('keyboard use and reduced motion keep disclosures and editing usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/__account-preview');
  await tab(page, 'Orders').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-order-id="SAMPLE-1042"] summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-order-id="SAMPLE-1042"]')).toHaveAttribute('open', '');
  await tab(page, 'Profile').click();
  await page.getByRole('button', { name: 'Edit details', exact: true }).click();
  await expect(page.getByLabel('Full name', { exact: true })).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
});
