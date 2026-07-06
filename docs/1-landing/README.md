# Landing Pages

Public-facing pages on `ethoz.cl`, implemented with SvelteKit 2, Svelte 5, Tailwind CSS v4, and the repo design system in `.impeccable.md`.

## Core Flow

| Route | Purpose |
| --- | --- |
| `/` | Main landing page and primary narrative |
| `/demo` | Search a school by RBD or name |
| `/demo/[rbd]` | Demo request page for the selected school |
| `/schedule` | Cal.com booking handoff |
| `/contact` | General contact form |
| `/seguridad-datos` | Security and infrastructure proof |
| `/features/*` | Feature detail pages |
| `/blog` and `/blog/[slug]` | SEO and education content |
| `/privacy`, `/terms` | Legal pages |

## Lead Capture

The landing does not write directly to a database. All public form capture goes through:

```text
src/lib/marketing.ts -> https://app.ethoz.cl/api/marketing/leads
```

Form submissions include:

- Contact name, role, email, optional phone and notes.
- School context when available.
- Visitor/device metadata.
- First/last attribution data.
- reCAPTCHA token for contact/demo leads.

Resource downloads use the same endpoint with `kind: "resource"` and keep the download available even if capture fails.

## Shared Components

| File | Purpose |
| --- | --- |
| `src/lib/components/NavBar.svelte` | Global navigation |
| `src/lib/components/Footer.svelte` | Footer links and company info |
| `src/lib/components/ResourceGate.svelte` | Soft email gate for downloads |
| `src/lib/components/PitchModal.svelte` | Pitch modal |
| `src/lib/marketing.ts` | Marketing API client |
| `src/lib/utils/recaptcha.ts` | reCAPTCHA v3 client helper |
| `src/lib/stores/schools.svelte.ts` | School search state |

## Content Rules

- Put user-facing copy in `src/lib/i18n/translations/es.ts` and `en.ts`.
- Keep feature content below the first hero narrative, not inside hero badges.
- Do not reintroduce admin, prospecting CRM, or social publishing routes in this repo.
- Do not add a public database client to the landing.

## Validation

```bash
npm run lint
npm run lint:i18n
npm run check
npm run test:unit
npm run build
```
