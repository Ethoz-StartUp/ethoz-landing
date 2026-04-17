export type EventPayload = Record<string, string | number | boolean | null | undefined>;

const PII_KEYS = new Set([
  'email',
  'phone',
  'telefono',
  'name',
  'first_name',
  'last_name',
  'nombre',
  'apellido',
  'rut',
  'address',
  'direccion',
  'message',
  'mensaje',
  'notes',
]);

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(\+?56\s?9\s?\d{4}\s?\d{4})|(\+?\d[\d\s-]{7,})/;

function looksLikePii(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  if (EMAIL_RE.test(value)) return true;
  if (PHONE_RE.test(value)) return true;
  return false;
}

export function scrubEvent(payload: EventPayload): EventPayload {
  const out: EventPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (PII_KEYS.has(key.toLowerCase())) continue;
    if (looksLikePii(value)) continue;
    out[key] = value;
  }
  return out;
}
