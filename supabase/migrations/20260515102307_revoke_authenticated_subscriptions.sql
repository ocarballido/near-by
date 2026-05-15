-- 20260515_revoke_authenticated_subscriptions.sql

-- subscriptions: authenticated no necesita ningún permiso
REVOKE ALL ON public.subscriptions FROM authenticated;

-- subscription_plans: ídem
REVOKE ALL ON public.subscription_plans FROM authenticated;