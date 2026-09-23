# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

BNBexplorer: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 4, con Supabase (auth, Postgres, storage, Edge Functions en Deno). Gestor de paquetes: npm. No es un monorepo.

## Convenciones de trabajo

- Entrega incremental: un fichero cada vez y confirmación explícita antes de pasar al siguiente.
- Nunca inventar rutas, nombres ni firmas: verificar siempre el código real antes de escribir.
- Análisis y decisiones de arquitectura antes de codificar.
- `type` en lugar de `interface`.
- Clases de Tailwind como literales completos; nunca concatenadas dinámicamente.
- Componentes: una carpeta por componente con `index.tsx`, jerarquía atoms/molecules/organisms/templates.
- Identificadores en inglés y camelCase; el español solo en contenido de texto.
- Indentación: `.prettierrc` fija 4 espacios, pero Prettier no está instalado ni hay script de formato, y algunos ficheros usan tabs (p. ej. `tsconfig.json`, `routing.ts`). Respetar la indentación del fichero que se edita.

## Verificación

No hay tests ni CI de checks. Tras cambios significativos ejecuta `npx tsc --noEmit` (sin salida = OK). La verificación completa (lint, tsc y build) la lanzo yo con `/verify`; no ejecutes `npm run build` por tu cuenta.

## Comandos

- Supabase local: `npm run sb:start | sb:stop | sb:status` (ninguno ejecuta `db reset`). El README dice `npm run supabase start`, que no existe.
- Scripts sueltos: `npx tsx --tsconfig scripts/tsconfig.json scripts/<fichero>.ts` (`tsx` no está en `package.json`; lo descarga npx).

## Entorno

- Nunca leer, modificar ni referenciar ficheros `.env*` (excepto `.env.template`); un hook PreToolUse lo bloquea en Read/Edit/Write/Grep/Bash. Nunca apuntar el entorno local a producción.
- `.env.template` está desactualizado (viene de la plantilla original); no es la lista real de variables.
- El service key se llama `PRIVATE_SUPABASE_SERVICE_KEY` (código y CI), no `SUPABASE_SERVICE_ROLE_KEY` como dice `README-local.md`.

## Middleware (`src/middleware.ts`)

Orden: next-intl → si `MAINTENANCE_MODE` está activo, rewrite a `/[locale]/maintenance` (antes de tocar Supabase) → cookie anónima `be_anon_id` solo en `/public*` → refresco de sesión con `updateSession`. El matcher excluye `/api`: los route handlers hacen su propia autenticación.

## Supabase clients

- Leer `src/lib/supabase/*` antes de importar cualquier cliente; no asumir nombres ni firmas.

### Servidor (Server Components, Server Actions, Route Handlers)

- `createSSRClient()`: auth / identidad del usuario (getUser) y lecturas sujetas a RLS.
- `createServerAdminClient()` (service_role): escrituras en Storage y operaciones admin en Server Actions, SIEMPRE después de verificar auth con el cliente SSR. Nunca importarlo en código cliente.
- `createSSRSassClient()`: hoy se usa en el callback de auth (`src/app/api/auth/callback/route.ts`) y en `src/app/api/properties/route.ts`. No usarlo en código nuevo.

### Cliente (componentes "use client")

- `createSPASassClient()` es la vía estándar para flujos de auth (login, signup, magic link, reset, MFA, logout). Reutilizar sus métodos antes de llamar a `supabase.auth` directamente.
- `signInWithMagicLink` depende de `window.location.origin`: solo cliente.

### General

- Usar `overrideTypes` en todas las queries.

## Migraciones (Supabase)

1. `npx supabase migration new <nombre>` → escribir el SQL en el fichero generado.
2. Aplicar en local con `npx supabase migration up` (preserva los datos locales). `npx supabase db reset` SOLO si es imprescindible y tras confirmarlo conmigo.
3. Implementar la lógica y probar SIEMPRE en local.
4. `npx supabase db push --dry-run` → revisar → `npx supabase db push`. Si el código depende del esquema nuevo, el push va ANTES del merge a `main`.
5. Regenerar tipos SIEMPRE desde producción, nunca desde local:
   `npx supabase gen types typescript --project-id wwclrrykkvsbpzlpavls > src/lib/types.ts`

- Nunca modificar una migración ya aplicada; siempre crear una nueva.

## i18n (next-intl)

- Idiomas: es, en, fr, pt, it. `LOCALES` en `src/config/config-constants.ts` es la única fuente de verdad; no declarar uniones de locales locales en otros ficheros.
- Todo texto de UI nuevo se añade a los 5 ficheros de `messages/` (en.json, es.json, fr.json, it.json, pt.json).
- Claves planas en camelCase.
- Navegación: usar `Link`, `redirect`, `useRouter`, `usePathname` y `getPathname` de `@/i18n/routing` en lugar de `next/link` / `next/navigation`. Lo que `@/i18n/routing` no exporta (`useSearchParams`, `useParams`, `notFound`...) sigue viniendo de `next/navigation`.
- El código existente aún importa de `next/navigation` y `next/link` en muchos ficheros. La regla aplica a código nuevo; no migres imports existentes salvo que la tarea lo pida explícitamente.
- Las páginas viven bajo `src/app/[locale]/...`. Los Route Handlers van en `src/app/api/`, fuera de `[locale]` (el middleware excluye `/api`).

### Añadir un idioma nuevo

1. Añadirlo a `LOCALES` en `src/config/config-constants.ts`.
2. Crear `messages/<locale>.json` traduciendo desde es.json o en.json.
3. Traducir las plantillas de email en `supabase/functions/`:
   - send-email/templates/magicLinkTemplate.ts
   - send-sequence-email/templates/: a1-no-property-day2, a2-no-property-day7, b1-incomplete-day3, b2-incomplete-day14, c1-no-featured-day5, d1-weekly-digest, e1-broadcast
   - weekly-digest/index.ts, send-broadcast/index.ts
   - _shared/send-email.ts: revisar, normalmente no requiere cambios
4. Revisar el envío de broadcast (`src/app/[locale]/admin/broadcast/` y su route handler `src/app/api/broadcast/route.ts`) para que contemple todos los idiomas.
5. Actualizar los prompts del itinerario en `src/config/prompt.ts`.
6. Revisar `src/app/[locale]/layout.tsx`.
7. Tras el despliegue: recordarme lanzar los workflows de GitHub Actions (ver Despliegue).

## Edge Functions (supabase/functions/)

- Runtime Deno, no Node: nada de APIs de Node; usar los imports/`deno.json` existentes como referencia. Excluidas de tsc.
- Funciones de email:
  - `send-email`: emails transaccionales (Auth Hook).
  - `email-job`: cron diario (10:00 UTC) que evalúa y dispara las secuencias. Prioridad: tipo B (propiedad incompleta) sobre tipo C (sin destacados). `MAX_EMAILS_PER_RUN` es un control de seguridad: no eliminarlo ni subirlo sin confirmarlo conmigo.
  - `send-sequence-email`: envío individual de cada email de secuencia.
  - `weekly-digest`: resumen semanal (lunes 9:00 UTC).
  - `send-broadcast`: envíos masivos.
  - `run-email-job`: copia de `email-job` solo para pruebas locales (simula el paso de los días con `EMAIL_TEST_DAYS_OFFSET`, sin auth de cron). Nunca se despliega en producción. Los cambios de lógica de secuencias se aplican en las dos.
- `_shared/` se empaqueta dentro de cada función al desplegar: si cambia algo en `_shared/`, hay que redesplegar TODAS las funciones que lo importan.
- Secretos: se gestionan con `npx supabase secrets set`, nunca en código ni en el `.env` del frontend.
- Probar en local con `npx supabase functions serve <nombre>` antes de desplegar.
- Despliegue siempre manual y por función: `npx supabase functions deploy <nombre>`. Tras cualquier cambio, indicarme explícitamente qué funciones hay que desplegar.

## Despliegue

1. Rama `develop-local` → commits convencionales agrupados por capa → PR a `main` → merge → deploy automático de Vercel.
2. Las Edge Functions NO se despliegan con Vercel: ver sección "Edge Functions".
3. No hay CI de checks, pero sí workflows manuales (`workflow_dispatch`) en GitHub Actions: "Migrate Translations" y "Migrate Property Translations". Se lanzan desde la rama `main` al añadir un idioma. No puedes lanzarlos tú: recuérdamelo.

## Producción y git

- Nunca ejecutes comandos que afecten a producción sin mi confirmación explícita: `npx supabase db push` (sin `--dry-run`), `npx supabase functions deploy`, `npx supabase secrets set`. Indícame el comando y espera.
- No hagas commits, push ni PRs: los hago yo. Puedes proponer el mensaje de commit.
