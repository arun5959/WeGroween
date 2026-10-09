import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../..');
const url='http://127.0.0.1:5173/design-system/contact-directions/2026-10-07/index.html';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const errors=[], submissions=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(r.method()!=='GET')submissions.push(r.url());});
try {
 const response=await page.goto(url);assert.equal(response.status(),200);
 await page.evaluate(()=>document.fonts.ready);
 const widths=[320,390,640,768,1440], directions=['desk','letter','guide'];
 for(const width of widths){
  await page.setViewportSize({width,height:1000});
  for(const id of directions){
   await page.locator(`[data-direction="${id}"]`).click();
   assert.equal(await page.locator('.direction:visible').count(),1);
   assert.equal(await page.locator(`#${id}`).isVisible(),true);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id} overflow at ${width}`);
   assert.ok(await page.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0)),'image loaded');
   if(width===1440||width===390){await page.screenshot({path:path.join(dir,`${id}-${width===1440?'desktop':'mobile'}.png`),fullPage:true});}
  }
 }
 await page.locator('[data-direction="desk"]').click();
 await page.locator('[data-topic="restaurant"]').click();
 assert.match(await page.locator('#topic-text').textContent(),/expected quantities/);
 assert.match(await page.locator('#topic-email').getAttribute('href'),/Restaurant%20supply%20enquiry/);
 await page.locator('[data-direction="letter"]').click();
 await page.locator('#draft-form button').click();
 assert.equal(await page.locator('#sender-email').getAttribute('aria-invalid'),'true');
 assert.equal(await page.locator('#sender-email').evaluate(e=>e===document.activeElement),true);
 await page.locator('#sender-email').fill('visitor@example.invalid');
 await page.locator('#enquiry-topic').selectOption('restaurant');
 await page.locator('#enquiry-message').fill('Kitchen enquiry: mushrooms, expected quantity 10 trays.');
 await page.locator('#draft-form button').click();
 assert.equal(await page.locator('#email-draft').isVisible(),true);
 assert.match(await page.locator('#open-draft').getAttribute('href'),/Restaurant%20supply%20enquiry/);
 assert.match(await page.locator('#draft-body').textContent(),/visitor@example.invalid/);
 await page.locator('#enquiry-message').fill('Revised enquiry');
 assert.equal(await page.locator('#email-draft').isVisible(),false);
 await page.locator('[data-direction="guide"]').click();
 const question=page.locator('#guide summary').nth(1);
 await question.focus();await page.keyboard.press('Enter');
 assert.equal(await question.evaluate(e=>e.parentElement.open),true);
 await page.setViewportSize({width:390,height:844});
 await page.locator('.menu-toggle').click();
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.topic-choice').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 const noJS=await browser.newContext({javaScriptEnabled:false});
 const fallback=await noJS.newPage();await fallback.goto(url);
 assert.equal(await fallback.locator('.direction:visible').count(),3);
 assert.equal(await fallback.locator('#draft-form').isVisible(),false);
 await noJS.close();
 const baseline=JSON.parse(fs.readFileSync(path.join(dir,'scope-baseline.json'),'utf8'));
 const changed=Object.entries(baseline).filter(([file,hash])=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')!==hash).map(([file])=>file);
 assert.deepEqual(changed,[]);assert.deepEqual(errors,[]);assert.deepEqual(submissions,[]);
 const result={status:'passed',checkedAt:new Date().toISOString(),widths,directions,screenshots:6,checks:['one selected direction','no horizontal overflow','local images loaded','topic guidance and subject','draft validation and mailto construction','draft invalidation','keyboard accordion','mobile menu Escape','reduced motion','no JavaScript fallback','no message submissions','no browser runtime errors','protected source hashes unchanged'],protectedFiles:Object.keys(baseline).length};
 fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));
} finally {await browser.close();}
