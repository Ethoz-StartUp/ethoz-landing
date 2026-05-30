// Shared HMAC-signed OAuth `state` — binds the CSRF token to a server secret so
// it cannot be forged with just a fresh timestamp (the previous scheme validated
// only the timestamp; the random nonce was never stored or compared).
//
// REQUIRES the OAUTH_STATE_SECRET Edge Function secret:
//   supabase secrets set OAUTH_STATE_SECRET=<long-random-string> --project-ref <ref>
// Fails CLOSED (verifyState returns false / signState throws) if it is unset.

const STATE_TTL_MS = 10 * 60 * 1000;

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time compare to avoid a signature timing oracle.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// Returns `${ts}:${nonce}:${hmac(ts:nonce)}`.
export async function signState(): Promise<string> {
  const secret = Deno.env.get("OAUTH_STATE_SECRET");
  if (!secret) throw new Error("OAUTH_STATE_SECRET not configured");
  const payload = `${Date.now()}:${crypto.randomUUID()}`;
  const sig = await hmacHex(secret, payload);
  return `${payload}:${sig}`;
}

// Verifies the HMAC and the 10-minute freshness window. Fails closed.
export async function verifyState(state: string | null): Promise<boolean> {
  const secret = Deno.env.get("OAUTH_STATE_SECRET");
  if (!secret || !state) return false;
  const parts = state.split(":");
  if (parts.length !== 3) return false;
  const [tsStr, nonce, sig] = parts;
  const ts = Number(tsStr);
  if (isNaN(ts) || Date.now() - ts > STATE_TTL_MS) return false;
  const expected = await hmacHex(secret, `${tsStr}:${nonce}`);
  return timingSafeEqual(expected, sig);
}
