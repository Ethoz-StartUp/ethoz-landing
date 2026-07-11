import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const appHtml = (): string => readFileSync(resolve(process.cwd(), 'src/app.html'), 'utf8');

describe('synchronous consent bootstrap', () => {
  it('sets all Consent Mode v2 defaults to denied before the app hydrates', () => {
    const html = appHtml();
    const defaultCommand = html.slice(
      html.indexOf("window.gtag('consent', 'default'"),
      html.indexOf('// Restore an explicit prior choice')
    );
    expect(defaultCommand).toContain("analytics_storage: 'denied'");
    expect(defaultCommand).toContain("ad_storage: 'denied'");
    expect(defaultCommand).toContain("ad_user_data: 'denied'");
    expect(defaultCommand).toContain("ad_personalization: 'denied'");
  });

  it('removes the legacy pre-consent event buffer synchronously', () => {
    const html = appHtml();
    expect(html).toContain("sessionStorage.removeItem('ethoz_pending_events')");
  });
});
