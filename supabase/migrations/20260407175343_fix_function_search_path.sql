-- Fix function_search_path_mutable warnings
-- Usamos ALTER FUNCTION para añadir search_path sin recrear las funciones

alter function public.delete_old_property_visits() set search_path = public;
alter function public.get_property_visits_by_user(uuid) set search_path = public;
alter function my_custom_functions.is_user_authenticated() set search_path = public, auth, my_custom_functions;
alter function public.get_users_for_weekly_digest() set search_path = public, auth;
alter function public.get_users_without_property(int) set search_path = public, auth;
alter function public.get_incomplete_properties(int) set search_path = public, auth;
alter function public.get_properties_without_featured(int) set search_path = public, auth;