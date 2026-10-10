// Fictional review data. Never import customer records or persist these edits.
export function createSampleAccount() {
  return {
    profile: { name: 'Aarav Sample', email: 'aarav@example.invalid', phone: '' },
    addresses: [
      { id: 'sample-home', label: 'Home', recipient: 'Aarav Sample', line: '12 Demo Lane', city: 'Gohana', postal: '000000', isDefault: true },
      { id: 'sample-work', label: 'Work', recipient: 'Aarav Sample', line: '4 Example Studio', city: 'Gohana', postal: '000000', isDefault: false },
    ],
    orders: [
      { id: 'SAMPLE-1042', date: '7 October 2026', status: 'Delivered', delivered: '8 October 2026', address: 'Home · 12 Demo Lane, Gohana', items: [
        { slug: 'button-mushrooms', pack: '200 g', quantity: 1, amount: 140 },
        { slug: 'radish-microgreens', pack: '50 g', quantity: 1, amount: 190 },
      ] },
      { id: 'SAMPLE-1031', date: '28 September 2026', status: 'Delivered', delivered: '29 September 2026', address: 'Home · 12 Demo Lane, Gohana', items: [
        { slug: 'radish-microgreens', pack: '50 g', quantity: 1, amount: 190 },
      ] },
    ],
  };
}

// Navigation can preserve a review session; a full reload resets it.
export const sampleAccount = createSampleAccount();
export function resetSampleAccount() { Object.assign(sampleAccount, createSampleAccount()); }
export function orderTotal(order) { return order.items.reduce((total, item) => total + item.amount * item.quantity, 0); }
export function sampleMoney(value) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value); }
