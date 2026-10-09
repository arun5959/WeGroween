const copyButtons = document.querySelectorAll('[data-copy]');
const copyStatus = document.querySelector('[data-copy-status]');

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      copyStatus.textContent = `${value} copied to clipboard.`;
    } catch {
      copyStatus.textContent = `${value} — copy this value manually.`;
    }
  });
});

const contexts = {
  household: {
    kicker: 'Household product card',
    title: 'Taste first. Trust close behind.',
    description: 'Lead with appetite and cooking use, then show harvest evidence, pack size and availability before asking for action.',
    list: ['Sensory title and description', 'Unit and price remain inseparable', 'Availability uses plain language'],
    stage: `<article class="product-card"><div class="product-image"><img src="../assets/radish-microgreens.webp" alt="Vivid radish microgreens growing densely"><span class="badge success">Ready now</span></div><div class="product-body"><p class="meta-label">Microgreens</p><h4>Radish microgreens</h4><p>Peppery, crisp and vivid. Finish chaat, eggs or salads just before serving.</p><div class="product-meta"><strong>₹120 <small>/ 75 g</small></strong><span>Harvested today</span></div><button class="button button-primary">Add to harvest</button></div></article>`
  },
  restaurant: {
    kicker: 'Restaurant specification card',
    title: 'Lead with reliable operating detail.',
    description: 'Professional buyers need cut-off times, yield, pack formats and substitution policy ahead of decorative storytelling.',
    list: ['Pack and weekly capacity', 'Lead time and delivery days', 'Direct account action'],
    stage: `<article class="spec-card"><div><p class="meta-label">Chef supply · Live availability</p><h4>Blue-grey oyster</h4><p>Firm small clusters selected for high-heat service.</p></div><dl><div><dt>Pack</dt><dd>1 kg crate</dd></div><div><dt>Weekly capacity</dt><dd>18–24 kg</dd></div><div><dt>Cut-off</dt><dd>Thu · 18:00</dd></div></dl><button class="button button-primary">Request standing supply</button></article>`
  },
  operations: {
    kicker: 'Operations data row',
    title: 'Density without visual noise.',
    description: 'Admin patterns use the same type, color and state language, but shift emphasis from appetite to scanning and resolution.',
    list: ['Native table structure', 'Text-supported order states', 'Row actions name their object'],
    stage: `<div class="table-wrap"><table><caption>Harvest batches</caption><thead><tr><th>Batch</th><th>Crop</th><th>Ready</th><th>Status</th></tr></thead><tbody><tr><td>WG-241</td><td>Radish microgreens</td><td>04 Oct</td><td><span class="badge success">Ready</span></td></tr><tr><td>WG-242</td><td>Golden oyster</td><td>05 Oct</td><td><span class="badge warning">Checking yield</span></td></tr><tr><td>WG-243</td><td>Broccoli microgreens</td><td>07 Oct</td><td><span class="badge information">Growing</span></td></tr></tbody></table></div>`
  }
};

const tabs = [...document.querySelectorAll('[data-context]')];
const title = document.querySelector('[data-context-title]');
const kicker = document.querySelector('[data-context-kicker]');
const description = document.querySelector('[data-context-description]');
const list = document.querySelector('[data-context-list]');
const stage = document.querySelector('[data-context-stage]');

function selectContext(name) {
  const context = contexts[name];
  if (!context) return;
  tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.context === name)));
  kicker.textContent = context.kicker;
  title.textContent = context.title;
  description.textContent = context.description;
  list.innerHTML = context.list.map((item) => `<li>${item}</li>`).join('');
  stage.innerHTML = context.stage;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectContext(tab.dataset.context));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    selectContext(tabs[next].dataset.context);
  });
});
