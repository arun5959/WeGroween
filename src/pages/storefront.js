import { categories, products, heroImage, heroAlt } from '../content/foundation.js';
import { escapeHtml, link, pageIntro, notice } from '../components/primitives.js';
import { icon } from '../components/icons.js';
import { mediaAssets } from '../content/media.js';

const categoryCards = () => `<div class="category-grid">${categories.map((category) => `
  <article class="category-card">
    <figure><img src="${category.image}" width="640" height="480" alt="${escapeHtml(category.imageAlt)}" loading="lazy"></figure>
    <div class="category-copy">
      <p class="eyebrow">${escapeHtml(category.eyebrow)}</p>
      <h3>${escapeHtml(category.name)}${icon(category.icon)}</h3>
      <p class="category-description">${escapeHtml(category.description)}</p>
      <a class="button button--primary category-cta" href="/shop/category/${category.slug}">${escapeHtml(category.actionLabel)}</a>
    </div>
  </article>`).join('')}</div>`;

export function home() {
  return `<section class="hero container"><div class="hero-copy"><p class="eyebrow">Harvest to home</p><h1>Grown with care.<br>Chosen for <em>flavour.</em></h1><p class="lead">Explore mushrooms, microgreens and pairings from the WeGroween catalogue.</p><div class="action-row">${link('Shop this harvest', '/shop')}${link('Our story', '/our-farm', 'quiet')}</div><div class="hero-detail"><span>Mushrooms<br><strong>Distinct varieties.</strong></span><span>Microgreens<br><strong>Small leaves. Big character.</strong></span></div></div><figure class="hero-media"><img src="${heroImage}" alt="${escapeHtml(heroAlt)}" width="1122" height="1402" fetchpriority="high"></figure></section><section class="container section"><div class="section-heading"><div><p class="eyebrow">Explore the catalogue</p><h2>A place for every harvest.</h2></div><a class="text-link" href="/shop">Explore all categories ${icon('arrow-right')}</a></div>${categoryCards()}</section><section class="story-band"><div class="container story-grid"><figure class="story-media"><img src="${mediaAssets.farm.src}" alt="${escapeHtml(mediaAssets.farm.alt)}" width="1672" height="941" loading="lazy" decoding="async"></figure><div><p class="eyebrow">Our farm, your kitchen</p><h2>Know what you bring<br>to the table.</h2><p class="lead">Discover the story behind WeGroween and explore the produce in our catalogue.</p>${link('Meet WeGroween', '/our-farm', 'secondary')}</div></div></section><section class="container section supply-band"><div><p class="eyebrow">For restaurants</p><h2>Supply your kitchen.</h2><p>Explore the restaurant-supply pathway.</p></div>${link('Restaurant supply', '/restaurant-supply')}</section>`;
}

export function shop() {
  return `<div class="container section">${pageIntro('The catalogue', 'Explore this harvest.', 'Begin with mushrooms, microgreens or a thoughtful pairing.')}${categoryCards()}${notice('Catalogue preview', 'Pack sizes, prices and availability will be confirmed before ordering opens.')}</div>`;
}

export function category(params) {
  const item = categories.find((entry) => entry.slug === params.slug);
  if (!item) return null;
  const records = products.filter((entry) => entry.category === item.slug);
  return `<div class="container section"><nav aria-label="Breadcrumb"><a href="/shop">Shop</a> / ${escapeHtml(item.name)}</nav>${pageIntro('Explore the catalogue', item.name, item.description)}<div class="product-grid">${records.map((product) => `<a class="category-card" href="/products/${product.slug}"><figure><img src="${product.image}" alt="${escapeHtml(product.imageAlt)}" width="640" height="480"></figure><div class="category-copy"><h2>${product.name}</h2><p class="text-link">Explore this product ${icon('arrow-right')}</p></div></a>`).join('')}</div>${notice('Range being prepared', 'The complete range, packs and availability will be confirmed before ordering opens.')}</div>`;
}

export function product(params) {
  const item = products.find((entry) => entry.slug === params.slug);
  if (!item) return null;
  return `<div class="container section"><a href="/shop/category/${item.category}">Back to category</a><div class="product-detail"><img src="${item.image}" width="640" height="480" alt="${escapeHtml(item.imageAlt)}"><div>${pageIntro('Catalogue preview', item.name)}${notice('Ordering is not open', 'Pack sizes, price and availability are still being prepared.')}<button class="button" type="button" disabled aria-describedby="order-disabled-reason">Add to cart</button><p id="order-disabled-reason" class="muted">This product cannot be purchased in the local preview.</p>${link('Explore the catalogue', '/shop', 'quiet')}</div></div></div>`;
}
