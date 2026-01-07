# 🚀 Local Development Guide (Supabase + Next.js)

This document outlines the local development workflow, production synchronization, and database maintenance.

---

## 📁 Relevant Project Structure

-   `supabase/config.toml`
-   `README.md`
-   `README-local.md` (this file)

---

## 1️⃣ Daily Usage (Working Locally)

### Start Local Supabase

```bash
npx supabase start
```

### Check Local Endpoints and Services

```bash
npx supabase status
```

**What you will see:**

-   **Project URL**: Local API URL.
-   **anon key / service_role key**: Local credentials.
-   **Studio**: Web control panel (Local Dashboard).
-   **Mailpit**: Auth email interceptor for testing.

### Normal Workflow

1. **Start Next.js**: `npm run dev`
2. **Stop Local Supabase (optional)**: `npx supabase stop`

📩 **Local Auth Emails**: Emails are not sent to real addresses. View them in **Mailpit** (URL provided in `npx supabase status`).

---

## 2️⃣ Required Configuration (Auth redirects)

The following block must exist in `supabase/config.toml` to allow local authentication redirects:

```toml
[auth]
site_url = "http://localhost:3000"
additional_redirect_urls = [
  "http://localhost:3000/**",
  "[http://127.0.0.1:3000/](http://127.0.0.1:3000/)**"
]
```

> ⚠️ **Note**: This file only affects the local environment (Supabase CLI). It does not impact Production or Vercel.

**After any change to config:**

```bash
npx supabase stop
npx supabase start
```

---

## 3️⃣ Environment Variables for Next (.env.local)

Run `npx supabase status`, copy the local values, and configure `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_LOCAL_ANON_HERE

# Only if using admin/server-side queries
SUPABASE_SERVICE_ROLE_KEY=PASTE_LOCAL_SERVICE_ROLE_HERE
```

Restart Next.js after changes: `npm run dev`

---

## 4️⃣ HARD RESET + REBUILD FROM PRODUCTION

This process:

-   ❌ Completely wipes the local database.
-   ✅ Rebuilds the schema from Production.
-   ✅ Imports only specific catalog data (`categories` and `sub_categories`).

### 4.1 Prepare Production Connection

Define `PROD_DB_URL` using the Session Pooler (Supabase Dashboard → Database → Connect):

```bash
export PROD_DB_URL="postgresql://postgres.<project-ref>:PASSWORD@aws-0-...pooler.supabase.com:5432/postgres"
```

Verify connection:

```bash
psql "$PROD_DB_URL" -c 'select 1;'
```

### 4.2 Local Environment Hard Reset

```bash
npx supabase stop
docker rm -f $(docker ps -aq --filter "name=supabase") 2>/dev/null || true
docker volume rm $(docker volume ls -q | grep supabase) 2>/dev/null || true
npx supabase start
```

### 4.3 Dump Schema from Production

```bash
npx supabase db dump \
  --db-url "$PROD_DB_URL" \
  -s public,my_custom_functions \
  -f schema.sql
```

### 4.4 Import Schema Locally

```bash
export LOCAL_DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f schema.sql
```

### 4.5 Temporary Data Dump (public) from Production

```bash
npx supabase db dump \
  --db-url "$PROD_DB_URL" \
  --data-only \
  --use-copy \
  -s public \
  -f data_public.sql
```

### 4.6 Create seed_catalog.sql (Manual)

1. Open `data_public.sql`.
2. Copy the entire `COPY` block for `categories` and `sub_categories`.
3. Paste them into a new file: `seed_catalog.sql`.

⚠️ **Important:** The terminator must be an exact line with `\.` and the order must be `categories` → `sub_categories`.

### 4.7 Fix Format (If "end-of-copy marker corrupt" error occurs)

```bash
sed -i '' $'s/\r$//' seed_catalog.sql
printf '\n' >> seed_catalog.sql
```

### 4.8 Import Catalog Locally

```bash
psql "$LOCAL_DB_URL" -c 'TRUNCATE public.sub_categories, public.categories RESTART IDENTITY CASCADE;'
psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f seed_catalog.sql
```

---

## 5️⃣ Final Verification

```sql
select count(*) from public.categories;
select count(*) from public.sub_categories;

-- Example of a table that should be empty:
select count(*) from public.properties;
```

---

## 6️⃣ Best Practices

-   ❌ **Do not perform a hard reset daily**.
-   ✅ **Use test users** created locally.
-   ❌ **Never point `.env.local` to Production**.
-   ✅ **Keep this README separate** from the main project documentation.

---

## 7️⃣ When to Repeat This Process

-   When the **schema** changes in Production.
-   When you want a **clean environment**.
-   If the local Docker environment becomes desynchronized.
