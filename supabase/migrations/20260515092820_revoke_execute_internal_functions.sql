-- Revoke public execute access on SECURITY DEFINER functions
-- that are internal-only (cron jobs / Edge Functions via service_role).
-- These functions must never ser callable via /rest/v1/rpc/ por anon o authenticated.
-- Se revoca de PUBLIC (grantee=0), anon y authenticated — los tres son necesarios en Supabase.
-- Part of the Supabase Data API hardening before the 30 May 2026 breaking change.

REVOKE EXECUTE ON FUNCTION public.delete_old_property_visits() FROM public, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.get_incomplete_properties(integer) FROM public, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.get_properties_without_featured(integer) FROM public, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.get_property_visits_by_user(uuid) FROM public, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.get_users_for_weekly_digest() FROM public, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.get_users_without_property(integer) FROM public, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;