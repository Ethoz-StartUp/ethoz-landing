# Ethoz Landing Documentation

Ethoz Landing is the public marketing site and conversion funnel for Ethoz. It is a static SvelteKit site hosted on Firebase Hosting. Public forms send lead data to the GCP application backend at `app.ethoz.cl`.

## Current Architecture

```
Browser
  -> Firebase Hosting static SvelteKit landing
  -> Cloud Run marketing API at app.ethoz.cl
  -> Cloud SQL Postgres marketing_leads table
```

The landing repo owns only the public website. Product application, backend state, admin panels, and operational data live in `ethoz-app`.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | SvelteKit 2, Svelte 5, Tailwind CSS v4 |
| Hosting | Firebase Hosting |
| Lead intake | Cloud Run API in `ethoz-app` |
| Database | Cloud SQL Postgres in GCP |
| Scheduling | Cal.com |
| Analytics | Google Tag Manager, Microsoft Clarity |
| Errors | Sentry |
| Data | Static Mineduc school JSON under `static/data/` |

## GCP Cost Posture

| Need | Tool | Cost posture |
| --- | --- | --- |
| Public landing | Firebase Hosting | Free/low-cost static hosting + Google CDN |
| Lead API | Cloud Run in `ethoz-app` | Scale-to-zero when idle |
| Lead storage | Cloud SQL in `ethoz-app` | Paid baseline; shared with product DB |
| Bot protection | reCAPTCHA Enterprise | Google-managed, public site key in landing |

## Local Development

```bash
npm install
npm run dev -- --port 5177
```

Use `.env.local` for local-only values:

```bash
PUBLIC_MARKETING_API_URL=https://app.ethoz.cl
PUBLIC_RECAPTCHA_SITE_KEY=
PUBLIC_CAL_API_KEY=
PUBLIC_CLARITY_PROJECT_ID=
PUBLIC_APP_URL=https://app.ethoz.cl/login
PUBLIC_SENTRY_DSN=
```

Do not commit secrets. Lead intake uses `ethoz-app` on Cloud Run with reCAPTCHA Enterprise; this static landing repo only consumes public `PUBLIC_*` values.

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/demo` | School search |
| `/demo/[rbd]` | Demo request for a selected school |
| `/schedule` | Cal.com booking page |
| `/contact` | General contact form |
| `/about` | Company story |
| `/get-started` | Pricing/onboarding |
| `/compliance` | Compliance overview |
| `/seguridad-datos` | Data security |
| `/blog` and `/blog/[slug]` | Blog |
| `/features/*` | Feature pages |
| `/privacy`, `/terms` | Legal |

## Lead Flow

1. User searches/selects a school or opens contact.
2. Landing collects form data and reCAPTCHA token.
3. `src/lib/marketing.ts` sends the payload to `/api/marketing/leads` on `app.ethoz.cl`.
4. The GCP app verifies reCAPTCHA server-side and inserts into Cloud SQL.
5. The landing redirects successful demo requests to `/schedule`.

Resource downloads use the same marketing endpoint with `kind: "resource"` and do not block the PDF download if capture fails.

## Commands

```bash
npm run lint
npm run lint:i18n
npm run check
npm run audit:security
npm run test:unit
npm run build
```

Deploy both Firebase Hosting sites:

```bash
npm run build
firebase deploy --only hosting
```

## Key Files

| File | Purpose |
| --- | --- |
| `.impeccable.md` | Visual design system |
| `src/lib/marketing.ts` | Public marketing API client |
| `src/lib/i18n/translations/es.ts` | Spanish copy |
| `src/lib/i18n/translations/en.ts` | English copy |
| `src/lib/utils/recaptcha.ts` | reCAPTCHA client helper |
| `src/lib/stores/schools.svelte.ts` | School search state |
| `scripts/process-schools.mjs` | Mineduc CSV to static JSON |
| `firebase.json` | Hosting headers, rewrites, CSP |
| `.github/workflows/deploy.yml` | Manual Firebase deploy |

## Agent Notes

- Read `AGENTS.md` and `.impeccable.md` before visual changes.
- Keep user-facing copy in `src/lib/i18n/translations/{es,en}.ts`.
- Test local landing changes on port `5177`.
- Keep backend runtime, admin panels, CRM scripts, and social publishing outside this repo.
