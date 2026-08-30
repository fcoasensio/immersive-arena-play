# Arreglar acceso al panel /admin (permiso denegado)

## Causa raíz (confirmada)

En el arreglo de seguridad anterior se revocó el permiso `EXECUTE` de la función `has_role()` a todos los roles. Comprobado: la consulta de privilegios de `has_role` devuelve **cero grants**.

En PostgreSQL, el permiso `EXECUTE` se comprueba sobre el usuario que invoca la función **incluso si la función es SECURITY DEFINER**. Resultado: todas las políticas RLS de administrador (`Admins can read...`) que llaman a `has_role(auth.uid(), 'admin')` fallan con error de permiso → la consulta a `user_roles` en `ProtectedAdminRoute.tsx` falla → la app cree que no eres admin y te redirige a `/admin/login`.

Las cuentas y roles en la base de datos están correctos:
- `admin@shootandrun.es` → rol `admin` ✓
- `fcoasensio@shootandrun.es` → **sin rol** (si entras con esta cuenta, nunca tendrás acceso admin; ver paso opcional)

## Cambios

1. **Migración SQL**: conceder `EXECUTE` sobre `public.has_role(uuid, app_role)` a `authenticated` y `service_role` (a `anon` no hace falta: ninguna política pública la usa). Esto es seguro: la función solo devuelve un booleano sobre si un usuario tiene un rol; no expone datos ni permite escalada.
2. **Verificación**: consultar de nuevo los grants y probar una lectura de `user_roles` como admin autenticado; ejecutar el linter de seguridad para confirmar que no reaparece el aviso anterior (si reaparece, documentarlo en la memoria de seguridad como falso positivo aceptado, ya que el grant es imprescindible para que RLS funcione).
3. **Opcional (preguntar)**: si quieres entrar con `fcoasensio@shootandrun.es`, asignarle el rol `admin` en `user_roles`. Si solo usas `admin@shootandrun.es`, no hace falta.

## Detalles técnicos

- SQL: `GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;` (+ `service_role`).
- No se toca el código del frontend: `ProtectedAdminRoute` es correcto; el fallo era del lado de la base de datos.
