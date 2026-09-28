---
name: verify
description: Ejecuta lint, comprobación de tipos y build de Next.js e informa de los fallos sin corregir nada. Usar antes de dar un cambio por terminado.
disable-model-invocation: true
---

El proyecto no tiene tests ni CI de checks, así que la verificación es esta secuencia. Ejecútala desde la raíz del repo:

1. `npm run lint`: ejecútalo siempre.
2. `npx tsc --noEmit` (sin salida = OK; `supabase/` queda excluido porque es Deno): ejecútalo siempre, aunque el lint haya fallado.
3. `npm run build`: ejecútalo solo si `tsc` ha pasado. Si `tsc` falló, indica que el build se omitió y por qué.

No corrijas nada. Al terminar, informa de cada paso (pasó, falló u omitido) y, por cada fallo, el paso, el error exacto y el fichero afectado. Después espera mi confirmación antes de tocar código.

No leas ni modifiques ficheros `.env*` para hacer que el build pase; si falta una variable de entorno, dilo y pregúntame.
