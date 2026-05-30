/**
 * Compact Chilean school record as stored in `static/data/schools.json`.
 *
 * Field names are intentionally short to keep the ~12k-record JSON payload small.
 * Shared by the prospecting utilities and the school-search store so both decode
 * the same on-disk shape.
 */
export interface SchoolCompact {
  /** RBD — Rol Base de Datos, the school's unique Mineduc identifier. */
  r: number;
  /** Name — official school name. */
  n: string;
  /** Region code — Chilean region number (1–16). */
  rg: number;
  /** Commune — comuna name. */
  c: string;
  /** Sostenedor — name of the operator/holder that runs the school. */
  s: string;
  /** Matrícula — total student enrollment. */
  m: number;
  /** Dependency code — administrative dependency type (see DEP_LABELS). */
  d: number;
  /** Latitude — geographic coordinate. */
  lt: number;
  /** Longitude — geographic coordinate. */
  lg: number;
}
