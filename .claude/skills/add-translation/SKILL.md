---
name: add-translation
description: Añade textos de UI nuevos a los 5 ficheros de messages/ (es, en, fr, pt, it) con claves coherentes con la estructura existente y traducción natural en cada idioma.
disable-model-invocation: true
argument-hint: "<textos nuevos> — <zona de la app donde se usan>"
---

Textos y zona recibidos: $ARGUMENTS

## Estructura real de `messages/`

Léela antes de proponer nada; no la des por supuesta.

- Ficheros: `es.json`, `en.json`, `fr.json`, `pt.json`, `it.json`. JSON con 4 espacios de indentación, UTF-8 con caracteres literales (sin escapes `\u`).
- Conviven varias generaciones de claves en el nivel superior:
    - Legado: el propio texto en español como clave (`"Mis Alojamientos"`, `"Subir imagen"`). No crear claves nuevas de este tipo.
    - kebab-case (`auto-modal-option-bars`, `magic-finder-title-with-name`). No crear claves nuevas de este tipo.
    - camelCase plano, agrupado por prefijo de feature (`propertyTierModalTitle`, `propertyTierModalIntro`, `propertyTierModalRowPhoto`...). Es el estilo para claves nuevas.
    - Namespaces (objetos anidados, hasta 4 niveles): `GuestChat`, `ArrivalGuide`, `wow`, `unsubscribe`, `PublicPageBanner`, `maintenance`, `Property`, `propertyForm`, `feedback`, etc. Algunos componentes los consumen con `useTranslations('<namespace>')` o `getTranslations({ locale, namespace: '...' })`.
- La mayoría del código usa `useTranslations()` / `getTranslations()` sin namespace y lee claves del nivel superior.
- Orden: no es alfabético. Las claves están agrupadas por feature y lo nuevo se ha ido añadiendo al final o junto a su grupo.
- Los ficheros no están perfectamente alineados: `en.json` no tiene algunas claves que sí están en `es.json` y tiene alguna extra, y `fr.json` tiene alguna clave con nombre distinto. `es`, `pt` e `it` sí comparten orden. Por eso la posición se localiza por clave ancla, nunca por número de línea.
- Placeholders ICU simples: `{name}`, `{count}`, `{zone}`, `{limit}`, `{total}`, etc. Etiquetas de rich text: `<link>…</link>`, `<bold>…</bold>`, `<terms>…</terms>`, `<privacy>…</privacy>`...
- Registro de cada fichero: es → tuteo (no hay ningún "usted"); fr → vous; pt → tu; it → tu. Compruébalo con `git grep` si dudas; manda el registro dominante del fichero.

## Pasos

### 1. Entender el contexto

- Identifica los textos nuevos (normalmente en español) y la zona de la app donde se usan.
- Si falta la zona o algún texto es ambiguo, pregúntame antes de seguir.
- Localiza el componente o página de esa zona y mira cómo obtiene las traducciones (`useTranslations()` sin namespace o con namespace). Eso decide dónde van las claves.
- Busca con `git grep` claves ya existentes de esa zona en `messages/es.json` (prefijo de feature o namespace).

### 2. Proponer las claves y esperar confirmación

- Por defecto: claves planas en camelCase, en el nivel superior, con el prefijo de la feature y justo después de las claves relacionadas (p. ej. `propertyTierModalNewThing` tras el último `propertyTierModal*`).
- Excepción: si el componente usa `useTranslations('<namespace>')`, la clave tiene que ir dentro de ese namespace (una clave plana no sería accesible). Señálamelo explícitamente, porque se aparta de la regla de claves planas.
- Si no hay claves relacionadas, propón añadirlas al final del fichero.
- Antes de proponer, comprueba con `git grep` que ninguna clave nueva existe ya.
- Enséñame una tabla: clave propuesta, texto en español, ubicación (nivel superior o namespace) y clave ancla tras la que irá.
- Si algún texto choca con el principio "cero fricción" (comunica una carencia al anfitrión en el dashboard) o inventa prueba social, avísame.
- No sigas hasta que confirme.

### 3. Añadir las claves a los 5 ficheros

- Usa Edit sobre cada fichero insertando justo después de la clave ancla. No reescribas el fichero entero ni lo regeneres con un script: se perdería el formato y el orden existentes.
- Si la clave ancla no existe en algún fichero (por el desalineamiento descrito arriba), no la inventes: elige la clave relacionada más cercana que sí exista y dímelo.
- Cuida las comas: la línea anterior debe terminar en coma; si insertas al final de un objeto, la nueva clave es la que no la lleva.
- Traducción natural en cada idioma, no literal: tono cercano y profesional, con el registro del fichero (tuteo en español salvo que el fichero use usted). Adapta la longitud si el texto va en un botón o etiqueta corta.
- Mantén la terminología ya usada en cada idioma: busca con `git grep` cómo se tradujo antes un término del producto (alojamiento, guía, huésped, anfitrión...) y respétalo.
- Placeholders (`{name}`, `{count}`...) y nombres de etiquetas rich text (`<link>`, `<bold>`...) se copian tal cual, sin traducir. Solo se traduce el texto que va dentro de las etiquetas.
- No corrijas ni reordenes claves existentes, aunque veas errores o desalineamientos; si los ves, menciónalos al final.

### 4. Verificar

- Para cada clave nueva, `git grep -c '"<clave>":' -- messages/` debe devolver los 5 ficheros con al menos una coincidencia.
- Si la clave va dentro de un namespace y su nombre es genérico (`title`, `description`...), el `git grep` no basta para confirmarlo: comprueba además la ruta completa en cada fichero con
  `node -e "for (const l of ['es','en','fr','pt','it']) { const v = '<ns>.<clave>'.split('.').reduce((o, k) => o?.[k], require('./messages/' + l + '.json')); console.log(l, v === undefined ? 'FALTA' : 'OK') }"`
- Confirma que los 5 ficheros siguen siendo JSON válido:
  `node -e "for (const l of ['es','en','fr','pt','it']) require('./messages/' + l + '.json'); console.log('OK')"`
- Si algo falla, dímelo con el error exacto antes de corregirlo.

### 5. Tabla de revisión

Enséñame una tabla con una fila por clave y las columnas: clave, es, en, fr, pt, it. Debajo, anota cualquier decisión de traducción no obvia (registro, término elegido, texto acortado) y los desalineamientos que hayas visto en los ficheros.

No toques los componentes que usarán las claves salvo que te lo pida.
