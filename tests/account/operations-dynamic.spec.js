import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const choose=async(page,label,value)=>{await page.getByRole('combobox',{name:label,exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click();};
const ready=async(page,path)=>{await page.goto(path);await expect(page.locator('#app')).toHaveAttribute('data-status','200');};
const save=async page=>{await page.getByRole('dialog').getByRole('button',{name:'Save changes',exact:true}).click();};
test.beforeEach(async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});});

test('overview opens actionable queues and tables preserve search, sorting and pages on reload',async({page})=>{
 await ready(page,'/admin');await expect(page.locator('.admin-metrics a').last()).toContainText('₹1,760');
 await page.locator('.admin-metrics a').first().click();await expect(page).toHaveURL('/admin/orders?status=Preparing');await expect(page.locator('[data-work-row]:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();await expect(page.locator('[data-work-row]:visible')).toHaveCount(6);
 await page.getByRole('button',{name:'Next records'}).click();await expect(page.locator('[data-work-row]:visible')).toHaveCount(1);await page.reload();await expect(page.locator('[data-admin-page]')).toHaveText('2 / 2');
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();await page.getByLabel('Find an order').fill('Meera');await choose(page,'Sort records','Order value: high to low');
 await expect(page.locator('[data-work-row]:visible').first()).toContainText('SAMPLE-1048');await page.reload();await expect(page.getByLabel('Find an order')).toHaveValue('Meera');await expect(page.locator('[data-work-row]:visible')).toHaveCount(2);
 await page.getByLabel('Find an order').fill('none');await expect(page.locator('[data-work-empty]')).toBeVisible();
});

test('bulk fulfilment updates dashboard counts and remains saved after reload',async({page})=>{
 await ready(page,'/admin/orders?status=Preparing');await page.getByRole('checkbox',{name:'Select records on this page'}).check();await expect(page.locator('[data-admin-selected]')).toHaveText('1 selected');await page.getByRole('button',{name:'Mark ready',exact:true}).click();
 await expect(page.locator('.work-status')).toContainText('1 selected record set to Ready');await expect(page.locator('[data-work-empty]')).toBeVisible();
 await ready(page,'/admin');await expect(page.locator('.admin-metrics a').first()).toContainText('0');await expect(page.locator('.admin-activity')).toContainText('SAMPLE-1050: Preparing → Ready');
 await ready(page,'/admin/orders/SAMPLE-1050');await expect(page.locator('.work-header .account-tag')).toHaveText('Ready');await page.reload();await expect(page.locator('.work-header .account-tag')).toHaveText('Ready');
});

test('order cancellation requires a note and preserves purchased prices',async({page})=>{
 await ready(page,'/admin/orders/SAMPLE-1050');await choose(page,'Order status','Cancelled');await page.getByRole('button',{name:'Update sample order'}).click();await expect(page.locator('[data-admin-form-error]')).toContainText('Record a reason');
 await page.getByLabel('Internal note or cancellation reason').fill('Fictional customer request');await page.getByRole('button',{name:'Update sample order'}).click();await expect(page.locator('.work-header .account-tag')).toHaveText('Cancelled');await expect(page.locator('.admin-activity')).toContainText('Fictional customer request');
 await expect(page.locator('.work-line').first()).toContainText('₹140');await page.reload();await expect(page.locator('.work-header .account-tag')).toHaveText('Cancelled');
});

test('stock movements persist and drive low-stock alerts and inventory sorting',async({page})=>{
 await ready(page,'/admin/inventory');await page.locator('[data-record-id="button-mushrooms"]').getByRole('button',{name:'Adjust stock'}).click();
 await page.getByLabel('New sample stock (packs)').fill('0');await save(page);await expect(page.getByRole('dialog')).toBeVisible();await page.getByLabel('Reason for the adjustment').fill('Sample harvest allocation');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.reload();await expect(page.locator('[data-record-id="button-mushrooms"]')).toContainText('0 packs');await expect(page.locator('.admin-activity')).toContainText('36 → 0 packs');
 await choose(page,'Sort records','Stock: low to high');await expect(page.locator('[data-work-row]:visible').first()).toContainText('Button mushrooms');
 await ready(page,'/admin');await expect(page.locator('.admin-low-stock')).toContainText('Button mushrooms');await expect(page.locator('.admin-attention-number').last()).toHaveText('3');
});

test('approved product photographs preview live and product records survive a full reload',async({page})=>{
 await ready(page,'/admin/products/new');await page.getByLabel('Product name').fill('Chef harvest');await page.getByLabel('Description',{exact:true}).fill('A considered selection for the kitchen.');await page.getByLabel('Sample pack size').fill('100 g');await page.getByLabel('Illustrative price (₹)').fill('175.25');
 await choose(page,'Approved photograph','Golden oyster mushrooms');await choose(page,'Publishing state','Published');await expect(page.locator('[data-admin-product-name]')).toHaveText('Chef harvest');await expect(page.locator('[data-admin-product-image]')).toBeVisible();
 await page.getByRole('button',{name:'Save product'}).click();await expect(page).toHaveURL(/\/admin\/products\?q=Chef/);await expect(page.locator('[data-work-row]:visible')).toContainText('₹175.25');await expect(page.locator('.work-status')).toContainText('Chef harvest added');
 await page.reload();await expect(page.locator('[data-work-row]:visible')).toContainText('Chef harvest');await expect(page.locator('[data-work-row]:visible')).toContainText('Published');await page.locator('[data-work-row]:visible').getByRole('link',{name:'Edit product'}).click();await page.reload();await expect(page.getByLabel('Product name')).toHaveValue('Chef harvest');await expect(page.getByLabel('Illustrative price (₹)')).toHaveValue('175.25');
});

test('category ordering and new customer records persist and customer history is connected',async({page})=>{
 await ready(page,'/admin/categories');await page.getByRole('button',{name:'Add a category'}).click();await page.getByLabel('Category name').fill('Kitchen greens');await page.getByLabel('Description',{exact:true}).fill('A careful collection.');await page.getByLabel('Display position').fill('0');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await page.reload();await expect(page.locator('[data-work-row]')).toHaveCount(5);
 await ready(page,'/admin/customers');await page.getByRole('button',{name:'Add customer'}).click();await page.getByLabel('Full name',{exact:true}).fill('New Sample');await page.getByLabel('Email',{exact:true}).fill('new@example.invalid');await choose(page,'State','Active');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await page.reload();await expect(page.locator('[data-work-row]')).toContainText(['Aarav','Meera','Kabir','New Sample']);
 await ready(page,'/admin/customers/sample-customer');await expect(page.locator('[data-work-row]')).toHaveCount(3);await expect(page.locator('[data-record-id="SAMPLE-1042"]')).toContainText('SAMPLE-1042');
});

test('kitchen follow-ups, internal notes and stages feed the overview',async({page})=>{
 await ready(page,'/admin/restaurant-supply');await page.locator('[data-record-id="sample-kitchen"]').getByRole('button',{name:'Review enquiry'}).click();await page.getByLabel('Follow-up date').fill('2026-10-20');await page.getByLabel('Conversation notes').fill('Review the weekly sample pack.');await choose(page,'Conversation stage','Discussing');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.reload();await expect(page.locator('[data-record-id="sample-kitchen"]')).toContainText('2026-10-20');await ready(page,'/admin');await expect(page.locator('.admin-follow-ups')).toContainText('Follow up 2026-10-20');
});

test('promotion and delivery editors reject invalid rules then save valid records',async({page})=>{
 await ready(page,'/admin/promotions');await page.getByRole('button',{name:'Add promotion'}).click();await page.getByLabel('Promotion name').fill('Sample welcome');await page.getByLabel('Sample code').fill('SAMPLE10');await page.getByLabel('Illustrative discount (%)').fill('20');await choose(page,'State','Draft');await save(page);await expect(page.locator('[data-admin-form-error]')).toContainText('already in use');
 await page.getByLabel('Sample code').fill('WELCOME20');await page.getByLabel('Starts on').fill('2026-10-01');await page.getByLabel('Ends on').fill('2026-10-30');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await page.reload();await expect(page.locator('[data-work-row]')).toHaveCount(2);
 await ready(page,'/admin/delivery');await page.getByRole('button',{name:'Add a zone'}).click();await page.getByLabel('Zone name').fill('Sample north');await page.getByLabel('Sample PIN codes').fill('000000');await page.getByLabel('Illustrative delivery fee (₹)').fill('40');await choose(page,'State','Draft');await save(page);await expect(page.locator('[data-admin-form-error]')).toContainText('another zone');
 await page.getByLabel('Sample PIN codes').fill('111111, 222222');await save(page);await expect(page.getByRole('dialog')).not.toBeVisible();await page.reload();await expect(page.locator('[data-work-row]')).toHaveCount(2);
});

test('reports share one period-filtered ledger, chart, arithmetic and exact CSV export',async({page})=>{
 await ready(page,'/admin/reports');await choose(page,'Reporting period','Last 7 days');await expect(page.locator('.work-metrics')).toContainText('₹1,290');await expect(page.locator('[data-work-row]')).toHaveCount(4);await expect(page.locator('.admin-chart-day')).toHaveCount(4);
 await page.getByLabel('Find an order').fill('1050');const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export sample CSV'}).click();const download=await downloadPromise;const csv=await fs.readFile(await download.path(),'utf8');expect(csv).toContain('SAMPLE-1050');expect(csv).not.toContain('SAMPLE-1048');
 await page.reload();await expect(page.getByLabel('Find an order')).toHaveValue('1050');await expect(page.locator('.work-metrics')).toContainText('₹330');
});

test('settings persist, update thresholds and preferences, and reset requires an explicit action',async({page})=>{
 await ready(page,'/admin/settings');await page.getByLabel('Business name').fill('Sample growing desk');await page.getByLabel('Low-stock alert (packs)').fill('50');await page.getByRole('checkbox',{name:'Show activity summary'}).uncheck();await page.getByRole('button',{name:'Save changes',exact:true}).click();await page.reload();await expect(page.getByLabel('Business name')).toHaveValue('Sample growing desk');
 await ready(page,'/admin');await expect(page.locator('.admin-attention-number').last()).toHaveText('11');await expect(page.getByText('The activity summary is hidden in your workspace preferences.')).toBeVisible();
 await ready(page,'/admin/settings');await page.getByRole('button',{name:'Reset preview data'}).click();await page.getByRole('button',{name:'Keep my changes'}).click();await expect(page.getByLabel('Business name')).toHaveValue('Sample growing desk');
 await page.getByRole('button',{name:'Reset preview data'}).click();await page.getByRole('button',{name:'Reset preview records',exact:true}).click();await expect(page.getByRole('dialog')).not.toBeVisible();await expect(page.getByLabel('Business name')).toHaveValue('WeGroween');
 await page.reload();await expect(page.getByLabel('Low-stock alert (packs)')).toHaveValue('10');
});

for(const reducedMotion of ['reduce','no-preference'])test(`mobile editors, keyboard and history clean up correctly (${reducedMotion})`,async({page})=>{
 await page.emulateMedia({reducedMotion});await page.setViewportSize({width:320,height:600});await ready(page,'/admin/inventory');await page.getByRole('button',{name:'Adjust stock'}).first().click();const modal=page.getByRole('dialog');await expect(modal).toBeVisible();await modal.getByRole('button',{name:'Close editor'}).focus();await page.keyboard.press('Shift+Tab');expect(await page.evaluate(()=>document.activeElement.closest('#account-edit-modal')!==null)).toBe(true);await page.keyboard.press('Tab');await expect(modal.getByRole('button',{name:'Close editor'})).toBeFocused();await page.keyboard.press('Escape');await expect(modal).not.toBeVisible();await expect(page.getByRole('button',{name:'Adjust stock'}).first()).toBeFocused();await page.getByRole('button',{name:'Adjust stock'}).first().click();await page.getByLabel('New sample stock (packs)').fill('44');await page.getByLabel('Reason for the adjustment').fill('Sample recount');await save(page);await expect(modal).not.toBeVisible();
 expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 await page.getByRole('navigation',{name:'Admin navigation'}).getByRole('link',{name:'Promotions',exact:true}).click();await page.getByRole('button',{name:'Add promotion'}).click();await page.goBack();await expect(page.locator('#account-edit-modal')).toHaveCount(0);expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
});

test('corrupt and unavailable browser storage keep the preview usable',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('wegroween.operations.preview.v1','{broken'));await ready(page,'/admin');await expect(page.locator('.work-status')).toContainText('could not be loaded');await expect(page.locator('[data-work-row]')).toHaveCount(3);
 await page.getByRole('navigation',{name:'Admin navigation'}).getByRole('link',{name:'Settings',exact:true}).click();await page.getByLabel('Business name').fill('Recovered Sample');await page.getByRole('button',{name:'Save changes',exact:true}).click();await page.getByRole('navigation',{name:'Admin navigation'}).getByRole('link',{name:'Overview',exact:true}).click();await expect(page.locator('.work-status')).not.toContainText('could not be loaded');
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('Unavailable');};});await ready(page,'/admin/settings');await page.getByLabel('Business name').fill('In-memory Sample');await page.getByRole('button',{name:'Save changes',exact:true}).click();await expect(page.locator('.work-status')).toContainText('remains in this tab');await expect(page.getByLabel('Business name')).toHaveValue('In-memory Sample');
});
