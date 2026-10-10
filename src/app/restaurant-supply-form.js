import { businessContact } from '../content/contact.js';
import { supplyProduce, supplyFrequency } from '../content/restaurant-supply.js';

// Build a reviewable email draft locally; no submission or persistent storage.
export function setupRestaurantSupplyForm(root, motion) {
  const form = root.querySelector('#supply-form');
  if (!form) return () => {};
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const panel = root.querySelector('.supply-form-panel');
  const draft = root.querySelector('#supply-email-draft');
  const bodyElement = root.querySelector('#supply-draft-body');
  const openDraft = root.querySelector('#supply-open-draft');
  const feedback = root.querySelector('#supply-feedback');
  const interests = [...form.querySelectorAll('[name="interest"]')];
  const field = name => form.elements.namedItem(name);
  const value = name => field(name).value.trim();
  const selected = id => interests.some(item => item.value === id && item.checked);
  const changeLayout = change => motion ? motion.changeLayout(panel, change) : change();

  function discardDraft() {
    draft.hidden = true;
    openDraft.removeAttribute('href');
    bodyElement.textContent = '';
    feedback.textContent = '';
  }

  function setError(name, message) {
    const targets = name === 'interest' ? interests : [field(name)];
    targets.forEach(target => {
      if (message) target.setAttribute('aria-invalid', 'true');
      else target.removeAttribute('aria-invalid');
    });
    const error = root.querySelector(`#supply-${name}-error`);
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
  }

  function updateProduce() {
    supplyProduce.forEach(item => {
      const active = selected(item.id);
      root.querySelector(`#supply-quantity-${item.id}`).hidden = !active;
      field(`amount-${item.id}`).disabled = !active;
    });
    const other = selected('other');
    root.querySelector('#supply-other-request').hidden = !other;
    field('other').disabled = !other;
    field('other').required = other;
    if (!other) setError('other', '');
  }

  form.hidden = false;
  // Accommodate browser-restored checkbox values on initialisation.
  updateProduce();
  form.addEventListener('input', event => changeLayout(() => {
    discardDraft();
    setError(event.target.name, '');
    if (['email', 'phone'].includes(event.target.name)) {
      setError('email', '');
      setError('phone', '');
    }
  }), options);
  form.addEventListener('change', event => changeLayout(() => {
    discardDraft();
    setError(event.target.name, '');
    if (event.target.name === 'interest') updateProduce();
  }), options);

  form.addEventListener('submit', event => {
    event.preventDefault();
    let focusTarget;
    changeLayout(() => {
      discardDraft();
      const errors = new Map();
      if (!value('business')) errors.set('business', 'Enter your restaurant or business name.');
      if (!value('city')) errors.set('city', 'Enter your kitchen’s city.');
      if (value('pin') && !/^[1-9][0-9]{5}$/.test(value('pin'))) errors.set('pin', 'Enter a valid six-digit PIN code, or leave it blank.');
      if (!interests.some(item => item.checked)) errors.set('interest', 'Choose at least one produce interest.');
      if (selected('other') && !value('other')) errors.set('other', 'Describe the other produce you’re interested in.');
      if (!value('name')) errors.set('name', 'Enter the contact person’s name.');
      if (!value('email') && !value('phone')) errors.set('email', 'Provide an email address or a phone number.');
      if (value('email') && !field('email').validity.valid) errors.set('email', 'Enter a valid email address.');
      const phone = value('phone');
      const digits = phone.replace(/\D/g, '');
      if (phone && (!/^[+\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) errors.set('phone', 'Enter a phone number with 7–15 digits.');
      ['business', 'city', 'pin', 'interest', 'other', 'name', 'email', 'phone'].forEach(name => setError(name, errors.get(name) ?? ''));
      if (errors.size) {
        feedback.textContent = 'Please check the highlighted fields.';
        const first = errors.keys().next().value;
        focusTarget = first === 'interest' ? interests[0] : field(first);
        return;
      }

      const produce = supplyProduce.filter(item => selected(item.id)).map(item => {
        const amount = value(`amount-${item.id}`);
        return `- ${item.name}: ${amount || 'Quantity to discuss'}`;
      });
      if (selected('other')) produce.push(`- Another produce request: ${value('other')}`);
      const frequency = supplyFrequency.find(item => item.id === value('frequency')) ?? supplyFrequency[0];
      const body = [
        'RESTAURANT SUPPLY ENQUIRY', '',
        'YOUR KITCHEN', `Restaurant / business: ${value('business')}`, `City: ${value('city')}`,
        ...(value('pin') ? [`PIN code: ${value('pin')}`] : []), '',
        'YOUR PRODUCE', ...produce, `Preferred frequency: ${frequency.label}`, '',
        'YOUR CONTACT', `Contact person: ${value('name')}`,
        ...(value('email') ? [`Email: ${value('email')}`] : []),
        ...(phone ? [`Phone: ${phone}`] : []),
        ...(value('notes') ? ['', 'ADDITIONAL NOTES', value('notes')] : []),
      ].join('\n');
      bodyElement.textContent = body;
      openDraft.href = `mailto:${businessContact.email}?subject=${encodeURIComponent('Restaurant supply enquiry')}&body=${encodeURIComponent(body)}`;
      draft.hidden = false;
      focusTarget = draft;
      motion?.reveal(draft);
    });
    focusTarget?.focus({ preventScroll: true });
    focusTarget?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, options);
  return () => controller.abort();
}
