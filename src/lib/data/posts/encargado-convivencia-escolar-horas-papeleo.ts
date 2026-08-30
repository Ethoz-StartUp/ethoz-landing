import { CLAIMS } from '../claims';
import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'encargado-convivencia-escolar-horas-papeleo',
	title: 'Encargado de Convivencia: cómo recuperar 10 horas al mes',
	description:
		'La sobrecarga administrativa es la segunda inquietud de los directores chilenos. Mapeamos a dónde se van las horas del Encargado de Convivencia y qué parte del papeleo se puede automatizar sin ceder el criterio profesional.',
	date: '2026-08-21',
	author: 'Ignacio Araya',
	readTime: '7 min',
	tags: ['Encargado de Convivencia', 'Sobrecarga', 'Productividad'],
	coverImage: '/images/blog/encargado-convivencia-escolar-horas-papeleo.webp',
	content: `
	<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
	<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
	<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">El Encargado de Convivencia pierde gran parte de su semana en papeleo: actas redactadas desde cero, citaciones, informes y reconstrucción de evidencia. Automatizar el borrador y el registro, manteniendo la aprobación humana en cada documento, devuelve unas 10 horas al mes que hoy se gastan en el papel y no en el caso.</p>
</div>

<h2>La sobrecarga tiene nombre y apellido estadístico</h2>
<p>En la encuesta nacional a directores de 2026, la convivencia aparece como la primera inquietud (${CLAIMS.directorsSurveyConvivencia.value} de los ${CLAIMS.directorsSurveyConvivencia.detail}) e inmediatamente después aparece la sobrecarga administrativa: ${CLAIMS.directorsSurveyOverload.value}, con la misma muestra (${CLAIMS.directorsSurveyOverload.source}). Las dos cifras son la misma historia vista desde dos ángulos: el problema de convivencia crece y el trabajo que genera cae sobre pocas personas.</p>
<p>Esa persona, en la mayoría de los colegios chilenos, es el Encargado de Convivencia. Su rol debería concentrarse en los casos: entrevistar, mediar, seguir acuerdos, prevenir escalamiento. Su semana real, en cambio, se reparte entre los casos y una montaña de documentación manual que crece con cada denuncia.</p>

<h2>A dónde se van las horas</h2>
<p>El papeleo del encargado tiene cuatro fuentes principales, y ninguna aparece en la descripción del cargo:</p>
<ul>
  <li><strong>Actas desde cero:</strong> cada reunión con apoderados, cada entrevista, cada acuerdo exige un acta. Redactarla desde una hoja en blanco toma entre 20 y 40 minutos, y en una semana cargada son varias.</li>
  <li><strong>Citaciones y comunicaciones:</strong> coordinar horarios, redactar los llamados, confirmar asistencia, dejar registro de cada gestión.</li>
  <li><strong>Informes periódicos:</strong> dirección pide estado de casos, la comunidad escolar pide balances, la red pide consolidados. Cada informe se arma a mano, cada vez.</li>
  <li><strong>Reconstrucción de evidencia:</strong> cuando un caso escala, reunir su cronología completa desde cuadernos, correos y planillas puede tomar días. Es el ítem más caro y el que siempre llega con urgencia.</li>
</ol>
<p>Suma conservadora: dos actas semanales, las citaciones asociadas, un informe mensual y la reconstrucción ocasional de un caso delicado. La cuenta supera las 10 horas mensuales sin esfuerzo, y en colegios con alta casuística la duplica. Puedes estimar tu propia cifra con la <a href="/calculadora-roi">calculadora de papeleo</a>.</p>

<h2>Qué se puede automatizar (y qué no)</h2>
<p>La automatización honesta del papeleo tiene una regla clara: la máquina borrador, la persona decide. Aplicada al trabajo del encargado, se ve así:</p>
<ul>
  <li><strong>Actas en borrador:</strong> el sistema redacta el acta citando la evidencia del expediente (fechas, acuerdos anteriores, medidas vigentes). El encargado revisa, edita y aprueba. El documento difícil de empezar ya está empezado. Así funcionan las <a href="/funcionalidades/actas-y-descargos">actas y descargos asistidos por IA</a>: la IA redacta, tú apruebas.</li>
  <li><strong>Plazos con aviso:</strong> cada paso del protocolo tiene vencimiento en días hábiles y el aviso llega antes, sin que el encargado persiga el calendario en su cabeza.</li>
  <li><strong>Registro que se ordena solo:</strong> cada acción queda archivada en el expediente del caso con fecha y autor. La reconstrucción de evidencia desaparece como tarea, porque la evidencia ya está ordenada.</li>
  <li><strong>Informes al día:</strong> el estado de los casos se lee directamente del sistema, sin consolidar planillas a mano.</li>
</ul>
<p>Y lo que no se automatiza: la entrevista, la mediación, la decisión sobre medidas, el juicio sobre un estudiante. Nada de eso se delega. El criterio profesional es exactamente lo que la automatización viene a proteger, devolviéndole horas.</p>

<h2>De la sobrecarga al foco</h2>
<p>Hay una consecuencia menos obvia de recuperar esas horas: mejora el propio trabajo de convivencia. Un encargado que no llega agotado por el papeleo entrevista mejor, sigue los acuerdos de cerca y detecta antes los casos que escalan. La sobrecarga no solo cansa: degrada la calidad de la respuesta institucional, y esa degradación termina apareciendo en los expedientes cuando ya es tarde.</p>
<p>También hay una consecuencia para el año siguiente: cuando el registro se ordena solo, marzo deja de partir desde cero. El historial de cada caso sigue disponible para quien corresponde, y el encargado nuevo hereda contexto en lugar de cuadernos. Ese problema, el reinicio de marzo, tiene su propio análisis en <a href="/blog/reinicio-de-marzo-seguridad-escolar">este artículo</a>.</p>

<h2>El mismo día, con y sin sistema</h2>
<p>La diferencia se aprecia mejor en una jornada concreta. Sin sistema, el encargado parte la mañana revisando correos para reconstruir qué pasó ayer con un caso, redacta dos actas desde una hoja en blanco, persigue por teléfono una citación que nadie confirmó y termina el día armando a mano el informe semanal para dirección. Con sistema, la misma mañana parte con la lista de lo que vence esta semana: dos pasos de protocolo con responsable y fecha, una citación que el sistema ya agendó y cuyo acta salió en borrador citando los antecedentes del expediente. El informe semanal se lee, no se construye.</p>
<p>La jornada tiene las mismas horas. Lo que cambia es en qué se gastan: en el caso o en el papel que lo rodea.</p>

<h2>Qué conversar con tu dirección</h2>
<p>El encargado que quiera recuperar esas horas necesita respaldo directivo, y la conversación es más fácil con números que con frustración. Tres preguntas ayudan a estructurarla: cuántas horas semanales se estima que el equipo dedica a documentación manual, qué pasaría si mañana la Superintendencia requiere el expediente del caso más delicado (y cuánto costaría reunirlo), y qué parte del trabajo del encargado es realmente criterio profesional y qué parte es trámite repetible. Las respuestas suelen ordenar la decisión solas: el trámite repetible es lo automatizable, y es donde se pierden las horas.</p>
<p>La dirección también gana algo en ese trato: un encargado con tiempo para los casos es un colegio con mejor convivencia y con expedientes completos cuando se necesitan.</p>

<h2>El error de mirar la sobrecarga como problema de la persona</h2>
<p>Cuando un encargado se atrasa con las actas o un plazo se pasa, la lectura fácil es individual: le falta organización, le falta mano, le falta ritmo. La lectura correcta es estructural: el sistema actual le exige a una sola persona producir manualmente cada documento, perseguir cada plazo y reconstruir cada evidencia. Ningún nivel de compromiso personal sostiene eso indefinidamente, y la rotación de encargados agotados es uno de los costos ocultos de la sobrecarga: cada salida se lleva el contexto de los casos que no quedó registrado.</p>
<p>Por eso la conversación sobre papeleo no es de bienestar laboral, aunque también lo mejore. Es de continuidad institucional: el colegio que documenta por sistema no depende de que una persona heroica aguante.</p>

<h2>Por dónde partir</h2>
<p>Recuperar las horas no exige un proyecto de meses. Exige medir primero y automatizar después. Dos pasos concretos: estima cuántas horas mensuales se van en papeleo (la <a href="/calculadora-roi">calculadora</a> toma dos minutos) y revisa qué parte de tus protocolos hoy no deja evidencia automática. La <a href="/auditoria">Auditoría de Ejecución de Protocolos</a> hace exactamente esa segunda medición y entrega el informe en dos semanas. La conversación inicial no tiene costo.</p>

<h2>Conclusión</h2>
<p>El Encargado de Convivencia no necesita más planillas ni más fuerza de voluntad. Necesita que el sistema haga el trabajo repetible: borradores, plazos, registro. Las 10 horas al mes que el papeleo le quita hoy son las mismas horas que el caso difícil de mañana le va a exigir. Devolverlas es una decisión operativa, no tecnológica. Y es una de las pocas decisiones que mejora al mismo tiempo la vida del equipo, la calidad de la respuesta a las familias y la solidez del expediente institucional. Tres resultados por una sola decisión.</p>
`
};
