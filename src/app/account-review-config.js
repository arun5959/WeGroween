// Publish the fictional account design without enabling development commerce,
// staff access, authentication, or a real customer session.
const configured = import.meta.env?.VITE_ACCOUNT_PREVIEW
  ?? (typeof process !== 'undefined' ? process.env.VITE_ACCOUNT_PREVIEW : undefined);
export const publishedAccountPreview = configured === 'true';
