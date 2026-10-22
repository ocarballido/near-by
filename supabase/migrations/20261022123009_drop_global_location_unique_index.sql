-- Fase 2 de 2: retirar la unicidad GLOBAL de lugares.
--
-- Requisito: el código con onConflict
-- 'property_id,name,latitude,longitude,sub_category_id' debe estar YA
-- desplegado. Con el código antiguo (onConflict sin property_id), quitar
-- este índice hace fallar sus upserts (42P10).
--
-- Aclaración sobre la fase 1 (20261022121341): mientras convivan los dos
-- índices, el código ANTIGUO sigue reasignando filas entre propiedades (su
-- arbiter es este índice global); solo el código nuevo lo evita. Con el
-- código nuevo y ambos índices, un lugar compartido con otra propiedad hace
-- fallar el upsert entero (23505): por eso esta fase se aplica justo
-- después del deploy.
--
-- Tras esto, dos propiedades pueden tener el mismo lugar cada una con su
-- propia fila; la unicidad la garantiza unique_location_entry_per_property.

-- DROP INDEX toma un ACCESS EXCLUSIVE sobre property_data: si no lo obtiene
-- enseguida (p. ej. por una transacción larga), fallar y reintentar en vez
-- de dejar en cola las lecturas de la guía pública. "local": solo para la
-- transacción de esta migración.
set local lock_timeout = '5s';

drop index if exists public.unique_location_entry;
