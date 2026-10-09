import { header, footer, main, skipLink, navLink } from '../components/navigation.js';
export function account(content, context) {
  const links = [['Profile', '/account'], ['Orders', '/account/orders'], ['Addresses', '/account/addresses']];
  return `${skipLink}${header(context.path)}<div class="container account-layout section"><nav class="side-navigation" aria-label="Account navigation">${links.map(([label, href]) => navLink(label, href, context.path)).join('')}</nav>${main(content)}</div>${footer()}`;
}
