import { mediaAssets } from './media.js';

export const categories = Object.freeze([
  { slug: 'mushrooms', name: 'Mushrooms', eyebrow: 'Distinct varieties', actionLabel: 'Explore mushrooms', icon: 'mushroom', image: mediaAssets.mushrooms.src, imageAlt: mediaAssets.mushrooms.alt, description: 'Explore the mushroom varieties in the WeGroween catalogue.' },
  { slug: 'microgreens', name: 'Microgreens', eyebrow: 'Small leaves. Big character.', actionLabel: 'Explore microgreens', icon: 'microgreens', image: mediaAssets.microgreens.src, imageSrcSet: mediaAssets.microgreens.srcSet, imageAlt: mediaAssets.microgreens.alt, description: 'Discover radish, sunflower, mustard and broccoli microgreens.' },
  { slug: 'combos', name: 'Pairings', eyebrow: 'Better together', actionLabel: 'Explore pairings', icon: 'cloche', image: mediaAssets.pairings.src, imageAlt: mediaAssets.pairings.alt, description: 'Explore mushrooms and microgreens together.' },
]);
// Existing catalogue names and updated public media, not confirmed sale offers.
export const products = Object.freeze([
  { slug: 'button-mushrooms', name: 'Button mushrooms', category: 'mushrooms', image: mediaAssets.buttonMushrooms.src, imageAlt: mediaAssets.buttonMushrooms.alt },
  { slug: 'radish-microgreens', name: 'Radish microgreens', category: 'microgreens', image: mediaAssets.radishMicrogreens.src, imageAlt: mediaAssets.radishMicrogreens.alt },
]);
export const heroImage = mediaAssets.hero.src;
export const heroAlt = mediaAssets.hero.alt;
