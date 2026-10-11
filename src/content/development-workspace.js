import { products, categories } from './foundation.js';
import { businessContact } from './contact.js';

// Isolated fictional workspace. Never an authorisation source or public offer.
export function createWorkspace() {
  return {
    products: products.map(p => ({ ...p, id: p.slug, pack: p.samplePack, price: p.samplePrice, stock: p.category === 'mushrooms' ? 36 : 24, status: 'Draft' })),
    categories: categories.map(c => ({ id: c.slug, name: c.name, description: c.description, status: 'Draft' })),
    customers: [{ id: 'sample-customer', name: 'Aarav Sample', email: 'aarav@example.invalid', phone: '', status: 'Active' }],
    orders: [
      { id: 'SAMPLE-1050', customerId: 'sample-customer', customer: 'Aarav Sample', date: '11 October 2026', status: 'Preparing', total: 330, address: '12 Demo Lane, Gohana · 000000', payment: 'Sample payment', items: [{ slug: 'button-mushrooms', pack: '200 g', amount: 140, quantity: 1 }, { slug: 'radish-microgreens', pack: '50 g', amount: 190, quantity: 1 }] },
      { id: 'SAMPLE-1042', customerId: 'sample-customer', customer: 'Aarav Sample', date: '7 October 2026', status: 'Delivered', total: 330, address: '12 Demo Lane, Gohana · 000000', payment: 'Sample payment', items: [{ slug: 'button-mushrooms', pack: '200 g', amount: 140, quantity: 1 }, { slug: 'radish-microgreens', pack: '50 g', amount: 190, quantity: 1 }] },
    ],
    enquiries: [{ id: 'sample-kitchen', name: 'Sample Kitchen', contact: 'Meera Sample', email: 'meera@example.invalid', produce: 'Mushrooms & microgreens', frequency: 'Weekly', status: 'New' }],
    promotions: [{ id: 'sample-promotion', name: 'First harvest', code: 'SAMPLE10', discount: 10, status: 'Draft' }],
    zones: [{ id: 'sample-zone', name: 'Gohana preview zone', pins: '000000', fee: 30, status: 'Draft' }],
    inventoryLog: [],
    settings: { name: 'WeGroween', email: businessContact.email, phone: businessContact.phone, ordering: 'Closed' },
    basket: [],
    lastOrder: null,
  };
}
export const developmentWorkspace = createWorkspace();
export const basketTotal = () => developmentWorkspace.basket.reduce((n, line) => n + (developmentWorkspace.products.find(p => p.id === line.id)?.price || 0) * line.quantity, 0);
export const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
