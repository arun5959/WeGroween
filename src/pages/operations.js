import { developmentWorkspace as state, money } from '../content/development-workspace.js';
import { escapeHtml as e, link } from '../components/primitives.js';
import { workHeader, panel, metrics, table, tag, action, workField as field, workForm, demoNote, back } from '../components/workspace.js';
import { categories } from '../content/foundation.js';
import { icon } from '../components/icons.js';

const to = (label, href) => `<a class="account-text-action" href="${e(href)}">${e(label)} ${icon('arrow-right')}</a>`;
const hiddenId = id => `<input type="hidden" name="id" value="${e(id)}">`;
const definition = items => `<dl class="work-definition">${items.map(([label, value]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>`;
const orderTable = () => table(['Order', 'Kitchen / customer', 'Placed', 'Illustrative total', 'Status', ''], state.orders.map(o => ({ status: o.status, cells: [e(o.id), e(o.customer), e(o.date), money(o.total), tag(o.status), to('Open order', `/admin/orders/${o.id}`)] })), { search: 'Find an order', statuses: ['Preparing', 'Ready', 'Out for delivery', 'Delivered', 'Cancelled'] });
const productTable = () => table(['Product', 'Sample pack', 'Sample price', 'Sample stock', 'Status', ''], state.products.map(p => ({ status: p.status, cells: [e(p.name), e(p.pack), money(p.price), e(p.stock), tag(p.status), to('Edit product', `/admin/products/${p.id}/edit`)] })), { search: 'Find a product', statuses: ['Draft', 'Published', 'Archived'] });
const orderItems = order => order.items.map(line => { const p = state.products.find(p => p.id === line.slug); return `<div class="work-line">${p ? `<img src="${e(p.image)}" alt="${e(p.imageAlt)}" width="64" height="64">` : ''}<div><strong>${e(p?.name || line.slug)}</strong><p>${e(line.pack || p?.pack || '')} · ${line.quantity} pack${line.quantity === 1 ? '' : 's'}</p></div><span>${money((line.amount ?? p?.price ?? 0) * line.quantity)}</span></div>`; }).join('');

export function operationsPage(page, params, path) {
  let body;
  if (page.id === 'A02') {
    body = workHeader('Your growing business', 'The day, at a glance.', 'A considered place for your harvest, your kitchens and the work ahead.')
      + metrics([['Orders to prepare', state.orders.filter(o => o.status === 'Preparing').length, 'Sample work queue'], ['Products', state.products.length, 'Illustrative catalogue'], ['New enquiries', state.enquiries.filter(q => q.status === 'New').length, 'Sample kitchen conversations'], ['Illustrative sales', money(state.orders.reduce((n, o) => n + o.total, 0)), 'Fictional order totals']])
      + panel('On the table today', orderTable(), to('All orders', '/admin/orders'))
      + `<div class="work-columns">${panel('Keep the harvest moving', `<p>Review sample stock before preparing an order.</p>${to('Open inventory', '/admin/inventory')}`)}${panel('A kitchen is getting in touch', `<p>${e(state.enquiries[0]?.name || 'No enquiries')} · ${e(state.enquiries[0]?.produce || 'Your next conversation starts here.')}</p>${to('Open enquiries', '/admin/restaurant-supply')}`)}</div>`;
  } else if (page.id === 'A03') {
    body = workHeader('Orders', 'From harvest to handover.', 'Find an order, review its contents and follow the fulfilment steps.') + orderTable();
  } else if (page.id === 'A04') {
    const o = state.orders.find(o => o.id === params.orderId); if (!o) return null;
    const stages = ['Preparing', 'Ready', 'Out for delivery', 'Delivered'];
    body = back('Back to orders', '/admin/orders') + workHeader('Order detail', o.id, `${o.customer} · ${o.date}`, tag(o.status))
      + `<div class="work-grid"><div>${panel('The selection', orderItems(o))}${panel('Payment & delivery', definition([['Payment', o.payment], ['Delivery address', o.address], ['Illustrative total', money(o.total)]]))}</div><div>${panel('Follow the order', o.status === 'Cancelled' ? '<p>This sample order is cancelled. No further fulfilment step is scheduled.</p>' : `<ol class="work-step-list">${stages.map((stage, i) => `<li data-complete="${i <= stages.indexOf(o.status)}"><strong>${e(stage)}</strong><p>${i === stages.indexOf(o.status) ? 'Current sample step' : i < stages.indexOf(o.status) ? 'Completed in this preview' : 'Next in the workflow'}</p></li>`).join('')}</ol>`)}${panel('Update fulfilment', workForm('order', hiddenId(o.id) + field('status', 'Order status', o.status, { choices: [...stages, 'Cancelled'] }), 'Update sample order'))}</div></div>`;
  } else if (page.id === 'A05') {
    body = workHeader('Your catalogue', 'Make room for a harvest.', 'Manage the details that help a kitchen choose with confidence.', link('Add a product', '/admin/products/new')) + productTable();
  } else if (page.id === 'A06') {
    const creating = path.endsWith('/new'); const p = creating ? {} : state.products.find(p => p.id === params.productId); if (!p) return null;
    body = back('Back to products', '/admin/products') + workHeader('Product editor', creating ? 'Introduce a new harvest.' : p.name, 'Keep the name, pack and availability clear. Prices here are illustrative.')
      + `<div class="work-grid">${panel('The product', workForm('product', hiddenId(p.id || '') + field('name', 'Product name', p.name, { required: true }) + field('description', 'Description', p.description || '', { type: 'textarea' }) + `<div class="work-form-grid">${field('category', 'Category', p.category || 'mushrooms', { choices: categories.map(c => c.slug) })}${field('pack', 'Sample pack size', p.pack || '', { required: true })}${field('price', 'Illustrative price (₹)', p.price || 0, { type: 'number', required: true })}${field('stock', 'Sample stock (packs)', p.stock || 0, { type: 'number', required: true })}</div>` + field('status', 'Publishing state', p.status || 'Draft', { choices: ['Draft', 'Published', 'Archived'] }), 'Save product'))}${panel('A clear first impression', p.image ? `<img src="${e(p.image)}" alt="${e(p.imageAlt)}" width="640" height="480" style="border-radius:var(--radius-card)"><p style="margin-top:16px">Use an honest photograph of the produce. Publishing in this workspace changes the sample record only.</p>` : '<p>The product starts as a draft. Choose its approved photograph when the real media workflow is connected.</p>')}</div>`;
  } else if (page.id === 'A07') {
    body = workHeader('Categories', 'A place for every harvest.', 'Organise the catalogue around the way your customers browse.', action('Add a category', 'new-category'))
      + table(['Category', 'Description', 'Status', ''], state.categories.map(c => ({ status: c.status, cells: [e(c.name), `<span class="work-small">${e(c.description)}</span>`, tag(c.status), action('Edit', 'edit-category', c.id)] })), { search: 'Find a category', statuses: ['Draft', 'Published'] });
  } else if (page.id === 'A08') {
    body = workHeader('Inventory', 'Know what is ready.', 'Review sample quantities and record why a stock figure changes.')
      + table(['Product', 'Pack', 'Sample stock', ''], state.products.map(p => ({ cells: [e(p.name), e(p.pack), `${p.stock} packs`, action('Adjust stock', 'stock', p.id)] })), { search: 'Find produce' })
      + panel('The stock notebook', state.inventoryLog.length ? `<ul>${state.inventoryLog.map(l => `<li>${e(l)}</li>`).join('')}</ul>` : '<p>No adjustments yet. Every change needs a reason so the record remains understandable.</p>');
  } else if (page.id === 'A09') {
    body = workHeader('Customers', 'The people at the table.', 'Review sample customer details and their order context.')
      + table(['Name', 'Email', 'Status', ''], state.customers.map(c => ({ status: c.status, cells: [e(c.name), e(c.email), tag(c.status), to('View customer', `/admin/customers/${c.id}`)] })), { search: 'Find a customer', statuses: ['Active', 'Inactive'] });
  } else if (page.id === 'A10') {
    const c = state.customers.find(c => c.id === params.customerId); if (!c) return null;
    body = back('Back to customers', '/admin/customers') + workHeader('Customer detail', c.name, 'A fictional customer record for reviewing the service experience.', action('Edit details', 'customer', c.id))
      + `<div class="work-grid">${panel('The essentials', definition([['Name', c.name], ['Email', c.email], ['Phone', c.phone || 'Not added'], ['Account', c.status]]))}${panel('Order context', `<p>${state.orders.filter(o => o.customerId === c.id).length} sample orders</p><p>Customer records in this workspace are fictional.</p>${to('Review orders', '/admin/orders')}`)}</div>`;
  } else if (page.id === 'A11') {
    body = workHeader('Restaurant supply', 'Good conversations grow.', 'Keep each kitchen’s produce needs, timing and next step together.')
      + table(['Kitchen', 'Produce', 'Schedule', 'Stage', ''], state.enquiries.map(q => ({ status: q.status, cells: [e(q.name), e(q.produce), e(q.frequency), tag(q.status), action('Review enquiry', 'enquiry', q.id)] })), { search: 'Find a kitchen', statuses: ['New', 'Discussing', 'Agreed', 'Closed'] })
      + panel('From conversation to arrangement', '<p>New → Discussing → Agreed. An agreed sample record represents a reviewed workflow, not a confirmed real supply arrangement.</p>');
  } else if (page.id === 'A12') {
    body = workHeader('Promotions', 'A thoughtful invitation.', 'Prepare sample offers without changing real catalogue prices.', action('Add promotion', 'new-promotion'))
      + table(['Name', 'Code', 'Sample discount', 'Status', ''], state.promotions.map(p => ({ status: p.status, cells: [e(p.name), e(p.code), `${p.discount}%`, tag(p.status), action('Edit', 'promotion', p.id)] })), { search: 'Find a promotion', statuses: ['Draft', 'Active', 'Ended'] });
  } else if (page.id === 'A13') {
    body = workHeader('Delivery settings', 'Plan the last few miles.', 'Review fictional zones and charges before designing the real service rules.', action('Add a zone', 'new-zone'))
      + table(['Zone', 'Sample PINs', 'Illustrative fee', 'Status', ''], state.zones.map(z => ({ status: z.status, cells: [e(z.name), e(z.pins), money(z.fee), tag(z.status), action('Edit', 'zone', z.id)] })), { search: 'Find a zone', statuses: ['Draft', 'Active', 'Paused'] })
      + panel('Before delivery opens', '<p>Actual coverage, charges, cut-off times and delivery slots need the business’s confirmed operating rules. These sample zones do not establish service availability.</p>');
  } else if (page.id === 'A14') {
    const total = state.orders.reduce((n, o) => n + o.total, 0);
    body = workHeader('Reports', 'See how the harvest moves.', 'An overview of fictional orders and product quantities.', action('Export sample CSV', 'export'))
      + metrics([['Sample order total', money(total), 'Not real revenue'], ['Orders', state.orders.length, 'Sample records'], ['Average sample order', money(state.orders.length ? total / state.orders.length : 0), 'Illustrative value'], ['Units in sample stock', state.products.reduce((n, p) => n + p.stock, 0), 'Fictional inventory']])
      + `<div class="work-columns">${panel('Sample orders by day', '<div class="work-report-chart" role="img" aria-label="Fictional daily order counts: Monday 1, Tuesday 2, Wednesday 1, Thursday 3, Friday 2"><div><span style="--bar:30%"></span><small>Mon · 1</small></div><div><span style="--bar:60%"></span><small>Tue · 2</small></div><div><span style="--bar:30%"></span><small>Wed · 1</small></div><div><span style="--bar:90%"></span><small>Thu · 3</small></div><div><span style="--bar:60%"></span><small>Fri · 2</small></div></div><p>This chart demonstrates presentation with a separate fictional series.</p>')}${panel('The current selection', state.products.map(p => `<div class="work-line"><div><strong>${e(p.name)}</strong><p>${p.stock} sample packs in stock</p></div></div>`).join(''))}</div>`;
  } else if (page.id === 'A15') {
    body = workHeader('General settings', 'Keep the essentials together.', 'Manage the sample business contact and store state.')
      + `<div class="work-grid">${panel('Business details', workForm('settings', field('name', 'Business name', state.settings.name, { required: true }) + field('email', 'Contact email', state.settings.email, { required: true, type: 'email' }) + field('phone', 'Contact phone', state.settings.phone, { type: 'tel' }) + field('ordering', 'Store state', state.settings.ordering, { choices: ['Closed', 'Preview only'] })))}${panel('Staff access', '<p>Roles and permissions must be managed through verified staff identities when the authentication service is connected. This preview cannot grant real access.</p>')}</div>`;
  } else return null;
  return `<div class="work-page" data-workspace data-workspace-kind="operations"><p class="work-status" role="status" aria-live="polite"></p>${body}${demoNote()}</div>`;
}
