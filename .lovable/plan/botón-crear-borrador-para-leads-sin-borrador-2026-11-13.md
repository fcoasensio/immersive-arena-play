# Botón "Crear borrador" para leads sin borrador

## Qué verás
En /admin → Leads, cada lead con email y sin borrador (por ejemplo PEDRO, categoría C) mostrará el botón **"Crear borrador"**. Al pulsarlo se prepara el borrador de respuesta y aparece en **Emails pendientes**, listo para revisarlo y aprobarlo. Nunca se envía solo.

## Cambios
1. Nueva función del servidor `crear-borrador-lead` (solo para administradores): recibe el lead, comprueba que tiene email y que no tiene ya un borrador pendiente, y genera el mismo borrador que ya usan los leads B (local cubierto, 16 jugadores en laser tag y 12 en VR, enlace a precios /#packs, sin volver a preguntar lo que el cliente ya dio).
2. La generación del borrador se mueve a un archivo compartido, para que el formulario y el botón usen el mismo texto.
3. En la lista de leads: botón "Crear borrador" (oculto si no hay email o si ya hay un borrador), con aviso de éxito o error.
4. Desplegar las funciones y probarlo con el lead de PEDRO.
