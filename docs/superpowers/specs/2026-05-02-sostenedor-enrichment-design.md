# Sostenedor Contact Enrichment — Design Spec

**Date:** 2026-05-02
**Status:** Draft → F1 ready
**Branch:** `redesign/stripe-press` (or feature branch off main once redesign merges)
**Owner:** Ignacio (idaraya@uc.cl)

---

## Goal

Enrich the 7,885 MINEDUC sostenedores with actionable contact data (email, phone, contact name, role, source URL, confidence) and surface it in `/admin/prospecting` with filters, dedup, confidence scoring, and CSV export — using **only free public data sources**.

**Yield target:** ≥80% of Tier 1+2 (~1,500 sostenedores) with verified email + phone within 1 week.

## Non-goals

- Not selling lists or sharing data with third parties.
- Not scraping personal information that isn't already published as institutional contact.
- Not building a full CRM (the existing tracker tab in `/admin/prospecting` is enough).
- Not paid APIs (Hunter.io, Apollo, ZoomInfo, etc).

## Strategy

**Public-data aggregation.** Chile mandates publication of institutional contact data for every public school under Ley 20.285 (Transparencia Activa). Private schools publish on their own websites. We aggregate, dedupe, score, and surface.

---

## Sources matrix (ordered by yield × cost)

| # | Source | Type | Coverage | Method |
|---|--------|------|----------|--------|
| 1 | **Transparencia Activa** (Ley 20.285) | Mandatory public | 2,500 municipales + 11 SLEPs | Scrape `municipalidadX.cl/transparencia/` per template |
| 2 | **ChileCompra / Mercado Público** | Public procurement | ~3,000 sostenedores que licitan | API `https://api.mercadopublico.cl` — buyer email |
| 3 | **DAEM/SLEP pattern URLs** | Predictable URLs | ~2,500 municipales | Pattern: `daemX.cl`, `sle-X.cl`, `municipalidadX.cl/educacion` |
| 4 | **Sitios web de colegios privados** | Self-published | ~5,000 con web propia | Firecrawl bulk + regex emails/phones |
| 5 | **Wayback Machine** | Archive recovery | sites con downtime | `web.archive.org/cdx/search` API |
| 6 | **SII (zeus.sii.cl)** | Razón social oficial | TODOS los con RUT | Scrape `getstc` endpoint by RUT |
| 7 | **Mineduc Buscador EE** | Public registry | TODOS los colegios | Cross-reference RBD → contact |
| 8 | **Google/DuckDuckGo dorks** | Web index | Tier 1 long tail | `site:linkedin.com/in "director" "X"`, `"X" email contacto` |
| 9 | **PDFs Mineduc anuales** | Director names | Variable | pdfplumber + Kimi extraction |
| 10 | **Facebook/Instagram bios** | Public business pages | Colegios chicos | Graph API público (no auth needed para Pages) |

---

## Data model

See `supabase/migrations/004_sostenedor_enrichment.sql` for full DDL.

**Two tables:**

### `sostenedor_urls`
Candidate URLs discovered per sostenedor before scraping.
- `sostenedor_name`, `sostenedor_rut`, `url`, `domain`, `source`, `confidence`, `status` (pending/scraped/failed/skipped), `last_scraped_at`.
- Unique on `(sostenedor_name, url)`.

### `sostenedor_contacts`
Final enriched contact rows.
- `sostenedor_name`, `sostenedor_rut`, `contact_name/role/email/phone/linkedin_url`.
- Provenance: `source`, `source_url`, `raw_snippet`, `confidence`.
- Verification: `verified_at`, `verified_by`, `bounce_count`, `is_active`.
- CHECK: at least one of email/phone/linkedin must be present.
- Partial unique on `(sostenedor_name, contact_email)` and `(sostenedor_name, contact_phone)`.

**RLS:** admin-only, same UUID pattern as `001_prospect_tables`.

---

## Phases

### F1 — Bootstrap + URL discovery (Día 1)
- ✅ Migration `004_sostenedor_enrichment.sql`.
- ✅ Script `scripts/discover-sostenedor-urls.mjs` — for each sostenedor, fire DDG/Bing search + pattern guesses + Wayback lookup → write to `sostenedor_urls`.
- Output: ~5,500 candidate URLs covering ~70% of sostenedores.

### F2 — Transparencia Activa scraper (Día 2)
- Script `scripts/scrape-transparencia.mjs` — iterate municipalidades, hit `/transparencia/` (or templated paths), extract DAEM staff contacts.
- Yield: 1,500-2,000 institutional contacts for municipal sostenedores.

### F3 — ChileCompra API enrichment (Día 3)
- Script `scripts/enrich-chilecompra.mjs` — call `api.mercadopublico.cl/Comprador/v1` per RUT, extract `usuario_email` from buyer profile.
- Yield: 1,500-2,500 verified emails (these are official procurement contacts → high confidence).

### F4 — Bulk web scrape (Día 4)
- Script `scripts/scrape-sostenedor-sites.mjs` — Firecrawl `/scrape` over discovered URLs (Tier 1+2 priority), regex extract emails/phones, store raw_snippet.
- Yield: 2,000-3,000 contacts from private school websites.

### F5 — LLM extraction + dedup (Día 5)
- Script `scripts/llm-extract-contacts.mjs` — Kimi CLI processes `raw_snippet` chunks, emits structured JSON `{name, role, email, phone}`. Dedup against existing rows.
- Yield: cleanup + ~500 additional contacts from messy HTML.

### F6 — Admin dashboard (Día 6)
- New route `/admin/prospecting/contacts` (or new tab in existing `/admin/prospecting`).
- Components:
  - Filter bar: tier, region, source, has_email, has_phone, verified, confidence range.
  - Table: sostenedor_name, contact_count, top_contact, confidence, last_verified, source.
  - Row expand: all contacts for that sostenedor with verify/dismiss/edit actions.
  - Bulk: export CSV (segmentado por tier/region), mark verified, push to outreach queue.
- Reuse shadcn `Table`, `Sheet`, `Select`, `Badge`, `Button`.

### F7 — Deliverability validation (Día 7)
- Script `scripts/verify-emails.mjs` — SMTP banner ping (no actual send) per email; flag bounces (`bounce_count++`, `is_active=false` after 2).
- Optional: monthly cron via Supabase scheduled function.

---

## UX additions (`/admin/prospecting/contacts`)

```
┌─ Contactos enriquecidos ───────────────────────────────────────┐
│ [Buscar...]  Tier:[▼] Región:[▼] Fuente:[▼] Email:[has/none] │
│                                                Export CSV ⤓   │
├────────────────────────────────────────────────────────────────┤
│ Tier  Sostenedor              Contactos  Top Contact  Conf  ⋮ │
│  1    Corp Edu Cerro Navia    3 emails   contacto@..  0.92  > │
│  1    SLEP Andalién Sur       7 emails   daem@..      0.85  > │
│  ...                                                           │
└────────────────────────────────────────────────────────────────┘
```

Row expand shows all contacts + source URL + raw snippet (audit trail) + verify/edit/disable actions.

---

## Compliance

- **Ley 20.285** (Transparencia): explicitly mandates publication of contact data for public bodies → no consent needed.
- **Ley 21.719** (Data Protection, full enforcement Dec 2026): personal data requires legitimate basis. We're aggregating institutional contacts already published — falls under "datos manifestados públicamente" exception. Contact roles like "Director DAEM" published on official sites = institutional, not personal.
- **Outbound use:** when we send marketing, we must honor opt-out (CAN-SPAM equivalent in Ley 21.719). The dashboard must support `is_active=false` and respect it in any export/queue.
- **Audit trail:** every contact has `source_url` + `raw_snippet` + `created_at` for provenance — defensible if anyone challenges us.

---

## Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Rate limiting from search engines / scraping targets | Random User-Agent rotation, 2-5s delays, retry with exponential backoff, fallback to alt search engine |
| Stale data | Re-verification cron monthly; `verified_at` shown in dashboard; auto-disable after 2 bounces |
| Duplicate sostenedores (same name, different RUT) | Match on `sostenedor_rut` when present; manual merge UI in dashboard |
| Firecrawl monthly limit (free tier 500/mo) | Sequence scrapes by Tier (1 first); cache raw HTML; consider local Playwright fallback for high volume |
| ChileCompra API throttling | Respect documented limits (300 req/min); checkpoint progress; resumable script |

---

## Success metrics

- ≥80% of Tier 1 (402 sostenedores) with email + phone + verified
- ≥60% of Tier 2 (~1,100 sostenedores) with at least email
- ≥40% of Tier 3 (~6,000 sostenedores) with at least one channel
- <5% bounce rate on email verification
- Average confidence score ≥0.7 across all rows

---

## File checklist

- [x] `supabase/migrations/004_sostenedor_enrichment.sql`
- [ ] `scripts/discover-sostenedor-urls.mjs` (F1)
- [ ] `scripts/scrape-transparencia.mjs` (F2)
- [ ] `scripts/enrich-chilecompra.mjs` (F3)
- [ ] `scripts/scrape-sostenedor-sites.mjs` (F4)
- [ ] `scripts/llm-extract-contacts.mjs` (F5)
- [ ] `src/routes/admin/prospecting/contacts/+page.svelte` (F6)
- [ ] `src/lib/utils/sostenedor-contacts.ts` (F6 — types + helpers)
- [ ] `scripts/verify-emails.mjs` (F7)
- [ ] `docs/3-prospecting/enrichment.md` (docs update)
