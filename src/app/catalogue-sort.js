export const catalogueSortOptions = Object.freeze([
  ['selection', 'Our selection'],
  ['name-asc', 'Name: A–Z'],
  ['name-desc', 'Name: Z–A'],
  ['availability', 'Availability'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
]);

const names = new Intl.Collator('en-IN', { sensitivity: 'base', numeric: true });

// Unknown availability is distinct from sold out. Preview inventory is supplied
// explicitly; it must never become a public claim about stock.
export function sortCatalogue(records, mode, { inventory = null } = {}) {
  const stock = inventory ? new Map(inventory.map(item => [item.id, item])) : null;
  const availability = product => {
    const quantity = stock?.get(product.slug)?.stock;
    if (Number.isFinite(quantity)) return quantity > 0 ? 0 : 1;
    return product.availability === 'available' ? 0 : product.availability === 'unavailable' ? 1 : 2;
  };
  const price = product => stock?.get(product.slug)?.price ?? product.samplePrice;
  const comparePrice = (a, b, direction) => {
    const first = price(a), second = price(b);
    if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
    if (!Number.isFinite(second)) return -1;
    return (first - second) * direction;
  };
  const compare = {
    'name-asc': (a, b) => names.compare(a.name, b.name),
    'name-desc': (a, b) => names.compare(b.name, a.name),
    availability: (a, b) => availability(a) - availability(b),
    'price-asc': (a, b) => comparePrice(a, b, 1),
    'price-desc': (a, b) => comparePrice(a, b, -1),
  }[mode];
  return compare ? [...records].sort(compare) : [...records];
}
