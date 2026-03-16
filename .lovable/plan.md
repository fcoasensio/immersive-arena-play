

## Plan: Mejorar todos los emails del sistema

Hay 4 emails en total repartidos en 2 edge functions:
1. **send-reservation-notification**: email admin + email cliente (reserva)
2. **send-outdoor-budget-notification**: email admin + email cliente (presupuesto outdoor)

### Cambios a realizar

**1. Añadir logo de shootandrun**
- Crear un bucket de storage `email-assets` y subir el logo (`src/assets/logo-shootandrun.png`)
- Incluir el logo en la cabecera de los 4 emails usando la URL pública del bucket

**2. Mejorar contenido del email al cliente (reserva)**
- Añadir todos los datos de la reserva: tipo de evento, extras seleccionados, temática videoinvitación
- Incluir datos de contacto de shootandrun (teléfono, email, dirección)
- Incluir instrucciones: "Te contactaremos para confirmar y gestionar el anticipo de 50€"
- Añadir enlace a Google Maps de la ubicación
- Tono más cercano y profesional

**3. Mejorar contenido del email al admin (reserva)**
- Mantener todos los datos actuales (ya están completos)
- Añadir logo en cabecera

**4. Mejorar email al cliente (outdoor)**
- Añadir resumen de los datos enviados (ubicación, personas, tipo de evento)
- Incluir datos de contacto de shootandrun
- Tono profesional y cercano

**5. Mejorar email al admin (outdoor)**
- Añadir logo en cabecera (datos ya están completos)

### Detalle técnico

- Se creará un bucket `email-assets` con acceso público para alojar el logo
- Se subirá `logo-shootandrun.png` al bucket
- Se actualizarán ambos archivos edge function con las plantillas HTML mejoradas
- Se redesplegarán ambas funciones automáticamente
- Datos de contacto usados: C/ Independencia 31, Alcantarilla (Murcia), +34 606323053, hola@shootandrun.es

