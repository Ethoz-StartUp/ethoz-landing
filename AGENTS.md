# AGENTS.md — AI Agent Guidelines for Ethoz

## Agent Roles

### Frontend / Landing
- Read `.impeccable.md` before ANY visual change
- All text via `t()` — update `src/lib/i18n/translations/es.ts` and `en.ts`
- Test at port 5177
- SEO: every page needs svelte:head with title, description, og tags, twitter card, canonical, JSON-LD

### Content Creation
- Read `docs/5-knowledge-base/` for source data (stats, competitors, laws, messaging)
- Read `docs/content-bank/content-calendar.md` for scheduling
- Read `src/lib/content/strategy.ts` for platform rules and Kimi prompt builder
- Blog posts: follow `src/lib/data/posts/types.ts` interface exactly
- Social: follow brand rules in `docs/5-knowledge-base/audiencias-messaging.md`

### Lead Capture / Backend Boundary
- Landing has no admin/CRM backend
- Public forms write through `src/lib/marketing.ts`
- Backend endpoint lives in `ethoz-app`: `/api/marketing/leads`
- Do not reintroduce a public database client or legacy admin routes here

### Prospecting / Data
- Source CSVs: Directorio-Oficial-Sostenedores-2025/, Directorio-Oficial-EE-2025/
- Processing: scripts/process-schools.mjs → static/data/schools.json
- Scoring algorithm documented in docs/3-prospecting/README.md

## File Discovery Shortcuts
| Need | Look here |
|------|-----------|
| Design system | .impeccable.md |
| Brand & product context | docs/5-knowledge-base/posicionamiento-ethoz.md |
| Statistics & data | docs/5-knowledge-base/estadisticas.md |
| Competitor intel | docs/5-knowledge-base/competencia.md |
| Legal landscape | docs/5-knowledge-base/leyes-regulaciones.md |
| Audience messaging | docs/5-knowledge-base/audiencias-messaging.md |
| Lead capture client | src/lib/marketing.ts |
| Content strategy | src/lib/content/strategy.ts |
| Blog post format | src/lib/data/posts/types.ts |
| i18n translations | src/lib/i18n/translations/{es,en}.ts |
| Env vars | .env.local |
| Deploy config | firebase.json, .firebaserc |

## Anti-patterns
- NEVER hardcode colors (use tokens)
- NEVER hardcode text (use t())
- NEVER stack icon + title vertically (always inline)
- NEVER use dark sections (light mode only)
- NEVER say Ethoz "replaces" other systems (it complements)
- NEVER invent statistics (use docs/5-knowledge-base/estadisticas.md)
- NEVER reintroduce admin/CRM/social publishing code in this landing repo
- NEVER commit .env.local or API keys
