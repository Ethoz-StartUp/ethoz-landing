import { CLAIMS } from '../claims';
import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'ley-21719-colegios-checklist-datos-estudiantes',
	title: 'Ley 21.719 y colegios: checklist de datos de estudiantes antes de diciembre',
	description:
		'La Ley 21.719 entra en vigencia plena el 1 de diciembre de 2026 y endurece las reglas para los datos de menores. Estado real de la ley, checklist accionable para colegios y los errores que conviene evitar.',
	date: '2026-08-14',
	author: 'Ignacio Araya',
	readTime: '8 min',
	tags: ['Ley 21.719', 'Protección de Datos', 'Checklist'],
	coverImage: '/images/blog/ley-21719-colegios-checklist-datos-estudiantes.webp',
	content: `
	<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
	<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
	<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">La Ley 21.719 rige plenamente desde el 1 de diciembre de 2026. La Agencia fiscalizadora aún está en formación y el Mineduc no ha publicado guía oficial: la referencia válida hoy es el texto de la ley. Los colegios tratan datos sensibles de menores todos los días, y el checklist de adecuación es concreto: registro, consentimientos, ARCO, brechas, proveedores y acceso por rol.</p>
</div>

<h2>El estado real de la ley, sin humo</h2>
<p>Empecemos por lo que sabemos con certeza. La Ley 21.719 fue promulgada el 13 de diciembre de 2024 y entra en vigencia plena el <strong>1 de diciembre de 2026</strong>. Crea la Agencia de Protección de Datos Personales como fiscalizador, con potestad sancionadora que llega hasta ${CLAIMS.lawFinesCap.value} para las infracciones gravísimas (${CLAIMS.lawFinesCap.source}).</p>
<p>Dos hechos honestos completan el cuadro. Primero: la Agencia <strong>aún no se constituye</strong>. La ley la crea, pero su instalación está en marcha, de modo que la fiscalización efectiva parte con la vigencia plena y no antes. Segundo: el Mineduc <strong>no ha publicado una guía oficial</strong> para establecimientos educacionales. La referencia válida hoy es el texto de la ley misma. Quien prometa certezas más allá de eso está vendiendo humo, y quien espere la guía oficial para partir está apostando contra el calendario.</p>

<h2>Por qué los colegios están en el centro de la ley</h2>
<p>Pocas organizaciones tratan tanto dato sensible por día como un colegio: salud de menores, situación familiar, medidas judiciales, evaluaciones psicológicas, registros de convivencia. La ley refuerza la protección de los datos de menores de edad, y eso convierte al sistema escolar en uno de los sectores más expuestos de la economía chilena.</p>
<p>Tres obligaciones resumen el cambio de régimen. El colegio debe saber <strong>qué datos tiene y por qué</strong> (registro y finalidad), debe tener <strong>permiso válido para tratarlos</strong> (consentimiento parental informado para menores) y debe poder <strong>responder cuando un titular ejerce sus derechos</strong> (acceso, rectificación, cancelación, oposición y portabilidad, los ARCO+P, en plazos legales). A eso se suman deberes de seguridad, notificación de brechas y control de proveedores.</p>

<h2>El checklist, punto por punto</h2>
<p>Esta es la lista de verificación operativa para llegar a diciembre con el trabajo hecho. Cada ítem corresponde a una obligación del texto legal:</p>
<ol>
  <li><strong>Registro de Actividades de Tratamiento (RAT):</strong> el inventario vivo de qué datos recoge el colegio, con qué finalidad, quién accede, cuánto se conservan y con qué medidas de seguridad.</li>
  <li><strong>Consentimiento parental actualizado:</strong> formularios que desglosan finalidades, no una cláusula genérica de matrícula heredada de hace años.</li>
  <li><strong>Procedimiento ARCO+P documentado:</strong> cómo se recibe, registra y responde una solicitud de acceso, rectificación, cancelación u oposición, dentro del plazo legal.</li>
  <li><strong>Protocolo de brechas:</strong> quién detecta, quién decide y cómo se notifica a la autoridad dentro de las 72 horas que la ley exige.</li>
  <li><strong>Contratos con encargados de tratamiento:</strong> todo proveedor que trate datos por cuenta del colegio (plataformas, apps, servicios) bajo contrato de encargo conforme a la ley.</li>
  <li><strong>Acceso por rol:</strong> cada funcionario ve solo los datos que necesita para su función. El dato sensible no circula por planillas compartidas ni grupos de chat.</li>
  <li><strong>Medidas de seguridad:</strong> cifrado en reposo y en tránsito, respaldos y control de accesos con registro de auditoría.</li>
  <li><strong>Política de privacidad publicada:</strong> actualizada, comprensible y disponible para la comunidad.</li>
  <li><strong>Responsable identificado:</strong> la persona que responde por la protección de datos en la organización, con funciones y capacidad de ejecución.</li>
  <li><strong>Capacitación del personal:</strong> docentes y administrativos conocen las reglas básicas: qué compartir, dónde registrar y qué nunca enviar por canales informales.</li>
</ol>
<p>La versión extensa, con el detalle de cada obligación y sus referencias al texto legal, está en nuestra <a href="/ley-21719">guía completa de la Ley 21.719 para colegios</a>.</p>

<h2>Los errores que conviene evitar</h2>
<p><strong>Esperar la guía del Mineduc.</strong> Puede que llegue, puede que no llegue a tiempo. La ley ya está publicada y sus plazos no dependen de la guía. Partir por el texto es la única opción seria.</p>
<p><strong>Creer que el ERP lo cubre.</strong> Los sistemas de gestión académica administran matrícula y notas. La mayoría no gestiona consentimientos granulares, registro de actividades de tratamiento ni respuesta ARCO con plazos. Verificar antes de asumir.</p>
<p><strong>Consentimientos genéricos.</strong> Una cláusula que autoriza "el tratamiento de datos para fines educacionales" no informa finalidades específicas ni cubre datos sensibles. El consentimiento debe ser explícito, libre, específico e informado.</p>
<p><strong>Datos sensibles en canales informales.</strong> La ficha médica por WhatsApp o la planilla de convivencia en una carpeta compartida sin control son, hoy, la fuente más probable de una infracción. El problema no es la intención: es la falta de canal adecuado.</p>

<h2>Las multas y cómo se gradúan</h2>
<p>El régimen sancionatorio de la ley se ordena en tres niveles según la gravedad de la infracción. Las infracciones leves (formalidades incumplidas, registros incompletos) pueden sancionarse con multas de hasta 100 UTM. Las graves (tratamiento sin base de legitimación, incumplimiento de derechos ARCO) escalan a miles de UTM. Y las gravísimas (tratamiento ilícito de datos sensibles, reincidencia) llegan al tope del sistema: ${CLAIMS.lawFinesCap.value} o un porcentaje de la facturación anual del infractor, lo que resulte mayor (${CLAIMS.lawFinesCap.source}).</p>
<p>Para un sostenedor de red, el matiz práctico es doble: la multa se calcula sobre la organización, no sobre el colegio individual, y la reincidencia agrava el cuadro. La exposición es patrimonial, no solo operativa.</p>

<h2>Sostenedor y colegio: quién responde por qué</h2>
<p>La ley distingue al responsable del tratamiento (quien decide para qué se usan los datos, típicamente el sostenedor como persona jurídica) del encargado del tratamiento (quien trata datos por cuenta de otro, como los proveedores de plataformas). En la práctica escolar esto significa que el sostenedor no puede delegar la responsabilidad en el colegio ni el colegio en sus proveedores: cada contrato con un encargado debe garantizar por escrito el cumplimiento de la ley, y la responsabilidad final sobre los datos de los estudiantes sigue en la organización.</p>
<p>Esta distinción tiene una consecuencia de gobierno: la adecuación a la ley no es un proyecto que dirección pueda ejecutar sola. Requiere decisión del sostenedor en contratos, en designación de responsables y en presupuesto de medidas de seguridad.</p>

<h2>Qué hacer este trimestre</h2>
<p>Con diciembre acercándose, la secuencia razonable para los próximos meses es: primero, levantar el Registro de Actividades de Tratamiento (sin inventario no hay diagnóstico posible). Segundo, revisar los consentimientos parentales del próximo proceso de matrícula, que es donde más superficie de riesgo se acumula. Tercero, documentar el procedimiento ARCO y el protocolo de brechas, porque son los dos procesos que no se pueden improvisar cuando se necesitan. Cuarto, revisar los contratos con proveedores. El resto del checklist sigue detrás, pero esos cuatro ítems cubren la mayor parte de la exposición inicial.</p>

<h2>El vínculo con la convivencia</h2>
<p>Hay un cruce que los equipos directivos no siempre anticipan: los registros de convivencia son datos sensibles de menores, y al mismo tiempo son la evidencia que el colegio necesita para defenderse en descargos y demandas. La ley no prohíbe documentar la convivencia: exige hacerlo con base de legitimación, seguridad, acceso por rol y trazabilidad de accesos. Un <a href="/funcionalidades/expediente-legal">expediente del caso</a> bien construido cumple ambas funciones: prueba la ejecución del protocolo y respeta el régimen de protección de datos.</p>
<p>La <a href="/auditoria">Auditoría de Ejecución de Protocolos</a> incluye el checklist 21.719 aplicado a los datos de tus estudiantes, junto con la revisión de protocolos y la simulación de descargo. Entrega en dos semanas, y la conversación inicial no tiene costo.</p>
`
};
