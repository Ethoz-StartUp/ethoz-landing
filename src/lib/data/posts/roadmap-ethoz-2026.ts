import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'roadmap-ethoz-2026',
	title: 'Lo que viene: el roadmap de Ethoz para 2026',
	description:
		'Somos transparentes sobre lo que hemos construido y lo que falta. Este es el roadmap de Ethoz: los módulos fundacionales, lo que viene y lo que no vamos a hacer.',
	date: '2026-04-02',
	author: 'Ignacio Araya',
	readTime: '6 min',
	tags: ['Ethoz', 'Producto', 'Roadmap'],
	coverImage: '/images/blog/roadmap-ethoz-2026.webp',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Ethoz ya tiene cinco módulos funcionando: ficha del alumno, retiros seguros, cumplimiento de la Ley 21.719, permisos por cargo y búsqueda instantánea. En 2026 construiremos app móvil, integración con SIGE, módulo financiero básico, comunicación con familias y un dashboard de cumplimiento normativo. Todo con el mismo filtro: ¿protege al alumno, sus datos o la institución?</p>
</div>

<h2>Construir diferente desde el principio</h2>
<p>Ethoz nació para resolver lo que el mercado escolar chileno no resuelve: la seguridad del alumno en tiempo real y la privacidad de sus datos conforme a la <a href="/blog/ley-21719-que-deben-saber-los-colegios">Ley 21.719</a>. Mientras los sistemas tradicionales se enfocaron en el libro de clases y la gestión académica, el problema de quién retira a un niño, quién puede ver su ficha y qué datos se pueden almacenar legalmente quedó sin respuesta.</p>
<p>Pero sabemos que un colegio necesita más que seguridad y privacidad. Necesita operar. Necesita comunicarse con las familias. Necesita controlar sus finanzas. Por eso estamos construyendo en fases, sin perder nuestro ADN. Este artículo es nuestra forma de ser transparentes con los colegios que evalúan Ethoz: lo que ya existe, lo que viene y lo que no vamos a hacer.</p>

<h2>Lo que ya está: los cinco módulos fundacionales</h2>
<p>El programa piloto de 2026 opera sobre cinco módulos que forman el núcleo de la plataforma:</p>
<ul>
  <li><strong>Ficha Integral 360° del Alumno.</strong> Perfil longitudinal que acompaña al estudiante año a año, con niveles de confidencialidad por campo. Cada dato tiene un propietario, un fundamento legal y un registro de acceso. Para entender cómo se estructuran los datos sensibles conforme a la ley, lea <a href="/blog/privacidad-por-diseno-art-16-bis">cómo manejar datos médicos de alumnos sin violar el Art. 16 bis</a>.</li>
  <li><strong>Retiros Seguros y Alertas Críticas.</strong> Validación cruzada en tiempo real de la persona que solicita el retiro, con bloqueo automático ante órdenes de alejamiento activas. Ningún asistente de portería toma una decisión de alto riesgo solo. El módulo se explica en detalle en <a href="/blog/retiros-escolares-seguros-tecnologia">cómo evitar entregas no autorizadas con tecnología</a>.</li>
  <li><strong>Privacidad y Protección de Datos.</strong> Cumplimiento de la Ley 21.719 desde la arquitectura: minimización estructural, consentimientos diferenciados, cifrado en reposo y tránsito, y log de auditoría inalterable. El colegio puede demostrar cumplimiento ante la Agencia de Protección de Datos sin depender de un informe de consultoría externo.</li>
  <li><strong>Permisos por Cargo (RBAC).</strong> Director, Inspector, Profesor, Orientador y Portero operan sobre vistas diferenciadas del mismo perfil. El portero ve la foto, el nombre y las alertas activas. El docente ve lo que necesita para el aula. Nadie accede a datos que no le corresponden por su función. Para el análisis de riesgos asociados al <a href="/blog/control-acceso-roles-seguridad-escolar">control de acceso por roles en el contexto escolar</a>, existe un artículo específico.</li>
  <li><strong>Búsqueda Instantánea.</strong> Búsqueda fuzzy sobre el directorio de alumnos, con panel de gestión que muestra alertas visuales diferenciadas. La información relevante aparece antes de que el asistente termine de escribir el nombre.</li>
</ul>
<p>Estos cinco módulos son los que los colegios del programa piloto están usando hoy. No son una promesa: son funcionalidad operando en producción.</p>

<h2>Lo que estamos construyendo</h2>
<p>A continuación, los módulos en desarrollo activo o en etapa de diseño validado con usuarios reales del piloto:</p>

<h3 style="font-size: 1.125rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem;">App móvil para apoderados y porteros</h3>
<p>Los apoderados necesitan visibilidad desde el teléfono: saber que su hijo fue retirado, autorizar un retiro de emergencia, actualizar la lista de personas autorizadas. Los porteros necesitan verificar retiros sin estar frente a un computador de escritorio en una garita. La aplicación móvil elimina la fricción en ambos extremos del proceso y cierra la última brecha analógica del flujo de retiros. Está en desarrollo activo.</p>

<h3 style="font-size: 1.125rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem;">Integración directa con SIGE y plataforma MINEDUC</h3>
<p>La doble digitación es uno de los principales puntos de fricción en la adopción de cualquier sistema nuevo. Un establecimiento que ya opera con SIGE no debería tener que ingresar manualmente la matrícula, la asistencia o los datos institucionales en Ethoz. La integración sincronizará los datos en una sola dirección: desde SIGE hacia Ethoz, sin que el equipo directivo deba coordinar dos plataformas. Estamos trabajando en la especificación técnica con los equipos del programa piloto.</p>

<h3 style="font-size: 1.125rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem;">Módulo financiero básico</h3>
<p>Control de pagos, estado de morosidad y reportes por período. No es un sistema contable completo —ese no es nuestro foco— pero sí la información operativa que un director o administrador necesita para tomar decisiones: qué familias tienen cuotas pendientes, cuál es el índice de morosidad del mes y qué acciones de seguimiento están en curso. Lo estamos diseñando para que se integre con la ficha del alumno sin agregar complejidad innecesaria.</p>

<h3 style="font-size: 1.125rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem;">Comunicación con familias</h3>
<p>Canal de comunicación directa entre el establecimiento y los apoderados, integrado con los permisos por cargo. No es otro grupo de WhatsApp sin control ni trazabilidad: es comunicación estructurada donde el director puede definir qué roles envían mensajes a qué grupos, cada mensaje queda registrado con timestamp y el apoderado tiene un solo punto de contacto con el colegio. Para un establecimiento preocupado por el cumplimiento de la Ley 21.719, la comunicación sin trazabilidad es un riesgo que este módulo cierra.</p>

<h3 style="font-size: 1.125rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem;">Dashboard de cumplimiento normativo</h3>
<p>Métricas en tiempo real sobre el estado de cumplimiento de la Ley 21.719: consentimientos pendientes de renovación, accesos sin auditar, brechas detectadas en la configuración de permisos, campos de datos sin base legal documentada. El objetivo es que cualquier sostenedor pueda responder a una inspección de la Agencia de Protección de Datos con evidencia generada automáticamente por el sistema, sin depender de un proceso de auditoría manual. Para entender qué está en juego, lea sobre las <a href="/blog/multas-proteccion-datos-sostenedores">multas de hasta 20.000 UTM para sostenedores</a>.</p>

<h2>Lo que NO vamos a hacer</h2>
<p>La transparencia también implica definir los límites. Hay funcionalidades que el mercado espera de un sistema de gestión escolar y que Ethoz no construirá, al menos no en su forma clásica:</p>
<ul>
  <li><strong>No vamos a construir un libro de clases digital.</strong> Hay plataformas maduras —algunas con años de integración con el Mineduc— que resuelven bien ese problema. Replicarlo solo para ser un sistema completo diluiría nuestro foco y no agregaría valor real.</li>
  <li><strong>No vamos a reemplazar tu sistema actual.</strong> Ethoz está diseñado para complementar lo que ya existe, no para obligar a un colegio a migrar todo en un proceso traumático. La integración con SIGE es parte de ese principio.</li>
  <li><strong>No vamos a agregar funciones que diluyan nuestro foco en seguridad y privacidad.</strong> Cada módulo nuevo que se incorpore a Ethoz pasa por un filtro antes de entrar al roadmap: ¿protege al alumno, protege sus datos o protege a la institución ante un riesgo real? Si la respuesta es no, la funcionalidad no entra.</li>
</ul>
<p>Este filtro no es marketing. Es la razón por la que Ethoz existe. La industria tiene suficientes sistemas que intentan hacer todo y terminan sin hacer nada bien.</p>

<h2>Un roadmap construido con colegios, no en un laboratorio</h2>
<p>Cada módulo en este roadmap fue validado con equipos directivos reales antes de comenzar el desarrollo. Los colegios del programa piloto no son usuarios beta que prueban código inestable: son colaboradores activos que definieron qué problemas merecen una solución y en qué orden.</p>
<p>Eso tiene un costo en velocidad y una ventaja en precisión. Preferimos construir el módulo correcto seis meses después a construir el módulo equivocado hoy. El resultado es un roadmap que refleja necesidades reales del sistema escolar chileno, no supuestos de un equipo de producto que nunca ha operado un establecimiento.</p>
<p>Si quiere entender el contexto normativo que hace urgente este tipo de solución, el artículo sobre la <a href="/blog/crisis-convivencia-escolar-2025">crisis de convivencia escolar en 2025</a> y el análisis de por qué <a href="/blog/excel-no-cumple-normativa-datos">Excel no cumple la normativa de datos</a> ofrecen el marco completo.</p>

<h2>Conclusión</h2>
<p>Somos transparentes sobre dónde estamos y hacia dónde vamos porque creemos que los colegios merecen esa honestidad antes de comprometerse con una plataforma. Los cinco módulos fundacionales están operando. Los módulos del roadmap están en construcción o diseño activo. Y los límites que definimos son tan importantes como las funciones que construimos.</p>
<p>Si quiere ser parte del proceso —y tener influencia real sobre qué se construye primero—, el programa piloto 2026 tiene cupos limitados. La conversación empieza con una demo.</p>

<div style="margin-top: 2.5rem; border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.25rem 1.5rem; background: var(--secondary);">
  <p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">Programa Piloto 2026</p>
  <p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Los colegios del piloto tienen acceso anticipado a cada módulo, participan en la validación de nuevas funciones y reciben soporte directo del equipo de Ethoz. Los cupos son limitados.</p>
  <p style="margin-top: 0.75rem; margin-bottom: 0;"><a href="/demo" style="font-size: 0.875rem; font-weight: 600; color: var(--primary); text-decoration: underline; text-underline-offset: 3px;">Solicitar acceso al piloto →</a></p>
</div>
`
};
