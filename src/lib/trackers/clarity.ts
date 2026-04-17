import { env } from '$env/dynamic/public';

let loaded = false;

export function loadClarity(): void {
  if (typeof window === 'undefined' || loaded) return;
  const id = env.PUBLIC_CLARITY_PROJECT_ID;
  if (!id) return;
  if ((window as any).clarity) {
    loaded = true;
    return;
  }
  (function (c: any, l: any, a: string, r: string, i: string) {
    c[a] = c[a] || function (...args: any[]) { (c[a].q = c[a].q || []).push(args); };
    const t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    t.onerror = () => console.warn('[Clarity] failed to load');
    const y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', id);
  loaded = true;
}
