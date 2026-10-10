import { test, expect } from '@playwright/test';

async function kitchen(page) {
  await page.locator('#supply-business').fill('Test Kitchen');
  await page.locator('#supply-city').fill('Gohana');
  await page.locator('#supply-name').fill('Test Chef');
}

test('supply page uses the approved structure with four supplied photographs', async ({ page }) => {
  await page.goto('/restaurant-supply');
  await expect(page).toHaveTitle('Restaurant Supply · WeGroween');
  await expect(page.locator('.supply-page h1')).toHaveText('Bring a thoughtful harvest to your kitchen.');
  await expect(page.locator('.supply-page [data-supply-image]')).toHaveCount(4);
  await expect(page.locator('.supply-page img')).toHaveCount(4);
  expect(await page.locator('[data-supply-image]').evaluateAll(nodes => nodes.map(node => [node.dataset.supplyImage, node.querySelectorAll('img').length, node.hasAttribute('aria-hidden')]))).toEqual([
    ['hero', 1, false], ['mushrooms', 1, false], ['microgreens', 1, false], ['growing-story', 1, false],
  ]);
  await page.locator('.supply-page img').evaluateAll(async images => {
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode()));
  });
  expect(await page.locator('.supply-page img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth || !image.alt).length)).toBe(0);
  await expect(page.locator('.supply-steps li')).toHaveCount(3);
  await expect(page.locator('.supply-fieldgroup legend')).toHaveText(['Your kitchen', 'Your produce', 'Your contact']);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /mushrooms and microgreens/i);
  await expect(page.locator('.supply-page')).not.toContainText('Coming soon');
  await expect(page.locator('.contact-answer a, .contact-answer button')).toHaveCount(0);
});

test('validates requirements and conditional fields, with clear focus targets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/restaurant-supply');
  const prepare = page.getByRole('button', { name: 'Prepare supply enquiry' });
  await prepare.click();
  await expect(page.locator('#supply-business')).toBeFocused();
  await kitchen(page);
  await page.locator('#supply-pin').fill('012345');
  await prepare.click();
  await expect(page.locator('#supply-pin')).toBeFocused();
  await expect(page.locator('#supply-pin-error')).toBeVisible();
  await page.locator('#supply-pin').fill('');
  await prepare.click();
  await expect(page.locator('#supply-interest-mushrooms')).toBeFocused();
  await page.locator('#supply-interest-other').check();
  await expect(page.locator('#supply-other')).toBeVisible();
  await expect(page.locator('#supply-other')).toBeEnabled();
  await prepare.click();
  await expect(page.locator('#supply-other')).toBeFocused();
  await page.locator('#supply-other').fill('Seasonal vegetables — availability to discuss');
  await prepare.click();
  await expect(page.locator('#supply-email')).toBeFocused();
  await page.locator('#supply-phone').fill('123');
  await prepare.click();
  await expect(page.locator('#supply-phone')).toBeFocused();
  await page.locator('#supply-phone').fill('+91 98765 43210');
  await prepare.click();
  await expect(page.locator('#supply-email-draft')).toBeVisible();
  await expect(page.locator('#supply-draft-body')).toContainText('Phone: +91 98765 43210');
  await expect(page.locator('#supply-draft-body')).not.toContainText('Email:');
  await page.locator('#supply-email').fill('invalid');
  await prepare.click();
  await expect(page.locator('#supply-email')).toBeFocused();
  await expect(page.locator('#supply-email-error')).toHaveText('Enter a valid email address.');
});

test('safely prepares email drafts, omits deselected quantities and invalidates edits', async ({ page }) => {
  const submissions = [];
  const failures = [];
  page.on('request', request => { if (request.method() !== 'GET') submissions.push(request.url()); });
  page.on('pageerror', error => failures.push(error.message));
  await page.goto('/restaurant-supply');
  await kitchen(page);
  await page.locator('#supply-email').fill('chef@example.invalid');
  await page.locator('#supply-pin').fill('131301');
  await page.locator('#supply-interest-mushrooms').check();
  await expect(page.locator('#supply-amount-mushrooms')).toBeVisible();
  await page.locator('#supply-amount-mushrooms').fill('5 kg');
  await page.locator('#supply-interest-microgreens').check();
  await page.getByRole('combobox', { name: 'Preferred frequency' }).click();
  await page.getByRole('option', { name: 'Interested in weekly supply', exact: true }).click();
  const note = '<img src=x onerror=alert(1)> & a question about pack sizes';
  await page.locator('#supply-notes').fill(note);
  const prepare = page.getByRole('button', { name: 'Prepare supply enquiry' });
  await prepare.click();
  await expect(page.locator('#supply-email-draft')).toBeFocused();
  const draftURL = new URL(await page.locator('#supply-open-draft').getAttribute('href'));
  expect(draftURL.protocol).toBe('mailto:');
  expect(draftURL.pathname).toBe('wegroween@gmail.com');
  expect(draftURL.searchParams.get('subject')).toBe('Restaurant supply enquiry');
  const body = draftURL.searchParams.get('body');
  expect(body).toContain('PIN code: 131301');
  expect(body).toContain('- Mushrooms: 5 kg');
  expect(body).toContain('- Microgreens: Quantity to discuss');
  expect(body).toContain('Interested in weekly supply');
  expect(body).toContain(note);
  await expect(page.locator('#supply-draft-body img')).toHaveCount(0);
  await page.locator('#supply-interest-mushrooms').uncheck();
  await expect(page.locator('#supply-email-draft')).toBeHidden();
  await expect(page.locator('#supply-open-draft')).not.toHaveAttribute('href');
  await expect(page.locator('#supply-amount-mushrooms')).toBeDisabled();
  await prepare.click();
  await expect(page.locator('#supply-draft-body')).not.toContainText('5 kg');
  await expect(page.locator('#supply-draft-body')).not.toContainText('- Mushrooms');
  await page.locator('#supply-notes').fill('Updated note');
  await expect(page.locator('#supply-email-draft')).toBeHidden();
  expect(submissions).toEqual([]);
  expect(failures).toEqual([]);
});

test('form and keyboard FAQs work after client navigation and browser back', async ({ page }) => {
  await page.goto('/');
  await page.locator('.site-navigation a[href="/restaurant-supply"]').click();
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.locator('#supply-form')).toBeVisible();
  const question = page.locator('.contact-questions summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.contact-answer').first()).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('.contact-questions details').first()).not.toHaveAttribute('open');
  await page.locator('.site-navigation a[href="/shop"]').click();
  await page.goBack();
  await expect(page.locator('#supply-form')).toBeVisible();
  await page.getByRole('button', { name: 'Prepare supply enquiry' }).click();
  await expect(page.locator('#supply-business')).toBeFocused();
});

test('conditional fields expand subtly and settle correctly with reduced motion', async ({ page }) => {
  await page.goto('/restaurant-supply');
  await page.evaluate(() => document.fonts.ready);
  const frames = await page.locator('.supply-form-panel').evaluate(async panel => {
    const heights = [panel.getBoundingClientRect().height];
    panel.querySelector('#supply-interest-mushrooms').click();
    const start = performance.now();
    await new Promise(resolve => {
      function sample() {
        heights.push(panel.getBoundingClientRect().height);
        if (performance.now() - start < 350) requestAnimationFrame(sample);
        else resolve();
      }
      requestAnimationFrame(sample);
    });
    return heights;
  });
  expect(frames.at(-1)).toBeGreaterThan(frames[0]);
  expect(frames.some(height => height > frames[0] + 1 && height < frames.at(-1) - 1)).toBe(true);
  await page.locator('#supply-interest-mushrooms').uncheck();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#supply-quantity-mushrooms')).toBeHidden();
  await expect(page.locator('#supply-amount-mushrooms')).toBeDisabled();
  await expect.poll(() => page.locator('.supply-form-panel').evaluate(element => element.getAnimations().length)).toBe(0);
  await page.locator('#supply-interest-microgreens').check();
  await expect(page.locator('#supply-amount-microgreens')).toBeVisible();
  expect(await page.locator('.supply-form-panel').evaluate(element => element.getAnimations().length)).toBe(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`supply layout and conditional form fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/restaurant-supply');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.locator('[data-supply-image="hero"] img').evaluate(image => image.currentSrc)).toContain(width <= 900 ? 'supply-hero-landscape' : 'supply-hero-portrait');
    await page.locator('#supply-interest-mushrooms').check();
    await page.locator('#supply-interest-microgreens').check();
    await page.locator('#supply-interest-other').check();
    await expect(page.locator('#supply-other')).toBeVisible();
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const outside = await page.locator('.supply-page input, .supply-page textarea, .supply-page select, .supply-page .button, [data-supply-image]').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length && (node.getBoundingClientRect().right > innerWidth + 1 || node.getBoundingClientRect().left < -1)).map(node => node.id || node.className));
    expect(outside).toEqual([]);
  });
}

test('supply content and direct contact fallback work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/restaurant-supply');
  await expect(page.locator('h1')).toHaveText('Bring a thoughtful harvest to your kitchen.');
  await expect(page.locator('#supply-form')).toBeHidden();
  await expect(page.locator('.supply-page noscript a')).toHaveAttribute('href', 'mailto:wegroween@gmail.com?subject=Restaurant%20supply%20enquiry');
  await page.locator('.contact-questions summary').first().click();
  await expect(page.locator('.contact-answer').first()).toBeVisible();
  await context.close();
});

test('home uses art-directed kitchen images and the new category image without broken media', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const hero = page.locator('.hero-media img');
    expect(await hero.evaluate(image => image.currentSrc)).toContain(width <= 720 ? 'kitchen-dish-landscape' : 'kitchen-dish-portrait');
    await page.locator('img').evaluateAll(async images => {
      images.forEach(image => { image.loading = 'eager'; });
      await Promise.all(images.map(image => image.decode()));
    });
    expect(await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth || !image.alt).length)).toBe(0);
    await expect(page.locator('.category-card').nth(1).locator('img')).toHaveAttribute('src', /microgreens-range/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
