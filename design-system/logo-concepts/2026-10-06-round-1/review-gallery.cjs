const { chromium } = require('playwright');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:8765',{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(__dirname,'gallery-desktop.png'),fullPage:true});
  const media = await page.locator('.preview img').evaluateAll(imgs=>imgs.map(img=>({file:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0})));
  await page.locator('.preview').first().click();
  const enlarged = await page.locator('#viewer').evaluate(el=>el.open);
  await page.locator('#close').click();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(__dirname,'gallery-mobile.png'),fullPage:true});
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  console.log(JSON.stringify({media,enlarged,mobileOverflow:overflow}));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
