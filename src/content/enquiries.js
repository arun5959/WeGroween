export const contactCopy = Object.freeze({
  title: 'Let’s talk about your next harvest.',
  description: 'Questions about mushrooms, microgreens or produce for your kitchen? Get in touch with WeGroween.',
});

export const enquiryTopics = Object.freeze([
  { id: 'produce', name: 'Produce questions', subject: 'Produce enquiry', guidance: 'Tell us which produce you’re interested in and what you’d like to know.' },
  { id: 'delivery', name: 'Delivery questions', subject: 'Delivery enquiry', guidance: 'Include your location and preferred produce. Delivery areas, charges and timing are still being prepared for this catalogue preview.' },
  { id: 'restaurant', name: 'Restaurant enquiries', subject: 'Restaurant supply enquiry', guidance: 'Share your kitchen’s name, produce preferences, expected quantities and location.' },
]);

export const contactFAQs = Object.freeze([
  { question: 'What produce can I ask about?', answer: 'Explore mushrooms, microgreens and pairings in our catalogue. Let us know which produce you’re interested in and what you would like to know.' },
  { question: 'What should I include in a delivery enquiry?', answer: enquiryTopics[1].guidance },
  { question: 'How should a restaurant get in touch?', answer: enquiryTopics[2].guidance },
]);
