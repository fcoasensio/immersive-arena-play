## Chatbot de atención al cliente con escalado al gerente

Asistente conversacional integrado en el sitio que responde dudas usando **solo** la información de shootandrun (actividades, edades, precios, packs, horarios, ubicación, política de reservas, FAQ del blog). Si no sabe responder o el cliente lo pide, recoge sus datos y envía la consulta por email al gerente.

### Funcionamiento

- Botón flotante (burbuja neón cyberpunk) en la esquina inferior derecha, visible en todas las páginas públicas (no en `/admin`).
- Al pulsar abre un panel de chat con saludo inicial: *"¡Hola! Soy el asistente de shootandrun. ¿En qué puedo ayudarte?"*
- El bot responde en streaming (token a token) con markdown.
- Si la pregunta queda fuera del contexto (precios personalizados, disponibilidad concreta, queja, exterior a medida) o el bot detecta baja confianza, ofrece automáticamente un botón **"Escalar al gerente"**.
- El cliente rellena un mini-formulario (nombre, email/teléfono, mensaje) y la conversación + datos se envían por email a `hola@shootandrun.es`.

### Tecnología

- **Lovable AI** (`google/gemini-3-flash-preview`) vía edge function — sin coste de API key adicional.
- **Resend** (ya configurado) para el email de escalado.
- **Streaming SSE** para respuesta fluida.
- Sin persistencia: las conversaciones viven solo en el navegador (sessionStorage), no se guardan en la base de datos salvo cuando se escalan.

### Base de conocimiento

Un archivo `supabase/functions/chat-asistente/knowledge.ts` con toda la info estructurada del negocio:
- Actividades (Laser Tag +8, VR +12, indoor/outdoor)
- Capacidad (Laser Tag hasta 16, VR hasta 12)
- Precios y packs (leídos también desde la tabla `packs` para mantenerlos sincronizados)
- Horarios disponibles, antelación 48h, anticipo 50€ Bizum
- Catálogo VR (lista de juegos con edades)
- Ubicación: Avda. Cristo Yacente 24, Alcantarilla
- Contacto: 606 323 053, hola@shootandrun.es
- Reglas: nunca inventar precios/disponibilidad; redirigir reservas a `/reservar`; redirigir presupuestos outdoor al formulario.

El system prompt instruye al modelo: responder **solo** desde el contexto, en español, tono cercano y juvenil, máximo 3 frases por respuesta, sugerir CTA cuando proceda (botón "Reservar" o "Pedir presupuesto"), y devolver `[ESCALAR]` al final si no puede responder.

### Cambios por archivo

**Nuevos archivos**
- `supabase/functions/chat-asistente/index.ts` — edge function streaming a Lovable AI, lee la base de conocimiento y los packs activos de la BD, construye el prompt, devuelve SSE. Maneja errores 429/402.
- `supabase/functions/chat-asistente/knowledge.ts` — base de conocimiento estática.
- `supabase/functions/escalar-consulta-chat/index.ts` — recibe `{nombre, contacto, mensaje, historial}`, valida con Zod, envía email vía Resend a `hola@shootandrun.es` con la transcripción completa.
- `src/components/chat/ChatWidget.tsx` — burbuja flotante + panel desplegable.
- `src/components/chat/ChatMessages.tsx` — render de mensajes con `react-markdown` (ya instalado o se añade).
- `src/components/chat/EscalateForm.tsx` — formulario de escalado.
- `src/hooks/useChatStream.ts` — hook que gestiona el streaming SSE línea por línea.

**Archivos modificados**
- `src/App.tsx` — montar `<ChatWidget />` global, oculto en rutas `/admin*`.
- `supabase/config.toml` — registrar las dos nuevas funciones (sin `verify_jwt` específico, default).

### Estilo visual

- Burbuja redonda 56px, gradiente neón azul→magenta, ícono de mensaje, animación pulse sutil.
- Panel 380×560px (responsive: pantalla completa en móvil), fondo `bg-card/95` con blur, borde neón.
- Mensajes del bot alineados a la izquierda con avatar circular del logo; usuario a la derecha en azul neón.
- Indicador "escribiendo…" con tres puntos animados mientras llega el primer token.

### Seguridad y límites

- La edge function valida la longitud del mensaje (máx. 1000 caracteres) y del historial (máx. 20 turnos) para evitar abusos de tokens.
- Rate limiting en cliente: bloquea envíos si hay otra petición en curso.
- Sin almacenamiento de conversaciones → cumple RGPD por defecto. Solo se guarda lo escalado en el email.
- El formulario de escalado pide consentimiento explícito de tratamiento de datos según la Política de Privacidad.

### Resultado esperado

Cualquier visitante puede preguntar "¿a partir de qué edad puedo jugar a VR?", "¿cuánto cuesta un cumpleaños de 10 niños?", "¿abrís el domingo?" y recibir respuesta inmediata. Si pregunta algo que requiere atención humana ("queremos un evento para 50 personas en exterior con catering"), el bot ofrece escalar y el gerente recibe la consulta completa por email.