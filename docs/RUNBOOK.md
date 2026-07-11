# Ethoz Landing Runbook

## Local Smoke

```bash
npm run dev -- --port 5177
```

Check:

- `/`
- `/demo`
- `/contacto`
- `/agendar`
- `/seguridad-datos`

## Validation

```bash
npm run lint
npm run lint:i18n
npm run check
npm run audit:security
npm run test:unit
npm run build
```

Production HTTP smoke (read-only; does not execute JavaScript, accept analytics
consent, or submit forms):

```bash
npm run smoke:production
```

## Lead Funnel

Landing forms call:

```text
POST https://app.ethoz.cl/api/marketing/leads
```

Required production dependency:

- `ethoz-app` Cloud Run deployed.
- Cloud SQL migration for `marketing_leads` applied.
- Cloud Run service injects `GCP_PROJECT_ID` and `RECAPTCHA_ENTERPRISE_SITE_KEY`.
- The landing build uses the matching public `PUBLIC_RECAPTCHA_SITE_KEY`.

Quick endpoint checks:

```bash
curl -sI https://app.ethoz.cl/login
curl -sI https://ethoz.cl/
```

Do not test with real student data. Use obvious test payloads and masked logs.

## Firebase Deploy

```bash
npm run build
firebase deploy --only hosting
```

The GitHub workflow `.github/workflows/deploy.yml` runs the quality gates on
pull requests and pushes to `main`. Production deploys remain manual and are
accepted only when dispatched from `main`.

Before deploying, the workflow runs lint, i18n validation, Svelte/TypeScript
checks, the static security audit, unit tests, and one production build. The
validated `build/` artifact is then deployed without rebuilding. After Firebase
returns successfully, the workflow runs the production HTTP smoke.

The production build uses:

- `PUBLIC_MARKETING_API_URL=https://app.ethoz.cl`
- public Cal.com, Clarity, reCAPTCHA site key, app URL, and Sentry values.

## Post-deploy Smoke

`scripts/smoke-production.mjs` verifies:

- Key pages return HTML with the expected canonical URL.
- `robots.txt` and `sitemap.xml` are reachable and reference the canonical site.
- Migrated English slugs return permanent redirects and preserve query params.
- `www.ethoz.cl` redirects to the apex domain over valid TLS.
- HSTS, CSP, frame, MIME-sniffing, referrer, and permissions headers are present.

The check sends only `GET` and `HEAD` requests. It never calls the marketing API,
loads browser trackers, stores consent, or creates a lead. To test another
Firebase Hosting URL while retaining production canonicals:

```bash
SMOKE_BASE_URL=https://example.web.app npm run smoke:production
```

If the post-deploy smoke fails, inspect the failed assertion and Firebase deploy
output before retrying. Re-deploy the last known-good commit if production pages,
redirects, TLS, or security headers are unavailable.

Firebase Web App display name in project `gestion-estudiantil-dev`:

```text
Ethoz Landing
```

## GCP Boundary

This repo owns only the static public site. Backend state lives in `ethoz-app`:

- Cloud Run service: `ethoz-app`
- Project: `gestion-estudiantil-dev`
- Region: `southamerica-west1`
- Database: Cloud SQL Postgres

Cost posture:

- Firebase Hosting serves the landing as static files.
- Cloud Run handles lead intake and scales to zero.
- Cloud SQL is the paid baseline because it stores product data.

If leads fail:

1. Check browser Network tab for `/api/marketing/leads`.
2. Check Cloud Run logs for `scope=marketing-leads`.
3. Confirm `GCP_PROJECT_ID` and `RECAPTCHA_ENTERPRISE_SITE_KEY` are present in Cloud Run.
4. Confirm the `marketing_leads` migration ran in Cloud SQL.

## Hard Rules

- Do not reintroduce a public legacy database client, admin panel, CRM scripts, or social publishing backend in this repo.
- Do not commit `.env.local`.
- Keep UI copy in `src/lib/i18n/translations/{es,en}.ts`.
- Keep visual changes aligned with `.impeccable.md`.
