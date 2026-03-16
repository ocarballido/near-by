# Sistema de Emails Automáticos — BNBexplorer

## Índice

1. [Arquitectura general](#arquitectura-general)
2. [Tipos de email y condiciones de envío](#tipos-de-email-y-condiciones-de-envío)
3. [Cómo probar en local](#cómo-probar-en-local)
4. [Cómo desplegar a producción](#cómo-desplegar-a-producción)
5. [Variables de entorno y secrets](#variables-de-entorno-y-secrets)
6. [Cómo activar y desactivar el sistema](#cómo-activar-y-desactivar-el-sistema)
7. [Cómo añadir un nuevo tipo de email](#cómo-añadir-un-nuevo-tipo-de-email)

---

## Arquitectura general

El sistema envía emails automáticos a los usuarios según su comportamiento en la app. Se compone de las siguientes piezas:

### Base de datos (Supabase)

**Tabla `profiles`**
Extiende `auth.users` con datos específicos de la app. Se crea automáticamente una fila por cada nuevo usuario gracias a un trigger. Campos clave:
- `email_opt_out` — si es `true`, el usuario no recibe emails
- `unsubscribe_token` — UUID único usado en el enlace de baja
- `full_name` — nombre del usuario (opcional, para personalización futura)

**Tabla `email_sequence_log`**
Registra cada email enviado. Garantiza que nunca se envía el mismo email dos veces al mismo usuario. Campos clave:
- `user_id` — a quién se envió
- `type` — tipo de email (`no_property`, `incomplete_property`, `no_featured`)
- `step` — paso dentro de la secuencia (1 o 2)
- `ref_id` — ID de la propiedad (solo para tipos B y C, null para tipo A)

**Funciones SQL**
Tres funciones que detectan usuarios que necesitan recibir un email:
- `get_users_without_property(days_offset int)` — usuarios sin propiedad
- `get_incomplete_properties(days_offset int)` — propiedades sin info o sin locations
- `get_properties_without_featured(days_offset int)` — propiedades sin etiquetas featured/must_visit

El parámetro `days_offset` permite simular el paso del tiempo en pruebas locales.

### Edge Functions (Supabase)

```
supabase/functions/
├── _shared/
│   └── send-email.ts          → lógica compartida de envío
├── send-sequence-email/       → endpoint HTTP para envíos puntuales
├── email-job/                 → job diario (se despliega en prod)
└── run-email-job/             → simulación del job (solo local)
```

**`_shared/send-email.ts`**
Núcleo del sistema. Recibe un payload `{type, step, userId, email, ...}`, verifica que el usuario no esté dado de baja, selecciona el template correcto, envía con Resend y registra en `email_sequence_log`.

**`send-sequence-email`**
Endpoint HTTP que expone la lógica de `_shared/send-email.ts`. Útil para envíos puntuales desde curl o desde Next.js.

**`email-job`**
Job completo que se ejecuta en producción. Consulta las tres funciones SQL, aplica las condiciones de días, verifica duplicados, aplica la prioridad B sobre C y llama a `_shared/send-email.ts` para cada envío.

**`run-email-job`**
Copia local de `email-job` para pruebas. Acepta `EMAIL_TEST_DAYS_OFFSET` para simular el paso del tiempo sin esperar días reales. Nunca se despliega en producción.

### Templates de email

```
supabase/functions/send-sequence-email/templates/
├── a1-no-property-day2.ts
├── a2-no-property-day7.ts
├── b1-incomplete-day3.ts
├── b2-incomplete-day14.ts
└── c1-no-featured-day5.ts
```

Cada template recibe parámetros tipados y devuelve `{ subject, html }`. Están escritos en HTML con tablas para compatibilidad con todos los clientes de email (Gmail, Outlook, Apple Mail, etc.). Soportan 3 idiomas: `es`, `en`, `fr`.

### pg_cron

Job programado que se ejecuta cada día a las **10:00 AM UTC**. Llama a la Edge Function `email-job` via HTTP usando `pg_net`. Las credenciales están almacenadas de forma segura en **Supabase Vault**.

### Página de baja

`/[locale]/unsubscribe?token=XXX` — página pública en Next.js que marca `email_opt_out = true` en `profiles` sin requerir login. El token es el `unsubscribe_token` del usuario.

---

## Tipos de email y condiciones de envío

### A1 — Usuario sin propiedad, día 2
- **Condición:** registrado hace 2+ días sin ninguna propiedad creada
- **Asunto:** "Tu guía digital te está esperando"
- **Se detiene si:** el usuario crea una propiedad antes del día 2

### A2 — Usuario sin propiedad, día 7
- **Condición:** registrado hace 7+ días sin propiedad, y A1 ya fue enviado
- **Asunto:** "¿Puedo ayudarte con algo?"
- **Se detiene si:** el usuario crea una propiedad antes del día 7

### B1 — Propiedad incompleta, día 3
- **Condición:** propiedad creada hace 3+ días sin contenido de tipo `info` O sin tipo `location`
- **Asunto:** "Tu alojamiento tiene trabajo pendiente"
- **Se detiene si:** la propiedad se completa antes del día 3

### B2 — Propiedad incompleta, día 14
- **Condición:** propiedad creada hace 14+ días, sigue incompleta, y B1 ya fue enviado
- **Asunto:** "Tus inquilinos merecen la mejor guía"
- **Se detiene si:** la propiedad se completa antes del día 14

### C1 — Sin etiquetas, día 5
- **Condición:** propiedad creada hace 5+ días, tiene locations pero ninguna con `featured=true` o `must_visit=true`, y la propiedad está completa
- **Asunto:** "¿Cuáles son tus lugares favoritos?"
- **Prioridad:** si la propiedad también cumple criterio B, C1 no se envía hasta que B esté resuelto
- **Se envía:** una sola vez por propiedad

### Reglas generales
- El job corre cada día a las 10:00 AM UTC
- Ningún email se repite — `email_sequence_log` lo garantiza a nivel de base de datos con una restricción `UNIQUE`
- Si un usuario está dado de baja (`email_opt_out=true`), no recibe nada
- Máximo `MAX_EMAILS_PER_RUN` emails por ejecución (actualmente 50)

---

## Cómo probar en local

### Requisitos previos
- Supabase local corriendo: `npx supabase start`
- Archivo `.env` en `supabase/functions/.env` con las variables necesarias

### Variables del .env local
```dotenv
SEND_EMAIL_HOOK_SECRET=tu_valor
RESEND_API_KEY=tu_api_key_real
EMAIL_TEST_MODE=true
EMAIL_TEST_WHITELIST=tu@email.com
EMAIL_TEST_DAYS_OFFSET=2
MAX_EMAILS_PER_RUN=5
```

### Arrancar las funciones
```bash
npx supabase functions serve --env-file ./supabase/functions/.env
```

### Ejecutar el job manualmente
```bash
curl -X POST http://127.0.0.1:54321/functions/v1/run-email-job \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7kyqtLvDy1hM0b5obNQe0WH3Fs4vGTUiMos" \
  -d '{}'
```

### Simular el paso del tiempo
Cambia `EMAIL_TEST_DAYS_OFFSET` en el `.env` y reinicia el servidor:
- `EMAIL_TEST_DAYS_OFFSET=2` → simula que han pasado 2 días (prueba A1)
- `EMAIL_TEST_DAYS_OFFSET=7` → simula que han pasado 7 días (prueba A2)
- `EMAIL_TEST_DAYS_OFFSET=3` → simula 3 días desde creación de propiedad (prueba B1)
- `EMAIL_TEST_DAYS_OFFSET=14` → simula 14 días (prueba B2)
- `EMAIL_TEST_DAYS_OFFSET=5` → simula 5 días (prueba C1)

### Verificar resultados
- Emails enviados: dashboard de Resend en `https://resend.com/emails`
- Logs registrados: Studio local → Table Editor → `email_sequence_log`
- Consultas SQL de prueba:
```sql
SELECT * FROM get_users_without_property(2);
SELECT * FROM get_incomplete_properties(3);
SELECT * FROM get_properties_without_featured(5);
SELECT * FROM email_sequence_log;
```

### Limpiar entre pruebas
```sql
DELETE FROM email_sequence_log;
```

---

## Cómo desplegar a producción

### Migraciones de base de datos
```bash
npx supabase db push
```
Aplica solo las migraciones pendientes sin tocar los datos existentes.

### Edge Functions
Siempre que se modifiquen templates, `_shared/send-email.ts` o la lógica de las funciones:
```bash
npx supabase functions deploy send-email
npx supabase functions deploy send-sequence-email
npx supabase functions deploy email-job
```

`run-email-job` NUNCA se despliega en producción — es solo para pruebas locales.

### Next.js
El deploy de Next.js (Vercel) es automático al hacer merge a `main` en GitHub. Incluye la página `/unsubscribe` y cualquier cambio de frontend.

### Orden recomendado de deploy
1. Push a GitHub → merge a main → Vercel despliega automáticamente
2. `npx supabase db push` (si hay migraciones nuevas)
3. `npx supabase functions deploy [nombre]` (para cada función modificada)
4. Verificar en prod con curl apuntando a `https://wwclrrykkvsbpzlpavls.supabase.co`

---

## Variables de entorno y secrets

### Supabase secrets (para Edge Functions)
Gestión desde terminal:
```bash
npx supabase secrets list                          # ver todas
npx supabase secrets set NOMBRE=valor              # añadir o actualizar
```

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key de Resend para envío de emails |
| `SEND_EMAIL_HOOK_SECRET` | Secret del webhook de Auth de Supabase |
| `EMAIL_TEST_MODE` | `true` = solo envía a whitelist, `false` = envía a todos |
| `EMAIL_TEST_WHITELIST` | Emails separados por coma que reciben en modo test |
| `MAX_EMAILS_PER_RUN` | Límite máximo de emails por ejecución del job |

### Vercel (para Next.js)
Gestión desde el Dashboard de Vercel → Settings → Environment Variables.

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `PRIVATE_SUPABASE_SERVICE_KEY` | Clave de servicio (usada en `/api/unsubscribe`) |

### Supabase Vault (para pg_cron)
Almacena las credenciales que usa el job de pg_cron para llamar a la Edge Function. Se gestionan desde el SQL Editor de producción:
```sql
SELECT vault.create_secret('valor', 'nombre');
SELECT name FROM vault.secrets;  -- verificar
```

| Nombre en Vault | Descripción |
|---|---|
| `project_url` | URL del proyecto Supabase |
| `anon_key` | Clave anon de Supabase |

### .env local (para desarrollo)
Ubicación: `supabase/functions/.env`
Este archivo NO se sube a git.

---

## Cómo activar y desactivar el sistema

### Activar para todos los usuarios (cuando esté verificado)
```bash
npx supabase secrets set EMAIL_TEST_MODE=false
```
Los cambios en secrets se aplican inmediatamente sin redesplegar.

### Volver a modo test
```bash
npx supabase secrets set EMAIL_TEST_MODE=true
```

### Añadir emails a la whitelist de pruebas
```bash
npx supabase secrets set EMAIL_TEST_WHITELIST=email1@dominio.com,email2@dominio.com
```

### Pausar el job de pg_cron sin eliminarlo
Desde el Dashboard de Supabase → Integrations → Cron → toggle Active/Inactive junto al job `daily-email-sequence`.

### Dar de baja a un usuario manualmente
```sql
UPDATE profiles SET email_opt_out = true WHERE user_id = 'UUID_DEL_USUARIO';
```

### Reactivar emails para un usuario
```sql
UPDATE profiles SET email_opt_out = false WHERE user_id = 'UUID_DEL_USUARIO';
```

---

## Cómo añadir un nuevo tipo de email

Ejemplo: añadir un email para usuarios que llevan 30 días sin entrar al dashboard.

### Paso 1 — Crear el template
Crear `supabase/functions/send-sequence-email/templates/d1-inactive-day30.ts` siguiendo el mismo patrón que los templates existentes. Debe exportar una función `renderD1InactiveDay30` que reciba los parámetros necesarios y devuelva `{ subject, html }`.

### Paso 2 — Registrar el template en deno.json
Añadir la entrada en `supabase/functions/send-sequence-email/deno.json`:
```json
{
  "imports": {
    "./templates/d1-inactive-day30": "./templates/d1-inactive-day30.ts"
  }
}
```

### Paso 3 — Añadir la lógica en _shared/send-email.ts
Importar el nuevo template y añadir el caso en el bloque de selección de template:
```typescript
import { renderD1InactiveDay30 } from '../send-sequence-email/templates/d1-inactive-day30.ts';

// En el bloque de selección:
} else if (type === 'inactive_user' && step === 1) {
  ({ subject, html } = renderD1InactiveDay30({ ...templateParams }));
}
```

### Paso 4 — Crear la función SQL
Crear una migración con la función que detecta los usuarios que cumplen la condición:
```sql
create or replace function get_inactive_users(days_offset int default 0)
returns table (id uuid, email text, days_since_last_sign_in int)
language sql security definer as $$
  select
    au.id,
    au.email,
    extract(day from (now() + (days_offset || ' days')::interval) - au.last_sign_in_at)::int
  from auth.users au
  left join public.profiles pr on pr.user_id = au.id
  where (pr.email_opt_out is null or pr.email_opt_out = false)
    and au.last_sign_in_at < now() - interval '30 days'
$$;
```

### Paso 5 — Añadir la lógica en email-job y run-email-job
En ambos archivos añadir el nuevo bloque de tipo D siguiendo el mismo patrón que los tipos A, B y C.

### Paso 6 — Probar en local
Aplicar la migración con `npx supabase migration up`, probar con `run-email-job` y el offset adecuado, verificar en Resend.

### Paso 7 — Desplegar
```bash
npx supabase db push
npx supabase functions deploy send-sequence-email
npx supabase functions deploy email-job
```

---

*Última actualización: Marzo 2026*
