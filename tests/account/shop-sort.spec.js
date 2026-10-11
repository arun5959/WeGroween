import {test,expect} from '@playwright/test';
import {products} from '../../src/content/foundation.js';
import {sortCatalogue} from '../../src/app/catalogue-sort.js';
import {developmentWorkspace} from '../../src/content/development-workspace.js';
const order=page=>page.locator('[data-product-card]').evaluateAll(cards=>cards.map(card=>card.dataset.productCard));
const choose=async(page,label)=>{const control=page.locator('.shop-sort').getByRole('combobox');await control.click();await page.getByRole('option',{name:label,exact:true}).click();await expect(control).toBeFocused();};
test('one global sort covers every product and survives reload and history',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/shop');await page.getByRole('link',{name:'All products',exact:true}).click();await expect(page).toHaveURL('/shop?view=all');await expect(page.locator('[data-product-card]')).toHaveCount(11);
 for(const [mode,label] of [['name-asc','Name: A–Z'],['name-desc','Name: Z–A'],['price-asc','Price: low to high'],['price-desc','Price: high to low'],['availability','Availability'],['selection','Our selection']]) {
  await choose(page,label);expect(await order(page)).toEqual(sortCatalogue(products,mode,{inventory:developmentWorkspace.products}).map(p=>p.slug));await expect(page).toHaveURL(mode==='selection'?'/shop?view=all':`/shop?view=all&sort=${mode}`);
 }
 await choose(page,'Price: low to high');await page.reload();await expect(page.locator('.shop-sort').getByRole('combobox')).toHaveText('Price: low to high');expect(await order(page)).toEqual(sortCatalogue(products,'price-asc').map(p=>p.slug));
 await choose(page,'Name: A–Z');await page.goBack();await expect(page.locator('.shop-sort').getByRole('combobox')).toHaveText('Price: low to high');
 await page.getByRole('combobox',{name:'Category',exact:true}).click();await page.getByRole('option',{name:'Mushrooms · 6',exact:true}).click();await expect(page).toHaveURL('/shop/category/mushrooms?sort=price-asc');expect(await order(page)).toEqual(sortCatalogue(products.filter(p=>p.category==='mushrooms'),'price-asc').map(p=>p.slug));
 await page.getByRole('link',{name:'Our selections',exact:true}).click();await expect(page).toHaveURL('/shop');await expect(page.locator('[data-shop-collection]')).toHaveCount(2);
});
test('sort supports keyboard, mobile and cleanup',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1440,768,390,320]) {
  await page.setViewportSize({width,height:900});await page.goto('/shop/category/mushrooms');const control=page.getByRole('combobox',{name:'Sort by in Mushrooms'});expect((await control.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await control.focus();await page.keyboard.press('Enter');await page.keyboard.press('End');await page.keyboard.press('Enter');await expect(control).toHaveText('Price: high to low');expect(await order(page)).toEqual(sortCatalogue(products.filter(p=>p.category==='mushrooms'),'price-desc').map(p=>p.slug));
  await control.click();await expect(page.getByRole('listbox')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);await page.keyboard.press('Escape');await expect(control).toBeFocused();
  await page.getByRole('combobox',{name:'Category',exact:true}).click();await page.getByRole('option',{name:'Microgreens · 5',exact:true}).click();await expect(page.locator('.wg-select-listbox')).toHaveCount(2);
 }
 await page.evaluate(()=>document.querySelector('.site-header a[href="/help"]').click());await expect(page.locator('.wg-select-listbox[id^="shop-"]')).toHaveCount(0);expect(errors).toEqual([]);
});
test('sorting animates while preserving cards and controls',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/shop?view=all');
 const result=await page.evaluate(()=>{const select=document.querySelector('[data-shop-sort]'),grid=document.querySelector('.product-grid'),card=grid.firstElementChild,button=select.nextElementSibling;select.value='name-asc';select.dispatchEvent(new Event('change',{bubbles:true}));return {cardKept:card.isConnected&&card.parentElement===grid,buttonKept:button===select.nextElementSibling,animations:grid.getAnimations().map(a=>a.effect.getKeyframes())};});
 expect(result.cardKept&&result.buttonKept).toBe(true);expect(result.animations.some(frames=>frames.some(frame=>frame.opacity))).toBe(true);await expect(page).toHaveURL('/shop?view=all&sort=name-asc');await expect.poll(()=>page.locator('.product-grid').evaluate(grid=>grid.getAnimations().length)).toBe(0);
});
