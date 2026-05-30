#!/usr/bin/env bash
# deploy-backend-hardening.sh — AI-agent-optimized backend deploy for ethoz-landing.
#
# Applies the post-audit security hardening that needs an authenticated Supabase CLI:
#   1. secrets   — OAUTH_STATE_SECRET (+ optional META_PAGE_ID / ADMIN_USER_ID)
#   2. migration — 005_leads_rls_hardening.sql (drop anon INSERT + scope leads RLS)
#   3. functions — deploy the 8 changed Edge Functions
#   4. verify    — probe verify-lead to confirm it is deployed + reachable
#
# AGENT CONTRACT
#   - Non-interactive: config via flags/env ONLY. Never prompts. No TTY required.
#   - SAFE DEFAULT: without --yes it runs as --dry-run (no prod mutation).
#   - Idempotent + re-runnable: secret set only if absent; migration 005 + function
#     deploys are idempotent. Safe to retry after a partial failure.
#   - Order enforced: secret → migration → functions → verify. A failed step aborts
#     later ones, so functions never deploy without OAUTH_STATE_SECRET (else OAuth 400s).
#   - Machine-readable: a single JSON object is printed to STDOUT (always); human
#     step lines go to STDERR (suppressed with --json). Parse stdout.
#   - Exit codes: 0 ok · 2 precondition · 3 secrets · 4 migration · 5 functions · 6 verify.
#
# USAGE
#   ./scripts/deploy-backend-hardening.sh --plan        # print the plan as JSON, no side effects
#   ./scripts/deploy-backend-hardening.sh               # DRY RUN (no --yes), prints what it would do
#   ./scripts/deploy-backend-hardening.sh --yes         # real run
#   SUPABASE_DB_URL=postgresql://... ./scripts/deploy-backend-hardening.sh --yes
#   ./scripts/deploy-backend-hardening.sh --yes --skip-migration --json
#
# CONFIG (env)
#   PROJECT_REF=irpesrcijcdwyjxxwpyb     # supabase project ref (default below)
#   OAUTH_STATE_SECRET=<hex>             # used verbatim if set (deterministic); else generated when absent
#   SUPABASE_DB_URL=postgresql://...     # required to auto-apply migration 005 (else pass --skip-migration)
#   META_PAGE_ID / ADMIN_USER_ID         # optional extra Edge Function secrets

set -u

PROJECT_REF="${PROJECT_REF:-irpesrcijcdwyjxxwpyb}"
MIGRATION="supabase/migrations/005_leads_rls_hardening.sql"
FUNCTIONS=(verify-lead social-publish cal-webhook new-lead-notify request-resource social-auth-linkedin social-auth-google social-auth-meta)

YES=0; DRY=0; JSON=0; SKIP_MIG=0; NO_VERIFY=0; PLAN=0
for arg in "$@"; do
  case "$arg" in
    --yes) YES=1 ;;
    --dry-run) DRY=1 ;;
    --json) JSON=1 ;;
    --skip-migration) SKIP_MIG=1 ;;
    --no-verify) NO_VERIFY=1 ;;
    --plan) PLAN=1 ;;
    --help|-h) sed -n '2,46p' "$0"; exit 0 ;;
    *) echo "{\"ok\":false,\"error\":\"unknown arg: $arg\",\"exit\":2}"; exit 2 ;;
  esac
done
# Safe default for agents: anything without an explicit --yes is a dry run.
[ "$YES" -eq 1 ] || DRY=1

STEPS_JSON=""
add_step() { # <id> <name> <status> <detail>
  STEPS_JSON="${STEPS_JSON:+$STEPS_JSON,}{\"id\":$1,\"name\":\"$2\",\"status\":\"$3\",\"detail\":\"$4\"}"
  [ "$JSON" -eq 1 ] || echo "STEP $1 $2 $3 — $4" >&2
}
finish() { # <ok-bool> <exit> <hint>
  local dr; dr=$([ "$DRY" -eq 1 ] && echo true || echo false)
  echo "{\"ok\":$1,\"dry_run\":$dr,\"project_ref\":\"$PROJECT_REF\",\"steps\":[$STEPS_JSON],\"hint\":\"$3\",\"exit\":$2}"
  exit "$2"
}

if [ "$PLAN" -eq 1 ]; then
  echo "{\"plan\":[\"1:secrets:OAUTH_STATE_SECRET\",\"2:migration:005_leads_rls\",\"3:functions:${FUNCTIONS[*]}\",\"4:verify:verify-lead\"],\"order_enforced\":true,\"non_interactive\":true,\"safe_default\":\"dry-run unless --yes\",\"project_ref\":\"$PROJECT_REF\",\"exit\":0}"
  exit 0
fi

# ── Preflight ──
command -v supabase >/dev/null 2>&1 || { add_step 0 preflight FAIL "supabase CLI missing"; finish false 2 "brew install supabase/tap/supabase && supabase login"; }
[ -f "$MIGRATION" ] || { add_step 0 preflight FAIL "not repo root"; finish false 2 "cd to the repo root"; }
if [ "$DRY" -eq 0 ] && ! supabase projects list >/dev/null 2>&1; then
  add_step 0 preflight FAIL "supabase CLI not authenticated"; finish false 2 "supabase login"
fi
add_step 0 preflight OK "cli+repo$([ "$DRY" -eq 0 ] && echo "+auth")"

# ── Step 1: secrets ──
if [ "$DRY" -eq 1 ]; then
  add_step 1 secrets DRYRUN "would set OAUTH_STATE_SECRET if absent"
elif [ -n "${OAUTH_STATE_SECRET:-}" ]; then
  supabase secrets set "OAUTH_STATE_SECRET=$OAUTH_STATE_SECRET" --project-ref "$PROJECT_REF" >/dev/null 2>&1 \
    && add_step 1 secrets OK "set from env" || { add_step 1 secrets FAIL "set failed"; finish false 3 "check auth/project-ref"; }
elif supabase secrets list --project-ref "$PROJECT_REF" 2>/dev/null | grep -q "OAUTH_STATE_SECRET"; then
  add_step 1 secrets SKIP "already present (not rotating)"
else
  supabase secrets set "OAUTH_STATE_SECRET=$(openssl rand -hex 32)" --project-ref "$PROJECT_REF" >/dev/null 2>&1 \
    && add_step 1 secrets OK "generated + set" || { add_step 1 secrets FAIL "set failed"; finish false 3 "check supabase auth"; }
fi
if [ "$DRY" -eq 0 ]; then
  [ -n "${META_PAGE_ID:-}" ]  && supabase secrets set "META_PAGE_ID=$META_PAGE_ID"   --project-ref "$PROJECT_REF" >/dev/null 2>&1
  [ -n "${ADMIN_USER_ID:-}" ] && supabase secrets set "ADMIN_USER_ID=$ADMIN_USER_ID" --project-ref "$PROJECT_REF" >/dev/null 2>&1
fi

# ── Step 2: migration ──
if [ "$SKIP_MIG" -eq 1 ]; then
  add_step 2 migration SKIP "--skip-migration"
elif [ "$DRY" -eq 1 ]; then
  add_step 2 migration DRYRUN "would apply $MIGRATION via psql if SUPABASE_DB_URL set"
elif [ -n "${SUPABASE_DB_URL:-}" ]; then
  command -v psql >/dev/null 2>&1 || { add_step 2 migration FAIL "psql missing"; finish false 4 "install psql, or apply 005 in SQL editor then --skip-migration"; }
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$MIGRATION" >/dev/null 2>&1 \
    && add_step 2 migration OK "005 applied via psql" || { add_step 2 migration FAIL "psql apply failed"; finish false 4 "inspect SUPABASE_DB_URL / 005 sql"; }
else
  add_step 2 migration FAIL "no SUPABASE_DB_URL"
  finish false 4 "export SUPABASE_DB_URL=postgresql://... OR apply 005 in the SQL editor then re-run with --skip-migration (do NOT use 'supabase db push' — it would re-create existing policies 001-004 and fail)"
fi

# ── Step 3: functions ──
if [ "$DRY" -eq 1 ]; then
  add_step 3 functions DRYRUN "would deploy ${#FUNCTIONS[@]} functions"
else
  supabase functions deploy "${FUNCTIONS[@]}" --project-ref "$PROJECT_REF" >/dev/null 2>&1 \
    && add_step 3 functions OK "deployed ${#FUNCTIONS[@]}" || { add_step 3 functions FAIL "deploy failed"; finish false 5 "supabase functions deploy logs"; }
fi

# ── Step 4: verify ──
if [ "$NO_VERIFY" -eq 1 ] || [ "$DRY" -eq 1 ]; then
  add_step 4 verify SKIP "$([ "$DRY" -eq 1 ] && echo dry-run || echo --no-verify)"
else
  code=$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -d '{}' \
    "https://${PROJECT_REF}.supabase.co/functions/v1/verify-lead" 2>/dev/null || echo 000)
  if [ "$code" = "400" ]; then
    add_step 4 verify OK "verify-lead up (HTTP 400 on empty body, expected)"
  else
    add_step 4 verify FAIL "verify-lead HTTP $code (expected 400)"; finish false 6 "recheck function deploy + project ref"
  fi
fi

finish true 0 "backend hardening live — smoke-check a /demo lead + a social reconnect in /admin/content"
