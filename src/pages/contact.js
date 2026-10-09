import { escapeHtml, link } from '../components/primitives.js';
import { icon } from '../components/icons.js';
import { businessContact } from '../content/contact.js';
import { contactCopy, enquiryTopics, contactFAQs } from '../content/enquiries.js';

export function contactPage() {
  return `<div class="container contact-page">
    <header class="contact-intro"><p class="eyebrow">Contact WeGroween</p><h1>${escapeHtml(contactCopy.title)}</h1><p class="lead">${escapeHtml(contactCopy.description)}</p></header>
    <div class="contact-enquiry-grid">
      <section class="contact-draft-section" aria-labelledby="contact-draft-title">
        <p class="eyebrow">A little context helps</p><h2 id="contact-draft-title">Write to WeGroween.</h2>
        <form id="contact-form" class="contact-draft-form" hidden novalidate>
          <div class="field"><label for="contact-name">Name <span class="contact-optional">(optional)</span></label><input id="contact-name" name="name" autocomplete="name" maxlength="120"></div>
          <div class="field"><label for="contact-email">Email address</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="contact-email-error"><p class="field-error" id="contact-email-error" hidden></p></div>
          <div class="field"><label for="contact-topic">What is your enquiry about?</label><select id="contact-topic" name="topic">${enquiryTopics.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="contact-message">Your message</label><textarea id="contact-message" name="message" rows="5" maxlength="3000" required aria-describedby="contact-message-hint contact-message-error"></textarea><p class="contact-field-hint" id="contact-message-hint">${escapeHtml(enquiryTopics[0].guidance)}</p><p class="field-error" id="contact-message-error" hidden></p></div>
          <p id="contact-feedback" class="contact-feedback" role="alert"></p>
          <button class="button" type="submit">Prepare email draft ${icon('arrow-right')}</button>
          <p class="contact-draft-note">Prepare a draft, then open it in your email app. You send it from there.</p>
        </form>
        <noscript><p>Contact WeGroween directly by email or phone. Preparing an email draft here requires JavaScript.</p><div class="action-row">${link('Email WeGroween', `mailto:${businessContact.email}`)}</div></noscript>
        <section id="contact-email-draft" class="contact-email-draft" aria-labelledby="contact-draft-subject" tabindex="-1" hidden><p class="eyebrow">Your email draft</p><h3 id="contact-draft-subject"></h3><pre id="contact-draft-body"></pre><a id="contact-open-draft" class="button">Open in your email app ${icon('arrow-right')}</a><p class="contact-draft-note">Your draft is ready. Nothing has been sent or saved by this website.</p></section>
      </section>
      <aside class="contact-sheet" aria-labelledby="contact-details-title"><p class="eyebrow">A direct conversation</p><h2 id="contact-details-title">Reach WeGroween.</h2>
        <address><a class="contact-method" href="mailto:${escapeHtml(businessContact.email)}">${icon('mail')}<span><small>Email</small><span>${escapeHtml(businessContact.email)}</span></span></a><a class="contact-method" href="${escapeHtml(businessContact.phoneHref)}">${icon('phone')}<span><small>Phone</small><span>${escapeHtml(businessContact.phone)}</span></span></a></address>
        <a class="contact-method" href="${escapeHtml(businessContact.instagram)}" target="_blank" rel="noopener noreferrer">${icon('instagram')}<span><small>Follow the growing</small><span>Instagram</span></span></a>
        <p class="contact-based">Based in ${escapeHtml(businessContact.location)}.</p><div class="contact-direct-action">${link('Email WeGroween', `mailto:${businessContact.email}`)}</div>
      </aside>
    </div>
    <section class="contact-faq" aria-labelledby="contact-faq-title"><header><p class="eyebrow">Frequently asked questions</p><h2 id="contact-faq-title">A few useful starting points.</h2><p>Find the details to include in your enquiry.</p><a class="text-link contact-catalogue-link" href="/shop"><span>Explore the catalogue</span>${icon('arrow-right')}</a></header>
      <div class="contact-questions">${contactFAQs.map(f => `<details><summary><span>${escapeHtml(f.question)}</span>${icon('plus')}</summary><div class="contact-answer"><p>${escapeHtml(f.answer)}</p></div></details>`).join('')}</div>
    </section>
  </div>`;
}
