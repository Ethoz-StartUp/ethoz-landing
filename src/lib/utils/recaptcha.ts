import { env } from '$env/dynamic/public';

function getKey(): string | undefined {
  return env.PUBLIC_RECAPTCHA_SITE_KEY;
}

// The reCAPTCHA script is injected async on mount; a fast submit can fire before
// `window.grecaptcha` exists. Wait for it (up to timeoutMs) instead of giving up
// immediately — otherwise the token comes back null and the lead is silently lost.
function waitForGrecaptcha(timeoutMs = 6000): Promise<any | null> {
  return new Promise((resolve) => {
    const ready = () => {
      const grecaptcha = (window as any).grecaptcha;
      return grecaptcha?.enterprise?.execute ? grecaptcha.enterprise : (grecaptcha?.execute ? grecaptcha : null);
    };
    const now = ready();
    if (now) return resolve(now);
    const start = Date.now();
    const iv = setInterval(() => {
      const g = ready();
      if (g) {
        clearInterval(iv);
        resolve(g);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(iv);
        resolve(null);
      }
    }, 100);
  });
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  const key = getKey();
  if (!key) return null;

  const grecaptcha = await waitForGrecaptcha();
  if (!grecaptcha) return null;

  // reCAPTCHA score keys require execute to run inside ready().
  try {
    return await new Promise<string | null>((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(key, { action }).then(resolve).catch(() => resolve(null));
      });
    });
  } catch {
    return null;
  }
}

export function getRecaptchaScriptUrl(): string {
  const key = getKey() ?? '';
  return `https://www.google.com/recaptcha/enterprise.js?render=${key}`;
}
