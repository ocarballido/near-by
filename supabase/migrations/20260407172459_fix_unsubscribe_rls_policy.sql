-- La política "Public can unsubscribe" es innecesaria porque el unsubscribe
-- se gestiona desde una API route de Next.js con service role key,
-- que bypasea RLS. La eliminamos para evitar el warning de seguridad.
drop policy if exists "Public can unsubscribe" on public.profiles;