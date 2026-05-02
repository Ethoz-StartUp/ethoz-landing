// Theme store — reads/writes localStorage('theme') and toggles
// document.documentElement.dataset.theme. Mirrors the inline FOUC-free
// init script in src/app.html so server-rendered HTML stays consistent
// with client-side runtime state.
//
// Source of truth for the choice: localStorage. Source of truth for the
// effective theme on first load: localStorage > prefers-color-scheme.

import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function getInitial(): Theme {
  if (!browser) return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

class ThemeStore {
  current = $state<Theme>('light');

  init() {
    if (!browser) return;
    this.current = getInitial();
    document.documentElement.dataset.theme = this.current;

    // Follow system pref changes when user has not made an explicit choice.
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', (e) => {
      if (localStorage.getItem('theme')) return; // explicit choice — don't follow system
      const next: Theme = e.matches ? 'dark' : 'light';
      this.current = next;
      document.documentElement.dataset.theme = next;
    });
  }

  set(next: Theme) {
    this.current = next;
    if (!browser) return;
    localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
  }

  toggle() {
    this.set(this.current === 'dark' ? 'light' : 'dark');
  }

  /** Clear explicit choice and revert to system preference. */
  resetToSystem() {
    if (!browser) return;
    localStorage.removeItem('theme');
    const next: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.current = next;
    document.documentElement.dataset.theme = next;
  }
}

export const themeStore = new ThemeStore();
