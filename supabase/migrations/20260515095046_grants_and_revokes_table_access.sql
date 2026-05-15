-- Migración 2: GRANTs explícitos en tablas nuevas + REVOKEs de anon
-- Preparación para el cambio de Supabase del 30 de mayo 2026.
-- Contexto: todas las queries van por service_role (createServerAdminClient)
-- o por authenticated (createSSRClient). Ninguna tabla necesita acceso anon.

-- =========================================================
-- PARTE 1: Revocar DEFAULT PRIVILEGES del baseline
-- El baseline hizo GRANT ALL ON TABLES a anon y authenticated
-- para cualquier tabla futura creada por postgres.
-- Lo revertimos para que las próximas tablas no hereden ALL.
-- =========================================================

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM authenticated;

-- =========================================================
-- PARTE 2: Tablas nuevas — revocar ALL heredado y aplicar
-- grants mínimos correctos
-- =========================================================

-- feedback_messages: authenticated solo puede insertar
REVOKE ALL ON public.feedback_messages FROM anon, authenticated;
GRANT INSERT ON public.feedback_messages TO authenticated;
GRANT ALL ON public.feedback_messages TO service_role;

-- profiles: authenticated lee y actualiza su propio perfil
REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- email_sequence_log: solo service_role
REVOKE ALL ON public.email_sequence_log FROM anon, authenticated;
GRANT ALL ON public.email_sequence_log TO service_role;

-- property_visits: solo service_role
REVOKE ALL ON public.property_visits FROM anon, authenticated;
GRANT ALL ON public.property_visits TO service_role;

-- =========================================================
-- PARTE 3: Tablas antiguas del baseline
-- Revocar SELECT de anon — todo pasa por service_role en servidor
-- =========================================================

REVOKE SELECT ON public.ai_usage FROM anon;
REVOKE SELECT ON public.categories FROM anon;
REVOKE SELECT ON public.location_groups FROM anon;
REVOKE SELECT ON public.locations FROM anon;
REVOKE SELECT ON public.properties FROM anon;
REVOKE SELECT ON public.property_data FROM anon;
REVOKE SELECT ON public.property_info FROM anon;
REVOKE SELECT ON public.sub_categories FROM anon;
REVOKE SELECT ON public.subscription_plans FROM anon;
REVOKE SELECT ON public.subscriptions FROM anon;
REVOKE SELECT ON public.todo_list FROM anon;