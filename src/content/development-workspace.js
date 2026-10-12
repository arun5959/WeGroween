import { products, categories } from './foundation.js';
import { businessContact } from './contact.js';

// Isolated fictional workspace. Never an authorisation source or public offer.
export function createWorkspace() {
  const workspace = {
    products: products.map(p => ({ ...p, id: p.slug, pack: p.samplePack, price: p.samplePrice, stock: p.slug === 'golden-oyster-mushrooms' ? 6 : p.slug === 'mustard-microgreens' ? 8 : p.category === 'mushrooms' ? 36 : 24, status: 'Draft', imageKey: p.slug })),
    categories: categories.map((c, position) => ({ position, id: c.slug, name: c.name, description: c.description, status: 'Draft' })),
    customers: [{ id: 'sample-customer', name: 'Aarav Sample', email: 'aarav@example.invalid', phone: '', status: 'Active' }, { id: 'sample-chef', name: 'Meera Sample', email: 'meera@example.invalid', phone: '', status: 'Active', notes: 'Restaurant-supply conversation; illustrative account only.' }, { id: 'sample-customer-old', name: 'Kabir Sample', email: 'kabir@example.invalid', phone: '', status: 'Inactive' }],
    orders: [
      { id: 'SAMPLE-1050', customerId: 'sample-customer', customer: 'Aarav Sample', date: '11 October 2026', status: 'Preparing', total: 330, address: '12 Demo Lane, Gohana · 000000', payment: 'Sample payment', items: [{ slug: 'button-mushrooms', pack: '200 g', amount: 140, quantity: 1 }, { slug: 'radish-microgreens', pack: '50 g', amount: 190, quantity: 1 }] },
      { id: 'SAMPLE-1042', customerId: 'sample-customer', customer: 'Aarav Sample', date: '7 October 2026', status: 'Delivered', total: 330, address: '12 Demo Lane, Gohana · 000000', payment: 'Sample payment', items: [{ slug: 'button-mushrooms', pack: '200 g', amount: 140, quantity: 1 }, { slug: 'radish-microgreens', pack: '50 g', amount: 190, quantity: 1 }] },
      { id: 'SAMPLE-1048', customerId: 'sample-chef', customer: 'Meera Sample', date: '10 October 2026', status: 'Ready', total: 440, address: '4 Example Studio, Gohana · 000000', payment: 'Sample COD', items: [{ slug: 'golden-oyster-mushrooms', pack: '200 g', amount: 220, quantity: 2 }] },
      { id: 'SAMPLE-1046', customerId: 'sample-chef', customer: 'Meera Sample', date: '9 October 2026', status: 'Out for delivery', total: 190, address: '4 Example Studio, Gohana · 000000', payment: 'Sample online payment', items: [{ slug: 'radish-microgreens', pack: '50 g', amount: 190, quantity: 1 }] },
      { id: 'SAMPLE-1041', customerId: 'sample-customer-old', customer: 'Kabir Sample', date: '4 October 2026', status: 'Cancelled', total: 140, address: '8 Sample Road, Gohana · 000000', payment: 'No sample payment collected', items: [{ slug: 'button-mushrooms', pack: '200 g', amount: 140, quantity: 1 }] },
      { id: 'SAMPLE-1031', customerId: 'sample-customer', customer: 'Aarav Sample', date: '28 September 2026', status: 'Delivered', total: 190, address: '12 Demo Lane, Gohana · 000000', payment: 'Sample payment', items: [{ slug: 'radish-microgreens', pack: '50 g', amount: 190, quantity: 1 }] },
      { id: 'SAMPLE-1020', customerId: 'sample-customer-old', customer: 'Kabir Sample', date: '1 September 2026', status: 'Delivered', total: 280, address: '8 Sample Road, Gohana · 000000', payment: 'Sample payment', items: [{ slug: 'button-mushrooms', pack: '200 g', amount: 140, quantity: 2 }] },
    ],
    enquiries: [{ id: 'sample-kitchen', name: 'Sample Kitchen', contact: 'Meera Sample', email: 'meera@example.invalid', produce: 'Mushrooms & microgreens', frequency: 'Weekly', followUp: '2026-10-12', notes: '', status: 'New' }, { id: 'sample-bistro', name: 'Sample Bistro', contact: 'Tara Sample', email: 'tara@example.invalid', produce: 'Golden oyster mushrooms', frequency: 'Weekly', followUp: '2026-10-13', notes: 'Review pack requirements for a weekly kitchen selection.', status: 'Discussing' }, { id: 'sample-table', name: 'Sample Table', contact: 'Dev Sample', email: 'dev@example.invalid', produce: 'Mixed microgreens', frequency: 'One-off', followUp: '', notes: 'Illustrative arrangement; no supply commitment.', status: 'Agreed' }],
    promotions: [{ id: 'sample-promotion', name: 'First harvest', code: 'SAMPLE10', discount: 10, minimum: 0, starts: '', ends: '', status: 'Draft' }],
    zones: [{ id: 'sample-zone', name: 'Gohana preview zone', pins: '000000', fee: 30, minimum: 0, cutoff: '16:00', status: 'Draft' }],
    inventoryLog: [],
    activity: [],
    settings: { name: 'WeGroween', email: businessContact.email, phone: businessContact.phone, ordering: 'Closed', lowStockThreshold: 10, digest: true },
    basket: [],
    lastOrder: null,
  };
  for (const order of workspace.orders) for (const line of order.items) line.name = products.find(p => p.slug === line.slug)?.name || line.slug;
  return workspace;
}
export const developmentWorkspace = createWorkspace();
export const basketTotal = () => developmentWorkspace.basket.reduce((n, line) => n + (developmentWorkspace.products.find(p => p.id === line.id)?.price || 0) * line.quantity, 0);
export const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
