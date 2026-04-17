const GTM_ID = 'GTM-WX6ZCXLZ';

let loaded = false;

export function loadGtm(): void {
  if (typeof window === 'undefined' || loaded) return;
  if (document.querySelector(`script[src*="googletagmanager.com/gtm.js?id=${GTM_ID}"]`)) {
    loaded = true;
    return;
  }
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  s.onerror = () => console.warn('[GTM] failed to load');
  document.head.appendChild(s);
  loaded = true;
}
