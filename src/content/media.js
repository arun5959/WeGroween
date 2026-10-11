// The supplied files in public/media are the website's source assets.
const asset = (filename, alt) => Object.freeze({ filename, src: `/media/${filename.split('/').map(encodeURIComponent).join('/')}`, alt });

const responsiveAsset = (stem, alt, width, height) => {
  const sources = [...new Set([480, 768, width])].filter(size => size <= width).map(size => Object.freeze({ ...asset(`optimized/${stem}-${size}.webp`, alt), width: size }));
  return Object.freeze({ ...sources.at(-1), width, height, sources: Object.freeze(sources), srcSet: sources.map(source => `${source.src} ${source.width}w`).join(', ') });
};

export const mediaAssets = Object.freeze({
  logoHeader: asset('Logo/wegroween-header.svg', 'WeGroween'),
  logoFooter: asset('Logo/wegroween-footer.svg', 'WeGroween'),
  logoMark: asset('Logo/wegroween-favicon.svg', 'WeGroween mushroom and sprout mark'),
  hero: responsiveAsset('kitchen-dish-portrait', 'A hand adding microgreens to a pan of sautéed mushrooms on a kitchen worktop', 1122, 1402),
  heroLandscape: responsiveAsset('kitchen-dish-landscape', 'A hand adding microgreens to a pan of sautéed mushrooms on a kitchen worktop', 1402, 1122),
  supplyHero: responsiveAsset('supply-hero-portrait', 'Fresh oyster and button mushrooms with mixed microgreens arranged on parchment', 1122, 1402),
  supplyHeroLandscape: responsiveAsset('supply-hero-landscape', 'Fresh oyster and button mushrooms with mixed microgreens arranged on parchment', 1402, 1122),
  supplyMushrooms: responsiveAsset('oyster-mushrooms-detail', 'Oyster mushroom cluster showing curved caps and fine gills on a stone surface', 1448, 1086),
  supplyMicrogreens: responsiveAsset('microgreens-detail', 'Freshly cut microgreens with green leaves and pale and pink stems on stone', 1448, 1086),
  supplyGrowing: responsiveAsset('microgreens-harvest', 'A person handling a tray of mixed microgreens between indoor growing racks', 1536, 1024),
  farm: asset('Industrial Microgreens and Mushroom Farm.png', 'Indoor growing space with illuminated microgreen trays on the left and oyster mushroom racks behind glass on the right'),
  mushrooms: asset('Rustic Mixed Mushroom Harvest.png', 'A plate with button, golden oyster and other oyster mushrooms'),
  microgreens: responsiveAsset('microgreens-range', 'An overhead view of dense microgreen trays with green leaves and pink stems', 1448, 1086),
  pairings: asset('Rustic Mushroom and Microgreen Platter (1).png', 'A platter of mushrooms and fresh microgreens'),
  buttonMushrooms: responsiveAsset('product-button-mushrooms', 'White button mushrooms on a stone surface', 1448, 1086),
  radishMicrogreens: responsiveAsset('product-radish-microgreens', 'Pink-stemmed radish microgreens on a stone surface', 1448, 1086),
  oysterMushrooms: responsiveAsset('product-oyster-mushrooms', 'A grey oyster mushroom cluster with layered caps on stone', 1448, 1086),
  whiteOysterMushrooms: responsiveAsset('product-white-oyster-mushrooms', 'A pale oyster mushroom cluster with broad caps and visible gills on stone', 1448, 1086),
  goldenOysterMushrooms: responsiveAsset('product-golden-oyster-mushrooms', 'A golden oyster mushroom cluster on a stone surface', 1448, 1086),
  broccoliMicrogreens: responsiveAsset('product-broccoli-microgreens', 'Green broccoli microgreens with pale stems on stone', 1448, 1086),
  sunflowerMicrogreens: responsiveAsset('product-sunflower-microgreens', 'Sunflower shoots with broad green leaves and pale stems on stone', 1448, 1086),
  mustardMicrogreens: responsiveAsset('product-mustard-microgreens', 'Mustard microgreens with small green and purple leaves on stone', 1448, 1086),
  mixedMicrogreens: responsiveAsset('product-mixed-microgreens', 'Mixed green and purple microgreens arranged on a ceramic plate', 1448, 1086),
  mushroomMicrogreenPairing: responsiveAsset('product-mushroom-microgreen-pairing', 'Button, white oyster and grey oyster mushrooms with mixed microgreens on a plate', 1448, 1086),
  oysterRadishPairing: responsiveAsset('product-oyster-radish-pairing', 'White oyster mushrooms with pink-stemmed radish microgreens on a ceramic plate', 1448, 1086),
  storyTerrace: asset('story/paper/01-terrace-1536.webp', 'Symbolic paper illustration of a vegetable plant in a terrace planter'),
  storyIndoor: asset('story/paper/02-indoor-growing-1536.webp', 'Paper illustration of microgreens and oyster mushrooms growing indoors'),
  storyPurpose: asset('story/paper/03-purpose-1536.webp', 'Paper illustration of a small planter beside a larger crate of produce'),
  storyTable: asset('story/paper/05-table-1536.webp', 'Paper illustration of fresh produce arranged on a cream plate'),
});
