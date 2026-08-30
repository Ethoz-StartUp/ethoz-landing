import { CLAIMS } from '../claims';
import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'protocolo-bullying-plazos-colegio',
	title: 'Protocolo de actuación frente al bullying: los plazos que tu colegio debe cumplir',
	description:
		'Casi todos los colegios chilenos tienen un protocolo de convivencia escrito. El problema es otro: ejecutarlo con plazos, responsables y evidencia. Esta es la anatomía de un protocolo que resiste una fiscalización.',
	date: '2026-07-24',
	author: 'Ignacio Araya',
	readTime: '8 min',
	tags: ['Convivencia Escolar', 'Protocolos', 'Plazos'],
	coverImage: '/images/blog/protocolo-bullying-plazos-colegio.webp',
	content: `
	<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
	<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
	<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Tener protocolo no basta: hay que probar que se ejecutó. Un protocolo de convivencia solo resiste una fiscalización cuando cada paso tiene responsable, plazo en días hábiles y evidencia en el expediente del caso. Los plazos que tu propio reglamento fija son los primeros que la Superintendencia revisa.</p>
</div>

<h2>El protocolo existe. El problema es ejecutarlo</h2>
<p>Prácticamente todos los colegios de Chile tienen un protocolo de actuación frente al bullying escrito en su reglamento interno de convivencia. Está en un PDF, en un pendrive de dirección o en la página veintitantos del reglamento que cada apoderado firma en marzo. El documento existe. La pregunta que hace un fiscalizador, un abogado contrario o un tribunal es distinta: ¿se ejecutó?</p>
<p>La diferencia importa porque el volumen de casos crece todos los años. Las denuncias de convivencia ante la Superintendencia llegaron a <strong>${CLAIMS.complaints2025.value}</strong> durante 2025 (${CLAIMS.complaints2025.source}), y los directores del país la declaran como su primera inquietud: el ${CLAIMS.directorsSurveyConvivencia.value} la sitúa en el primer lugar de la encuesta nacional (${CLAIMS.directorsSurveyConvivencia.source}). Con esa presión, un protocolo que vive solo en el papel no protege a nadie: ni al estudiante, ni al equipo, ni al sostenedor.</p>
<p>Ethoz no promete que el bullying desaparezca de un colegio. Ningún sistema honesto puede prometerlo. Lo que sí puede ordenarse es la respuesta: que cada denuncia active los mismos pasos, en los mismos plazos, con la misma evidencia. Eso es lo que se evalúa cuando algo sale mal.</p>

<h2>Anatomía de un protocolo de convivencia</h2>
<p>Un protocolo de actuación frente al bullying, despojado de su formato, es una secuencia de pasos con tres atributos cada uno: qué se hace, quién lo hace y para cuándo. La secuencia típica que los reglamentos chilenos describen es reconocible:</p>
<ol>
  <li><strong>Recepción de la denuncia:</strong> el caso se registra formalmente, con fecha, relato y canal de ingreso.</li>
  <li><strong>Medidas inmediatas de protección:</strong> separación de espacios, ajustes de supervisión, contacto con los apoderados del estudiante afectado.</li>
  <li><strong>Investigación:</strong> entrevistas con involucrados y testigos, recopilación de antecedentes, todo con registro.</li>
  <li><strong>Citaciones:</strong> reuniones con los apoderados de ambos estudiantes, con acta de lo conversado.</li>
  <li><strong>Determinación de medidas:</strong> sanciones, acuerdos, derivaciones a orientación o a instancias externas.</li>
  <li><strong>Seguimiento:</strong> verificación periódica de que las medidas se cumplen y de que no hay represalias.</li>
  <li><strong>Cierre:</strong> acta final con resultado y aprendizajes del caso.</li>
</ol>
<p>Fíjate en que cada paso produce, o debería producir, un documento: un registro, un acta, una citación, un informe. Esos documentos son el expediente del caso. Un protocolo sin producción documental es una intención, no un procedimiento.</p>

<h2>Los plazos: días hábiles, no buenas intenciones</h2>
<p>Los reglamentos internos fijan plazos concretos para cada etapa, y el sistema de denuncias de la Superintendencia opera en <strong>días hábiles</strong>. Eso tiene una consecuencia práctica incómoda: los plazos del propio reglamento del colegio son exigibles. Cuando un caso llega a fiscalización, una de las primeras contrastaciones es simple: el reglamento dice que la citación se realiza dentro de cierto plazo, ¿el acta muestra que se cumplió?</p>
<p>Aquí es donde los protocolos se rompen en la vida real:</p>
<ul>
  <li><strong>Pasos sin responsable claro:</strong> "se citará a los apoderados" no dice quién llama, quién agenda ni quién registra. Sin dueño, el paso se ejecuta tarde o nunca.</li>
  <li><strong>Plazos que vencen en silencio:</strong> el vencimiento vive en la cabeza del encargado. Si esa persona se enferma o cambia de cargo, el plazo se pierde sin que nadie lo note.</li>
  <li><strong>Evidencia dispersa:</strong> el acta está en un cuaderno, la citación en un correo, la medida en la memoria del inspector. Al reconstruir el caso, cada documento cuesta horas.</li>
  <li><strong>Seguimiento abandonado:</strong> la medida se declara y nadie verifica. La fiscalización posterior pregunta por ese seguimiento.</li>
</ul>
<p>Ninguna de estas fallas es de redacción del reglamento. Son fallas de ejecución. Y todas tienen la misma forma: un paso sin dueño, sin fecha y sin registro.</p>

<h2>Siete señales de que tu protocolo es ejecutable</h2>
<p>Un protocolo resiste una fiscalización cuando puede responder estas preguntas sin levantar el teléfono:</p>
<ol>
  <li>¿Cada denuncia abre un registro formal con fecha y canal de ingreso?</li>
  <li>¿Cada paso del protocolo tiene un responsable nombrado, no un cargo genérico?</li>
  <li>¿Los plazos están fijados en días hábiles y alguien (o algo) avisa antes de que venzan?</li>
  <li>¿Cada entrevista, citación y acuerdo tiene acta en el expediente del caso?</li>
  <li>¿Las medidas de protección quedan registradas con fecha de aplicación?</li>
  <li>¿El seguimiento tiene hitos verificables, no solo "se continuará observando"?</li>
  <li>¿El expediente completo del caso se puede exportar si mañana lo pide la Superintendencia?</li>
</ol>
<p>Si la respuesta a alguna es "depende de la persona", el protocolo es frágil exactamente donde más importa: en su demostrabilidad.</p>

<h2>Una semana real de protocolo, con y sin sistema</h2>
<p>Vale la pena bajar la anatomía a un caso concreto. Una apoderada denuncia un episodio de hostigamiento un lunes a las 8:30. En el colegio sin sistema, la denuncia queda anotada en un correo a inspectoría, las medidas de protección se conversan de pasada en la sala de profesores, la citación a los apoderados se agenda "cuando se pueda" y la primera acta aparece el viernes, redactada de memoria. El protocolo se ejecutó, más o menos, pero el expediente no podrá probarlo: no hay fecha de activación, no hay responsable por paso y la cronología depende de la memoria de tres personas.</p>
<p>En el colegio con ejecución, la misma denuncia abre el caso a las 8:40. Las medidas de protección quedan asignadas con vencimiento ese mismo día, las citaciones tienen responsable y plazo en días hábiles, y cada gestión (llamado, correo, reunión) se registra en el expediente cuando ocurre. El viernes no hay que reconstruir nada: el caso se lee completo, con la cronología y las actas en orden. La diferencia de trabajo real para el equipo es mínima en la semana. La diferencia de lo que se puede demostrar después es total.</p>

<h2>Qué revisar en tu reglamento este mes</h2>
<p>Si el diagnóstico anterior deja dudas, la revisión práctica parte por tres documentos que ya existen en tu colegio. El primero es el reglamento interno: verifica que cada protocolo tenga pasos numerados y plazos explícitos, porque lo que el reglamento no fija, la ejecución improvisa. El segundo es el último caso cerrado: intenta leer su expediente completo y mide cuánto tardas en encontrar cada documento, porque ese tiempo es el que mañana costará un descargo. El tercero es la agenda de la semana entrante: cuenta cuántos vencimientos de protocolo hay y quién los persigue, porque si la respuesta es "el encargado, de memoria", el sistema actual depende de una sola persona.</p>
<p>Esas tres revisiones toman una tarde y entregan el mapa exacto de lo que falta convertir.</p>

<h2>Del papel a la ejecución</h2>
<p>La buena noticia es que ejecutar no exige rehacer el reglamento. Exige convertirlo: cada protocolo escrito se transforma en una secuencia de pasos con responsable y vencimiento en días hábiles, cada vencimiento con su aviso previo y cada acción con su registro automático en el expediente. Ese es el trabajo de un <a href="/funcionalidades/protocolos-y-plazos">motor de protocolos con plazos</a>, y el resultado documental es el <a href="/funcionalidades/expediente-legal">expediente del caso</a> que resiste una fiscalización.</p>
<p>La guía para responder cuando la denuncia ya escaló está en <a href="/blog/descargos-superintendencia-educacion-guia">Descargos ante la Superintendencia: guía paso a paso</a>. Y el proceso para llevar tu reglamento actual a este formato, sin rehacerlo, se detalla en <a href="/blog/reglamento-interno-protocolo-ejecutable">Del reglamento interno al protocolo ejecutable</a>.</p>

<h2>Conclusión</h2>
<p>Un protocolo de convivencia vale lo que vale su última ejecución documentada. Los colegios no necesitan otro PDF: necesitan que los pasos que ya escribieron tengan dueño, fecha y registro. Cuando la Superintendencia o un tribunal revise, no preguntará qué decía el reglamento. Preguntará qué pasó, quién lo hizo, cuándo, y dónde está anotado.</p>
<p>La <a href="/auditoria">Auditoría de Ejecución de Protocolos</a> revisa tus protocolos contra la normativa y sus plazos, y te muestra en dos semanas cuáles pasos hoy no podrías probar. La conversación inicial no tiene costo.</p>
`
};
