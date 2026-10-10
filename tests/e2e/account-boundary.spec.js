import { test, expect } from '@playwright/test';

test('production does not expose the development sample account or unlock accounts', async ({ page, request }) => {
  const preview = await request.get('/__account-preview', { headers: { Accept: 'text/html' } });
  expect(preview.status()).toBe(404);
  await page.goto('/__account-preview');
  await expect(page.locator('#app')).toHaveAttribute('data-status', '404');
  await expect(page.locator('[data-account-preview]')).toHaveCount(0);
  await page.goto('/account');
  await expect(page.locator('#app')).toHaveAttribute('data-status', '403');
  await expect(page.getByRole('link', { name: 'Explore the sample account' })).toHaveCount(0);
});
