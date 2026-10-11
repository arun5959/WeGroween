import { developmentWorkspace as state } from '../content/development-workspace.js';
import { sampleAccount } from '../content/sample-account.js';
import { workField as field, saveActions } from '../components/workspace.js';
import { escapeHtml as e } from '../components/primitives.js';
import { setupAccountEditorModal } from './account-editor-modal.js';
import { setupBrandedSelects } from './branded-select.js';
import { siteUrl, mountHtml } from './hosting.js';

export function setupWorkspaceInteractions(root, { scroller, refresh, navigate }) {
  const workspace = root.querySelector('[data-workspace]');
  if (!workspace) return () => {};
  const controller = new AbortController(), events = { signal: controller.signal };
  let modal, modalEditor, modalSelects = () => {}, modalAction = '', modalId = '', modalTriggerAction = '';
  const notify = text => { const node = root.querySelector('.work-status'); if (node) node.textContent = text; };
  function addSelection(id, quantity, { feedback = false, trigger = null } = {}) {
    const product = state.products.find(p => p.id === id);
    if (!product) return false;
    const line = state.basket.find(l => l.id === id);
    const before = line?.quantity || 0;
    if (line) line.quantity = Math.min(20, line.quantity + quantity);
    else state.basket.push({ id, quantity });
    document.dispatchEvent(new CustomEvent('wg:basket-changed'));
    if (feedback) document.dispatchEvent(new CustomEvent('wg:cart-added', { detail: { productName: product.name, added: Math.min(20, before + quantity) - before, trigger } }));
    return true;
  }
  function repaint(text, selector) {
    const checkout = root.querySelector('[data-work-form="checkout"]');
    const draft = checkout ? [...new FormData(checkout)] : [];
    const activeId = document.activeElement?.id;
    refresh();
    draft.forEach(([name, value]) => {
      root.querySelectorAll(`[data-work-form="checkout"] [name="${CSS.escape(name)}"]`).forEach(input => {
        if (input.type === 'radio') input.checked = input.value === value;
        else input.value = value;
      });
    });
    root.querySelector('.work-status')?.replaceChildren(document.createTextNode(text));
    root.querySelector(selector || (activeId ? `#${CSS.escape(activeId)}` : '.work-header h1'))?.focus({ preventScroll: true });
  }
  function filter() {
    const query = (workspace.querySelector('[data-work-filter]')?.value || '').trim().toLocaleLowerCase();
    const status = workspace.querySelector('[name="status-filter"]')?.value || 'All statuses';
    let count = 0;
    workspace.querySelectorAll('[data-work-row]').forEach(row => {
      row.hidden = !row.textContent.toLocaleLowerCase().includes(query) || (status !== 'All statuses' && row.dataset.status !== status);
      if (!row.hidden) count++;
    });
    const label = workspace.querySelector('[data-work-count]'); if (label) label.textContent = `${count} matching record${count === 1 ? '' : 's'}`;
    const empty = workspace.querySelector('[data-work-empty]'); if (empty) empty.hidden = count > 0;
  }
  workspace.addEventListener('input', filter, events);
  workspace.addEventListener('change', filter, events);
  const schemas = {
    category: ['categories', [['name', 'Category name', { required: true }], ['description', 'Description', { type: 'textarea' }], ['status', 'State', { choices: ['Draft', 'Published'] }]]],
    customer: ['customers', [['name', 'Full name', { required: true }], ['email', 'Email', { type: 'email', required: true }], ['phone', 'Phone (optional)', { type: 'tel' }], ['status', 'State', { choices: ['Active', 'Inactive'] }]]],
    enquiry: ['enquiries', [['name', 'Kitchen', { required: true }], ['contact', 'Contact person', { required: true }], ['email', 'Email', { type: 'email', required: true }], ['produce', 'Produce requirements', { required: true }], ['frequency', 'Schedule', { choices: ['Still exploring', 'One-off', 'Weekly', 'To discuss'] }], ['status', 'Conversation stage', { choices: ['New', 'Discussing', 'Agreed', 'Closed'] }]]],
    promotion: ['promotions', [['name', 'Promotion name', { required: true }], ['code', 'Sample code', { required: true }], ['discount', 'Illustrative discount (%)', { type: 'number', required: true }], ['status', 'State', { choices: ['Draft', 'Active', 'Ended'] }]]],
    zone: ['zones', [['name', 'Zone name', { required: true }], ['pins', 'Sample PIN codes', { required: true }], ['fee', 'Illustrative delivery fee (₹)', { type: 'number', required: true }], ['status', 'State', { choices: ['Draft', 'Active', 'Paused'] }]]],
  };
  function dismiss() { modalSelects(); modalSelects = () => {}; modal?.close(); }
  function openEditor(button, kind, id) {
    if (!modal) {
      modalEditor = document.createElement('section'); modalEditor.className = 'account-editor'; modalEditor.hidden = true; workspace.append(modalEditor);
      modal = setupAccountEditorModal(workspace, scroller, { onDismiss: dismiss, eyebrow: 'Operations', description: 'Edit the fictional record below. Changes reset on reload.' });
    }
    modalAction = kind; modalId = id; modalTriggerAction = button.dataset.workAction; modalSelects();
    const schema = schemas[kind];
    const record = kind === 'stock' ? state.products.find(p => p.id === id) : state[schema[0]].find(r => r.id === id) || {};
    const fields = kind === 'stock' ? [['stock', 'New sample stock (packs)', { type: 'number', required: true }], ['reason', 'Reason for the adjustment', { type: 'textarea', required: true }]] : schema[1];
    modalEditor.innerHTML = mountHtml(`<form class="work-form" data-work-form="modal">${fields.map(([name, label, options]) => field(name, label, record[name] ?? '', options)).join('')}${saveActions()}</form>`);
    modal.open(modalEditor, kind === 'stock' ? 'Adjust sample stock' : `${id ? 'Edit' : 'Add'} ${kind}`, button);
    modalSelects = setupBrandedSelects(modalEditor);
  }
  root.addEventListener('click', event => {
    const card = !event.target.closest('a, button, input, select, textarea, [contenteditable]') ? event.target.closest('[data-product-card]') : null;
    if (card) {
      if (!window.getSelection().isCollapsed || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const details = card.querySelector('h3 a[href]');
      if (details) navigate(new URL(details.href));
      return;
    }
    // Browsing details is public; purchasing and editing remain preview-only.
    if (!import.meta.env.DEV) return;
    const close = event.target.closest('[data-work-close], [data-account-action="cancel-edit"]'); if (close) { dismiss(); return; }
    const button = event.target.closest('[data-work-action]');
    if (!button) return;
    const type = button.dataset.workAction, id = button.dataset.record;
    if (type === 'card-buy' || type === 'card-add') {
      if (!addSelection(id, 1, { feedback: type === 'card-add', trigger: button })) return;
      if (type === 'card-buy') navigate(new URL(siteUrl('/checkout'), location.href));
    } else if (type === 'seed-basket') {
      state.basket = state.products.slice(0, 2).map(p => ({ id: p.id, quantity: 1 }));
      document.dispatchEvent(new CustomEvent('wg:basket-changed')); repaint('Sample selection loaded.');
    } else if (type === 'export') {
      const cell = value => { let text = String(value); if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; };
      const csv = [['Sample order', 'Customer', 'Date', 'Status', 'Illustrative total'], ...state.orders.map(o => [o.id, o.customer, o.date, o.status, o.total])].map(row => row.map(cell).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'wegroween-sample-orders.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); notify('Sample CSV exported.');
    } else {
      const kind = type.replace(/^(new-|edit-)/, ''); if (schemas[kind] || kind === 'stock') openEditor(button, kind, id);
    }
  }, events);
  root.addEventListener('submit', event => {
    const form = event.target.closest('[data-work-form]'); if (!form) return;
    event.preventDefault();
    // Delivery is paused: block Enter and programmatic submissions as well as the button.
    if (form.dataset.workForm === 'checkout') { notify('We’re not currently delivering. Orders are unavailable.'); return; }
    if (!import.meta.env.DEV) return;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => input.setCustomValidity(input.value.trim() ? '' : 'Please enter a value.'));
    if (!form.reportValidity()) return;
    const data = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));
    const kind = form.dataset.workForm;
    if (kind === 'basket') {
      const quantity = Number(data.quantity); const p = state.products.find(p => p.id === data.id);
      if (!p || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) { notify('Choose between 1 and 20 sample packs.'); return; }
      addSelection(p.id, quantity, { feedback: true, trigger: form.querySelector('button[type="submit"]') });
    } else if (kind === 'modal') {
      if (modalAction === 'promotion' && Number(data.discount) > 100) { form.querySelector('[name="discount"]').setCustomValidity('Use a value from 0 to 100.'); form.reportValidity(); return; }
      if (modalAction === 'stock') {
        const p = state.products.find(p => p.id === modalId); if (!p || !data.reason) return;
        state.inventoryLog.unshift(`${p.name}: ${p.stock} → ${Number(data.stock)} packs · ${data.reason}`); p.stock = Number(data.stock);
      } else {
        const collection = state[schemas[modalAction][0]], record = collection.find(r => r.id === modalId);
        if ('fee' in data) data.fee = Number(data.fee); if ('discount' in data) data.discount = Number(data.discount);
        if (record) Object.assign(record, data); else collection.push({ id: `sample-${modalAction}-${collection.length + 1}`, ...data });
      }
      modalSelects(); modalSelects = () => {};
      const focusSelector = `[data-work-action="${modalTriggerAction}"]${modalId ? `[data-record="${CSS.escape(modalId)}"]` : ''}`;
      modal.close({ restoreFocus: false, afterClose: () => repaint('Sample record updated.', focusSelector) });
    } else if (kind === 'product') {
      const p = state.products.find(p => p.id === data.id);
      const record = { ...data, price: Number(data.price), stock: Number(data.stock) };
      if (p) Object.assign(p, record); else { record.id = `sample-product-${state.products.length + 1}`; state.products.push(record); }
      navigate(new URL(siteUrl('/admin/products'), location.href));
    } else if (kind === 'order') {
      const order = state.orders.find(o => o.id === data.id); if (order) order.status = data.status;
      const customerOrder = sampleAccount.orders.find(o => o.id === data.id);
      if (customerOrder) { customerOrder.status = data.status; customerOrder.delivered = data.status === 'Delivered' ? 'Delivered in this local preview' : data.status === 'Cancelled' ? 'Cancelled in this local preview' : 'Awaiting delivery in this preview'; }
      repaint('Sample fulfilment updated.', '[data-work-form="order"] button[type="submit"]');
    } else if (kind === 'settings') { Object.assign(state.settings, data); notify('Sample settings updated. Public contact details were not changed.'); }
  }, events);
  root.addEventListener('input', event => { if (event.target.matches('input, textarea')) event.target.setCustomValidity(''); }, events);
  function basketClick(event) {
    if (!import.meta.env.DEV) return;
    const control = event.target.closest('[data-basket-change], [data-basket-remove]'); if (!control || !root.contains(control)) return;
    const id = control.dataset.basketRemove || control.dataset.product, line = state.basket.find(l => l.id === id); if (!line) return;
    if (control.dataset.basketRemove) state.basket = state.basket.filter(l => l.id !== id);
    else { line.quantity = Math.min(20, line.quantity + Number(control.dataset.basketChange)); if (line.quantity < 1) state.basket = state.basket.filter(l => l.id !== id); }
    document.dispatchEvent(new CustomEvent('wg:basket-changed'));
    const focusSelector = control.dataset.basketRemove || !state.basket.some(l => l.id === id)
      ? '[data-work-action="seed-basket"], .work-header h1'
      : `[data-product="${CSS.escape(id)}"][data-basket-change="${control.dataset.basketChange}"]`;
    repaint('Sample selection updated.', focusSelector);
  }
  root.addEventListener('click', basketClick, events);
  return () => { controller.abort(); modalSelects(); modal?.dispose(); };
}
