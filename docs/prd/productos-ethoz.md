# PRD: Productos Ethoz

## Visión general

Ethoz ofrece 8 módulos independientes que los colegios activan según sus necesidades. Cada módulo resuelve un problema concreto y cumple con la Ley 21.719.

---

## 1. Perfil Integral del Alumno

**Problema que resuelve:** La información de cada alumno está fragmentada entre libretas, Excel y chats de WhatsApp. Cada marzo se pierde el historial.

**Qué hace:**
- Ficha 360° con historial académico, conductual, de asistencia y alertas médicas
- Persiste año a año — elimina el "reinicio de marzo"
- Tres niveles de confidencialidad (estándar, restringido, privado)
- Alertas médicas tipo bandera (sin diagnósticos detallados, conforme al Art. 16 bis)
- Timeline longitudinal de observaciones

**Usuarios principales:** Director, Inspector, Docente, Orientador
**Ruta:** `/features/student-profile`

---

## 2. Control de Acceso por Roles

**Problema que resuelve:** Todos los funcionarios ven todo. El auxiliar puede ver diagnósticos psicológicos, el docente accede a fichas socioeconómicas.

**Qué hace:**
- Vista diferenciada por cargo: Director, Inspector, Docente, Orientador, Portero
- Pantalla simplificada para portería: solo foto, nombre y alertas críticas
- Observaciones filtradas automáticamente según nivel de confidencialidad y rol
- Cumple principio de minimización de la Ley 21.719

**Usuarios principales:** Todos (cada uno ve su vista)
**Ruta:** `/features/access-control`

---

## 3. Retiros Escolares Seguros

**Problema que resuelve:** Órdenes de alejamiento que no llegan al portero. Retiros autorizados a personas equivocadas. Cadena de custodia rota.

**Qué hace:**
- Verificación digital de personas autorizadas en portería
- Bloqueo visual automático ante órdenes de alejamiento o restricciones judiciales
- Notificaciones por rol — datos sensibles nunca se transmiten completos
- Registro completo de cada retiro con timestamp y responsable

**Usuarios principales:** Portero, Inspector, Director
**Ruta:** `/features/safe-pickups`

---

## 4. Búsqueda Inteligente

**Problema que resuelve:** Encontrar la ficha de un alumno entre cientos requiere navegar carpetas, filtrar Excel o preguntar al inspector.

**Qué hace:**
- Búsqueda por nombre, RUT o curso en menos de un segundo
- Tolerante a errores tipográficos
- Resultados con indicadores visuales de alertas activas
- Filtros por curso, sección y estado de alerta

**Usuarios principales:** Todos los roles
**Ruta:** `/features/smart-search`

---

## 5. Registro de Convivencia

**Problema que resuelve:** Incidentes registrados en cuadernos paralelos que nadie consolida. Sin patrones visibles. Sin memoria entre años.

**Qué hace:**
- Registro centralizado de incidentes, intervenciones y protocolos
- Seguimiento de frecuencia por alumno, curso, tipo y horario
- Historial continuo sin pérdida anual
- Protocolos diferenciados por severidad
- Base para cumplir con Ley Aula Segura (requiere datos longitudinales)

**Usuarios principales:** Inspector, Orientador, Director
**Ruta:** `/compliance` (sección Convivencia)

---

## 6. Cumplimiento Ley 21.719

**Problema que resuelve:** Los colegios no tienen infraestructura para cumplir con la nueva ley de datos. Sin consentimientos, sin trazabilidad, sin derechos ARCO+P.

**Qué hace:**
- Gestión de consentimientos parentales para menores de 14
- Respuesta a solicitudes ARCO+P (acceso, rectificación, cancelación, oposición, portabilidad)
- Cifrado de datos sensibles
- Aislamiento de datos entre establecimientos
- Privacidad por diseño integrada en toda la arquitectura

**Usuarios principales:** Director, Administrador del sistema
**Ruta:** `/features/privacy-compliance`

---

## 7. Dashboard de Gestión

**Problema que resuelve:** El director no tiene una vista consolidada de lo que pasa en su colegio. Necesita pedir informes manuales.

**Qué hace:**
- Indicadores de asistencia, convivencia y cumplimiento en una vista
- Métricas agregadas sin exponer datos individuales
- Alertas de patrones emergentes (aumento de incidentes en un curso, baja de asistencia)
- Exportación de informes para sostenedores y fiscalizaciones

**Usuarios principales:** Director, Sostenedor
**Ruta:** `/compliance` (sección Dashboard)

---

## 8. Libro de Clases Digital

**Problema que resuelve:** La Circular N°30 exige libro de clases digital con integridad, trazabilidad y verificación con Clave Única. Las planillas no cumplen.

**Qué hace:**
- Registro digital de asistencia y calificaciones con trazabilidad completa
- Verificación de identidad conforme a estándares de la Superintendencia
- Registro de auditoría: quién registró qué, cuándo y desde dónde
- Intersección con Ley 21.719 para protección de datos académicos

**Usuarios principales:** Docente, Jefe UTP, Director
**Ruta:** `/compliance` (sección Libro de Clases)

---

## Modelo de negocio

- **Sin planes fijos:** El colegio elige los módulos que necesita
- **Precio:** Basado en matrícula + módulos activos
- **Incluido:** Implementación, migración de datos, capacitación y soporte
- **Facturación:** Mensual en UF

## Competencia directa

| Competidor | Enfoque |
|---|---|
| Kimche | Libro de clases digital, planificación, convivencia |
| IntegraPIE | Gestión PIE, planificación, evaluación |
| Napsis | Sistema académico general |
| SIGE (MINEDUC) | Sistema obligatorio de gestión institucional |

**Diferenciador Ethoz:** Único enfocado en cumplimiento Ley 21.719 + seguridad escolar (retiros, alertas, RBAC). Los competidores gestionan datos pero no los protegen.
