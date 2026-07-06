# Ethoz Landing Runbook

## Local Smoke

```bash
npm run dev -- --port 5177
```

Check:

- `/`
- `/demo`
- `/contact`
- `/schedule`
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

## Lead Funnel

Landing forms call:

```text
POST https://app.ethoz.cl/api/marketing/leads
```

Required production dependency:

- `ethoz-app` Cloud Run deployed.
- Cloud SQL migration for `marketing_leads` applied.
- GCP Secret Manager has `RECAPTCHA_SECRET_KEY`.
- Cloud Run service injects `RECAPTCHA_SECRET_KEY`.

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

The GitHub workflow `.github/workflows/deploy.yml` is manual and builds with:

- `PUBLIC_MARKETING_API_URL=https://app.ethoz.cl`
- public Cal.com, Clarity, reCAPTCHA site key, app URL, and Sentry values.

## GCP Boundary

This repo owns only the static public site. Backend state lives in `ethoz-app`:

- Cloud Run service: `ethoz-app`
- Project: `gestion-estudiantil-dev`
- Region: `southamerica-west1`
- Database: Cloud SQL Postgres

If leads fail:

1. Check browser Network tab for `/api/marketing/leads`.
2. Check Cloud Run logs for `scope=marketing-leads`.
3. Confirm `RECAPTCHA_SECRET_KEY` exists and is mounted in Cloud Run.
4. Confirm the `marketing_leads` migration ran in Cloud SQL.

## Hard Rules

- Do not reintroduce a public legacy database client, admin panel, CRM scripts, or social publishing backend in this repo.
- Do not commit `.env.local`.
- Keep UI copy in `src/lib/i18n/translations/{es,en}.ts`.
- Keep visual changes aligned with `.impeccable.md`.
