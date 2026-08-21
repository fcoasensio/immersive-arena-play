# Corregir dirección en correos: C/ Independencia 31 → Avda. Fernando III El Santo, 24

Cinco referencias a la dirección antigua `C/ Independencia 31` siguen apareciendo en correos que se envían a clientes y al admin. La dirección correcta confirmada es **Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)**.

## Cambios

### 1. `send-reservation-notification/index.ts` — 2 correcciones

**Línea 11** — URL de Google Maps que usa el cliente para llegar al local:
```
ANTES: "https://maps.google.com/?q=C/+Independencia+31,+30820+Alcantarilla,+Murcia"
DESPUÉS: "https://maps.google.com/?q=Avda.+Fernando+III+El+Santo,+24,+30820+Alcantarilla,+Murcia"
```

**Línea 235** — Footer del correo al admin:
```
ANTES: shootandrun · C/ Independencia 31, Alcantarilla (Murcia)
DESPUÉS: shootandrun · Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)
```

### 2. `send-outdoor-budget-notification/index.ts` — 1 corrección

**Línea 154** — Footer del correo al admin (presupuesto outdoor):
```
ANTES: shootandrun · C/ Independencia 31, Alcantarilla (Murcia)
DESPUÉS: shootandrun · Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)
```

### 3. `_shared/gdpr-footer.ts` — 2 correcciones

**Línea 21** — Dirección postal en el texto legal inglés (versión HTML):
```
ANTES: ...C/ Independencia, 31, 30820 - Alcantarilla (Murcia).
DESPUÉS: ...Avda. Fernando III El Santo, 24, 30820 - Alcantarilla (Murcia).
```

**Línea 32** — Dirección postal en el texto legal inglés (versión texto plano):
```
ANTES: ...C/ Independencia, 31, 30820 - Alcantarilla (Murcia).
DESPUÉS: ...Avda. Fernando III El Santo, 24, 30820 - Alcantarilla (Murcia).
```

## Resultado

Ningún correo (reserva, cambio de estado, reprogramación, outdoor, alerta) mostrará `C/ Independencia 31`. Todos usarán `Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)`, la misma dirección que ya aparece en la web.
