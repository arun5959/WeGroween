export const supplyCopy = Object.freeze({
  title: 'Bring a thoughtful harvest to your kitchen.',
  description: 'Explore mushrooms and microgreens for your restaurant. Share what your kitchen needs, and let’s discuss the possibilities.',
  metaDescription: 'Explore mushrooms and microgreens for your restaurant and prepare a supply enquiry with your produce preferences, approximate quantities and location.',
});

export const supplyProduce = Object.freeze([
  { id: 'mushrooms', name: 'Mushrooms', heading: 'A place at the centre of the plate.', description: 'Explore the mushroom varieties in our catalogue. Tell us which varieties interest you and how you plan to use them in your kitchen.', route: '/shop/category/mushrooms', imageSlot: 'mushrooms' },
  { id: 'microgreens', name: 'Microgreens', heading: 'Small leaves. A considered finishing touch.', description: 'Explore radish, sunflower, mustard and broccoli microgreens. Share the varieties your menu calls for, or ask us about the current range.', route: '/shop/category/microgreens', imageSlot: 'microgreens' },
]);

export const supplyFrequency = Object.freeze([
  { id: 'exploring', label: 'Still exploring' },
  { id: 'one-off', label: 'One-off requirement' },
  { id: 'weekly', label: 'Interested in weekly supply' },
  { id: 'other', label: 'Another schedule — to discuss' },
]);

export const supplyFAQs = Object.freeze([
  { question: 'What produce can I enquire about?', answer: 'Start with the mushrooms and microgreens in our catalogue. You can also include another produce request in your enquiry so we can discuss what may be possible.' },
  { question: 'Do I need to know exact quantities?', answer: 'An approximate amount is a useful starting point. Include a unit if you know it, or leave the quantity blank to discuss it with us.' },
  { question: 'Can I ask about recurring supply?', answer: 'Yes. Share your preferred frequency and any timing considerations. Availability and a suitable schedule need to be discussed before an arrangement is agreed.' },
  { question: 'How are delivery and pricing confirmed?', answer: 'Include your city and, if available, your PIN code. Produce availability, pack sizes, pricing, delivery coverage and timing are details to confirm during the supply conversation.' },
]);
