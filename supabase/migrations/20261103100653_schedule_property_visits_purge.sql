-- Programa la purga de property_visits (más de 90 días). La función existe
-- desde 20260328103604 pero nunca se llegó a programar
select cron.schedule(
  'purge-property-visits',
  '0 3 * * *',
  $$ select public.delete_old_property_visits(); $$
);
