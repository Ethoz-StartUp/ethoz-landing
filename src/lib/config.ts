// ── Contact info — single source of truth ──
// Change here and it updates everywhere (contact page, homepage CTA, footer, etc.)

import { BRAND } from '$lib/brand';

export const CONTACT = {
  email: {
    address: 'contacto@ethoz.cl',
    get link() {
      const subject = encodeURIComponent(`Consulta sobre ${BRAND}`);
      const body = encodeURIComponent(`Hola equipo ${BRAND},\n\nMe gustaría saber más sobre la plataforma para mi establecimiento educacional.\n\nQuedo atento a su respuesta.\n\nSaludos cordiales,`);
      return `mailto:${this.address}?subject=${subject}&body=${body}`;
    },
  },
  legal: 'legal@ethoz.cl',
  privacy: 'privacidad@ethoz.cl',
} as const;
