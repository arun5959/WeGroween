// Run against the live development site; inspect actual UI colors, not photographs.
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import { pages, examplePath } from '../src/app/routes.js';

const browser = await chromium.launch();
const page = await browser.newPage({ reducedMotion: 'reduce' });
const reports = [];
async function inspect(label) {
  // Wait for local fonts and inherited styles to settle after rapid route loads.
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const report = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const cache = new Map();
    function rgba(value) {
      if (!cache.has(value)) {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        cache.set(value, [...context.getImageData(0, 0, 1, 1).data]);
      }
      return cache.get(value);
    }
    function blend(front, back) {
      const alpha = front[3] / 255;
      return front.slice(0, 3).map((channel, index) => channel * alpha + back[index] * (1 - alpha)).concat(255);
    }
    function luminance(value) {
      const channels = value.slice(0, 3).map(channel => { const s = channel / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; });
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    }
    const extremes = [];
    const contrastFailures = [];
    let visibleElements = 0;
    let textChecks = 0;
    let inactiveTextExemptions = 0;
    for (const element of document.querySelectorAll('#app *, #cart-drawer[open] *')) {
      const style = getComputedStyle(element);
      if (!element.getClientRects().length || style.visibility === 'hidden' || style.opacity === '0') continue;
      visibleElements++;
      for (const property of ['color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']) {
        if (property.startsWith('border') && style[property.replace('Color', 'Width')] === '0px') continue;
        const value = rgba(style[property]);
        if (value[3] && (value.slice(0, 3).every(channel => channel === 0) || value.slice(0, 3).every(channel => channel === 255))) {
          extremes.push({ tag: element.tagName, class: element.getAttribute('class'), property, color: style[property] });
        }
      }
      const text = [...element.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent).join(' ').trim();
      if (!text || element.closest('svg, script, style')) continue;
      if (element.closest(':disabled, [aria-disabled="true"], [aria-hidden="true"]')) { inactiveTextExemptions++; continue; }
      const chain = [];
      for (let parent = element; parent; parent = parent.parentElement) chain.unshift(parent);
      let background = [252, 250, 246, 255];
      for (const parent of chain) background = blend(rgba(getComputedStyle(parent).backgroundColor), background);
      const foreground = blend(rgba(style.color), background);
      const light = luminance(foreground), dark = luminance(background);
      const ratio = (Math.max(light, dark) + .05) / (Math.min(light, dark) + .05);
      const size = parseFloat(style.fontSize), weight = parseInt(style.fontWeight);
      const minimum = size >= 24 || (size >= 18.667 && weight >= 700) ? 3 : 4.5;
      textChecks++;
      if (ratio < minimum) contrastFailures.push({ text: text.slice(0, 70), ratio: +ratio.toFixed(2), minimum });
    }
    const root = getComputedStyle(document.documentElement);
    return { visibleElements, textChecks, inactiveTextExemptions, extremes, contrastFailures, tokens: Object.fromEntries(['text-primary', 'surface', 'surface-elevated', 'background'].map(role => [role, root.getPropertyValue(`--color-${role}`).trim()])) };
  });
  reports.push({ label, width: page.viewportSize().width, ...report });
}
try {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const type of pages) {
      await page.goto(`http://127.0.0.1:5173${examplePath(type)}`);
      await page.locator('#app[data-page-id]').waitFor();
      await inspect(`${type.id} ${examplePath(type)}`);
    }
    await page.goto('http://127.0.0.1:5173/__account-preview');
    await inspect('Sample account overview');
    await page.getByRole('navigation', { name: 'Sample account navigation' }).getByRole('button', { name: 'Profile', exact: true }).click();
    await page.getByRole('button', { name: 'Edit details', exact: true }).click();
    await inspect('Sample account inline editor');
    if (width === 1440) await page.locator('.header-actions a[href="/cart"]').click();
    else {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('.mobile-menu-actions a[href="/cart"]').click();
    }
    await inspect('Open cart panel');
  }
  const summary = { date: '2026-10-10', pageTypes: pages.length, renderedCases: reports.length, visibleElements: reports.reduce((sum, report) => sum + report.visibleElements, 0), textChecks: reports.reduce((sum, report) => sum + report.textChecks, 0), inactiveTextExemptions: reports.reduce((sum, report) => sum + report.inactiveTextExemptions, 0), endpointFailures: reports.reduce((sum, report) => sum + report.extremes.length, 0), contrastFailures: reports.reduce((sum, report) => sum + report.contrastFailures.length, 0), limitations: 'Computed UI colors and flat/alpha text backgrounds; photograph pixels, gradients and browser chrome are outside this check. Disabled controls and aria-hidden decorations are exempt from text contrast checks.', reports };
  await writeFile('docs/verification/muted-interface-colors.json', JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ ...summary, reports: undefined }));
  if (summary.endpointFailures || summary.contrastFailures) process.exitCode = 1;
} finally { await browser.close(); }
