# 🧪 Local Development — Supabase + Docker

Este documento describe **cómo trabajar en local** con Supabase usando Docker, manteniendo:

-   ✅ El **mismo schema** que producción
-   ✅ **Solo datos de catálogo** desde producción (`categories`, `sub_categories`)
-   ❌ Sin datos sensibles (usuarios reales, properties, etc.)
-   ✅ Auth local funcional (magic link vía Mailpit)

> ⚠️ Este README es **técnico**.  
> No es necesario para arrancar el proyecto básico (`npm run dev`).

---

## 🧰 Requisitos

-   Docker Desktop instalado y **en ejecución**
-   Node.js / npm
-   Supabase CLI (`npx supabase`)
-   `psql` instalado
    ```bash
    brew install libpq
    brew link --force libpq
    ```
