export function navigateToPath(path, { replace = false } = {}) {
  if (window.location.pathname === path && !window.location.hash) return;
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'auto' });
}
