import { icon } from '../components/icons.js';
import { mountHtml } from './hosting.js';

export function setupAccountEditorModal(workspace, scroller, { onDismiss, eyebrow = 'Your account', description = 'Update your details below.' }) {
  const dialog = document.createElement('dialog');
  dialog.className = 'account-edit-modal';
  dialog.id = 'account-edit-modal';
  dialog.setAttribute('aria-labelledby', 'account-edit-title');
  dialog.setAttribute('aria-describedby', 'account-edit-description');
  dialog.innerHTML = mountHtml(`<div class="account-edit-modal-shade"></div><div class="account-edit-modal-panel"><header class="account-edit-modal-header"><div><p class="eyebrow">Your account</p><h2 id="account-edit-title"></h2></div><button type="button" class="account-edit-close" aria-label="Close editor" data-account-action="cancel-edit">${icon('close')}</button></header><div class="account-edit-modal-body" data-lenis-prevent><p id="account-edit-description">Update your details below.</p></div></div>`);
  workspace.append(dialog);
  dialog.querySelector('.eyebrow').textContent = eyebrow;
  dialog.querySelector('#account-edit-description').textContent = description;
  const panel = dialog.querySelector('.account-edit-modal-panel');
  const shade = dialog.querySelector('.account-edit-modal-shade');
  const body = dialog.querySelector('.account-edit-modal-body');
  workspace.querySelectorAll('.account-editor').forEach(editor => body.append(editor));
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const options = { signal: events.signal };
  const tokens = getComputedStyle(document.documentElement);
  const timing = tokens.getPropertyValue('--motion-standard').trim();
  const duration = (parseFloat(timing) * (timing.endsWith('ms') ? 1 : 1000)) || 220;
  const easing = tokens.getPropertyValue('--motion-easing-standard').trim() || 'ease-out';
  let animations = [];
  let completion = null;
  let savedScrollStyles = null;
  let trigger = null;

  function stop() {
    animations.forEach(animation => animation.cancel());
    animations = [];
    completion = null;
  }
  function unlock() {
    if (!savedScrollStyles) return;
    Object.assign(document.body.style, savedScrollStyles);
    savedScrollStyles = null;
    scroller.resume();
  }
  function animate(open, finish) {
    const from = { opacity: getComputedStyle(panel).opacity, transform: getComputedStyle(panel).transform, shade: getComputedStyle(shade).opacity };
    const fresh = !dialog.open;
    stop();
    dialog.inert = false;
    if (fresh) {
      savedScrollStyles = { overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight };
      const width = document.documentElement.clientWidth;
      const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.overflow = 'hidden';
      scroller.pause();
      const gap = document.documentElement.clientWidth - width;
      if (gap) document.body.style.paddingRight = `${padding + gap}px`;
      dialog.showModal();
    }
    if (preference.matches) { finish(); return; }
    const movement = panel.animate([
      { opacity: fresh ? 0 : from.opacity, transform: fresh ? 'translateY(8px) scale(.98)' : from.transform },
      { opacity: open ? 1 : 0, transform: open ? 'translateY(0) scale(1)' : 'translateY(6px) scale(.98)' },
    ], { duration: open ? duration : 160, easing, fill: 'forwards' });
    const fade = shade.animate([{ opacity: fresh ? 0 : from.shade }, { opacity: open ? 1 : 0 }], { duration: open ? duration : 160, easing, fill: 'forwards' });
    animations = [movement, fade];
    completion = finish;
    movement.onfinish = () => {
      if (!animations.includes(movement)) return;
      stop();
      finish();
    };
  }
  function close({ immediate = false, restoreFocus = true, afterClose = () => {} } = {}) {
    const finish = () => {
      stop();
      if (dialog.open) dialog.close();
      dialog.inert = false;
      unlock();
      trigger?.setAttribute('aria-expanded', 'false');
      if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
      afterClose();
    };
    if (!dialog.open || immediate) finish();
    else { animate(false, finish); dialog.inert = true; }
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); event.stopPropagation(); onDismiss(); }, options);
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') event.stopPropagation();
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]')].filter(element => element.getClientRects().length && !element.closest('[hidden]'));
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }, options);
  let backdropPress = false;
  const isBackdrop = target => target === dialog || target === shade;
  dialog.addEventListener('pointerdown', event => { backdropPress = isBackdrop(event.target); }, options);
  dialog.addEventListener('click', event => {
    if (backdropPress && isBackdrop(event.target)) onDismiss();
    backdropPress = false;
  }, options);
  preference.addEventListener('change', () => {
    if (preference.matches && completion) { const finish = completion; stop(); finish(); }
  }, options);
  window.addEventListener('popstate', () => close({ immediate: true, restoreFocus: false }), { ...options, capture: true });
  return {
    open(editor, title, button) {
      trigger = button;
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-controls', dialog.id);
      trigger.setAttribute('aria-expanded', 'true');
      dialog.querySelector('#account-edit-title').textContent = title;
      editor.hidden = false;
      body.scrollTop = 0;
      animate(true, () => {});
      editor.querySelector('input')?.focus({ preventScroll: true });
    },
    close,
    isOpen: () => dialog.open,
    dispose() { close({ immediate: true, restoreFocus: false }); events.abort(); dialog.remove(); },
  };
}
