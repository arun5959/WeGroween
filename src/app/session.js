// No phase-1 session can authorise protected data. Real Auth/server checks come later.
// Query parameters, browser storage and customer metadata cannot grant roles.
export function accessDecision(page) {
  if (['public', 'identity', 'staff-identity'].includes(page.access)) return { allowed: true };
  return { allowed: false, signIn: page.access === 'staff' ? '/admin/sign-in' : '/sign-in' };
}
