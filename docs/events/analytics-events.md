# Eventos de analítica (Mixpanel)

Qué eventos envía BNBexplorer a Mixpanel, cuándo se disparan y para qué sirve cada uno.

## Arquitectura

Todos los eventos pasan por `trackEvent` (`src/lib/analytics/mixpanel.ts`), que es la única función que habla con Mixpanel. Hay dos formas de llegar a ella:

| Origen | Cómo | Cuándo usarlo |
|---|---|---|
| Servidor (Server Components, Server Actions, Route Handlers) | `trackEvent(...)` directamente | Siempre que el evento se pueda emitir en servidor: es más fiable y el cliente no puede falsearlo |
| Cliente (componentes `"use client"`) | `trackClientEvent(...)` (`src/lib/analytics/trackClient.ts`) → `POST /api/track` → `trackEvent` | Solo para interacciones que únicamente conoce el navegador (clics, abandono de un formulario...) |

- `trackEvent` solo envía si `MIXPANEL_ENABLED === "true"` y hay `MIXPANEL_TOKEN`. Para probar en local sin enviar nada al proyecto real, `MIXPANEL_TRACK_URL` puede apuntar a un receptor local.
- A cada evento le añade `ip`, `user_country` (cabeceras de Vercel/Cloudflare), `user_agent` y `referer`.
- Los errores se ignoran: la analítica nunca debe romper el flujo de la app.
- `trackClientEvent` usa `keepalive: true`, así que el evento llega aunque el componente se desmonte o se abra un popup.

### `distinctId`

| Usuario | Valor |
|---|---|
| Anfitrión | `user.id` de Supabase |
| Huésped | cookie anónima `be_anon_id` (la crea el middleware solo en rutas `/public*`) |

### Reglas de seguridad

- `mixpanel.ts` **no** lleva `"use server"`. Si lo llevara, `trackEvent` se publicaría como Server Action y cualquiera podría llamarla sin pasar por ninguna validación. Nunca importarlo desde un componente cliente: usar `trackClientEvent`.
- `/api/track` es público (sin login) y solo acepta los eventos de `ALLOWED_EVENTS` (`src/app/api/track/route.ts`). Esa lista contiene **solo los eventos que emite el cliente**. Los eventos de servidor no se añaden, para que nadie pueda inventarlos desde fuera.
- `trackEvent` descarta de `props` las claves que fija ella misma (`token`, `distinct_id`, `ip`, `user_country`, `user_agent`, `referer`) y las reservadas de Mixpanel (`time`, `$*`, `mp_*`). No usar esos nombres como props.

## Eventos del anfitrión

### Onboarding y creación de la propiedad

En conjunto forman el embudo de creación de la primera propiedad.

| Evento | Origen | Cuándo se dispara | Props | Para qué sirve |
|---|---|---|---|---|
| `onboarding_start` | Servidor · `src/app/[locale]/app/properties/page.tsx` | Un usuario recién autenticado sin propiedades llega al listado y se le lleva a crear la primera | `page`, `fromAuth` | Primer paso del embudo |
| `create_property_address_selected` | Cliente · `src/components/organisms/form/property/index.tsx` | Elige una dirección del autocompletado | — | Cuántos completan el paso de la dirección |
| `create_property_submit_clicked` | Cliente · mismo formulario | Pulsa enviar al crear (no al editar) | `has_name`, `has_selected_address` | Intención de crear |
| `create_property_blocked_no_address_selection` | Cliente · mismo formulario | Envía sin haber elegido una dirección sugerida | `has_name` | Cuántos se atascan por escribir la dirección a mano |
| `create_property_failed` | Cliente · mismo formulario | La Server Action devuelve errores de validación | `error_fields` | Qué campos fallan |
| `create_property_completed` | Servidor · `src/app/actions/properties/add-property.ts` | La propiedad se crea correctamente | `property_id`, `locale`, `has_image`, `has_logo`, `has_description` | Conversión final del embudo |
| `create_property_abandoned` | Cliente · mismo formulario | El formulario de creación se desmonta sin haberse completado | `time_on_form_ms`, `has_name`, `has_selected_address` | Abandono y cuánto había rellenado |
| `wow_modal_dismissed` | Cliente · `src/hooks/usePropertyOnboardingFlow.ts` | Cierra el modal "wow" del onboarding tras crear la propiedad | `property_id` | Cuántos se saltan ese paso |

### Gestión de la propiedad

| Evento | Origen | Cuándo se dispara | Props | Para qué sirve |
|---|---|---|---|---|
| `property_progress_updated` | Servidor · `src/lib/updatePropertyProgress.ts` | Se recalcula el progreso tras añadir, borrar o generar lugares (`src/app/actions/locations/`) o tras actualizar la información (`src/app/actions/property-info/update-info.ts`) | `property_id`, `progress_percent` (0, 50 o 100), `has_info`, `has_location` | Nivel de completitud de la guía |
| `property_details_saved` | Servidor · `src/app/actions/properties/save-details.ts` | Guarda los detalles del alojamiento | `property_id`, `details_count`, `predefined_count`, `custom_count`, `updated_count`, `inserted_count` | Uso de los detalles, predefinidos frente a personalizados |
| `property_detail_deleted` | Servidor · `src/app/actions/properties/delete-detail.ts` | Borra un detalle | `detail_id`, `property_id` | Borrados de detalles |
| `property_deleted` | Servidor · `src/app/actions/properties/delete-property.ts` | Borra una propiedad | `property_id`, `had_image`, `deleted_location_groups_count` | Posible señal de abandono del producto |
| `share_clicked` | Cliente · `src/components/molecules/button-share/index.tsx` | Pulsa Facebook, WhatsApp o copiar enlace | `channel` (`facebook`, `whatsapp`, `copy_link`), `surface` (`property_card`, `landing_header`), `url`, `copy_failed` si falla la copia, más las `props` que reciba el componente | Qué canales y qué superficies se usan para compartir |

### Feedback

Formulario de feedback del dashboard (`src/components/organisms/form/feedback/index.tsx`). Forma un embudo: `feedback_opened` y después `feedback_submitted`, `feedback_cancelled` o `feedback_submit_failed`.

Props comunes: `source_area` (`create_property`, `create_location`, `create_info`, `dashboard`, `subscription`) y `context_type` (`property`, `location`, `info`, `none`).

| Evento | Cuándo se dispara | Props adicionales | Para qué sirve |
|---|---|---|---|
| `feedback_opened` | Se abre el formulario (una vez por apertura) | `context_id`, `page_path`, `locale` | Desde dónde se pide feedback |
| `feedback_submitted` | Se envía correctamente | `context_id`, `category`, `has_email`, `message_length`, `page_path`, `locale` | Volumen y tipo de feedback. Nunca se envía el texto del mensaje |
| `feedback_cancelled` | Se cierra sin enviar | `context_id`, `page_path`, `locale` | Abandono del formulario |
| `feedback_submit_failed` | El envío devuelve errores | `has_context_id`, `has_email` | Errores del formulario |

Todos son eventos de cliente.

## Eventos del huésped (guía pública)

Aquí se mide el valor que recibe el huésped. `distinctId` es siempre la cookie `be_anon_id`.

| Evento | Origen | Cuándo se dispara | Props | Para qué sirve |
|---|---|---|---|---|
| `tenant_visit_public_page` | Servidor · `src/app/[locale]/public/[...slug]/page.tsx` | Se renderiza la guía pública de una propiedad | `property_id`, `page` | Visitas a cada guía |
| `time_window_widget_shown` | Servidor · misma página | La guía tiene contenido para el widget según la hora del día | `property_id` | Impresiones del widget |
| `time_window_pill_clicked` | Cliente · `src/components/organisms/time-window-section/index.tsx` | Pulsa una pastilla del widget | `property_id`, `pill_id`, `source` (`widget` o `modal`) | Interacción con el widget |
| `time_window_directions_clicked` | Cliente · `src/components/molecules/time-window-modal/index.tsx` | Pulsa "cómo llegar" a un lugar | `property_id`, `pill_id`, `location_id` | La acción de más valor del widget |
| `itinerary_generate_clicked` | Cliente · `src/components/organisms/form/custom-plan/index.tsx` | Pide generar un itinerario con IA | `preferences`, `duration`, `transport` | Uso del planificador |

## Declarados pero sin uso

- `create_property_started`: está en `EventName`, pero ningún código lo envía.

## Añadir un evento nuevo

1. Añadir el nombre a `EventName` en `src/lib/analytics/mixpanel.ts` (snake_case, en inglés).
2. Emitirlo:
    - en servidor, con `trackEvent`;
    - en cliente, con `trackClientEvent` **y** añadirlo a `ALLOWED_EVENTS` en `src/app/api/track/route.ts`. Si no se añade, `/api/track` responde 400 y el evento se pierde sin avisar.
3. No usar claves reservadas en `props` (ver Reglas de seguridad) ni enviar datos personales o texto libre del usuario.
4. Documentarlo en este fichero.
