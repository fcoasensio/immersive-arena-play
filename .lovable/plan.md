# Leads del contacto rápido también en Odoo

## Qué cambia
- Cada vez que alguien rellena el contacto rápido (el que aparece tras un rato sin actividad), además de guardarse en tu admin como ahora, se crea una **oportunidad en el CRM de Odoo**.
- La oportunidad lleva: nombre en mayúsculas, teléfono, email, tipo de evento, actividad, nº de personas, fecha orientativa, presupuesto, cómo nos conoció, origen (UTM) y la categoría A/B/C con su puntuación. Las A salen con prioridad alta (3 estrellas), las B media y las C baja.
- También se crea o reutiliza el **contacto** en Odoo (se busca por email o teléfono para no duplicar).
- Los leads que llegan de Instagram entran por el mismo camino y también irán a Odoo.
- Si Odoo no responde, el lead **no se pierde**: queda guardado en tu admin, se marca "pendiente de Odoo" y tendrás un botón **"Enviar a Odoo"** para reintentarlo.
- Si tu Odoo no tiene el módulo CRM instalado, se crea solo el contacto y te lo indico.

Nada cambia para el cliente ni en los emails que apruebas.

## Detalles técnicos
- Migración: `leads_rapidos.odoo_lead_id integer`, `odoo_error text` (nullable).
- `supabase/functions/_shared/odoo.ts`: cliente JSON-RPC (login, execute_kw) reutilizado; `sync-odoo-cliente` pasa a usarlo.
- `_shared/odoo.ts` → `crearLeadOdoo(lead)`: busca/crea `res.partner`; crea `crm.lead` (`type: "opportunity"`, `name`, `partner_id`, `contact_name`, `email_from`, `phone`, `description` con todos los datos, `priority` 3/2/1). Si `crm.lead` no existe, solo partner.
- `submit-lead-rapido` y `sync-leads-instagram`: tras insertar, llamar a `crearLeadOdoo` con timeout corto; guardar `odoo_lead_id` u `odoo_error`. No bloquea la respuesta al visitante.
- Nueva función `sync-odoo-lead` (solo admin, `has_role`) para el reintento; botón y estado en la pestaña de leads del admin.
- Probar con un lead de prueba y comprobar `odoo_lead_id`; borrar después solo esa fila de prueba (y en Odoo indicarte cuál era).
