// Explicit publishing switch for fictional, browser-local operations records.
// This does not establish a staff session or authorise server data.
const configured = import.meta.env?.VITE_OPERATIONS_PREVIEW
  ?? (typeof process !== 'undefined' ? process.env.VITE_OPERATIONS_PREVIEW : undefined);
export const publishedOperationsPreview = configured === 'true';
export const operationsPreviewEnabled = !!import.meta.env?.DEV || publishedOperationsPreview;
