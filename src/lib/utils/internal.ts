import { browser } from '$app/environment';

const STORAGE_KEY = 'ethoz_internal';
const TEST_EMAILS = ['ignacioaraya1995@gmail.com'];

/** Check if current user is flagged as internal (team member) */
export function isInternal(): boolean {
  if (!browser) return false;
  return localStorage.getItem(STORAGE_KEY) === '1';
}

/** Check URL for ?_internal=1 flag and persist it */
export function checkInternalFlag(): void {
  if (!browser) return;
  const params = new URLSearchParams(window.location.search);
  if (params.has('_internal')) {
    const value = params.get('_internal');
    if (value === '1') {
      localStorage.setItem(STORAGE_KEY, '1');
      console.info('[Ethoz] Internal mode ON — analytics excluded');
    } else {
      localStorage.removeItem(STORAGE_KEY);
      console.info('[Ethoz] Internal mode OFF');
    }
    // Clean URL without reload
    params.delete('_internal');
    const clean = params.toString();
    const newUrl = window.location.pathname + (clean ? `?${clean}` : '');
    window.history.replaceState({}, '', newUrl);
  }
}

/** Check if an email belongs to the team (for Supabase lead flagging) */
export function isTestEmail(email: string): boolean {
  return TEST_EMAILS.includes(email.toLowerCase().trim());
}
