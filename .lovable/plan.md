# Mejorar la navegación para agentes de IA

## Objetivo
Facilitar que asistentes como ChatGPT, Gemini, Claude y buscadores con IA descubran, comprendan y recomienden correctamente los servicios públicos de **shootandrun**, sin exponer el panel de administración ni información privada.

## Estado comprobado
- `robots.txt` permite rastrear la web pública y excluye `/admin` y `/admin/login` en la regla general, pero sus reglas específicas para algunos rastreadores no repiten esa exclusión.
- `sitemap.xml` ya incluye la home, reserva, las cuatro páginas comerciales, el blog, sus siete artículos y las páginas legales.
- La home tiene datos estructurados `LocalBusiness`; las páginas comerciales, preguntas frecuentes y artículos no tienen todavía datos estructurados propios.
- No existe `llms.txt` ni una versión ampliada para agentes.
- La aplicación es una SPA: algunas herramientas de IA pueden interpretar peor el contenido generado en el navegador que los archivos públicos directos.
- El pie enlaza las páginas comerciales principales, pero los artículos no ofrecen una navegación contextual sistemática hacia contenidos y servicios relacionados.

## Cambios propuestos

### 1. Crear una guía pública para agentes
- Añadir `/llms.txt` con una descripción breve del negocio, servicios, edades, capacidades, ubicación, contacto, proceso de reserva y enlaces canónicos prioritarios.
- Añadir `/llms-full.txt` con información pública más detallada: modalidades, públicos, preguntas frecuentes, precios publicados y reglas relevantes.
- Mantener fuera de ambos archivos el panel, operaciones internas, clientes, reservas, correos administrativos y cualquier dato privado.
- Simplificar `robots.txt` para que todos los rastreadores reciban la misma exclusión de `/admin` y `/admin/login`, y referenciar `llms.txt` sin limitar las páginas públicas.

### 2. Ampliar los datos estructurados
- Centralizar los datos públicos compartidos para evitar contradicciones entre páginas.
- Completar la home con `LocalBusiness`/`EntertainmentBusiness`, servicios, ubicación, contacto y enlaces oficiales consistentes.
- Añadir `Service` y `FAQPage` a las páginas de Laser Tag, Realidad Virtual, Cumpleaños y Eventos de Empresa.
- Añadir `Blog`/`ItemList` al índice del blog y `BlogPosting` junto con `BreadcrumbList` a cada artículo.
- Añadir migas de pan estructuradas a las páginas comerciales para que los agentes entiendan su relación con la home y la reserva.

### 3. Mejorar las rutas de descubrimiento
- Incorporar enlaces contextuales entre cada servicio, sus artículos relacionados, precios y la reserva.
- Añadir una sección discreta de contenido relacionado al final de artículos y páginas comerciales, reutilizando el estilo actual.
- Usar textos de enlace descriptivos, evitando enlaces ambiguos, para que personas y agentes sepan el destino antes de abrirlo.
- Mantener la navegación visual y la estética cyberpunk existentes; no se rediseñará la interfaz.

### 4. Reforzar metadatos y coherencia
- Sustituir los metadatos genéricos del documento base por título, descripción, Open Graph y Twitter específicos de **shootandrun**.
- Mantener `shootandrun.es` como dominio canónico y conservar `noindex,nofollow` en hosts de prueba.
- Añadir fechas de modificación al mapa del sitio y dejar una fuente mantenible para evitar que futuras páginas queden fuera.
- Corregir inconsistencias públicas detectadas mientras se construye la fuente común, sin cambiar precios ni condiciones no confirmadas.

### 5. Validación
- Comprobar que `robots.txt`, `sitemap.xml`, `llms.txt` y `llms-full.txt` son accesibles directamente y no devuelven la aplicación vacía.
- Validar el JSON-LD de home, páginas comerciales, blog y artículos.
- Revisar enlaces rotos, rutas canónicas, navegación entre contenidos y ausencia de rutas administrativas en archivos para agentes.
- Verificar la web en escritorio y móvil, además de ejecutar las comprobaciones automáticas del proyecto.

## Detalles técnicos
- Los datos estructurados se generarán con JSON-LD y URLs absolutas bajo `https://shootandrun.es`.
- La información de `llms.txt` será contenido estático y verificable, adecuado para agentes que no ejecutan JavaScript.
- No se dará a agentes acceso a la base de datos ni a funciones internas; solo se mejorará el descubrimiento del contenido público ya autorizado.
- Esta mejora no convierte el chat actual en un agente que navega ni añade acciones automáticas de reserva.
