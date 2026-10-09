import { businessContact } from '../content/contact.js';
import { enquiryTopics } from '../content/enquiries.js';

// Local draft only. No network submission or persistent storage.
export function setupContactForm(root, motion) {
  const form = root.querySelector('#contact-form');
  if (!form) return () => {};
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const draft = root.querySelector('#contact-email-draft');
  const feedback = root.querySelector('#contact-feedback');
  const email = form.elements.email;
  const message = form.elements.message;
  const panel = root.querySelector('.contact-draft-section');
  const changeLayout = change => motion ? motion.changeLayout(panel, change) : change();
  const topic = () => enquiryTopics.find(t => t.id === form.elements.topic.value) ?? enquiryTopics[0];
  const hideDraft = () => {
    draft.hidden = true;
    root.querySelector('#contact-open-draft').removeAttribute('href');
    root.querySelector('#contact-draft-body').textContent = '';
  };
  function setError(field, error) {
    const label = root.querySelector(`#${field.id}-error`);
    if (error) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    label.textContent = error;
    label.hidden = !error;
  }
  function updateTopic() {
    root.querySelector('#contact-message-hint').textContent = topic().guidance;
    hideDraft();
  }
  form.hidden = false;
  form.addEventListener('input', event => {
    changeLayout(() => {
      hideDraft();
      feedback.textContent = '';
      if (event.target === email || event.target === message) setError(event.target, '');
    });
  }, options);
  form.addEventListener('change', () => changeLayout(updateTopic), options);
  form.addEventListener('submit', event => {
    event.preventDefault();
    let focusTarget;
    changeLayout(() => {
      hideDraft();
      const emailError = email.value.trim() && email.validity.valid ? '' : 'Enter a valid email address.';
      const messageError = message.value.trim() ? '' : 'Add a message for WeGroween.';
      setError(email, emailError);
      setError(message, messageError);
      if (emailError || messageError) {
        feedback.textContent = 'Please check the highlighted fields.';
        focusTarget = emailError ? email : message;
        return;
      }
      feedback.textContent = '';
      const name = form.elements.name.value.trim();
      const body = `${name ? `Name: ${name}\n` : ''}Reply email: ${email.value.trim()}\n\n${message.value.trim()}`;
      root.querySelector('#contact-draft-subject').textContent = topic().subject;
      root.querySelector('#contact-draft-body').textContent = body;
      root.querySelector('#contact-open-draft').href = `mailto:${businessContact.email}?subject=${encodeURIComponent(topic().subject)}&body=${encodeURIComponent(body)}`;
      draft.hidden = false;
      focusTarget = draft;
      motion?.reveal(draft);
    });
    focusTarget?.focus({ preventScroll: true });
    if (focusTarget) focusTarget.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, options);
  return () => controller.abort();
}
