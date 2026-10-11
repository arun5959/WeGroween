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

for (const reducedMotion of ['reduce','no-preference']) {
 test(`mode toolbar stays aligned and settles after interrupted transitions (${reducedMotion})`,async({page})=>{
  await page.emulateMedia({reducedMotion});
  for (const width of [1440,768,390,320]) {
   await page.setViewportSize({width,height:900});await page.goto('/shop');
   const toolbar=page.locator('.shop-result-toolbar'),switcher=page.locator('.shop-view-switch');
   await expect(toolbar).not.toBeVisible();
   const before=await switcher.boundingBox();
   const motion=await page.evaluate(async()=>{
    const el=document.querySelector('.shop-result-toolbar');
    getComputedStyle(el).opacity;
    document.querySelector('[data-shop-view-link="all"]').click();
    await new Promise(requestAnimationFrame);
    const token=getComputedStyle(document.documentElement).getPropertyValue('--motion-standard').trim();
    return {durations:el.getAnimations().map(a=>a.effect.getTiming().duration),expected:parseFloat(token)*(token.endsWith('ms')?1:1000)};
   });
   if (reducedMotion==='no-preference') {
    expect(motion.durations.length).toBeGreaterThan(0);
    expect(motion.durations.every(d=>d===motion.expected)).toBe(true);
   } else expect(motion.durations).toEqual([]);
   await expect.poll(()=>toolbar.evaluate(el=>el.getAnimations().length)).toBe(0);
   const after=await switcher.boundingBox(),sort=await toolbar.boundingBox();
   expect(after.x).toBeCloseTo(before.x,1);expect(after.width).toBeCloseTo(before.width,1);
   if(width>720) {expect(after.y).toBe(before.y);expect(sort.x+sort.width).toBeLessThan(after.x);}
   else expect(sort.y+sort.height).toBeCloseTo(after.y,1);
   const trigger=page.locator('#shop-sort-catalogue-trigger');await expect(trigger).toBeEnabled();expect((await trigger.boundingBox()).height).toBeGreaterThanOrEqual(44);
   await trigger.click();await expect(page.locator('#shop-sort-catalogue-listbox')).toBeVisible();
   await page.goBack();await expect(toolbar).not.toBeVisible();await expect(toolbar).toHaveAttribute('inert','');
   await expect(page.locator('#shop-sort-catalogue-listbox')).not.toBeVisible();await expect(page.getByRole('combobox',{name:'Sort by in All products'})).toHaveCount(0);
   await page.evaluate(()=>{for(const mode of ['all','selections','all','selections']) document.querySelector(`[data-shop-view-link="${mode}"]`).click();});
   await expect(toolbar).not.toBeVisible();await expect.poll(()=>toolbar.evaluate(el=>el.getAnimations().length)).toBe(0);
   await expect(page.locator('[data-shop-collection]')).toHaveCount(2);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  }
 });
}
