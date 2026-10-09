import { header, footer, main, skipLink } from '../components/navigation.js';
export function storefront(content, context) {
  return `${skipLink}${header(context.path)}${main(content)}${footer()}`;
}
