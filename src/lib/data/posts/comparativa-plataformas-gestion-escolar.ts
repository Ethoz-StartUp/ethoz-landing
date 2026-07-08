import type { BlogPost } from './types';
import { BRAND } from '$lib/brand';

export const post: BlogPost = {
	slug: 'comparativa-plataformas-gestion-escolar',
	title: 'Comparativa 2026: qué cubren las 8 plataformas de gestión escolar en Chile y lo que ninguna fue diseñada para cubrir',
	description:
		'Lirmi, Colegium, WebClass, Napsis, Syscol, Kimche, U-Planner e Integratepie: qué resuelve cada plataforma según su documentación pública y el gap que ninguna fue diseñada para cubrir en protección de datos y convivencia escolar.',
	date: '2026-04-07',
	author: `Equipo ${BRAND}`,
	readTime: '10 min',
	tags: ['Comparativa', 'Software Escolar', 'Gestión Escolar'],
	coverImage: '/images/blog/comparativa-plataformas-gestion-escolar.webp',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Las ocho plataformas de gestión escolar más usadas en Chile resuelven bien la gestión académica y administrativa para la que fueron diseñadas. Pero ninguna fue diseñada con las exigencias de la Ley 21.719 ni la Ley 21.663 como requisito base, y su documentación pública no describe las medidas técnicas que esas leyes exigen. El gap que queda sin cubrir es el que ${BRAND} aborda como complemento, no como reemplazo: protección, convivencia y trazabilidad longitudinal con arquitectura de seguridad nativa.</p>
</div>

<h2>El mercado de software escolar en Chile en 2026</h2>
<p>El mercado chileno de software de gestión escolar está fragmentado entre plataformas que nacieron en contextos normativos muy diferentes al actual. La mayoría nació para gestionar notas y asistencia en un entorno donde la protección de datos personales no tenía el peso legal que tiene hoy, y su documentación pública no describe una adaptación a los nuevos requisitos.</p>
<p>Con la <strong>Ley 21.719</strong> a meses de su plena vigencia (diciembre de 2026) y la <strong>Ley 21.663</strong> imponiendo estándares de ciberseguridad, los establecimientos enfrentan en 2026 una decisión que no pueden postergar: ¿puede su plataforma actual cumplir con lo que la ley exige? El análisis de por qué la respuesta generalmente es negativa está en <a href="/blog/ninguna-plataforma-cumple-ley-21719">Por qué ninguna plataforma de gestión escolar cumple la Ley 21.719</a>.</p>
<p>A continuación, una revisión de cada plataforma con sus fortalezas declaradas y lo que su documentación pública no cubre.</p>

<h2>1. Lirmi</h2>
<p><strong>Posicionamiento:</strong> Plataforma de gestión pedagógica y curricular con enfoque en planificación docente y seguimiento de objetivos de aprendizaje. Presencia en Chile, México y Colombia.</p>
<p><strong>Fortalezas:</strong> interfaz relativamente moderna, buena experiencia docente en planificación, integración con el currículum MINEDUC.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Sin API pública documentada:</strong> la documentación pública de Lirmi no describe una API abierta para integraciones con otros sistemas, lo que dificulta que los datos salgan de manera estructurada hacia otras herramientas del establecimiento.</li>
  <li><strong>Interoperabilidad limitada:</strong> sin integraciones abiertas documentadas, el establecimiento que adopta Lirmi asume que su información pedagógica puede quedar en un silo.</li>
  <li><strong>Sin módulo de convivencia estructurado:</strong> su oferta pública no incluye un sistema de gestión de incidentes de convivencia con historial longitudinal.</li>
  <li><strong>Sin cumplimiento explícito de Ley 21.719:</strong> no hay documentación pública sobre las medidas técnicas que Lirmi implementa para el cumplimiento de la ley de protección de datos.</li>
</ul>

<h2>2. Colegium</h2>
<p><strong>Posicionamiento:</strong> Una de las plataformas con mayor penetración histórica en el mercado chileno. Cubre gestión académica, comunicaciones con apoderados y administración.</p>
<p><strong>Fortalezas:</strong> amplia base instalada, reconocimiento de marca, cobertura de múltiples procesos administrativos.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Arquitectura anterior al nuevo marco normativo:</strong> la plataforma se consolidó años antes de que existieran la Ley 21.719 y la Ley 21.663, y su documentación pública no describe un rediseño orientado a esas exigencias.</li>
  <li><strong>Módulo de convivencia acotado:</strong> según su documentación pública, el registro de incidentes no incluye historial longitudinal ni el control de acceso por rol que la gestión de datos sensibles requiere.</li>
  <li><strong>Sin arquitectura de cifrado documentada:</strong> no hay información pública verificable sobre cómo Colegium maneja el cifrado de datos en reposo.</li>
</ul>

<h2>3. WebClass</h2>
<p><strong>Posicionamiento:</strong> Plataforma de gestión académica y curricular con fuerte presencia en el segmento de colegios particulares pagados.</p>
<p><strong>Fortalezas:</strong> buena cobertura de los procesos de gestión académica, interfaz familiar para equipos con historia en la plataforma.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Portabilidad limitada:</strong> su documentación pública no describe formatos de exportación estándar, por lo que migrar los datos a otro sistema puede resultar costoso.</li>
  <li><strong>Modelo de precios por módulo:</strong> las funcionalidades básicas están disponibles, pero las capacidades avanzadas (reportes, integración con otros sistemas, acceso de múltiples roles) se cobran como módulos adicionales, generando costos que escalan con el tamaño del establecimiento.</li>
  <li><strong>Sin API pública documentada:</strong> según la información disponible, la interoperabilidad con otros sistemas es limitada o requiere acuerdos comerciales específicos con el proveedor.</li>
</ul>

<h2>4. Napsis</h2>
<p><strong>Posicionamiento:</strong> Plataforma de administración escolar con énfasis en los procesos de gestión financiera y matrícula. Orientada principalmente al segmento municipal y subvencionado.</p>
<p><strong>Fortalezas:</strong> cobertura de procesos administrativos financieros, familiaridad en el sector municipal.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Cifrado en reposo no documentado:</strong> la documentación pública de Napsis no describe cifrado de datos a nivel de base de datos, una de las medidas técnicas que la Ley 21.663 exige considerar.</li>
  <li><strong>Control de acceso granular no documentado:</strong> su documentación pública no menciona Row-Level Security; el control de acceso descrito opera a nivel de módulo, no a nivel de registro individual.</li>
  <li><strong>Integraciones limitadas:</strong> su documentación pública no describe mecanismos para integrarse con herramientas externas de manera ágil.</li>
</ul>

<h2>5. Syscol</h2>
<p><strong>Posicionamiento:</strong> Sistema de gestión escolar orientado a establecimientos de tamaño mediano con énfasis en administración y comunicación con apoderados.</p>
<p><strong>Fortalezas:</strong> precio competitivo, funcionalidades básicas cubiertas, implantación relativamente rápida.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Sin API documentada:</strong> la documentación pública de Syscol no menciona una API para integraciones, lo que limita la exportación estructurada hacia herramientas de análisis o hacia otros sistemas del establecimiento.</li>
  <li><strong>Escasa capacidad de personalización:</strong> el sistema funciona bien para el caso de uso estándar pero tiene poca flexibilidad para adaptar procesos a las necesidades específicas de cada establecimiento.</li>
  <li><strong>Sin módulo de protección escolar:</strong> la dimensión de convivencia y bienestar no está cubierta de manera estructurada.</li>
</ul>

<h2>6. Kimche</h2>
<p><strong>Posicionamiento:</strong> Plataforma relativamente más reciente en el mercado chileno con propuesta de modernización frente a las plataformas heredadas.</p>
<p><strong>Fortalezas:</strong> interfaz más moderna que las plataformas de primera generación, propuesta de integración de procesos.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Precios opacos:</strong> Kimche no publica sus precios públicamente. El proceso de cotización requiere contacto con el equipo comercial, lo que dificulta la comparación objetiva por parte de los sostenedores.</li>
  <li><strong>Historial más corto:</strong> la plataforma tiene menos historial que las incumbentes, lo que implica menos datos sobre estabilidad y rendimiento en escenarios de uso intensivo.</li>
  <li><strong>Cumplimiento normativo no documentado:</strong> no hay información pública verificable sobre las medidas técnicas implementadas para el cumplimiento de las leyes 21.719 y 21.663.</li>
</ul>

<h2>7. U-Planner</h2>
<p><strong>Posicionamiento:</strong> Plataforma de planificación académica y gestión curricular diseñada específicamente para la educación superior universitaria.</p>
<p><strong>Fortalezas:</strong> profunda especialización en los procesos específicos de las universidades, reconocimiento en el segmento de educación superior.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Alcance exclusivo de educación superior:</strong> U-Planner no está diseñado para establecimientos de educación básica o media. Su inclusión en este análisis es para documentar que no es una alternativa para el mercado escolar, pese a que a veces se menciona en conversaciones sobre software educacional.</li>
  <li><strong>Sin relevancia para sostenedores escolares:</strong> los procesos que U-Planner cubre (gestión de mallas curriculares universitarias, planificación de carreras, acreditación institucional) no tienen equivalente en la educación escolar.</li>
</ul>

<h2>8. Integratepie</h2>
<p><strong>Posicionamiento:</strong> Solución de gestión escolar desarrollada por una microempresa con foco en establecimientos de tamaño pequeño a mediano.</p>
<p><strong>Fortalezas:</strong> precio accesible, soporte personalizado por el tamaño del equipo proveedor, implementación simple.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Riesgo de continuidad de negocio:</strong> el tamaño de la empresa proveedora genera incertidumbre sobre la continuidad del soporte a largo plazo. Un cambio en el equipo o en la situación financiera del proveedor puede dejar al establecimiento sin soporte.</li>
  <li><strong>Capacidad técnica limitada:</strong> las exigencias de cifrado, auditoría y control de acceso que imponen las leyes 21.719 y 21.663 requieren un equipo de ingeniería con capacidades específicas que una microempresa típicamente no tiene.</li>
  <li><strong>Sin escalabilidad:</strong> la plataforma puede funcionar bien para establecimientos pequeños pero tiene limitaciones para crecer con las necesidades de redes de colegios o establecimientos de mayor tamaño.</li>
</ul>

<h2>El gap que ninguna plataforma fue diseñada para cubrir</h2>
<p>La revisión de las ocho plataformas revela un patrón consistente: todas fueron diseñadas para resolver el problema de gestión académica y administrativa de la era pre-normativa. Ninguna fue construida con las exigencias de la Ley 21.719 ni la Ley 21.663 como requisito de diseño.</p>
<p>El gap específico que queda sin cubrir es la intersección de tres capacidades:</p>
<ol>
  <li><strong>Protección de datos con cifrado nativo y control de acceso por rol a nivel de base de datos</strong> (no solo en la capa de aplicación).</li>
  <li><strong>Gestión de convivencia con historial longitudinal</strong> que persiste entre años y permite detectar patrones de riesgo.</li>
  <li><strong>Trazabilidad de auditoría completa</strong> que permita responder ante una fiscalización con evidencia de qué datos existen, quién los accedió y qué acciones se adoptaron.</li>
</ol>
<p>Este es el espacio que ${BRAND} ocupa. No reemplaza la plataforma de gestión académica que el establecimiento ya usa: la complementa como el sistema especializado en protección escolar y cumplimiento normativo que el contexto regulatorio de 2026 exige.</p>

<h2>Conclusión</h2>
<p>La elección de plataforma de gestión escolar en 2026 no puede hacerse con los criterios de 2015. El contexto normativo cambió de manera fundamental: ya no es suficiente con que el sistema funcione operativamente. Debe cumplir con estándares técnicos de seguridad que la mayoría de las plataformas no documenta públicamente. Los sostenedores que evalúen o renueven sus contratos de software escolar en 2026 deben hacer tres preguntas concretas: ¿los datos están cifrados en reposo? ¿Existe control de acceso a nivel de base de datos? ¿Hay un log de auditoría inmutable? Si la respuesta a cualquiera de las tres es no, el establecimiento está expuesto.</p>

<div style="background: var(--secondary); border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-top: 3rem;">
<h3 style="margin-top: 0;">Conozca la alternativa diseñada para el contexto normativo de 2026</h3>
<p>${BRAND} fue construido desde cero con cifrado pgcrypto, Row-Level Security y auditoría pgAudit como requisitos no negociables. Solicite una demostración técnica y compare con lo que tiene hoy.</p>
<a href="/demo" style="display: inline-block; background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Agendar demo</a>
</div>
`
};
