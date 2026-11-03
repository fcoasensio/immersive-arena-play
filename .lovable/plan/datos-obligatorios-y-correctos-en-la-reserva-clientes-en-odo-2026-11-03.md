# Datos obligatorios y correctos en la reserva (+ clientes en Odoo)

## Qué cambia para el cliente
1. **DNI / NIE / CIF**: se comprueba la letra o dígito de control al escribirlo. Si no es correcto, aparece "Documento no válido" y no puede pasar al siguiente paso. Hoy solo se marca como sospechosa; pasará a bloquearse.
2. **Código postal**: debe tener 5 cifras y existir en España (01–52). Al escribirlo se rellenan solos **Población** y **Provincia**:
   - Provincia: se calcula siempre a partir de las dos primeras cifras (30 = Murcia).
   - Población: se busca en un servicio público y gratuito de códigos postales. Si hay varias poblaciones, el cliente elige una de la lista. Si el servicio no responde, puede escribirla a mano.
3. **Dirección**: quedan tres campos: Dirección (calle y número), Población y Provincia, los tres obligatorios.
4. **Nombre y apellidos**: se guardan siempre en MAYÚSCULAS, sin espacios dobles. También el DNI en mayúsculas y sin guiones ni espacios.

Las mismas comprobaciones se repiten en el servidor, así nadie puede saltárselas.

## Admin y Odoo
- En el detalle de la reserva verás Población y Provincia.
- **Crear clientes en Odoo directamente: sí es posible.** Odoo tiene una conexión para que otros programas creen contactos. Al confirmar una reserva (o al crearla, como prefieras) se crearía o actualizaría el contacto en Odoo con nombre, DNI/NIF, email, teléfono, dirección, CP, población y provincia. Si ya existe un contacto con ese DNI, se actualiza en lugar de duplicarlo.
- Para esta parte necesito de ti: la dirección de tu Odoo (p. ej. `tuempresa.odoo.com`), el nombre de la base de datos, el email del usuario y una **clave API** de Odoo (Preferencias → Seguridad de la cuenta → Nueva clave API). La guardaré de forma segura. Si aún no la tienes, hago primero los puntos 1–4 y Odoo después.

## Detalles técnicos
- Migración: añadir `poblacion text` y `provincia text` (nullable) a `reservas`; columna `odoo_partner_id integer` nullable.
- `src/lib/validacionEs.ts`: `validarDocumentoEspanol` (DNI, NIE X/Y/Z, CIF con dígito/letra de control), `provinciaDesdeCP`, `normalizarNombre`; tests en vitest con documentos válidos/inválidos reales.
- Copia en `supabase/functions/_shared/validacion-es.ts`; `create-reservation` rechaza con 400 documento o CP inválidos (en lugar de solo sumar sospecha) y normaliza a mayúsculas antes de guardar.
- `ReservaForm.tsx`: zod con `refine`, autocompletado por CP (API pública de códigos postales, con caída a texto libre), selector de población.
- Emails, Google Calendar y admin muestran dirección completa.
- Odoo: Edge Function `sync-odoo-cliente` vía JSON-RPC (`res.partner` search por `vat`, luego `create`/`write`; provincia mapeada a `res.country.state` de España), llamada desde la confirmación; botón "Enviar a Odoo" en el detalle para reintentar. Secretos `ODOO_URL`, `ODOO_DB`, `ODOO_USER`, `ODOO_API_KEY`.
