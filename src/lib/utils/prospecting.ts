// ── Types ──

export interface SchoolCompact {
  r: number;
  n: string;
  rg: number;
  c: string;
  s: string;
  m: number;
  d: number;
  lt: number;
  lg: number;
}

export interface Sostenedor {
  name: string;
  schools: SchoolCompact[];
  totalEnrollment: number;
  schoolCount: number;
  regions: number[];
  communes: string[];
  depTypes: number[];
  primaryDepType: number;
  score: number;
  tier: 1 | 2 | 3;
}

// ── Labels ──

export const DEP_LABELS: Record<number, string> = {
  1: 'Municipal (Corp.)',
  2: 'Municipal (DAEM)',
  3: 'Part. Subvencionado',
  4: 'Part. Pagado',
  5: 'Admin. Delegada',
  6: 'Servicio Local Ed.',
};

export const REGION_NAMES: Record<number, string> = {
  1: 'Tarapacá',
  2: 'Antofagasta',
  3: 'Atacama',
  4: 'Coquimbo',
  5: 'Valparaíso',
  6: "O'Higgins",
  7: 'Maule',
  8: 'Biobío',
  9: 'La Araucanía',
  10: 'Los Lagos',
  11: 'Aysén',
  12: 'Magallanes',
  13: 'Metropolitana',
  14: 'Los Ríos',
  15: 'Arica y Parinacota',
  16: 'Ñuble',
};

// ── Scoring ──

function scoreDep(depType: number): number {
  switch (depType) {
    case 4: return 25;
    case 3: return 20;
    case 5: return 15;
    case 1: return 10;
    case 2: return 8;
    case 6: return 5;
    default: return 5;
  }
}

function scoreEnrollment(total: number): number {
  if (total >= 10000) return 35;
  if (total >= 5000) return 30;
  if (total >= 2000) return 25;
  if (total >= 1000) return 20;
  if (total >= 500) return 15;
  if (total >= 200) return 10;
  return 5;
}

function scoreSchoolCount(count: number): number {
  if (count >= 20) return 30;
  if (count >= 10) return 25;
  if (count >= 5) return 20;
  if (count >= 3) return 15;
  if (count >= 2) return 10;
  return 5;
}

function scoreRegion(regions: number[]): number {
  if (regions.includes(13)) return 10;
  if (regions.includes(5) || regions.includes(8)) return 7;
  return 5;
}

export function computeScore(s: {
  totalEnrollment: number;
  schoolCount: number;
  depTypes: number[];
  regions: number[];
}): number {
  const sorted = [...s.depTypes].sort((a, b) => scoreDep(b) - scoreDep(a));
  const primaryDep = sorted[0] ?? 6;
  return (
    scoreEnrollment(s.totalEnrollment) +
    scoreSchoolCount(s.schoolCount) +
    scoreDep(primaryDep) +
    scoreRegion(s.regions)
  );
}

export function getTier(score: number): 1 | 2 | 3 {
  if (score >= 60) return 1;
  if (score >= 35) return 2;
  return 3;
}

// ── Build sostenedor list from raw school data ──

export function buildSostenedores(schools: SchoolCompact[]): Sostenedor[] {
  const map = new Map<
    string,
    {
      schools: SchoolCompact[];
      totalEnrollment: number;
      regions: Set<number>;
      communes: Set<string>;
      depTypes: Set<number>;
    }
  >();

  for (const school of schools) {
    const key = school.s || 'Sin sostenedor';
    let entry = map.get(key);
    if (!entry) {
      entry = {
        schools: [],
        totalEnrollment: 0,
        regions: new Set(),
        communes: new Set(),
        depTypes: new Set(),
      };
      map.set(key, entry);
    }
    entry.schools.push(school);
    entry.totalEnrollment += school.m || 0;
    entry.regions.add(school.rg);
    entry.communes.add(school.c);
    entry.depTypes.add(school.d);
  }

  const result: Sostenedor[] = [];
  for (const [name, data] of map) {
    const regions = [...data.regions];
    const depTypes = [...data.depTypes];
    const score = computeScore({
      totalEnrollment: data.totalEnrollment,
      schoolCount: data.schools.length,
      depTypes,
      regions,
    });
    const sorted = [...depTypes].sort((a, b) => scoreDep(b) - scoreDep(a));
    result.push({
      name,
      schools: data.schools,
      totalEnrollment: data.totalEnrollment,
      schoolCount: data.schools.length,
      regions,
      communes: [...data.communes],
      depTypes,
      primaryDepType: sorted[0] ?? 6,
      score,
      tier: getTier(score),
    });
  }

  return result.sort((a, b) => b.score - a.score || b.totalEnrollment - a.totalEnrollment);
}

// ── CSV export ──

export function exportCSV(sostenedores: Sostenedor[]): string {
  const headers = [
    'Tier',
    'Score',
    'Sostenedor',
    'Colegios',
    'Alumnos Total',
    'Tipo Dependencia',
    'Regiones',
    'Comunas',
  ];
  const rows = sostenedores.map((s) => [
    s.tier,
    s.score,
    `"${s.name.replace(/"/g, '""')}"`,
    s.schoolCount,
    s.totalEnrollment,
    `"${s.depTypes.map((d) => DEP_LABELS[d] || d).join(', ')}"`,
    `"${s.regions.map((r) => REGION_NAMES[r] || r).join(', ')}"`,
    `"${s.communes.join(', ')}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
