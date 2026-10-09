// The supplied files in public/media are the website's source assets.
const asset = (filename, alt) => Object.freeze({ filename, src: `/media/${filename.split('/').map(encodeURIComponent).join('/')}`, alt });

export const mediaAssets = Object.freeze({
  logoHeader: asset('Logo/wegroween-header.svg', 'WeGroween'),
  logoFooter: asset('Logo/wegroween-footer.svg', 'WeGroween'),
  logoMark: asset('Logo/wegroween-favicon.svg', 'WeGroween mushroom and sprout mark'),
  hero: asset('Rustic Mushroom and Microgreens Still Life.png', 'Mushrooms and microgreens arranged together on a stone surface'),
  farm: asset('Industrial Microgreens and Mushroom Farm.png', 'Indoor growing space with illuminated microgreen trays on the left and oyster mushroom racks behind glass on the right'),
  mushrooms: asset('Rustic Mixed Mushroom Harvest.png', 'A plate with button, golden oyster and other oyster mushrooms'),
  microgreens: asset('Vibrant Mixed Microgreens on Ceramic Plate.png', 'Mixed microgreens arranged on a ceramic plate'),
  pairings: asset('Rustic Mushroom and Microgreen Platter (1).png', 'A platter of mushrooms and fresh microgreens'),
  buttonMushrooms: asset('Natural White Mushroom Still Life.png', 'White button mushrooms on a stone surface'),
  radishMicrogreens: asset('Fresh Pink-Stemmed Microgreens Pile.png', 'Pink-stemmed microgreens on a stone surface'),
  storyTerrace: asset('story/paper/01-terrace-1536.webp', 'Symbolic paper illustration of a vegetable plant in a terrace planter'),
  storyIndoor: asset('story/paper/02-indoor-growing-1536.webp', 'Paper illustration of microgreens and oyster mushrooms growing indoors'),
  storyPurpose: asset('story/paper/03-purpose-1536.webp', 'Paper illustration of a small planter beside a larger crate of produce'),
  storyTable: asset('story/paper/05-table-1536.webp', 'Paper illustration of fresh produce arranged on a cream plate'),
});
