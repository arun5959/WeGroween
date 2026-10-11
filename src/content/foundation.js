import { mediaAssets } from './media.js';

export const categories = Object.freeze([
  { slug: 'mushrooms', name: 'Mushrooms', eyebrow: 'Distinct varieties', actionLabel: 'Explore mushrooms', icon: 'mushroom', image: mediaAssets.mushrooms.src, imageAlt: mediaAssets.mushrooms.alt, description: 'Explore the mushroom varieties in the WeGroween catalogue.' },
  { slug: 'microgreens', name: 'Microgreens', eyebrow: 'Small leaves. Big character.', actionLabel: 'Explore microgreens', icon: 'microgreens', image: mediaAssets.microgreens.src, imageSrcSet: mediaAssets.microgreens.srcSet, imageAlt: mediaAssets.microgreens.alt, description: 'Discover radish, sunflower, mustard, broccoli and mixed microgreens.' },
  { slug: 'organic-harvest', name: 'Organic Harvest', eyebrow: 'Rooted in the everyday', actionLabel: 'Explore organic harvest', icon: 'produce', description: 'A new corner of the catalogue for everyday produce. The range is taking shape.', emptyDescription: 'We’re preparing this part of the catalogue. Products and growing details will appear here when the range is ready.' },
  { slug: 'exotics', name: 'Exotics', eyebrow: 'Beyond the familiar', actionLabel: 'Explore exotics', icon: 'exotic', description: 'A little curiosity for your kitchen. Our speciality range is taking shape.', emptyDescription: 'Something different is taking shape. Speciality varieties and their details will appear here when the range is ready.' },
]);
// Asset-backed catalogue for review. Sample packs and prices are not confirmed sale offers.
const product = (slug, name, description, category, media, samplePack, samplePrice, searchAliases = []) => Object.freeze({ slug, name, description, category, image: media.src, imageSrcSet: media.srcSet, thumbnail: media.sources?.[0].src ?? media.src, imageAlt: media.alt, samplePack, samplePrice, searchAliases });
export const products = Object.freeze([
  product('button-mushrooms', 'Button mushrooms', 'A familiar kitchen ingredient, ready to explore for your everyday dishes.', 'mushrooms', mediaAssets.buttonMushrooms, '200 g', 140),
  product('radish-microgreens', 'Radish microgreens', 'Pink stems and small green leaves for a colourful finishing touch.', 'microgreens', mediaAssets.radishMicrogreens, '50 g', 190),
  product('oyster-mushrooms', 'Oyster mushrooms', 'Layered grey caps with delicate gills, ready for your next pan or platter.', 'mushrooms', mediaAssets.oysterMushrooms, '200 g', 180, ['grey oyster mushrooms']),
  product('white-oyster-mushrooms', 'White oyster mushrooms', 'A pale, fan-shaped cluster to tear into pieces and bring to the pan.', 'mushrooms', mediaAssets.whiteOysterMushrooms, '200 g', 180),
  product('golden-oyster-mushrooms', 'Golden oyster mushrooms', 'Golden fan-shaped caps that bring a little colour to your kitchen.', 'mushrooms', mediaAssets.goldenOysterMushrooms, '200 g', 220, ['yellow oyster mushrooms']),
  product('broccoli-microgreens', 'Broccoli microgreens', 'Small green leaves and pale stems, gathered for a fresh finishing layer.', 'microgreens', mediaAssets.broccoliMicrogreens, '50 g', 180),
  product('sunflower-microgreens', 'Sunflower microgreens', 'Broad green leaves and sturdy pale stems for bowls, salads and sandwiches.', 'microgreens', mediaAssets.sunflowerMicrogreens, '50 g', 170, ['sunflower sprouts']),
  product('mustard-microgreens', 'Mustard microgreens', 'A tangle of small green and purple leaves for a colourful final flourish.', 'microgreens', mediaAssets.mustardMicrogreens, '50 g', 180),
  product('mixed-microgreens', 'Mixed microgreens', 'A mix of leaf shapes, colours and stems, gathered together for your plate.', 'microgreens', mediaAssets.mixedMicrogreens, '50 g', 200),
  product('mushroom-microgreen-pairing', 'Mushroom & microgreen pairing', 'Button and oyster mushrooms with mixed microgreens, brought together in one selection.', 'mushrooms', mediaAssets.mushroomMicrogreenPairing, '200 g mushrooms + 50 g microgreens', 320, ['combo', 'mixed mushroom microgreens platter']),
  product('oyster-radish-pairing', 'Oyster & radish pairing', 'Pale oyster mushrooms and pink-stemmed radish microgreens for a thoughtful pairing.', 'mushrooms', mediaAssets.oysterRadishPairing, '200 g mushrooms + 50 g microgreens', 350, ['combo', 'oyster mushrooms radish microgreens']),
]);
// Editorial collections. No sales ranking or harvest-date data is implied.
export const shopCollections = Object.freeze([
  { id: 'new-to-the-harvest', eyebrow: 'A little curiosity', name: 'Fresh discoveries', slugs: ['golden-oyster-mushrooms', 'white-oyster-mushrooms', 'broccoli-microgreens', 'mustard-microgreens'] },
  { id: 'kitchen-favourites', eyebrow: 'For your everyday table', name: 'Kitchen favourites', slugs: ['button-mushrooms', 'oyster-mushrooms', 'radish-microgreens', 'sunflower-microgreens', 'mushroom-microgreen-pairing', 'oyster-radish-pairing', 'mixed-microgreens'] },
]);
export const heroImage = mediaAssets.hero.src;
export const heroAlt = mediaAssets.hero.alt;
