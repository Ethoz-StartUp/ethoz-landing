/**
 * claims.ts — Única fuente de verdad para cifras de marketing del landing.
 *
 * Regla (PIVOTE-PLAN §1): toda cifra que aparezca en una página se importa
 * desde aquí, con su fuente y fecha. Nunca escribir números "de memoria" en
 * copy nuevo: si una cifra no está acá, no se publica.
 *
 * `value` usa formato es-CL; `valueEn` el formato en-US cuando difiere.
 */

export interface Claim {
  /** Valor tal como se muestra en la UI (formato es-CL). */
  value: string;
  /** Valor para la UI en inglés; si se omite, se usa `value`. */
  valueEn?: string;
  /** Contexto corto verificado (crecimiento, desglose, n de la muestra). */
  detail?: string;
  detailEn?: string;
  source: string;
  sourceUrl?: string;
  /** Fecha de la fuente (ISO). */
  date: string;
}

export const CLAIMS = {
  /** Denuncias de convivencia ante la Superintendencia durante 2025. */
  complaints2025: {
    value: '17.076',
    valueEn: '17,076',
    detail: '+22,2% interanual',
    detailEn: '+22.2% year over year',
    source: 'Emol / Superintendencia de Educación',
    date: '2026-02-10',
  },
  /** Participación de convivencia en el total de denuncias del sistema. */
  complaintsShare: {
    value: '75%',
    detail: 'del total de denuncias del sistema escolar',
    detailEn: 'of all complaints in the school system',
    source: 'Emol / Superintendencia de Educación',
    date: '2026-02-10',
  },
  /** Condena civil a un sostenedor por protocolo aplicado deficientemente. */
  courtRuling: {
    value: '$45,6M',
    valueEn: 'CLP $45.6M',
    detail: '$45.651.947 + $10.000.000 CLP',
    detailEn: 'CLP $45,651,947 + $10,000,000',
    source: 'PJUD, 17° Juzgado Civil de Santiago',
    date: '2026-06-01',
  },
  /** Encuesta nacional a directores: convivencia como inquietud #1. */
  directorsSurveyConvivencia: {
    value: '27,7%',
    valueEn: '27.7%',
    detail: 'n=5.734 directores',
    detailEn: 'n=5,734 principals',
    source: 'La Tercera',
    date: '2026-06-16',
  },
  /** Misma encuesta: sobrecarga administrativa como inquietud #2. */
  directorsSurveyOverload: {
    value: '27,1%',
    valueEn: '27.1%',
    detail: 'n=5.734 directores',
    detailEn: 'n=5,734 principals',
    source: 'La Tercera',
    date: '2026-06-16',
  },
  /** Tope de multas de la Ley 21.719 para infracciones gravísimas. */
  lawFinesCap: {
    value: '20.000 UTM',
    valueEn: '20,000 UTM',
    source: 'Ley 21.719, BCN',
    sourceUrl: 'https://www.bcn.cl/leychile/navegar?idNorma=1209272',
    date: '2024-12-13',
  },
  /** Establecimientos escolares en funcionamiento en Chile. */
  schoolsInChile: {
    value: '12.038',
    valueEn: '12,038',
    source: 'Directorio de establecimientos Mineduc 2025',
    sourceUrl: 'https://bibliotecadigital.mineduc.cl/handle/20.500.12365/21939',
    date: '2025-12-01',
  },
  /** Sostenedores registrados en Chile. */
  sostenedoresInChile: {
    value: '5.777',
    valueEn: '5,777',
    source: 'Directorio de establecimientos Mineduc 2025',
    sourceUrl: 'https://bibliotecadigital.mineduc.cl/handle/20.500.12365/21939',
    date: '2025-12-01',
  },
  /** Sostenedores multi-colegio (Tier 1 de la venta) según el directorio Mineduc. */
  multiSchoolOperators: {
    value: '401',
    source: 'Directorio de establecimientos Mineduc 2025, procesamiento Ethoz',
    sourceUrl: 'https://bibliotecadigital.mineduc.cl/handle/20.500.12365/21939',
    date: '2026-07-17',
  },
} as const satisfies Record<string, Claim>;

/**
 * Precio de la Auditoría de Ejecución de Protocolos.
 *
 * ⛔ PLACEHOLDER — el dueño fija el número antes de publicar /auditoria.
 * Mientras contenga "[X]", la página /auditoria NO debe deployarse
 * (lleva noindex y está fuera del sitemap como resguardo).
 */
export const AUDIT_PRICE_DISPLAY = 'desde $[X]00.000 por colegio';
export const AUDIT_PRICE_DISPLAY_EN = 'from CLP $[X]00,000 per school';

/** True mientras el precio de la auditoría siga sin definirse. */
export const AUDIT_PRICE_IS_PLACEHOLDER = AUDIT_PRICE_DISPLAY.includes('[X]');
