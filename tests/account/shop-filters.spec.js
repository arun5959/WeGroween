import {test,expect} from '@playwright/test';
import {products} from '../../src/content/foundation.js';
const choose=async(page,name)=>{const control=page.getByRole('combobox',{name:'Category',exact:true});await control.click();await page.getByRole('option',{name,exact:true}).click();await expect(control).toBeFocused();};
for(const reducedMotion of ['reduce','no-preference']) {
 test(`category changes retain the page and support history (${reducedMotion})`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion});await page.goto('/shop');
  await expect(page.locator('[data-shop-collection]')).toHaveCount(2);await expect(page.locator('.shop-global-sort')).not.toBeVisible();
  await page.evaluate(()=>{window.reviewShop=document.querySelector('.shop-page');window.reviewHeader=document.querySelector('.site-header');});
  for(const [slug,label,count] of [['mushrooms','Mushrooms · 6',6],['microgreens','Microgreens · 5',5],['organic-harvest','Organic Harvest · Coming soon',0],['exotics','Exotics · Coming soon',0]]) {
   await choose(page,label);await expect(page).toHaveURL(`/shop/category/${slug}`);await expect(page.locator('[data-product-card]')).toHaveCount(count);
   expect(await page.locator('[data-product-card]').evaluateAll(cards=>cards.map(card=>card.dataset.productCard))).toEqual(products.filter(p=>p.category===slug).map(p=>p.slug));
   expect(await page.evaluate(()=>reviewShop===document.querySelector('.shop-page')&&reviewHeader===document.querySelector('.site-header'))).toBe(true);
   if(!count) {await expect(page.locator('.shop-category-empty')).toBeVisible();await expect(page.locator('.shop-price-context')).not.toBeVisible();}
  }
  await page.goBack();await expect(page.locator('.shop-page')).toHaveAttribute('data-shop-category','organic-harvest');await page.goForward();await expect(page.locator('.shop-page')).toHaveAttribute('data-shop-category','exotics');
  await choose(page,'All harvests · 11');await expect(page).toHaveURL('/shop?view=all');await expect(page.locator('[data-shop-collection]')).toHaveCount(0);
  await page.getByRole('link',{name:'Our selections',exact:true}).click();await expect(page).toHaveURL('/shop');await expect(page.locator('[data-shop-collection]')).toHaveCount(2);expect(errors).toEqual([]);
 });
 test(`mobile shelves support buttons, keyboard and resizing (${reducedMotion})`,async({page})=>{
  await page.emulateMedia({reducedMotion});await page.setViewportSize({width:390,height:900});await page.goto('/shop');const shelf=page.locator('[data-shop-collection]').first(),track=shelf.getByRole('region');
  await expect(shelf.locator('[data-shelf-scroll="-1"]')).toBeDisabled();await shelf.getByRole('button',{name:'Next products in Fresh discoveries'}).click();await expect(shelf.locator('[data-shelf-position]')).toHaveText('2 / 4');
  await track.focus();await page.keyboard.press('End');await expect(shelf.locator('[data-shelf-position]')).toHaveText('4 / 4');await expect(shelf.locator('[data-shelf-scroll="1"]')).toBeDisabled();
  await page.keyboard.press('Home');await expect(shelf.locator('[data-shelf-position]')).toHaveText('1 / 4');await page.keyboard.press('ArrowRight');await expect(shelf.locator('[data-shelf-position]')).toHaveText('2 / 4');await expect(shelf.locator('[data-shelf-status]')).toContainText('2 of 4');
  await page.setViewportSize({width:1024,height:900});await expect(track).toHaveAttribute('tabindex','-1');expect(await track.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await page.setViewportSize({width:320,height:900});await expect(track).toHaveAttribute('tabindex','0');expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 });
}
test('direct category links, reload and rapid choices settle correctly',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [1440,768,390,320]) {await page.setViewportSize({width,height:900});await page.goto('/shop/category/mushrooms');await expect(page.locator('[data-product-card]')).toHaveCount(6);expect((await page.getByRole('combobox',{name:'Category',exact:true}).boundingBox()).height).toBeGreaterThanOrEqual(44);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);}
 await page.reload();await expect(page.locator('#shop-category')).toHaveValue('mushrooms');
 await page.evaluate(()=>{const picker=document.querySelector('#shop-category');for(const value of ['microgreens','exotics']){picker.value=value;picker.dispatchEvent(new Event('change',{bubbles:true}));}});
 await expect(page.locator('.shop-page')).toHaveAttribute('data-shop-category','exotics');await expect(page.locator('[data-product-card]')).toHaveCount(0);
 await page.goto('/shop/category/not-real');await expect(page.locator('#app')).toHaveAttribute('data-status','404');
});
