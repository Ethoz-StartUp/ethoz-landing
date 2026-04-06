export interface PitchSlide {
  start: number;
  end: number;
  id: string;
  subtitle: string;
}

export const pitchSlides: PitchSlide[] = [
  { start: 0, end: 5, id: 'intro', subtitle: 'Les presento a Ethoz, el escudo digital diseñado para la comunidad escolar de hoy.' },
  { start: 5, end: 20, id: 'problem', subtitle: '¿Dónde está la información más sensible de los alumnos? La realidad es que vive en planillas, libretas, WhatsApps... está por todos lados. Y ahí está el riesgo.' },
  { start: 20, end: 31, id: 'law', subtitle: 'Ahora se suma un nuevo desafío: la ley de protección de datos. Hablamos de la Ley 21.719. Va a cambiar las reglas del juego para todos.' },
  { start: 31, end: 48, id: 'fines', subtitle: 'La cuenta regresiva ya empezó. En diciembre de 2026, la ley entra en plena vigencia. Las multas pueden llegar hasta 20.000 UTM — más de $1.200 millones.' },
  { start: 48, end: 53, id: 'classification', subtitle: 'La ley clasifica las faltas en leves, graves y gravísimas, con sanciones para cada nivel.' },
  { start: 53, end: 58, id: 'solution', subtitle: 'Aquí es donde entra Ethoz, el escudo digital que protege al colegio y cumple la ley.' },
  { start: 58, end: 71, id: 'features-a', subtitle: 'Centralizamos todo en una ficha 360° por alumno. Las alertas críticas llegan al instante, solo a las personas que deben saber.' },
  { start: 71, end: 80, id: 'features-b', subtitle: 'En portería, validan quién retira a un alumno en segundos. Cada persona ve solo lo que necesita para su rol.' },
  { start: 80, end: 92, id: 'implementation', subtitle: 'Implementarlo es fácil. Conectamos el colegio, migramos los datos y listo. En semanas, el equipo ya está funcionando.' },
  { start: 92, end: 99, id: 'security', subtitle: 'Usamos cifrado de nivel bancario y todos los datos se guardan de forma segura aquí en Chile.' },
  { start: 99, end: 109, id: 'urgency', subtitle: 'La ley no espera. Prepararse hoy significa estar tranquilos mañana. Para 2026, abrimos un programa piloto.' },
  { start: 109, end: 999, id: 'cta', subtitle: 'Los cupos son muy limitados. Agenden su demo en ethoz.cl y aseguren su cupo para ser de los primeros en cumplir.' },
];

/** Countdown target: Ley 21.719 enforcement date */
export const ENFORCEMENT_DATE = '2026-12-01T00:00:00-03:00';

export function getDaysUntilEnforcement(): number {
  const diff = new Date(ENFORCEMENT_DATE).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / 86400000));
}
