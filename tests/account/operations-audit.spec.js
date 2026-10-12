import {test,expect} from '@playwright/test';
const choose=async(page,label,value)=>{await page.getByRole('combobox',{name:label,exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click();};
const ready=async(page,path)=>{await page.goto(path);await expect(page.locator('#app')).toHaveAttribute('data-status','200');};
const save=async page=>page.getByRole('dialog').getByRole('button',{name:'Save changes',exact:true}).click();
test.beforeEach(async({page})=>page.emulateMedia({reducedMotion:'reduce'}));

test('a product can be saved after correcting the missing-photo publishing error',async({page})=>{
 await ready(page,'/admin/products/new');await page.getByLabel('Product name').fill('Reviewed harvest');await page.getByLabel('Sample pack size').fill('100 g');await choose(page,'Publishing state','Published');await page.getByRole('button',{name:'Save product'}).click();await expect(page.locator('[data-admin-form-error]')).toContainText('photograph');
 await choose(page,'Approved photograph','Button mushrooms');await expect(page.locator('select[name="imageKey"]')).toHaveJSProperty('validationMessage','');await page.getByRole('button',{name:'Save product'}).click();await expect(page).toHaveURL(/products\?q=Reviewed/);
});

test('delivery and promotion money fields accept valid decimal amounts',async({page})=>{
 await ready(page,'/admin/delivery');await page.getByRole('button',{name:'Add a zone'}).click();await page.getByLabel('Zone name').fill('Decimal zone');await page.getByLabel('Sample PIN codes').fill('111111');await page.getByLabel('Illustrative delivery fee (₹)').fill('30.50');await page.getByLabel('Minimum order value (₹)').fill('250.75');
 expect(await page.getByLabel('Illustrative delivery fee (₹)').evaluate(input=>input.validity.valid)).toBe(true);await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await page.reload();await expect(page.locator('[data-work-row]').filter({hasText:'Decimal zone'})).toContainText('₹30.5');
 await ready(page,'/admin/promotions');await page.getByRole('button',{name:'Add promotion'}).click();await page.getByLabel('Promotion name').fill('Decimal welcome');await page.getByLabel('Sample code').fill('DECIMAL');await page.getByLabel('Illustrative discount (%)').fill('12.5');await page.getByLabel('Minimum order value (₹)').fill('100.25');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('report totals and chart follow the same search and stage filters as the exported ledger',async({page})=>{
 await ready(page,'/admin/reports');await page.getByLabel('Find an order').fill('1048');await expect(page.locator('.work-metrics')).toContainText('₹440');await expect(page.locator('.admin-chart-day')).toHaveCount(1);await page.getByLabel('Find an order').fill('');await choose(page,'Status','Delivered');await expect(page.locator('.work-metrics')).toContainText('₹800');await expect(page.locator('[data-work-row]:visible')).toHaveCount(3);
 await page.getByLabel('Find an order').fill('Kabir');await expect(page.locator('.work-metrics')).toContainText('₹280');await page.reload();await expect(page.locator('.work-metrics')).toContainText('₹280');await page.getByRole('button',{name:'Clear filters',exact:true}).click();await expect(page.locator('.work-metrics')).toContainText('₹1,760');await expect(page.locator('[data-work-row]:visible')).toHaveCount(6);
});

test('category names cannot hijack the unfiltered product view and filter URLs survive renames',async({page})=>{
 await ready(page,'/admin/categories');await page.getByRole('button',{name:'Add a category'}).click();await page.getByLabel('Category name').fill('All categories');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await ready(page,'/admin/products');await expect(page.locator('[data-work-count]')).toContainText('11 matching');
 await choose(page,'Category','Mushrooms');const bookmark=page.url();await ready(page,'/admin/categories');await page.locator('[data-record-id="mushrooms"]').getByRole('button',{name:'Edit',exact:true}).click();await page.getByLabel('Category name').fill('Seasonal mushrooms');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await page.goto(bookmark);await expect(page.locator('[data-work-count]')).toContainText('6 matching');await expect(page.getByRole('combobox',{name:'Category',exact:true})).toContainText('Seasonal mushrooms');
});

test('stock reasons retain the full allowed text and survive storage validation on reload',async({page})=>{
 const reason='a'.repeat(1200);await ready(page,'/admin/inventory');await page.getByRole('button',{name:'Adjust stock'}).first().click();await page.getByLabel('New sample stock (packs)').fill('40');await page.getByLabel('Reason for the adjustment').fill(reason);await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await expect(page.locator('.admin-activity')).toContainText(reason);await page.reload();await expect(page.locator('[data-record-id="button-mushrooms"]')).toContainText('40 packs');await expect(page.locator('.admin-activity')).toContainText(reason);
});

test('repeated submission while the editor closes creates only one record',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await ready(page,'/admin/customers');await page.getByRole('button',{name:'Add customer'}).click();await page.getByLabel('Full name',{exact:true}).fill('Single submission');await page.getByLabel('Email',{exact:true}).fill('single@example.invalid');await page.locator('[data-admin-form="modal"]').evaluate(form=>{form.requestSubmit();form.requestSubmit();});await expect(page.getByRole('dialog')).not.toBeVisible();await expect(page.locator('[data-work-count]')).toContainText('4 matching');await expect(page.locator('[data-work-row]').filter({hasText:'Single submission'})).toHaveCount(1);
});

test('two tabs synchronise records and preserve drafts instead of overwriting a changed record',async({page,context})=>{
 await ready(page,'/admin/inventory');const other=await context.newPage();await other.emulateMedia({reducedMotion:'reduce'});await ready(other,'/admin/inventory');
 const adjust=async(target,amount)=>{await target.getByRole('button',{name:'Adjust stock'}).first().click();await target.getByLabel('New sample stock (packs)').fill(String(amount));await target.getByLabel('Reason for the adjustment').fill('Sample recount');await save(target);await expect(target.getByRole('dialog')).not.toBeVisible();};
 await adjust(page,40);await expect(other.locator('[data-record-id="button-mushrooms"]')).toContainText('40 packs');await other.getByRole('button',{name:'Adjust stock'}).first().click();await other.getByLabel('New sample stock (packs)').fill('44');await other.getByLabel('Reason for the adjustment').fill('Older draft');await adjust(page,42);await save(other);await expect(other.locator('[data-admin-form-error]')).toContainText('another tab');await expect(other.getByLabel('New sample stock (packs)')).toHaveValue('44');await other.keyboard.press('Escape');await other.getByRole('button',{name:'Refresh workspace'}).click();await adjust(other,45);await expect(page.locator('[data-record-id="button-mushrooms"]')).toContainText('45 packs');await other.close();
});

test('changing a related field clears an obsolete validation error',async({page})=>{
 await ready(page,'/admin/promotions');await page.getByRole('button',{name:'Add promotion'}).click();await page.getByLabel('Promotion name').fill('Date review');await page.getByLabel('Sample code').fill('DATEREVIEW');await page.getByLabel('Illustrative discount (%)').fill('10');await page.getByLabel('Starts on').fill('2026-10-15');await page.getByLabel('Ends on').fill('2026-10-01');await save(page);await expect(page.locator('[data-admin-form-error]')).toContainText('end date');await page.getByLabel('Starts on').fill('2026-09-01');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();
 await ready(page,'/admin/products?category=Mushrooms');await expect(page).toHaveURL(/category=mushrooms/);await expect(page.locator('[data-work-count]')).toContainText('6 matching');
});

test('unrelated tab changes merge without losing an open customer draft',async({page,context})=>{
 await ready(page,'/admin/customers/sample-customer');await page.getByRole('button',{name:'Edit details',exact:true}).click();await page.getByLabel('Full name',{exact:true}).fill('Aarav Reviewed');const other=await context.newPage();await other.emulateMedia({reducedMotion:'reduce'});await ready(other,'/admin/inventory');await other.getByRole('button',{name:'Adjust stock'}).first().click();await other.getByLabel('New sample stock (packs)').fill('47');await other.getByLabel('Reason for the adjustment').fill('Concurrent recount');await save(other);await expect(other.getByRole('dialog')).not.toBeVisible();await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await ready(page,'/admin/inventory');await expect(page.locator('[data-record-id="button-mushrooms"]')).toContainText('47 packs');await ready(page,'/admin/customers/sample-customer');await expect(page.locator('h1')).toHaveText('Aarav Reviewed');await other.close();
});

test('report dropdown focus remains on the visible control after updating its period',async({page})=>{
 await ready(page,'/admin/reports');await choose(page,'Reporting period','Last 7 days');await expect(page.getByRole('combobox',{name:'Reporting period',exact:true})).toBeFocused();await choose(page,'Order stage','Delivered');await expect(page.getByRole('combobox',{name:'Order stage',exact:true})).toBeFocused();
});
