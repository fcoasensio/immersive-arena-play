# Pie legal RGPD en emails

Añadir el texto legal RGPD (español + inglés) como pie de página en todos los emails que envía la web.

## Alcance

Se aplicará a los emails enviados desde estas funciones:

- `send-reservation-notification` (confirmación al cliente + aviso admin)
- `send-status-change-notification` (cambio de estado al cliente)
- `send-reschedule-notification` (cambio fecha/hora al cliente + admin)
- `send-outdoor-budget-notification` (presupuesto outdoor)
- `send-suspicious-reservation-alert` (aviso admin)
- `enviar-email-lead-aprobado` (respuesta a lead aprobada)
- `submit-lead-rapido` (confirmación lead)
- `escalar-consulta-chat` (escalado consulta chat)

Se añade siempre, tanto en emails a clientes como a admin (el texto es genérico y válido para ambos).

## Implementación

1. Crear archivo compartido `supabase/functions/_shared/gdpr-footer.ts` que exporte:
   - `gdprFooterHtml`: bloque HTML con el texto RGPD en español e inglés, estilado en gris claro, tipografía pequeña (11px), separador superior, padding cómodo. Usa colores neutros que funcionan tanto en fondo claro (#f8f9fa) como sobre el patrón actual de los emails.
   - `gdprFooterText`: versión texto plano (por si se usa en algún email sin HTML).

2. En cada función de email listada arriba, importar `gdprFooterHtml` e insertarlo justo antes del cierre del `<table>` de footer existente (o al final del `<body>` si no hay footer). Mantener el contenido actual (dirección, teléfono, email) y añadir el bloque RGPD debajo, separado por una línea.

3. Redeploy automático de las funciones afectadas.

## Detalles técnicos

- El componente HTML usa tablas inline (compatibilidad con clientes de correo Outlook/Gmail), font-size 10–11px, color `#888`, line-height 1.4, max-width heredado del contenedor.
- Texto exacto facilitado por el usuario, sin alteraciones, en dos bloques (ES arriba, EN debajo) separados por un `<hr>` fino.
- El email `rgpd@shootandrun.es` y la dirección postal van como enlaces `mailto:`/texto plano según corresponda.
- No se modifica `chat-asistente` ni `create-reservation` porque no envían emails directamente.

## Resultado

Todos los emails salientes incluyen al final el aviso legal RGPD en español e inglés, cumpliendo con la LOPDGDD y el Reglamento (UE) 2016/679.
