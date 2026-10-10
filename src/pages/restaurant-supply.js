import { escapeHtml, link } from '../components/primitives.js';
import { icon } from '../components/icons.js';
import { businessContact } from '../content/contact.js';
import { supplyCopy, supplyProduce, supplyFrequency, supplyFAQs } from '../content/restaurant-supply.js';
import { mediaAssets } from '../content/media.js';

const supplyPhotos = { hero: mediaAssets.supplyHero, mushrooms: mediaAssets.supplyMushrooms, microgreens: mediaAssets.supplyMicrogreens, 'growing-story': mediaAssets.supplyGrowing };
function photo(slot, className = '') {
  const asset = supplyPhotos[slot];
  const hero = slot === 'hero';
  const sizes = hero ? '(max-width: 900px) calc(100vw - 48px), (max-width: 1248px) 42vw, 536px' : '(max-width: 900px) calc(100vw - 48px), 564px';
  return `<figure class="supply-photo ${className}" data-supply-image="${slot}">${hero ? `<picture><source media="(max-width: 900px)" srcset="${mediaAssets.supplyHeroLandscape.srcSet}" sizes="calc(100vw - 48px)">` : ''}<img src="${asset.src}" srcset="${asset.srcSet}" sizes="${sizes}" width="${asset.width}" height="${asset.height}" alt="${escapeHtml(asset.alt)}" ${hero ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">${hero ? '</picture>' : ''}</figure>`;
}

function input(id, label, { type = 'text', required = false, autocomplete = '', maxlength = 120, attributes = '', hint = '' } = {}) {
  return `<div class="field"><label for="supply-${id}">${label}</label><input id="supply-${id}" name="${id}" type="${type}" maxlength="${maxlength}" ${required ? 'required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${attributes} aria-describedby="supply-${id}-error${hint ? ` supply-${id}-hint` : ''}">${hint ? `<p class="supply-hint" id="supply-${id}-hint">${hint}</p>` : ''}<p class="field-error" id="supply-${id}-error" hidden></p></div>`;
}

function enquiryForm() {
  return `<form id="supply-form" class="supply-form" hidden novalidate>
    <fieldset class="supply-fieldgroup"><legend>Your kitchen</legend><div class="supply-fieldgroup-body">
      ${input('business', 'Restaurant or business name', { required: true, autocomplete: 'organization' })}
      <div class="supply-field-row">${input('city', 'City', { required: true, autocomplete: 'address-level2' })}${input('pin', 'PIN code <span class="supply-optional">(optional)</span>', { autocomplete: 'postal-code', maxlength: 6, attributes: 'inputmode="numeric" pattern="[1-9][0-9]{5}"' })}</div>
    </div></fieldset>
    <fieldset class="supply-fieldgroup"><legend>Your produce</legend><div class="supply-fieldgroup-body"><p class="supply-hint">Select what you’re interested in. Approximate quantities are welcome.</p>
      <div class="supply-choices">${supplyProduce.map(item => `<label class="supply-choice" for="supply-interest-${item.id}"><input id="supply-interest-${item.id}" name="interest" type="checkbox" value="${item.id}" aria-controls="supply-quantity-${item.id}" aria-describedby="supply-interest-error"><span>${escapeHtml(item.name)}</span></label>`).join('')}<label class="supply-choice" for="supply-interest-other"><input id="supply-interest-other" name="interest" type="checkbox" value="other" aria-controls="supply-other-request" aria-describedby="supply-interest-error"><span>Another produce request</span></label></div>
      <p class="field-error" id="supply-interest-error" hidden></p>
      ${supplyProduce.map(item => `<div class="supply-conditional field" id="supply-quantity-${item.id}" hidden><label for="supply-amount-${item.id}">${escapeHtml(item.name)} — approximate quantity <span class="supply-optional">(optional)</span></label><input id="supply-amount-${item.id}" name="amount-${item.id}" maxlength="120" disabled aria-describedby="supply-amount-${item.id}-hint"><p class="supply-hint" id="supply-amount-${item.id}-hint">Include a unit if you know it, or leave this to discuss.</p></div>`).join('')}
      <div class="supply-conditional field" id="supply-other-request" hidden><label for="supply-other">What else are you interested in?</label><textarea id="supply-other" name="other" rows="3" maxlength="600" disabled aria-describedby="supply-other-error" data-lenis-prevent></textarea><p class="field-error" id="supply-other-error" hidden></p></div>
      <div class="field"><label for="supply-frequency">Preferred frequency</label><select id="supply-frequency" name="frequency">${supplyFrequency.map(item => `<option value="${item.id}">${escapeHtml(item.label)}</option>`).join('')}</select><p class="supply-hint">Your preference starts the conversation; a schedule is agreed separately.</p></div>
    </div></fieldset>
    <fieldset class="supply-fieldgroup"><legend>Your contact</legend><div class="supply-fieldgroup-body">
      ${input('name', 'Contact person', { required: true, autocomplete: 'name' })}
      <p class="supply-hint supply-contact-hint">Provide an email address, a phone number, or both.</p>
      ${input('email', 'Email address', { type: 'email', autocomplete: 'email', maxlength: 254 })}
      ${input('phone', 'Phone number', { type: 'tel', autocomplete: 'tel', maxlength: 30 })}
      <div class="field"><label for="supply-notes">Anything else we should know? <span class="supply-optional">(optional)</span></label><textarea id="supply-notes" name="notes" rows="4" maxlength="2000" data-lenis-prevent></textarea><p class="supply-hint">Menu preferences, timing considerations or questions for us.</p></div>
    </div></fieldset>
    <p id="supply-feedback" class="supply-feedback" role="alert"></p>
    <button class="button" type="submit">Prepare supply enquiry ${icon('arrow-right')}</button>
    <p class="supply-hint supply-draft-note">Review your draft, then open it in your email app to send it.</p>
  </form>
  <noscript><p>Share your kitchen’s name, city, produce interests and approximate quantities by email or phone.</p><div class="action-row">${link('Email WeGroween', `mailto:${businessContact.email}?subject=Restaurant%20supply%20enquiry`)}</div></noscript>
  <section id="supply-email-draft" class="supply-email-draft" tabindex="-1" aria-labelledby="supply-draft-title" hidden><p class="eyebrow">Ready for your review</p><h3 id="supply-draft-title">Your supply enquiry.</h3><pre id="supply-draft-body"></pre><a id="supply-open-draft" class="button">Open in your email app ${icon('arrow-right')}</a><p class="supply-hint supply-draft-note">Nothing has been sent or saved by this website. You send the enquiry from your email app.</p></section>`;
}

export function restaurantSupplyPage() {
  return `<div class="supply-page">
    <section class="container supply-intro"><div class="supply-intro-copy"><p class="eyebrow">For your kitchen</p><h1>${escapeHtml(supplyCopy.title)}</h1><p class="lead">${escapeHtml(supplyCopy.description)}</p><div class="action-row">${link('Discuss your requirements', '#supply-enquiry')}<a class="text-link" href="#supply-range">Explore the range</a></div></div>${photo('hero', 'supply-photo--hero')}</section>
    <section class="container supply-section" id="supply-range" aria-labelledby="supply-range-title"><header class="supply-section-heading"><p class="eyebrow">The produce</p><h2 id="supply-range-title">What’s on the table.</h2><p>Two starting points. Plenty to talk about.</p></header>
      ${supplyProduce.map(item => `<article class="supply-produce-row">${photo(item.imageSlot, 'supply-photo--produce')}<div class="supply-produce-copy"><p class="eyebrow">${escapeHtml(item.name)}</p><h3>${escapeHtml(item.heading)}</h3><p>${escapeHtml(item.description)}</p><a class="text-link" href="${item.route}">Explore ${escapeHtml(item.name.toLowerCase())} ${icon('arrow-right')}</a></div></article>`).join('')}
    </section>
    <section class="supply-story" aria-labelledby="supply-story-title"><div class="container supply-story-grid"><div><p class="eyebrow">A little about us</p><h2 id="supply-story-title">A small beginning.<br>A shared interest in good food.</h2><p>WeGroween began with vegetables on a terrace. Curiosity brought microgreens and mushrooms into the home, and that small beginning grew into a brand with a bigger purpose.</p><p>Now, we’re opening the conversation with kitchens that want to know more about the produce they choose.</p>${link('Our story', '/our-farm', 'secondary')}</div>${photo('growing-story', 'supply-photo--story')}</div></section>
    <section class="container supply-section supply-process" aria-labelledby="supply-process-title"><header class="supply-section-heading"><p class="eyebrow">From interest to a conversation</p><h2 id="supply-process-title">Let’s start with your kitchen.</h2></header><ol class="supply-steps"><li><span class="supply-step-number" aria-hidden="true">01</span><h3>Share your requirements.</h3><p>Tell us about your kitchen, produce preferences, approximate quantities and location.</p></li><li><span class="supply-step-number" aria-hidden="true">02</span><h3>Discuss the possibilities.</h3><p>Availability, pack sizes, pricing and delivery are details to work through together.</p></li><li><span class="supply-step-number" aria-hidden="true">03</span><h3>Agree the supply details.</h3><p>A suitable arrangement starts with a clear understanding of what your kitchen needs.</p></li></ol></section>
    <section class="container supply-section supply-enquiry" id="supply-enquiry" aria-labelledby="supply-enquiry-title"><header class="supply-section-heading"><p class="eyebrow">Start a conversation</p><h2 id="supply-enquiry-title">Tell us what your kitchen needs.</h2><p>A few details will help make the conversation useful.</p></header><div class="supply-enquiry-grid"><div class="supply-form-panel">${enquiryForm()}</div><aside class="supply-guidance" aria-labelledby="supply-guidance-title"><p class="eyebrow">A useful starting point</p><h3 id="supply-guidance-title">Approximate is enough.</h3><p>You don’t need a final order to get in touch. Share what you know, and leave room for the details we can discuss.</p><ul><li>Your preferred produce.</li><li>An approximate quantity or frequency.</li><li>Your kitchen’s location.</li></ul><div class="supply-direct"><p>Prefer a direct conversation?</p><a class="contact-method" href="mailto:${escapeHtml(businessContact.email)}">${icon('mail')}<span><small>Email</small><span>${escapeHtml(businessContact.email)}</span></span></a><a class="contact-method" href="${escapeHtml(businessContact.phoneHref)}">${icon('phone')}<span><small>Phone</small><span>${escapeHtml(businessContact.phone)}</span></span></a></div></aside></div></section>
    <section class="container contact-faq supply-faq" aria-labelledby="supply-faq-title"><header><p class="eyebrow">Useful details</p><h2 id="supply-faq-title">Before you get in touch.</h2><p>A few starting points for your supply enquiry.</p></header><div class="contact-questions">${supplyFAQs.map(item => `<details><summary><span>${escapeHtml(item.question)}</span>${icon('plus')}</summary><div class="contact-answer"><p>${escapeHtml(item.answer)}</p></div></details>`).join('')}</div></section>
  </div>`;
}
