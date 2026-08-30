import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'reglamento-interno-protocolo-ejecutable',
	title: 'Del reglamento interno al protocolo ejecutable: cómo digitalizar sin rehacer nada',
	description:
		'Tu reglamento interno de convivencia ya contiene los protocolos. Lo que falta es que se ejecuten: pasos con responsable, plazos en días hábiles y evidencia automática. Guía para digitalizar sin rehacer el reglamento ni cambiar de sistema.',
	date: '2026-08-07',
	author: 'Ignacio Araya',
	readTime: '7 min',
	tags: ['Reglamento Interno', 'Convivencia Escolar', 'Digitalización'],
	coverImage: '/images/blog/reglamento-interno-protocolo-ejecutable.webp',
	content: `
	<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
	<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
	<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Digitalizar la convivencia no significa reescribir el reglamento ni cambiar de sistema de gestión. Significa convertir los protocolos que ya están escritos en pasos ejecutables: con responsable, plazo en días hábiles y registro automático en el expediente del caso. El reglamento es el punto de partida, no el obstáculo.</p>
</div>

<h2>El reglamento ya hizo la mitad del trabajo</h2>
<p>Todo colegio chileno tiene un reglamento interno de convivencia, y todo reglamento describe, con mayor o menor detalle, qué se hace cuando ocurre un incidente: cómo se recibe una denuncia, qué medidas inmediatas se aplican, a quién se cita, en qué plazos, cómo se determina la sanción y cómo se hace seguimiento. Ese contenido, construido durante años por los equipos directivos, es valioso y no hay que tocarlo.</p>
<p>El problema nunca fue el contenido. Es el formato. Un protocolo que vive en un PDF depende de que alguien lo recuerde, lo interprete y lo ejecute igual cada vez. Y la ejecución, cuando depende de la memoria, varía con la persona, con la carga de la semana y con el año escolar. Digitalizar la convivencia consiste en resolver ese problema de formato, no en reescribir el contenido.</p>

<h2>Qué significa "ejecutable"</h2>
<p>Un protocolo ejecutable es la misma secuencia de pasos del reglamento, pero con tres atributos que el papel no puede dar:</p>
<ul>
  <li><strong>Responsable por paso:</strong> cada acción tiene un dueño nombrado. "Citar a los apoderados" deja de ser una frase y pasa a ser una tarea asignada a orientación, con fecha de vencimiento.</li>
  <li><strong>Plazo en días hábiles:</strong> cada paso sabe para cuándo es, y el sistema avisa antes de que venza. Los días hábiles son la unidad que usa la Superintendencia, y la que el propio reglamento suele declarar.</li>
  <li><strong>Registro automático:</strong> cada acción completada deja su huella con fecha y autor en el expediente del caso, sin que nadie tenga que acordarse de anotarla.</li>
</ul>
<p>Con esos tres atributos, el protocolo deja de depender de quién esté presente esa semana. Se ejecuta igual en marzo que en noviembre, con el encargado titular o con su reemplazo.</p>

<h2>El proceso, paso a paso</h2>
<p>Llevar el reglamento a formato ejecutable es un proceso acotado, no un proyecto de transformación digital:</p>
<ol>
  <li><strong>Inventario de protocolos:</strong> se levantan los protocolos que el reglamento ya contiene (convivencia, bullying, retiros conflictivos, emergencias) y se identifica la secuencia de pasos de cada uno.</li>
  <li><strong>Mapeo a pasos ejecutables:</strong> cada paso recibe responsable y plazo en días hábiles, tal como el reglamento lo establece. Si el reglamento no fija un plazo, se fija ahora, por decisión directiva documentada.</li>
  <li><strong>Importación del contexto actual:</strong> los casos abiertos, el historial y los acuerdos vigentes se cargan desde Excel o CSV. Nada se redigita a mano.</li>
  <li><strong>Activación:</strong> desde ese momento, cada denuncia nueva abre su expediente y dispara la secuencia de pasos con sus avisos.</li>
  <li><strong>Operación:</strong> el equipo trabaja sobre los vencimientos de la semana, no sobre la memoria. La dirección ve el estado de cada caso sin pedir informes.</li>
</ol>
<p>El paso tres es el que más dudas genera, y el más simple: la importación masiva desde planillas existentes es la vía estándar. No requiere integración con el sistema de gestión del colegio ni proyectos de software a medida.</p>

<h2>Ejemplo concreto: la citación a apoderados</h2>
<p>El cambio se entiende mejor con un paso típico. En el reglamento, la citación suele leerse así: "Se citará a los apoderados de los estudiantes involucrados dentro del plazo establecido". En papel, esa frase depende de que alguien recuerde llamar, agende, y anote el resultado en algún lugar. En formato ejecutable, el mismo paso se transforma:</p>
<table>
  <thead>
    <tr>
      <th>En el reglamento (papel)</th>
      <th>En formato ejecutable</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"Se citará a los apoderados"</td>
      <td>Tarea asignada a orientación, con nombre y apellido</td>
    </tr>
    <tr>
      <td>"Dentro del plazo establecido"</td>
      <td>Vencimiento en días hábiles, con aviso previo automático</td>
    </tr>
    <tr>
      <td>Sin registro definido</td>
      <td>Acta de la reunión archivada en el expediente del caso</td>
    </tr>
    <tr>
      <td>Seguimiento informal</td>
      <td>Acuerdos registrados con fecha y revisión programada</td>
    </tr>
  </tbody>
</table>
<p>El contenido del protocolo no cambió en nada. Lo que cambió es que ahora cada paso sabe a quién le toca, para cuándo es y dónde queda la prueba.</p>

<h2>Cuánto demora y quién participa</h2>
<p>La pregunta práctica que sigue es de carga de trabajo. La experiencia razonable para un colegio de tamaño medio: el inventario de protocolos toma una jornada de dirección y encargado, el mapeo a pasos ejecutables otra, y la importación de casos y registros históricos se completa en semanas según el volumen de antecedentes. La configuración inicial del sistema se mide en días, no en meses. Quien lidera el proceso es el equipo directivo del colegio (dirección más encargado de convivencia), sin necesidad de contratar perfiles técnicos ni detener la operación del establecimiento.</p>
<p>El punto de inflexión no es tecnológico: es la decisión de que los plazos del reglamento dejen de depender de la memoria de una persona.</p>

<h2>Qué NO hay que hacer</h2>
<p>El camino tiene tres desvíos comunes que conviene evitar:</p>
<ul>
  <li><strong>Rehacer el reglamento:</strong> si el contenido es correcto, reescribirlo es meses de trabajo para llegar al mismo lugar. Se convierte, no se rehace.</li>
  <li><strong>Cambiar de sistema de gestión:</strong> tu ERP o plataforma académica sigue haciendo lo suyo (matrícula, notas, finanzas). La ejecución de protocolos es una capa distinta que la complementa. La comparativa honesta entre registrar y ejecutar está en <a href="/comparativa">esta página</a>.</li>
  <li><strong>Esperar el momento ideal:</strong> la convivencia no tiene temporada baja. Cada semana que pasa con el sistema en papel es otra semana de casos que quedan registrados a medias.</li>
</ul>

<h2>Tres mitos que frenan la decisión</h2>
<p><strong>"Digitalizar es cambiar la forma de trabajar del equipo."</strong> Al contrario: el equipo sigue ejecutando el mismo protocolo de siempre, pero el sistema persigue los plazos y ordena la evidencia por él. Lo que desaparece es el trabajo de reconstrucción, no el criterio profesional.</p>
<p><strong>"Necesito que se integre con mi plataforma actual."</strong> No para partir. La importación desde Excel o CSV deja el contexto cargado sin proyectos de integración. La integración puede venir después, pero no es prerrequisito.</p>
<p><strong>"Es un proyecto de meses."</strong> La configuración inicial toma días y la importación de casos y reglamento, semanas según el volumen. La <a href="/funcionalidades/protocolos-y-plazos">ejecución de protocolos con plazos</a> está operativa mientras el colegio sigue su rutina normal.</p>

<h2>Señales de que ya eres ejecutable</h2>
<p>El diagnóstico final es simple y se puede hacer sin tecnología: toma el último caso cerrado del semestre y verifica tres cosas. Primero, si la cronología completa se puede leer de corrido sin preguntarle a nadie. Segundo, si cada medida declarada tiene acta con fecha y responsable. Tercero, si sabes en este momento cuántos pasos de protocolo vencen la próxima semana. Si las tres respuestas son afirmativas, tu reglamento ya opera como ejecutable. Si alguna falla, el camino es el descrito arriba: no reescribir, convertir.</p>

<h2>El resultado: un reglamento que se defiende solo</h2>
<p>Cuando el reglamento se vuelve ejecutable, el colegio gana algo que el papel nunca pudo darle: la capacidad de demostrar su propio cumplimiento. Cada caso tiene su <a href="/funcionalidades/expediente-legal">expediente</a> con la cronología completa, cada plazo tiene su aviso y cada medida tiene su acta. Si la Superintendencia requiere descargos, la respuesta ya está escrita en los hechos registrados, como se detalla en la <a href="/blog/descargos-superintendencia-educacion-guia">guía de descargos paso a paso</a>.</p>
<p>La <a href="/auditoria">Auditoría de Ejecución de Protocolos</a> es el primer paso concreto: revisa tus protocolos contra la normativa y los plazos, y te entrega el mapa de qué falta para que tu reglamento sea ejecutable, en dos semanas. La conversación inicial no tiene costo.</p>
`
};
