import { browser } from '$app/environment';

const STORAGE_KEY = 'ethoz_consent_v1';

export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: number | null;
};

const DEFAULT: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  updatedAt: null,
};

function load(): ConsentState {
  if (!browser) return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw);
    return {
      essential: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : null,
    };
  } catch {
    return { ...DEFAULT };
  }
}

const state = $state<ConsentState>(load());

export function getConsent(): ConsentState {
  return state;
}

export function hasDecided(): boolean {
  return state.updatedAt !== null;
}

export function setConsent(next: { analytics: boolean; marketing: boolean }): void {
  state.analytics = next.analytics === true;
  state.marketing = next.marketing === true;
  state.updatedAt = Date.now();
  if (browser) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          essential: true,
          analytics: state.analytics,
          marketing: state.marketing,
          updatedAt: state.updatedAt,
        })
      );
    } catch {
      // localStorage disabled (Safari private) — state stays in memory
    }
  }
}
