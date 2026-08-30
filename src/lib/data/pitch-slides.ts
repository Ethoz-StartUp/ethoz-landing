import { BRAND } from '$lib/brand';

export interface PitchSlide {
  start: number;
  end: number;
  id: string;
  subtitle: string;
}

// Guion interno del pitch (PIVOTE-PLAN L3.4): convivencia con evidencia legal.
// Los subtítulos son el texto hablado que acompaña cada slide del PitchModal
// y del video generado con scripts/generate-pitch-video.mjs.
export const pitchSlides: PitchSlide[] = [
  { start: 0, end: 5, id: 'intro', subtitle: `Les presento a ${BRAND}, la plataforma que ejecuta los protocolos de convivencia del colegio y deja el expediente listo para cuando llegue la denuncia.` },
  { start: 5, end: 20, id: 'problem', subtitle: 'Las denuncias de convivencia suben todos los años. Cuando una llega, todos corren a buscar actas, correos y acuerdos repartidos en planillas, libretas y WhatsApps. Lo que no queda registrado, no existe.' },
  { start: 20, end: 31, id: 'law', subtitle: 'A eso se suma la Ley 21.719 de protección de datos, que entra en vigencia plena en diciembre de 2026 y endurece las reglas para los datos de menores.' },
  { start: 31, end: 48, id: 'fines', subtitle: 'El riesgo no es teórico: un tribunal condenó a un sostenedor a pagar más de 45 millones de pesos porque su protocolo se aplicó deficientemente y no pudo probarse. Y la ley agrega multas de hasta 20.000 UTM.' },
  { start: 48, end: 53, id: 'classification', subtitle: 'La ley clasifica las faltas en leves, graves y gravísimas, con sanciones para cada nivel.' },
  { start: 53, end: 58, id: 'solution', subtitle: `Aquí es donde entra ${BRAND}: convierte el reglamento del colegio en protocolos que se ejecutan con plazos, y cada paso queda en el expediente del caso.` },
  { start: 58, end: 71, id: 'features-a', subtitle: 'Cada denuncia abre su expediente: actas, medidas y comunicaciones citadas y exportables. El motor de protocolos asigna responsable y vencimiento en días hábiles, y avisa antes de que algo venza.' },
  { start: 71, end: 80, id: 'features-b', subtitle: 'La IA redacta actas y descargos citando la evidencia, siempre con aprobación humana. Y el sostenedor ve el riesgo de toda su red en un solo panel.' },
  { start: 80, end: 92, id: 'implementation', subtitle: 'Partir es simple: importamos el reglamento y los casos actuales desde Excel o CSV. En semanas, el equipo ya está ejecutando con plazos.' },
  { start: 92, end: 99, id: 'security', subtitle: 'Los datos viven cifrados en Chile, con aislamiento entre colegios y registro de auditoría de cada acceso.' },
  { start: 99, end: 109, id: 'urgency', subtitle: 'Entre agosto y octubre abrimos cupos para la Auditoría de Ejecución de Protocolos: en dos semanas, el colegio sabe qué resiste un descargo y qué falta en su expediente.' },
  { start: 109, end: 999, id: 'cta', subtitle: 'Agenden la conversación inicial en ethoz.cl. Cuando llegue la denuncia, que el expediente ya exista.' },
];

/** Countdown target: Ley 21.719 enforcement date */
export const ENFORCEMENT_DATE = '2026-12-01T00:00:00-03:00';

export function getDaysUntilEnforcement(): number {
  const diff = new Date(ENFORCEMENT_DATE).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / 86400000));
}
