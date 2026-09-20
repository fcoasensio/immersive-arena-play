# Corregir los borradores de email de contacto rápido

## Objetivo
Hacer que la vista previa sea legible y que los mensajes usen información exacta, sin volver a pedir datos que el cliente ya ha enviado.

## Cambios
1. **Vista previa legible en el panel de administración**
   - Mostrar el correo dentro de un área blanca aislada del tema oscuro del panel.
   - Evitar que los estilos generales de la web conviertan el texto del correo en blanco.
   - Aplicar la misma solución tanto al correo normal como a la vista previa durante la edición.

2. **Contenido correcto en los nuevos borradores**
   - Sustituir “arena climatizada todo el año” por una explicación exacta: el local es cubierto y apto durante todo el año frente al sol, lluvia o viento.
   - Usar “pista” en lugar de “arena”.
   - Informar de la capacidad simultánea: hasta 16 jugadores en Laser Tag y hasta 12 en Realidad Virtual.
   - Eliminar la promesa de un “precio cerrado” y dirigir al cliente a los precios publicados en `https://shootandrun.es/#packs`.
   - No volver a solicitar la fecha ni el número aproximado de jugadores; incorporar esos datos ya facilitados al texto cuando estén disponibles.
   - Mantener el aviso de que el importe final se calcula según los jugadores reales y que la cifra indicada es orientativa.

3. **Borradores pendientes existentes**
   - Actualizar los borradores que sigan pendientes de aprobación con el mismo contenido corregido, conservando destinatario, categoría y relación con su contacto.
   - No modificar correos ya enviados ni borradores descartados.

4. **Comprobación**
   - Desplegar el generador actualizado.
   - Revisar en el panel que el texto se lee correctamente y que los borradores pendientes muestran capacidades, condiciones del local, precios y datos del cliente sin preguntas repetidas.

## Detalles técnicos
- El generador afectado es el flujo de contacto rápido que crea borradores para contactos A y B.
- La actualización de registros se limitará por estado `pendiente_aprobacion`.
- El envío seguirá requiriendo tu aprobación manual; no se enviará ningún correo durante la corrección.
