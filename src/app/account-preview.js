import { sampleAccount, resetSampleAccount } from '../content/sample-account.js';
import { accountViews, addressRows } from '../pages/account-preview.js';
import { escapeHtml } from '../components/primitives.js';
import { mountHtml } from './hosting.js';
import { setupAccountEditorModal } from './account-editor-modal.js';

export function setupAccountPreview(root, motion, scroller) {
  const workspace = root.querySelector('[data-account-preview]');
  if (!workspace) return () => {};
  const assumedSignedIn = workspace.dataset.accountAssumedSession === 'true';
  const copy = (review, signedIn) => assumedSignedIn ? signedIn : review;
  const controller = new AbortController();
  const content = workspace.querySelector('.account-content');
  const feedback = workspace.querySelector('.account-feedback');
  const profileEditor = workspace.querySelector('[data-profile-editor]');
  const addressEditor = workspace.querySelector('[data-address-editor]');
  const profileForm = workspace.querySelector('[data-account-form="profile"]');
  const addressForm = workspace.querySelector('[data-account-form="address"]');
  let editingAddress = null;
  let editReturnSelector = '[data-account-action="add-address"]';
  let currentView = Object.hasOwn(accountViews, workspace.dataset.accountInitialView) ? workspace.dataset.accountInitialView : 'overview';
  addressEditor.querySelector('h2')?.remove();
  const editorModal = setupAccountEditorModal(workspace, scroller, {
    onDismiss: () => settleEdit(copy('Unsaved sample changes discarded.', 'Unsaved changes discarded.'), editReturnSelector),
  });

  function focusInView(element) {
    if (!element) return;
    element.focus({ preventScroll: true });
    const rect = element.getBoundingClientRect();
    const topInset = (root.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0) + 20;
    const adjustment = rect.top < topInset ? rect.top - topInset : rect.bottom > innerHeight - 24 ? rect.bottom - innerHeight + 24 : 0;
    if (adjustment) {
      scroller.refresh();
      scroller.toPosition(window.scrollY + adjustment);
    }
  }

  function announce(message) { feedback.textContent = message; }
  function paint() {
    const profile = sampleAccount.profile;
    workspace.querySelectorAll('[data-account-name]').forEach(node => { node.textContent = profile.name; });
    workspace.querySelectorAll('[data-account-email]').forEach(node => { node.textContent = profile.email; });
    workspace.querySelector('[data-account-phone]').textContent = profile.phone || 'Not added';
    workspace.querySelector('[data-account-greeting]').textContent = currentView === 'overview' ? `Good to see you, ${profile.name.split(/\s+/)[0]}` : 'Your account';
    workspace.querySelector('[data-account-addresses]').innerHTML = mountHtml(addressRows());
    workspace.querySelectorAll('[data-account-action="edit-profile"], [data-account-action="edit-address"], [data-account-action="add-address"]').forEach(button => {
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', 'account-edit-modal');
      button.setAttribute('aria-expanded', 'false');
    });
    const address = sampleAccount.addresses.find(item => item.isDefault);
    workspace.querySelector('[data-account-default-address]').innerHTML = address
      ? `<p class="account-address-label">${escapeHtml(address.label)} <span class="account-tag">Default</span></p><p>${escapeHtml(address.recipient)}</p><p class="muted">${escapeHtml(address.line)}<br>${escapeHtml(address.city)} · ${escapeHtml(address.postal)}</p>`
      : '<p class="muted">No default address yet. Add an address under Saved places.</p>';
  }
  function closeEditors() {
    editorModal.close({ immediate: true, restoreFocus: false });
    profileEditor.hidden = true;
    addressEditor.hidden = true;
    workspace.querySelectorAll('[data-account-action="edit-profile"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    workspace.querySelector('[data-account-action="add-address"]').setAttribute('aria-expanded', 'false');
    workspace.querySelectorAll('[data-account-action="edit-address"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    editingAddress = null;
  }
  function switchView(view) {
    if (!Object.hasOwn(accountViews, view)) return;
    currentView = view;
    motion.changeLayout(content, () => {
      closeEditors();
      workspace.querySelectorAll('[data-order-id]').forEach(order => { order.hidden = false; });
      workspace.querySelector('.account-order-back')?.remove();
      workspace.querySelectorAll('[data-account-panel]').forEach(panel => { panel.hidden = panel.dataset.accountPanel !== view; });
      workspace.querySelectorAll('.account-sidebar [data-account-target]').forEach(button => {
        if (button.dataset.accountTarget === view) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      workspace.querySelector('#sample-account-heading').textContent = accountViews[view][0];
      workspace.querySelector('[data-account-description]').textContent = accountViews[view][1];
      announce('');
      paint();
    });
    motion.reveal(workspace.querySelector(`[data-account-panel="${view}"]`));
    focusInView(workspace.querySelector('#sample-account-heading'));
  }
  function beginEdit(kind, button, address = null) {
    const form = kind === 'profile' ? profileForm : addressForm;
    if (!editorModal.isOpen()) closeEditors();
    profileEditor.hidden = true;
    addressEditor.hidden = true;
    editingAddress = address?.id ?? null;
    editReturnSelector = kind === 'profile'
      ? `[data-account-panel="${currentView}"] [data-account-action="edit-profile"]`
      : address ? `[data-address-id="${CSS.escape(address.id)}"] [data-account-action="edit-address"]` : '[data-account-action="add-address"]';
    const values = kind === 'profile' ? sampleAccount.profile : address || { label: '', recipient: sampleAccount.profile.name, line: '', city: '', postal: '' };
    for (const input of form.querySelectorAll('input')) {
      input.value = values[input.name] || '';
      input.setCustomValidity('');
    }
    const title = kind === 'profile' ? 'Edit your details' : address ? copy('Edit sample address', 'Edit address') : copy('Add a sample address', 'Add an address');
    announce('');
    editorModal.open(kind === 'profile' ? profileEditor : addressEditor, title, button);
  }
  function settleEdit(message, focusSelector) {
    const wasModal = editorModal.isOpen();
    editorModal.close({ restoreFocus: false, afterClose: () => {
      motion.changeLayout(content, () => { closeEditors(); paint(); announce(message); });
      const target = workspace.querySelector(focusSelector);
      if (wasModal) target?.focus({ preventScroll: true });
      else focusInView(target);
    } });
  }
  workspace.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !workspace.contains(button)) return;
    if (button.dataset.accountTarget) { switchView(button.dataset.accountTarget); return; }
    const action = button.dataset.accountAction;
    const address = sampleAccount.addresses.find(item => item.id === button.closest('[data-address-id]')?.dataset.addressId);
    if (action === 'view-latest') {
      switchView('orders');
      const details = workspace.querySelector('[data-order-id]');
      if (details.dataset.expanded !== 'true') details.querySelector('summary').click();
    } else if (action === 'edit-profile') beginEdit('profile', button);
    else if (action === 'add-address') beginEdit('address', button);
    else if (action === 'edit-address' && address) beginEdit('address', button, address);
    else if (action === 'cancel-edit') {
      settleEdit(copy('Unsaved sample changes discarded.', 'Unsaved changes discarded.'), editReturnSelector);
    } else if (action === 'default-address' && address) {
      sampleAccount.addresses.forEach(item => { item.isDefault = item === address; });
      settleEdit(copy(`${address.label} is now the sample default address.`, `${address.label} is now your default address.`), `[data-address-id="${address.id}"] [data-account-action="edit-address"]`);
    } else if (action === 'remove-address' && address) {
      sampleAccount.addresses = sampleAccount.addresses.filter(item => item !== address);
      if (address.isDefault && sampleAccount.addresses.length) sampleAccount.addresses[0].isDefault = true;
      settleEdit(copy('Sample address removed.', 'Address removed.'), '[data-account-action="add-address"]');
    } else if (action === 'reset') {
      resetSampleAccount();
      settleEdit('Sample data reset.', '[data-account-action="reset"]');
    }
  }, { signal: controller.signal });
  workspace.addEventListener('input', event => { if (event.target.matches('input')) event.target.setCustomValidity(''); }, { signal: controller.signal });
  workspace.addEventListener('submit', event => {
    const form = event.target.closest('[data-account-form]');
    if (!form) return;
    event.preventDefault();
    for (const input of form.querySelectorAll('input')) {
      input.setCustomValidity(input.required && !input.value.trim() ? 'Please enter a value.' : '');
    }
    if (!form.reportValidity()) return;
    const values = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
    if (form.dataset.accountForm === 'profile') {
      Object.assign(sampleAccount.profile, values);
      settleEdit(copy('Sample profile updated. Nothing was sent or saved.', 'Details updated for this preview.'), editReturnSelector);
    } else {
      const existing = sampleAccount.addresses.find(item => item.id === editingAddress);
      if (existing) Object.assign(existing, values);
      else sampleAccount.addresses.push({ ...values, id: `sample-${crypto.randomUUID()}`, isDefault: sampleAccount.addresses.length === 0 });
      settleEdit(copy('Sample address updated. Nothing was sent or saved.', 'Address updated for this preview.'), editReturnSelector);
    }
  }, { signal: controller.signal });
  workspace.querySelectorAll('[data-account-panel]').forEach(panel => { panel.hidden = panel.dataset.accountPanel !== currentView; });
  workspace.querySelectorAll('.account-sidebar [data-account-target]').forEach(button => {
    if (button.dataset.accountTarget === currentView) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  workspace.querySelector('#sample-account-heading').textContent = workspace.dataset.accountOrder ? `Order ${workspace.dataset.accountOrder}.` : accountViews[currentView][0];
  workspace.querySelector('[data-account-description]').textContent = workspace.dataset.accountOrder ? 'The selection, delivery details and journey of this sample order.' : accountViews[currentView][1];
  paint();
  const initialOrder = workspace.dataset.accountOrder;
  if (initialOrder) {
    const order = [...workspace.querySelectorAll('[data-order-id]')].find(order => order.dataset.orderId === initialOrder);
    if (order && !order.open) order.querySelector('summary').click();
  }
  return () => { editorModal.dispose(); controller.abort(); };
}
