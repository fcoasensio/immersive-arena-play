## Objetivo
Crear un archivo `.sql` compatible con MySQL 8+ con el esquema completo y todos los datos de tu base de datos PostgreSQL actual.

## Qué incluirá el archivo
- `CREATE TABLE` para las 6 tablas: `chat_eventos`, `configuracion`, `festivos`, `packs`, `reservas`, `user_roles`
- Todos los `INSERT` con los datos actuales
- Índices y claves primarias/únicas equivalentes
- Comentario de cabecera con fecha y notas de restauración

## Mapeo de tipos PostgreSQL → MySQL
| PostgreSQL | MySQL |
|---|---|
| `uuid` + `gen_random_uuid()` | `CHAR(36)` con `DEFAULT (UUID())` |
| `jsonb` | `JSON` |
| `text[]` (motivos_sospecha) | `JSON` (array serializado) |
| `timestamp with time zone` | `DATETIME(6)` (UTC) |
| `date` / `time` | `DATE` / `TIME` |
| `numeric` | `DECIMAL(10,2)` |
| ENUMs (`actividad`, `estado_reserva`, etc.) | `ENUM(...)` nativo de MySQL |
| `boolean` | `TINYINT(1)` |

## Lo que NO se incluye (no aplica en MySQL)
- Políticas RLS (Row-Level Security) — MySQL no tiene equivalente; tendrás que gestionar permisos en tu aplicación
- Función `has_role()` (SECURITY DEFINER) — específica de Postgres
- Referencias a `auth.users` de Supabase
- `GRANT` a roles de Supabase (`anon`, `authenticated`, `service_role`)

## Proceso técnico
1. Conectar a PostgreSQL con `psql` y extraer datos de cada tabla en formato compatible
2. Generar script Python que:
   - Escribe los `CREATE TABLE` MySQL adaptados
   - Convierte cada fila: escapa strings, serializa JSON, transforma arrays Postgres `{a,b}` a JSON `["a","b"]`, formatea timestamps
3. Generar `backup_shootandrun_mysql_YYYYMMDD.sql`
4. Verificar el archivo (validar sintaxis básica, contar INSERTs por tabla) y entregarlo como artifact descargable

## Cómo lo restaurarás
```bash
mysql -u usuario -p nombre_db < backup_shootandrun_mysql_YYYYMMDD.sql
```
Requiere MySQL 8.0+ (por soporte JSON y CHECK constraints).
